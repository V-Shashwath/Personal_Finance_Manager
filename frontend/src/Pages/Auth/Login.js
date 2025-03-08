import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!values.email) newErrors.email = "Email is required.";
    if (!values.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { email, password } = values;
    setLoading(true);

    try {
        const { data } = await axios.post(loginAPI, {
            email,
            password,
        });

        if (data.success === true) {
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
            toast.success(data.message, toastOptions);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
            if (err.response.data.message === "User not found") {
                toast.error("User not found. Please check your email and try again.", toastOptions);
            } else if (err.response.data.message === "Incorrect Email or Password") {
                toast.error("Incorrect Email or Password. Please try again.", toastOptions);
            } else {
                toast.error("An unexpected error occurred during login.", toastOptions);
            }
        } else {
            // General error fallback
            toast.error("An error occurred. Please try again later.", toastOptions);
        }
    } finally {
        setLoading(false);
    }
};


  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#1A1A1D",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#6699ff",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.9,
              random: true,
            },
            size: {
              value: 4,
              random: true,
            },
            move: {
              enable: true,
              speed: 1.5,
            },
            life: {
              duration: {
                sync: false,
                value: 3,
              },
              count: 0,
              delay: {
                random: {
                  enable: true,
                  minimumValue: 0.5,
                },
                value: 1,
              },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Container className="logincont mt-5" style={{ position: "relative", zIndex: "2" }}>
        <Row className="justify-content-between">
          <Col md={6} className="d-flex flex-column justify-content-center align-items-center text-center text-white">
            <div className="image-container" style={{ marginBottom: "20px", width: "100%", maxWidth: "300px" }}>
              <img src="logo.png" alt="Personal Finance" className="img-fluid rounded" />
            </div>
            <h2 className="main-title">Personal Finance Manager</h2>
            <p className="tagline">
              Simplify budgeting, track spending, and save for your future.<br />Take control of your finances with ease.
            </p>
          </Col>

          <Col md={5}>
            <h3 className="text-center text-white mt-4">Login</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mt-3">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  isInvalid={!!errors.email}
                />
                {errors.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  isInvalid={!!errors.password}
                />
                {errors.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
              </Form.Group>

              <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }} className="mt-4">
                <Button type="submit" className="text-center mt-3 btnStyleLogin" disabled={loading}>
                  {loading ? "Signin…" : "Login"}
                </Button>

                <p className="mt-3" style={{ color: "#D0D3D4" }}>
                  Don't Have an Account?{" "}
                  <Link to="/register" className="text-white lnk" style={{ textDecoration: 'underline', color: 'inherit' }}>
                    Register
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './auth.css';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => { }, []);

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
    if (!values.name) newErrors.name = "Name is required.";
    if (!values.email) newErrors.email = "Email is required.";
    if (!values.password) newErrors.password = "Password is required.";
    else if (values.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { name, email, password } = values;

    const { data } = await axios.post(registerAPI, {
      name,
      email,
      password
    });

    if (data.success === true) {
      delete data.user.password;
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message, toastOptions);
      setLoading(false);
      navigate("/");
    } else {
      toast.error(data.message, toastOptions);
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: { color: { value: '#1A1A1D' } },
            fpsLimit: 60,
            particles: {
              number: { value: 100, density: { enable: true, value_area: 800 } },
              color: { value: '#6699ff' },
              shape: { type: 'circle' },
              opacity: { value: 0.9, random: true },
              size: { value: 4, random: true },
              move: { enable: true, speed: 1.5 },
            },
            detectRetina: true,
          }}
          style={{
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <Container className="mt-5" style={{ position: 'relative', zIndex: 2 }}>
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

            <Col md={5} className="mt-5"> 
              <h3 className="text-center text-white mt-4">Registration</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName" className="mt-3">
                  <Form.Label className="text-white">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  {errors.name && <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label className="text-white">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  {errors.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label className="text-white">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  {errors.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
                </Form.Group>

                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    className="btnStyleSignUp text-center mt-3"
                    onClick={!loading ? handleSubmit : null}
                    disabled={loading}
                  >
                    {loading ? "Registering…" : "Sign Up"}
                  </Button>
                </div>

                <p className="text-center mt-3" style={{ color: "#D0D3D4" }}>
                  Already have an account? <Link to="/login" className="text-white lnk" style={{ textDecoration: 'underline', color: 'inherit' }}>Login</Link>
                </p>
              </Form>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
    </>
  );
}

export default Register;

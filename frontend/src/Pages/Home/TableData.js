import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

const TableData = (props) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleEditClick = (itemKey) => {
    const editTran = props.data.find((item) => item._id === itemKey);
    setCurrId(itemKey);
    setEditingTransaction(editTran);
    setValues({
      title: editTran.title,
      amount: editTran.amount,
      description: editTran.description,
      category: editTran.category,
      date: moment(editTran.date).format("YYYY-MM-DD"),
      transactionType: editTran.transactionType,
    });
    setShow(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${editTransactions}/${currId}`, values);
      if (data.success) {
        setShow(false);
        setTransactions((prev) =>
          prev.map((item) => (item._id === currId ? { ...item, ...values } : item))
        );

        if (props.setRefresh && typeof props.setRefresh === 'function') {
          props.setRefresh(!props.refresh);
        }
      } else {
        console.log("Error in editing transaction");
      }
    } catch (error) {
      console.error("Error editing transaction:", error);
    }
  };

  const handleDeleteClick = async (itemKey) => {
    try {
      const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
        userId: props.user._id,
      });
      if (data.success) {
        setTransactions((prev) => prev.filter((item) => item._id !== itemKey));
        
        if (props.setRefresh && typeof props.setRefresh === 'function') {
          props.setRefresh(!props.refresh);
        }
      } else {
        console.log("Error in deleting transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleViewDetailsClick = (transactionId) => {
    navigate(`/transaction/${transactionId}`); 
  };

  useEffect(() => {
    setTransactions(props.data);
  }, [props.data]);

  return (
    <Container>
      <Table responsive="md" className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {transactions.map((item, index) => (
            <tr key={index}>
              <td>{moment(item.date).format("YYYY-MM-DD")}</td>
              <td>{item.title}</td>
              <td>{item.amount}</td>
              <td>{item.transactionType}</td>
              <td>{item.category}</td>
              <td>
                <div className="icons-handle">
                  <EditNoteIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleEditClick(item._id)}
                  />
                  <DeleteForeverIcon
                    sx={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleDeleteClick(item._id)}
                  />
                  <Button
                    className="view-details"
                    variant="info"
                    size="sm"
                    onClick={() => handleViewDetailsClick(item._id)} 
                  >
                    View Details
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingTransaction && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Transaction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  type="text"
                  placeholder="Enter title"
                  value={values.title}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={values.amount}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSelect">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                >
                  <option value="">{values.category}</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Rent">Rent</option>
                  <option value="Salary">Salary</option>
                  <option value="Tip">Tip</option>
                  <option value="Food">Food</option>
                  <option value="Medical">Medical</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Enter description"
                  value={values.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSelect1">
                <Form.Label>Transaction Type</Form.Label>
                <Form.Select
                  name="transactionType"
                  value={values.transactionType}
                  onChange={handleChange}
                >
                  <option value="">{values.transactionType}</option>
                  <option value="Credit">Credit</option>
                  <option value="Expense">Expense</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                />
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default TableData;

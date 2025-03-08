import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { getTransactionById } from '../../utils/ApiRequest.js';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header.js";
import Spinner from "../../components/Spinner.js";
import './transaction.css'; // Make sure your CSS is applied

const TransactionDetail = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const { data } = await axios.get(`${getTransactionById}/${id}`);
        if (data.success) {
          setTransaction(data.transaction);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <Header />
      <Container className="transaction-detail-container mt-3">
        <Card className="transaction-card">
          <Card.Header className="transaction-card-header">
            Transaction Details
          </Card.Header>
          <Card.Body className='card-body'>
            <Card.Title className="card-title">{transaction.title}</Card.Title>
            <div className="transaction-details">
              <p><strong>Amount:</strong> {transaction.amount}</p>
              <p><strong>Description:</strong> {transaction.description}</p>
              <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {transaction.category}</p>
              <p><strong>Type:</strong> {transaction.transactionType}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => window.history.back()} 
              className="view-details-btn w-100"
            >
              Go Back
            </Button>
          </Card.Body>
        </Card>
      </Container>
      <ToastContainer />
    </>
  );
};

export default TransactionDetail;

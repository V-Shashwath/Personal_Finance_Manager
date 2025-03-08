import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { deleteMultipleTransactions, getAllTransactions } from '../../utils/ApiRequest.js';
import Header from "../../components/Header.js";
import Spinner from "../../components/Spinner.js";
import './transaction.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user._id : null;
      if (!userId) {
        setError("User ID is missing or invalid.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.post(getAllTransactions, { userId });
        if (data.success) {
          setTransactions(data.transactions);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleSelectTransaction = (id) => {
    setSelectedTransactions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((transactionId) => transactionId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : null;
    if (!userId) {
      setError("User ID is missing or invalid.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(deleteMultipleTransactions, {
        transactionIds: selectedTransactions,
        userId,
      });

      if (data.success) {
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => !selectedTransactions.includes(transaction._id))
        );
        setSelectedTransactions([]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    window.history.back(); // This will navigate the user back to the previous page
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Card className="transaction-card">
          <Card.Header className="transaction-card-header">Transaction List</Card.Header>
          <Card.Body className="card-body">
            <Button
              variant="danger"
              onClick={handleDeleteSelected}
              disabled={selectedTransactions.length === 0}
              className="dltS"
            >
              Delete Selected
            </Button>

            <Button
              variant="secondary"
              onClick={handleGoBack}
              className="goback"
            >
              Go Back
            </Button>

            <Table striped bordered hover className="transaction-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6">No transactions available</td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedTransactions.includes(transaction._id)}
                          onChange={() => handleSelectTransaction(transaction._id)}
                        />
                      </td>
                      <td>{transaction.title}</td>
                      <td>{transaction.amount}</td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.category}</td>
                      <td>{transaction.transactionType}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default TransactionList;

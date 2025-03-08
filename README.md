# Personal Finance Manager

This project contains both a **backend** and **frontend** that work together. The backend is a Node.js/Express application, and the frontend is a React application. Below are instructions for setting up and running the project locally.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [License](#license)

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MongoDB](https://www.mongodb.com/) (if running MongoDB locally)

## Setup Instructions

Follow these steps to set up and run the project.

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the necessary dependencies for the backend:
   ```bash
   npm install
   ```

3. Set up environment variables (see Environment Variables section below).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the necessary dependencies for the frontend:
   ```bash
   npm install
   ```

3. Set up environment variables (see Environment Variables section below).

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=5000
MONGO_URL=mongodb://localhost:27017/your-database-name
```

## Running the Project

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start running on the port specified in your environment variables (default: 5000).

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The frontend development server will start running on port 3000 by default. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Common Issues

1. **Backend server won't start**
   - Check if MongoDB is running (if using a local MongoDB instance)
   - Verify that all environment variables are set correctly
   - Make sure the specified port is not already in use

2. **Frontend can't connect to backend**
   - Ensure the backend server is running
   - Check that REACT_APP_API_URL points to the correct backend URL
   - Verify that CORS is properly configured on the backend

3. **Dependencies installation fails**
   - Try clearing npm cache: `npm cache clean --force`
   - Ensure you have the correct version of Node.js installed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

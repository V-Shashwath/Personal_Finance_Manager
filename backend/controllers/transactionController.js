// import Transaction from "../models/TransactionModel.js";
// import User from "../models/UserSchema.js";
// import moment from "moment";

// export const addTransactionController = async (req, res) => {
//   try {
//     const {
//       title,
//       amount,
//       description,
//       date,
//       category,
//       userId,
//       transactionType,
//     } = req.body;

//     // console.log(title, amount, description, date, category, userId, transactionType);

//     if (
//       !title ||
//       !amount ||
//       !description ||
//       !date ||
//       !category ||
//       !transactionType
//     ) {
//       return res.status(408).json({
//         success: false,
//         messages: "Please Fill all fields",
//       });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     let newTransaction = await Transaction.create({
//       title: title,
//       amount: amount,
//       category: category,
//       description: description,
//       date: date,
//       user: userId,
//       transactionType: transactionType,
//     });

//     user.transactions.push(newTransaction);

//     user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Transaction Added Successfully",
//     });
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       messages: err.message,
//     });
//   }
// };

// export const getAllTransactionController = async (req, res) => {
//   try {
//     const { userId, type, frequency, startDate, endDate } = req.body;

//     console.log(userId, type, frequency, startDate, endDate);

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Create a query object with the user and type conditions
//     const query = {
//       user: userId,
//     };

//     if (type !== 'all') {
//       query.transactionType = type;
//     }

//     // Add date conditions based on 'frequency' and 'custom' range
//     if (frequency !== 'custom') {
//       query.date = {
//         $gt: moment().subtract(Number(frequency), "days").toDate()
//       };
//     } else if (startDate && endDate) {
//       query.date = {
//         $gte: moment(startDate).toDate(),
//         $lte: moment(endDate).toDate(),
//       };
//     }

//     // console.log(query);

//     const transactions = await Transaction.find(query);

//     // console.log(transactions);

//     return res.status(200).json({
//       success: true,
//       transactions: transactions,
//     });
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       messages: err.message,
//     });
//   }
// };


// export const deleteTransactionController = async (req, res) => {
//   try {
//     const transactionId = req.params.id;
//     const userId = req.body.userId;

//     // console.log(transactionId, userId);

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     const transactionElement = await Transaction.findByIdAndDelete(
//       transactionId
//     );

//     if (!transactionElement) {
//       return res.status(400).json({
//         success: false,
//         message: "transaction not found",
//       });
//     }

//     const transactionArr = user.transactions.filter(
//       (transaction) => transaction._id === transactionId
//     );

//     user.transactions = transactionArr;

//     user.save();

//     // await transactionElement.remove();

//     return res.status(200).json({
//       success: true,
//       message: `Transaction successfully deleted`,
//     });
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       messages: err.message,
//     });
//   }
// };

// export const updateTransactionController = async (req, res) => {
//   try {
//     const transactionId = req.params.id;

//     const { title, amount, description, date, category, transactionType } =
//       req.body;

//     console.log(title, amount, description, date, category, transactionType);

//     const transactionElement = await Transaction.findById(transactionId);

//     if (!transactionElement) {
//       return res.status(400).json({
//         success: false,
//         message: "transaction not found",
//       });
//     }

//     if (title) {
//       transactionElement.title = title;
//     }

//     if (description) {
//       transactionElement.description = description;
//     }

//     if (amount) {
//       transactionElement.amount = amount;
//     }

//     if (category) {
//       transactionElement.category = category;
//     }
//     if (transactionType) {
//       transactionElement.transactionType = transactionType;
//     }

//     if (date) {
//       transactionElement.date = date;
//     }

//     await transactionElement.save();

//     // await transactionElement.remove();

//     return res.status(200).json({
//       success: true,
//       message: `Transaction Updated Successfully`,
//       transaction: transactionElement,
//     });
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       messages: err.message,
//     });
//   }
// };


import { body, validationResult } from 'express-validator';
import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

export const addTransactionController = [
  // Validation rules
  body('title').notEmpty().withMessage('Title is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Date must be a valid date'),
  body('category').notEmpty().withMessage('Category is required'),
  body('transactionType').notEmpty().withMessage('Transaction Type is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, amount, description, date, category, userId, transactionType } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      let newTransaction = await Transaction.create({
        title, amount, category, description, date, user: userId, transactionType
      });

      user.transactions.push(newTransaction);
      user.save();

      return res.status(200).json({ success: true, message: "Transaction Added Successfully" });
    } catch (err) {
      return res.status(401).json({ success: false, messages: err.message });
    }
  }
];

export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const query = { user: userId };
    if (type !== 'all') {
      query.transactionType = type;
    }

    if (frequency !== 'custom') {
      query.date = { $gt: moment().subtract(Number(frequency), "days").toDate() };
    } else if (startDate && endDate) {
      query.date = { $gte: moment(startDate).toDate(), $lte: moment(endDate).toDate() };
    }

    const transactions = await Transaction.find(query);
    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    return res.status(401).json({ success: false, messages: err.message });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const transactionElement = await Transaction.findByIdAndDelete(transactionId);
    if (!transactionElement) {
      return res.status(400).json({ success: false, message: "Transaction not found" });
    }

    user.transactions = user.transactions.filter(transaction => transaction._id !== transactionId);
    user.save();

    return res.status(200).json({ success: true, message: "Transaction successfully deleted" });
  } catch (err) {
    return res.status(401).json({ success: false, messages: err.message });
  }
};

export const updateTransactionController = [
  // Validation rules
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('description').optional().notEmpty().withMessage('Description is required'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
  body('category').optional().notEmpty().withMessage('Category is required'),
  body('transactionType').optional().notEmpty().withMessage('Transaction Type is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const transactionId = req.params.id;
      const { title, amount, description, date, category, transactionType } = req.body;

      const transactionElement = await Transaction.findById(transactionId);
      if (!transactionElement) {
        return res.status(400).json({ success: false, message: "Transaction not found" });
      }

      if (title) transactionElement.title = title;
      if (description) transactionElement.description = description;
      if (amount) transactionElement.amount = amount;
      if (category) transactionElement.category = category;
      if (transactionType) transactionElement.transactionType = transactionType;
      if (date) transactionElement.date = date;

      await transactionElement.save();

      return res.status(200).json({ success: true, message: "Transaction Updated Successfully", transaction: transactionElement });
    } catch (err) {
      return res.status(401).json({ success: false, messages: err.message });
    }
  }
];

export const deleteMultipleTransactionsController = async (req, res) => {
  try {
    const { transactionIds, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const deletedTransactions = await Transaction.deleteMany({ _id: { $in: transactionIds } });
    user.transactions = user.transactions.filter(transaction => !transactionIds.includes(transaction._id.toString()));
    user.save();

    return res.status(200).json({ success: true, message: "Transactions successfully deleted", deletedCount: deletedTransactions.deletedCount });
  } catch (err) {
    return res.status(401).json({ success: false, messages: err.message });
  }
};

export const getTransactionByIdController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(400).json({ success: false, message: "Transaction not found" });
    }

    return res.status(200).json({ success: true, transaction });
  } catch (err) {
    return res.status(401).json({ success: false, messages: err.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { userId } = req.body; // Getting userId from the request body

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Fetch all transactions for the user without any filters
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 }); // Sort by date in descending order

    // Return the fetched transactions
    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
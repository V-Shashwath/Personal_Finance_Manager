import express from 'express';
import { addTransactionController, deleteMultipleTransactionsController, deleteTransactionController, getAllTransactionController, getAllTransactions, getTransactionByIdController, updateTransactionController } from '../controllers/transactionController.js';

const router = express.Router();

router.route("/addTransaction").post(addTransactionController);
router.route("/getTransaction").post(getAllTransactionController);
router.route("/deleteTransaction/:id").post(deleteTransactionController);
router.route('/updateTransaction/:id').put(updateTransactionController);

router.route('/getAllTransactions').post(getAllTransactions);
router.route('/deleteMultipleTransactions').post(deleteMultipleTransactionsController);
router.route('/getTransactionById/:id').get(getTransactionByIdController);

export default router;
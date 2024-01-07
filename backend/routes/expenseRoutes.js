const express = require('express');

const expenseController = require('../controllers/expense.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.post('/addExpense', auth.authenticate, expenseController.addExpense);

router.get('/getExpenses', auth.authenticate , expenseController.getExpenses);

router.post('/deleteExpense/:id', auth.authenticate , expenseController.deleteExpense);

module.exports = router;
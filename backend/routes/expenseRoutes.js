const express = require('express');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes with authorization
router.get('/', authorize('expenses', 'read'), getExpenses);
router.get('/stats', authorize('expenses', 'read'), getExpenseStats);
router.post('/', authorize('expenses', 'create'), createExpense);
router.put('/:id', authorize('expenses', 'update'), updateExpense);
router.delete('/:id', authorize('expenses', 'delete'), deleteExpense);

module.exports = router;

const express = require('express');
const {
  getPayments,
  updatePayment,
  exportPayments,
  getPaymentStats
} = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes with authorization
router.get('/', authorize('payments', 'read'), getPayments);
router.get('/stats', authorize('payments', 'read'), getPaymentStats);
router.get('/export', authorize('payments', 'read'), exportPayments);
router.put('/:id', authorize('payments', 'update'), updatePayment);

module.exports = router;

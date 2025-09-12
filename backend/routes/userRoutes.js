const express = require('express');
const {
  getMyDetails,
  getMyPayments,
  getMyDuePayments,
  getMyAlerts,
  getMySeat,
  getMyDashboard
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/dashboard', getMyDashboard);
router.get('/details', getMyDetails);
router.get('/payments', getMyPayments);
router.get('/due-payments', getMyDuePayments);
router.get('/alerts', getMyAlerts);
router.get('/seat', getMySeat);

module.exports = router;

const express = require('express');
const {
  getDashboardStats,
  getRevenueAnalytics
} = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes with authorization
router.get('/stats', authorize('dashboard', 'read'), getDashboardStats);
router.get('/revenue-analytics', authorize('dashboard', 'read'), getRevenueAnalytics);

module.exports = router;

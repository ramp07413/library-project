const express = require('express');
const {
  getAlerts,
  createAlert,
  markAsRead,
  markAllAsRead,
  deleteAlert,
  getAlertStats
} = require('../controllers/alertController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes with authorization
router.get('/', authorize('alerts', 'read'), getAlerts);
router.get('/stats', authorize('alerts', 'read'), getAlertStats);
router.post('/', authorize('alerts', 'create'), createAlert);
router.put('/:id/read', authorize('alerts', 'update'), markAsRead);
router.put('/read-all', authorize('alerts', 'update'), markAllAsRead);
router.delete('/:id', authorize('alerts', 'delete'), deleteAlert);

module.exports = router;

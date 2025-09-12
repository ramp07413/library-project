const express = require('express');
const {
  initializeSeats,
  createSeat,
  getSeats,
  deleteSeat,
  assignSeat,
  unassignSeat,
  getSeatStats
} = require('../controllers/seatController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes with authorization
router.get('/', authorize('seats', 'read'), getSeats);
router.get('/stats', authorize('seats', 'read'), getSeatStats);
// router.post('/initialize', authorize('seats', 'create'), initializeSeats);
router.post('/assign', authorize('seats', 'update'), assignSeat);
router.post('/create', authorize('seats', 'create'), createSeat);
router.delete('/delete', authorize('seats', 'delete'), deleteSeat);
router.put('/:id/unassign', authorize('seats', 'update'), unassignSeat);

module.exports = router;

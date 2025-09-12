const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  createAdmin,
  updatePermissions,
  toggleUserStatus,
  deleteUser,
  getUserStats
} = require('../controllers/adminController');
const { authenticate, requireAdmin, requireSuperAdmin, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const createAdminValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'super_admin']).withMessage('Invalid role')
];

// Admin management routes
router.get('/users', requireAdmin, getUsers);
router.get('/users/stats', requireAdmin, getUserStats);
router.post('/users', requireAdmin, createAdminValidation, createAdmin);
router.put('/users/:id/permissions', requireAdmin, updatePermissions);
router.put('/users/:id/status', requireAdmin, toggleUserStatus);
router.delete('/users/:id', requireSuperAdmin, deleteUser);

module.exports = router;

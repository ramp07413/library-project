const Alert = require('../models/Alert');

// Get all alerts
const getAlerts = async (req, res) => {
  try {
    const { type, read } = req.query;
    let query = {};
    
    if (type && type !== 'all') query.type = type;
    if (read !== undefined) query.read = read === 'true';

    const alerts = await Alert.find(query)
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new alert
const createAlert = async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark alert as read
const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all alerts as read
const markAllAsRead = async (req, res) => {
  try {
    await Alert.updateMany({ read: false }, { read: true });
    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete alert
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get alert statistics
const getAlertStats = async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments();
    const unreadAlerts = await Alert.countDocuments({ read: false });
    
    const alertsByType = await Alert.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      totalAlerts,
      unreadAlerts,
      alertsByType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAlerts,
  createAlert,
  markAsRead,
  markAllAsRead,
  deleteAlert,
  getAlertStats
};

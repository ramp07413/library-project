const Payment = require('../models/Payment');
const Student = require('../models/Student');
const Alert = require('../models/Alert');

// Get user's student details
const getMyDetails = async (req, res) => {
  try {
    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const student = await Student.findById(req.user.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's payment history
const getMyPayments = async (req, res) => {
  try {
    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const { status, limit = 10 } = req.query;
    let query = { studentId: req.user.studentId };
    
    if (status && status !== 'all') query.status = status;

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Calculate payment statistics
    const totalPaid = await Payment.aggregate([
      { $match: { studentId: req.user.studentId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingAmount = await Payment.aggregate([
      { $match: { studentId: req.user.studentId, status: { $in: ['pending', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      payments,
      statistics: {
        totalPaid: totalPaid[0]?.total || 0,
        pendingAmount: pendingAmount[0]?.total || 0,
        totalPayments: payments.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's due payments
const getMyDuePayments = async (req, res) => {
  try {
    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const duePayments = await Payment.find({
      studentId: req.user.studentId,
      status: { $in: ['pending', 'overdue'] }
    }).sort({ dueDate: 1 });

    const totalDue = duePayments.reduce((sum, payment) => sum + payment.amount, 0);
    const overdueCount = duePayments.filter(p => p.status === 'overdue').length;

    res.json({
      duePayments,
      summary: {
        totalDue,
        overdueCount,
        totalDuePayments: duePayments.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's alerts
const getMyAlerts = async (req, res) => {
  try {
    const { read, limit = 20 } = req.query;
    let query = {};
    
    // Get alerts for this specific student or general alerts
    query.$or = [
      { studentId: req.user.studentId },
      { studentId: null } // General alerts
    ];
    
    if (read !== undefined) query.read = read === 'true';

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Alert.countDocuments({
      $or: [
        { studentId: req.user.studentId },
        { studentId: null }
      ],
      read: false
    });

    res.json({
      alerts,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's seat information
const getMySeat = async (req, res) => {
  try {
    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const student = await Student.findById(req.user.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    if (!student.seatNumber) {
      return res.json({ message: 'No seat assigned yet', seatNumber: null });
    }

    const Seat = require('../models/Seat');
    const seat = await Seat.findOne({ seatNumber: student.seatNumber });

    res.json({
      seatNumber: student.seatNumber,
      seatDetails: seat,
      assignedDate: student.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user dashboard summary
const getMyDashboard = async (req, res) => {
  try {
    if (!req.user.studentId) {
      return res.status(404).json({ message: 'No student profile found' });
    }

    const student = await Student.findById(req.user.studentId);
    
    // Payment summary
    const paymentSummary = await Payment.aggregate([
      { $match: { studentId: req.user.studentId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Recent payments
    const recentPayments = await Payment.find({ studentId: req.user.studentId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Unread alerts count
    const unreadAlerts = await Alert.countDocuments({
      $or: [
        { studentId: req.user.studentId },
        { studentId: null }
      ],
      read: false
    });

    // Calculate days since joining
    const daysSinceJoining = Math.floor((new Date() - new Date(student.joinDate)) / (1000 * 60 * 60 * 24));

    res.json({
      student: {
        name: student.name,
        email: student.email,
        joinDate: student.joinDate,
        shift: student.shift,
        seatNumber: student.seatNumber,
        status: student.status,
        daysSinceJoining
      },
      paymentSummary,
      recentPayments,
      unreadAlerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyDetails,
  getMyPayments,
  getMyDuePayments,
  getMyAlerts,
  getMySeat,
  getMyDashboard
};

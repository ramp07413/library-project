const Student = require('../models/Student');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Seat = require('../models/Seat');
const Alert = require('../models/Alert');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Student stats
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    
    // Seat stats
    const totalSeats = await Seat.countDocuments();
    const occupiedSeats = await Seat.countDocuments({ occupied: true });
    const availableSeats = totalSeats - occupiedSeats;
    const fullseat = await Seat.countDocuments({ seatOcupiedTiming: 'full' });
    const halfseat = await Seat.countDocuments({ seatOcupiedTiming: 'half' });

    // Payment stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = await Payment.aggregate([
      { 
        $match: { 
          status: 'paid',
          paidDate: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingPayments = await Payment.countDocuments({ status: 'pending' });

    // Revenue chart data (last 6 months)
    const revenueData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const nextDate = new Date(currentYear, currentMonth - i + 1, 1);
      
      const revenue = await Payment.aggregate([
        {
          $match: {
            status: 'paid',
            paidDate: { $gte: date, $lt: nextDate }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      revenueData.push({
        month: date.toLocaleString('default', { month: 'short' }),
        amount: revenue[0]?.total || 0
      });
    }

    // Student distribution by shift
    const shiftDistribution = await Student.aggregate([
      { $group: { _id: '$shift', count: { $sum: 1 } } }
    ]);

    // Recent activities
    const recentActivities = await Alert.find()
      .populate('studentId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalStudents,
        activeStudents,
        totalSeats,
        occupiedSeats,
        availableSeats,
        fullseat,
        halfseat,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingPayments
      },
      charts: {
        revenueData,
        shiftDistribution
      },
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue analytics
const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    const currentDate = new Date();
    let startDate;

    switch (period) {
      case '1month':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        break;
      case '3months':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
        break;
      case '1year':
        startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
        break;
      default:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
    }

    const revenueAnalytics = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidDate' },
            month: { $month: '$paidDate' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(revenueAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getRevenueAnalytics
};

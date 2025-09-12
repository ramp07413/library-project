const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { Parser } = require('json2csv');

// Get all payments
const getPayments = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    
    if (status && status !== 'all') query.status = status;

    const payments = await Payment.find(query)
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    let filteredPayments = payments;
    if (search) {
      filteredPayments = payments.filter(payment => 
        payment.studentId.name.toLowerCase().includes(search.toLowerCase()) ||
        payment.studentId.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(filteredPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status
const updatePayment = async (req, res) => {
  try {
    const { status, method, paidDate } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        method: status === 'paid' ? method : null,
        paidDate: status === 'paid' ? paidDate || new Date() : null
      },
      { new: true }
    ).populate('studentId', 'name email');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export payments to CSV
const exportPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('studentId', 'name email phone')
      .sort({ createdAt: -1 });

    const csvData = payments.map(payment => ({
      'Student Name': payment.studentId.name,
      'Student Email': payment.studentId.email,
      'Student Phone': payment.studentId.phone,
      'Amount': payment.amount,
      'Due Date': payment.dueDate.toDateString(),
      'Paid Date': payment.paidDate ? payment.paidDate.toDateString() : 'Not Paid',
      'Status': payment.status,
      'Method': payment.method || 'N/A',
      'Month': payment.month,
      'Year': payment.year
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('payments.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment statistics
const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const paidPayments = await Payment.countDocuments({ status: 'paid' });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const overduePayments = await Payment.countDocuments({ status: 'overdue' });

    const totalAmount = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paidAmount = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalPayments,
      paidPayments,
      pendingPayments,
      overduePayments,
      totalAmount: totalAmount[0]?.total || 0,
      paidAmount: paidAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  updatePayment,
  exportPayments,
  getPaymentStats
};

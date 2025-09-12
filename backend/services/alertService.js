const Alert = require('../models/Alert');
const Payment = require('../models/Payment');
const { isOverdue } = require('../utils/dateUtils');

// Create alert for overdue payments
const createOverduePaymentAlert = async (payment) => {
  try {
    const alert = new Alert({
      type: 'warning',
      title: 'Payment Overdue',
      message: `Payment of ₹${payment.amount} is overdue for ${payment.month} ${payment.year}`,
      studentId: payment.studentId
    });
    await alert.save();
    return alert;
  } catch (error) {
    console.error('Error creating overdue payment alert:', error);
  }
};

// Create alert for new student registration
const createNewStudentAlert = async (student) => {
  try {
    const alert = new Alert({
      type: 'info',
      title: 'New Student Registration',
      message: `${student.name} has registered for the ${student.shift} shift`,
      studentId: student._id
    });
    await alert.save();
    return alert;
  } catch (error) {
    console.error('Error creating new student alert:', error);
  }
};

// Create alert for payment received
const createPaymentReceivedAlert = async (payment) => {
  try {
    const alert = new Alert({
      type: 'success',
      title: 'Payment Received',
      message: `Payment of ₹${payment.amount} received for ${payment.month} ${payment.year}`,
      studentId: payment.studentId
    });
    await alert.save();
    return alert;
  } catch (error) {
    console.error('Error creating payment received alert:', error);
  }
};

// Check for overdue payments and create alerts
const checkOverduePayments = async () => {
  try {
    const overduePayments = await Payment.find({
      status: 'pending',
      dueDate: { $lt: new Date() }
    }).populate('studentId', 'name');

    for (const payment of overduePayments) {
      // Update payment status to overdue
      payment.status = 'overdue';
      await payment.save();

      // Create alert
      await createOverduePaymentAlert(payment);
    }

    console.log(`Processed ${overduePayments.length} overdue payments`);
  } catch (error) {
    console.error('Error checking overdue payments:', error);
  }
};

module.exports = {
  createOverduePaymentAlert,
  createNewStudentAlert,
  createPaymentReceivedAlert,
  checkOverduePayments
};

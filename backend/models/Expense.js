const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['utilities', 'maintenance', 'supplies', 'staff', 'marketing', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['one-time', 'recurring'],
    default: 'one-time'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);

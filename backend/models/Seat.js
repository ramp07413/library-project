const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['regular', 'premium', 'vip'],
    default: 'regular'
  },
  seatOcupiedTiming: {
    type: String,
    enum: ['none', 'half', 'full'],
    default: 'none'
  },
  occupied: {
    type: Boolean,
    default: false
  },
  position: {
    row: { type: Number, default: 1 },
    column: { type: Number, default: 1 }
  },
  student: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Seat', seatSchema);

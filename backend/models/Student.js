const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName : {
    type : String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  joinDate: {
    type: Date,
    required: true
  },
  endDate : {
    type : Date,
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  seatingType : {
    type : String,
    enum : ['half', 'full'],
    default : 'full'
  },
  fee : {
    type : Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);

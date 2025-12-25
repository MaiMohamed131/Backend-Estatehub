const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  propertyTitle: {
    type: String,
    required: true
  },
  propertyLocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'Credit Card'
  },
  transactionId: { 
    type: String, 
    unique: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
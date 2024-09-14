const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String },
  paymentStatus: { type: String, default: 'pending' },
  paymentIntentId: { type: String },
  razorpayOrderId : { type: String },
  ticketTypeName: { type: String }, // added ticketType field
  
});

module.exports = mongoose.model('Ticket', ticketSchema);
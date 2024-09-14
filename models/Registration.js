const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketType: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketType' }, // Reference to TicketType
  paymentMethod: { type: String },
  paymentStatus: { type: String, default: 'pending' },
  paymentIntentId: { type: String }
});

module.exports = mongoose.model('Registration', registrationSchema);

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  city: String,
  ticketPricing: {
    type: Number,
    required: true
  },
  category: String,
  images: [String],
  schedule: {
    type: String,  // Or you could use a more complex structure if needed
    required: false
  }
});

module.exports = mongoose.model('Event', eventSchema);
const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true // Ensure no leading/trailing spaces
  },
  description: { 
    type: String, 
    default: 'Standard ticket' // Default description if none provided
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price must be positive'], // Ensure the price is not negative
    validate: { 
      validator: Number.isInteger, 
      message: '{VALUE} is not a valid price' 
    }
  }
}, { timestamps: true }); // Automatically add `createdAt` and `updatedAt`

module.exports = mongoose.model('TicketType', ticketTypeSchema);

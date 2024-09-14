const Registration = require('../models/Registration');

exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().populate('event user ticketType');
    res.status(200).json(registrations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

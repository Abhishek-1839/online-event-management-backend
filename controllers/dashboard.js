const Event = require('../models/event');
const Registration = require('../models/Registration');

exports.getDashboard = async (req, res) => {
  try {
    const events = await Event.find().populate('registrations');
    const registrations = await Registration.find({ user: req.user._id });
    res.status(200).json({ events, registrations });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const Registration = require('../models/Registration');

exports.createRegistration = async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json(registration);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id }).populate('event ticketType');
    res.status(200).json(registrations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;
    await Registration.findByIdAndRemove(registrationId);
    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

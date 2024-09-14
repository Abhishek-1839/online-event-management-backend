const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json(user);
      } catch (err) {
        res.status(400).json({ error: err.message });}
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();  // Fetch all users
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: 'Failed to fetch users' });
    }
  };

  exports.getUserByName = async (req, res) => {
    try {
        const nameRegex = new RegExp(req.params.name, 'i');  // Case-insensitive and partial match
        const users = await User.find({ name: nameRegex });  // Find users whose name matches the regex
        if (!users || users.length === 0) {
          return res.status(404).json({ error: 'No users found' });
        }
        res.status(200).json(users);
      } catch (err) {
        res.status(400).json({ error: 'Failed to fetch user profile' });
      }
    };
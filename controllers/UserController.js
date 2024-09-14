const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

module.exports = router;
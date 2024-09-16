const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const { sendEmail } = require('../utils/email');
const generateToken = require('../utils/generateToken');


const generateActivationToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' });
};


// exports.register = async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
//       expiresIn: '1h'
//     });
//     res.status(201).json({ token });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
const registerUser = async (req, res) => {
  console.log('Received registration request:', req.body);
  const { name, email, password } = req.body;
  try {
      const user = await User.create({ name, email, password });


      // Generate activation token
      const activationToken = generateActivationToken(user._id);
      user.activationToken = activationToken;
      await user.save();

      const activationLink = `http://localhost:3000/activate/${activationToken}`;
      await sendEmail(req.body.email, 'Activate your account Registration Successful, Welcome to our service!', `Click this link to activate your account: ${activationLink}`);

      console.log('Sending registration email to:', req.body.email);
      // await sendEmail(req.body.email, );
      console.log('Registration email sent successfully');

      res.status(201).json({ message: "User registered. Please check your email to activate your account." });
  } catch (err) {
      console.log('Error in registration:', err);
      if (err.code === 'EAUTH') {
          res.status(500).json({ err: 'Email authentication failed. Please contact support.' });
      } else {
          res.status(500).json({ err: 'An error occurred during registration', details: err.message });
      }
  }
};


const activateUser = async (req, res) => {
  const { token } = req.params;
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOneAndUpdate(
          { _id: decoded.id, activationToken: token },
          { isActive: true, activationToken: null },
          { new: true }
      );

      if (!user) return res.status(400).json({ error: "Invalid or expired token" });


      res.json({ message: "Account activated. You can now log in." });

  } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });
      console.log('Hashed password in DB:', user.password);

      const isMatch = await user.comparePassword(password); // plain text password from login

      if (isMatch) {
          console.log('Password matches');
      } else {
          console.log('Password does not match');
      }
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      // if (!user.isActive) return res.status(400).json({ error: "Please activate your account" });

      // Generate JWT token (for session management)
      // This is where you would issue the JWT token

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
      });

      // Set the token in HttpOnly cookie
      res.cookie('jwtToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',  // Use secure in production
          sameSite: 'None' // Prevent CSRF
      });

      // For simplicity, returning user info
      res.json({ user: user._id, isLoggedIn: true });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
};



const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });

      // Generate a new reset token
      const resetToken = generateToken(user.id);
      
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
      console.log('Token saved in DB:', resetToken);
      console.log('Token expires at:', user.resetPasswordExpires);
      await user.save();

      const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
      await sendEmail(email, 'Reset your password', `Click this link to reset your password: ${resetLink}`);

      res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
      console.error("Error during forgot password:", err);
      res.status(500).json({ error: "Internal server error" });
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
      // Log the token received for debugging
      console.log('Token received:', token);

      // Find user by token and check if token hasn't expired
      const user = await User.findOne({
          resetPasswordToken: token,  // Make sure this matches exactly
          resetPasswordExpires: { $gt: Date.now() }  // Ensure time check is correct
          
      });

    


      if (!user) {
          console.log('User not found or token expired');
          return res.status(400).json({ error: "Invalid or expired token" });
      }

      // Log user for debugging
      console.log('User found:', user);

     // Hash the new password and save it
  //    const hashedPassword = await bcrypt.hash(newPassword, 10);
  //    console.log('Hashed new password:', hashedPassword);
     user.password = newPassword;

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.json({ message: "Password has been reset. You can now log in with your new password." });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
};


const logoutUser = async (req, res) => {
  try {
      // Clear the JWT token from the cookie
      res.clearCookie('jwtToken');

      // Return a success response
      res.json({ message: "Logged out successfully" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  registerUser,
  activateUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
};


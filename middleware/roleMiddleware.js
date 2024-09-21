// // middleware/roleMiddleware.js

// const User = require('../models/User'); // Assuming you have a User model

// // Middleware to check for admin role
// const isAdmin = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id); // Assuming `req.user` contains authenticated user ID
//     if (user && user.role === 'admin') {
//       next(); // Proceed if user is an admin
//     } else {
//       return res.status(403).json({ error: 'Access denied. Admins only.' });
//     }
//   } catch (err) {
//     return res.status(500).json({ error: 'Server error while checking role' });
//   }
// };

// module.exports = isAdmin;
// roleMiddleware.js
const roleMiddleware = (req, res, next) => {
const userRole = req.user.role; // Assuming role is part of the user object in the request
console.log(userRole);
  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
    };
  
module.exports = roleMiddleware;
  
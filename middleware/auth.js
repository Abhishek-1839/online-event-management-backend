// const jwt = require('jsonwebtoken');

// module.exports = async (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ error: 'Please authenticate' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // const authHeader = req.get('Authorization');
        // if (!authHeader) {
        //   return res.status(400).json({ error: 'Authorization header missing' });
        // }
        // const token = authHeader.replace('Bearer ', '');
        // console.log('Token:', token);

        const token = req.cookies.jwtToken

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }


        //   Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        const { email } = decoded;
        // Find the user by ID from the token payload
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Please authenticate.' });
        }
        req.user = { email: user.email };

        // Add a check for logout request
        if (req.url === '/auth/logout') {
            // Clear the JWT token from the cookie
            res.clearCookie('jwtToken');
            return res.json({ message: "Logged out successfully" });
        }
        
        next();
    }
    catch (err) {
        console.error('JWT verification failed:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please log in again.' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Please provide a valid token.' });
        } else {
            return res.status(401).json({ error: 'Authentication failed.' });
        }
    }
};

module.exports = authMiddleware;

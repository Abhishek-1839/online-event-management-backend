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

        // const token = req.cookies.jwtToken;
        let token;

        // if (req.headers.Authorization) {
        //     token = req.headers.Authorization.split(' ')[1]; // Bearer <token>
        // }
        console.log(token);
        const authHeader = req.headers.authorization;
        console.log(req.headers);

        // //   // Check if authorization header exists and starts with 'Bearer'
        if (authHeader && authHeader.startsWith('Bearer ')) {
            //     // Extract the token (split at the space and take the second part)
            token = authHeader.split(' ')[1];
        }
        if (!token) {
            console.error("No token found in request");
            return res.status(401).json({ error: "Unauthorized" });
        }


        //   Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        console.log("Token expiry time:", decoded.exp);

        const { id } = decoded;
        // Find the user by ID from the token payload
        const user = await User.findById(id);
        if (!user) {
            return res.status(401).json({ error: 'Please authenticate.' });
        }
        req.user = { id: user._id, email: user.email, role: decoded.role };


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

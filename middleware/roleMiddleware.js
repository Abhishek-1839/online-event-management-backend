const roleMiddleware = (req, res, next) => {
const userRole = req.user.role; // Assuming role is part of the user object in the request
console.log(userRole);
  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
    };
  
module.exports = roleMiddleware;
  
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const AuthService = require('../services/authService');
const { User } = require('../models');

const authMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Fetch the user from the database
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Attach user to request object
      req.user = user;

      if (requiredPermission) {
        const hasPermission = await AuthService.checkPermission(user.id, requiredPermission);
        if (!hasPermission) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }
      }

      next();
    } catch (error) {
      console.error('Error in auth middleware:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const AuthService = require('../services/authService');

const authMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (requiredPermission) {
        const hasPermission = await AuthService.checkPermission(req.user.id, requiredPermission);
        if (!hasPermission) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }
      }

      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;
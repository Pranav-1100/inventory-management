const { User } = require('../models');

class AuthService {
  static async checkPermission(userId, requiredPermission) {
    const user = await User.findByPk(userId);

    if (!user) {
      return false;
    }

    // Admin has all permissions
    if (user.role === 'admin') {
      return true;
    }

    // Define permissions for staff role
    const staffPermissions = ['read:products'];

    // For staff, check if they have the required permission
    return user.role === 'staff' && staffPermissions.includes(requiredPermission);
  }
}

module.exports = AuthService;
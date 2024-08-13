const { User, Role, Permission } = require('../models');

class AuthService {
  static async checkPermission(userId, requiredPermission) {
    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        include: Permission
      }
    });
    return user.Role.Permissions.some(p => p.name === requiredPermission);
  }
}

module.exports = AuthService;
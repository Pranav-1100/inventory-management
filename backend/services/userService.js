const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  static async createUser(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = await User.create(userData);
    const token = this.generateToken(user.id);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  static async loginUser({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = this.generateToken(user.id);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  static async getUserById(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  static generateToken(userId) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in environment variables');
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }
}

module.exports = UserService;
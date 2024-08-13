const { User, Token } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  static async createUser(userData) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({ ...userData, password: hashedPassword });
    const token = await this.generateOrRetrieveToken(user.id);
    
    return { 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }

  static async loginUser({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = await this.generateOrRetrieveToken(user.id);
    
    return { 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }

  static async getUserById(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  static async generateOrRetrieveToken(userId) {
    let tokenRecord = await Token.findOne({ where: { userId } });
    
    if (tokenRecord && this.isTokenValid(tokenRecord.token)) {
      return tokenRecord.token;
    }

    const token = this.generateToken(userId);
    
    if (tokenRecord) {
      await tokenRecord.update({ token });
    } else {
      await Token.create({ userId, token });
    }

    return token;
  }

  static generateToken(userId) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in environment variables');
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  static isTokenValid(token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = UserService;
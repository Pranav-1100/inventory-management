const { User, Notification } = require('../models');
const nodemailer = require('nodemailer');

class NotificationService {
  static async createNotification(userId, message, type) {
    return await Notification.create({ userId, message, type });
  }

  static async sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
      // Configure your email service here
    });

    await transporter.sendMail({ to, subject, text });
  }

  static async notifyLowStock(product) {
    const admins = await User.findAll({ where: { role: 'admin' } });
    const message = `Low stock alert for product: ${product.name}`;

    for (let admin of admins) {
      await this.createNotification(admin.id, message, 'lowStock');
      await this.sendEmail(admin.email, 'Low Stock Alert', message);
    }
  }
}

module.exports = NotificationService;
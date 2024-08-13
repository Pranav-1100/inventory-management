const { Order, Product, OrderItem, sequelize } = require('../models');
const { Op } = require('sequelize');

class ReportService {
  static async getSalesReport(startDate, endDate) {
    return await Order.findAll({
      attributes: [
        [sequelize.fn('date', sequelize.col('Order.createdAt')), 'date'],
        [sequelize.fn('count', sequelize.col('Order.id')), 'orderCount'],
        [sequelize.fn('sum', sequelize.col('Order.total')), 'totalSales']
      ],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        status: 'completed'
      },
      group: [sequelize.fn('date', sequelize.col('Order.createdAt'))],
      order: [[sequelize.fn('date', sequelize.col('Order.createdAt')), 'ASC']]
    });
  }

  static async getTopSellingProducts(limit = 10) {
    return await Product.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('sum', sequelize.col('OrderItems.quantity')), 'totalSold']
      ],
      include: [{
        model: OrderItem,
        attributes: [],
        include: [{
          model: Order,
          attributes: [],
          where: { status: 'completed' }
        }]
      }],
      group: ['Product.id'],
      order: [[sequelize.literal('totalSold'), 'DESC']],
      limit
    });
  }

  static async getProfitMarginReport() {
    return await Product.findAll({
      attributes: [
        'id',
        'name',
        'price',
        'cost',
        [sequelize.literal('price - cost'), 'profit'],
        [sequelize.literal('(price - cost) / cost * 100'), 'profitMargin']
      ],
      order: [[sequelize.literal('profitMargin'), 'DESC']]
    });
  }
}

module.exports = ReportService;
const { Transaction, Order, sequelize } = require('../models');
const { Op } = require('sequelize');

class TransactionService {
  static async createTransaction(transactionData) {
    return await Transaction.create(transactionData);
  }

  static async getAllTransactions() {
    return await Transaction.findAll({
      include: Order,
      order: [['createdAt', 'DESC']]
    });
  }

  static async getTransactionSummary() {
    const totalIncome = await Transaction.sum('amount', { where: { type: 'income' } });
    const totalExpense = await Transaction.sum('amount', { where: { type: 'expense' } });

    const dailyTransactions = await Transaction.findAll({
      attributes: [
        [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('sum', sequelize.literal('CASE WHEN type = "income" THEN amount ELSE 0 END')), 'income'],
        [sequelize.fn('sum', sequelize.literal('CASE WHEN type = "expense" THEN amount ELSE 0 END')), 'expense']
      ],
      group: [sequelize.fn('date', sequelize.col('createdAt'))],
      order: [[sequelize.fn('date', sequelize.col('createdAt')), 'DESC']],
      limit: 30
    });

    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      dailyTransactions
    };
  }
}

module.exports = TransactionService;
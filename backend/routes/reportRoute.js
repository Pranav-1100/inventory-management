const express = require('express');
const ReportService = require('../services/reportService');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.get('/sales', authMiddleware('view:reports'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await ReportService.getSalesReport(new Date(startDate), new Date(endDate));
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/top-products', authMiddleware('view:reports'), async (req, res) => {
  try {
    const { limit } = req.query;
    const report = await ReportService.getTopSellingProducts(parseInt(limit) || 10);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/profit-margin', authMiddleware('view:reports'), async (req, res) => {
  try {
    const report = await ReportService.getProfitMarginReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/sales', authMiddleware('view:reports'), async (req, res, next) => {
    try {
        const report = await ReportService.getSalesReport(req.query.startDate, req.query.endDate);
        res.json(report);
    } catch (error) {
        next(error);
    }
});

router.get('/inventory', authMiddleware('view:reports'), async (req, res, next) => {
    try {
        const report = await ReportService.getInventoryReport();
        res.json(report);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
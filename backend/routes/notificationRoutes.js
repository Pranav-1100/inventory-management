const express = require('express');
const NotificationService = require('../services/notificationService');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware(), async (req, res, next) => {
    try {
        const notifications = await NotificationService.getNotificationsForUser(req.user.id);
        res.json(notifications);
    } catch (error) {
        next(error);
    }
});

router.post('/mark-read', authMiddleware(), async (req, res, next) => {
    try {
        await NotificationService.markNotificationsAsRead(req.user.id, req.body.notificationIds);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
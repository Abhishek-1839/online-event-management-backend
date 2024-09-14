// routes/analyticsRoutes.js

const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/AnalyticsController');

// Define routes for analytics operations
router.get('/events/analytics', AnalyticsController.getEventAnalytics);

module.exports = router;

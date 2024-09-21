const express = require('express');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleMiddleware');
const AnalyticsController = require('../controllers/AnalyticsController');



const router = express.Router();

router.get('/', 
  authMiddleware,        // Step 1: Authenticate the user
  roleMiddleware, // Step 2: Check if user is an admin
  AnalyticsController.getEventAnalytics // Step 3: Handle the request if authorized
);
module.exports = router;
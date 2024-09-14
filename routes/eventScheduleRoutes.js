// routes/eventScheduleRoutes.js

const express = require('express');
const router = express.Router();
const EventScheduleController = require('../controllers/EventScheduleController');

// Define routes for schedule operations
router.get('/events/:id/schedule', EventScheduleController.getEventSchedule);
router.put('/events/:id/schedule', EventScheduleController.updateEventSchedule);

module.exports = router;

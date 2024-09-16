const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventcontroller');
const authMiddleware = require('./middleware/auth');
const upload = require('../middleware/upload');



router.post('/events', authMiddleware, upload.array('images', 5), EventController.createEvent);
router.get('/events', EventController.getEvents);
router.get('/events/search', EventController.searchEvents);
router.get('/events/filter', EventController.filterEvents);

router.get('/events/:id', EventController.getEventById);
router.put('/events/:id', upload.array('images', 5), EventController.updateEvent);

router.delete('/events/:id', EventController.deleteEvent);


module.exports = router;

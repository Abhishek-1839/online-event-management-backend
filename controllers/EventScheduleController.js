// controllers/EventScheduleController.js

const Event = require('../models/event');

// Get schedule for a specific event
exports.getEventSchedule = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event.schedule); // Assuming the schedule is part of the event model
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event schedule' });
  }
};

// Update schedule for a specific event
exports.updateEventSchedule = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { schedule: req.body.schedule },
      { new: true }
    ).exec();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event.schedule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event schedule' });
  }
};

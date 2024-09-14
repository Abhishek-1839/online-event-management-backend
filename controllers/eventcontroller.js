const path = require('path');
const fs = require('fs'); 
const Event = require('../models/event');

exports.createEvent = async (req, res) => {
  try {
    console.log("Files received:", req.files);  // Log the uploaded files
    console.log("Body data received:", req.body); 
      // Check if the file is uploaded
      const imageFiles = req.files.map(file => file.filename);
  
      const event = new Event({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        city: req.body.city,
        ticketPricing: req.body.ticketPricing,
        category: req.body.category,
        images: imageFiles, // Storing image file names
      });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().exec();
    res.send(events);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).exec();
    if (!event) {
      res.status(404).send({ message: 'Event not found' });
    } else {
      res.send(event);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Find the existing event to get the current image
    const existingEvent = await Event.findById(eventId).exec();
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if a new image is uploaded
    let updatedData = req.body;
    if (req.file) {
      // A new image has been uploaded, so update the image field in the database
      const newImagePath = `/uploads/${req.file.filename}`;

      // Optional: Delete the old image from the server (if required)
      if (existingEvent.images && existingEvent.images.length > 0) {
        const oldImagePath = path.join(__dirname, '../uploads');
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Failed to delete old image:', err);
          } else {
            console.log('Old image deleted:', oldImagePath);
          }
        });
      }

      // Add the new image path to the updated data
      updatedData.images = [newImagePath];
    }
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true }).exec();
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndRemove(req.params.id).exec();
    res.send({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.searchEvents = async (req, res) => {
  const { searchTerm } = req.query;  // Use req.query to get the search term from query string
  try {
    const events = await Event.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search for title
        { description: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search for description
        { location: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search for location
      ],
    });
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.filterEvents = async (req, res) => {
  try {
    const { category, city, price } = req.query;  // Using query parameters
    
    let filters = {};
    
    if (category) filters.category = category;
    if (city) filters.city = { $regex: new RegExp(city, 'i') };  // Case-insensitive search
    if (price) filters.price = { $lt: parseFloat(price) };  // Ensure price is a number
    
    const events = await Event.find(filters);
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// exports.filterEvents = async (req, res) => {
//   try {
//     const filters = {};
    
//     if (req.query.category) {
//       filters.category = req.query.category;
//     }
//     if (req.query.location) {
//       filters.location = req.query.location;
//     }
//     if (req.query.price) {
//       filters.price = req.query.price;
//     }

//     const events = await Event.find(filters);
//     res.status(200).json(events);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

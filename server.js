const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const eventRouter = require('./routes/eventRouter');
const eventScheduleRoutes = require('./routes/eventScheduleRoutes'); // Import the event schedule routes
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import the analytics routes
const dotenv = require('dotenv'); // Add this line
const ticketroutes = require('./routes/ticketRouter');
const authRoutes = require('./routes/auth');
const userroute = require('./routes/user');
const authMiddleware = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const ticketTypeRoutes = require('./routes/ticketType');
const registrationRoute = require('./routes/registration');
const { handleCheckoutPayment } = require("./controllers/stripe");
dotenv.config(); // Add this line

const app = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser());

// CORS configuration options
const corsOptions = {
    // Option 1: Allow all origins (least secure, most permissive)
    origin: 'https://fantastic-twilight-322d07.netlify.app',
    
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions));

// Connect to MongoDB using the connection string from the .env file
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.get("/payment", );
app.post("/checkout",authMiddleware, handleCheckoutPayment);


app.use('/ticketapi', ticketroutes);
app.use('/api/ticket-types', ticketTypeRoutes);
app.use(authRoutes);
app.use("/profile", authMiddleware, userroute);
app.use('/api/events', eventRouter); // Assuming eventRouter handles event-related routes
app.use('/api/events/schedule', eventScheduleRoutes); // Register the event schedule routes
app.use('/api/events/analytics', analyticsRoutes);

app.use('/api', registrationRoute);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

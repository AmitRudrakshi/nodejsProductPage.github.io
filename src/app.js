const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const passport = require('passport');
const User = require('./models/user');
require('dotenv').config();

//Initialize passport middleware
app.use(passport.initialize());

// Serialize and deserialize user objects
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//cors is used to include appropriate CORS headers
app.use(cors());

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Handle connection error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define routes
app.use('/api/products', productRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
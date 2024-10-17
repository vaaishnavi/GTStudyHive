require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const admin = require('firebase-admin');

//Import Routes
const sessionRoutes = require('./routes/sessions');
const authRoutes = require('./routes/authRoutes'); 

// Initialize Firebase Admin SDK
const serviceAccount = require('./keys/studyhiveFirebaseKey.json'); // Correct the path if necessary
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Express
const app = express();

// Use CORS
app.use(cors());
// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Use routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 4000; // Fallback to port 4000 if PORT is not defined in .env
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
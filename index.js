const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const projectRoutes = require('./routes/project.routes');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'https://stem-project-iota.vercel.app', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allow these headers
};
app.options('*', cors(corsOptions)); // Preflight response for all routes

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//////////////////////////

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection failed:', err));

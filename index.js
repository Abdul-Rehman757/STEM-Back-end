const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const projectRoutes = require('./routes/project.routes');
require('dotenv').config();

const app = express();

app.use(cors()); 

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//////////////////////////

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    module.exports = app;
  })
  .catch(err => console.error('Database connection failed:', err));

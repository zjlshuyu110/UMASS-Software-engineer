const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const upload = multer();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', upload.none(), authRoutes);

const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', upload.none(), gameRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', upload.none(), profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

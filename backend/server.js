const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Database Connection
// In a real app we'd connect to the real URI. For this demo, let's use in-memory mongo or just connect to the provided URI and let it fail if invalid, though usually we want a fallback or handle connection gracefully.
// Wait, the prompt says "MongoDB Atlas connection", so the user will provide their own later. We will just set it up to connect.
mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME
})
.then(() => console.log(`MongoDB Connected: ${process.env.DB_NAME}`))
.catch(err => console.error('MongoDB Connection Error:', err.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('NoteFlow API is running');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

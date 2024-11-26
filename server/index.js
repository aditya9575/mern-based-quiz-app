// ------------------------------------------------------------------------------------------------------
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

const userController = require("./controllers/userController");
const questionController = require('./controllers/questionController');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS policy handling
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Automatically sync questions
        await questionController.syncQuestionsLogic();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post("/signup", userController.signup);
app.post("/login", userController.login);
app.post("/google-login", userController.googleLogin); // Google login route

// Questions handling routes
app.post('/sync-questions', questionController.syncQuestions); // Sync questions from JSON to MongoDB
app.post('/next-question', questionController.getNextQuestion); // Get next question based on user performance
app.get('/questions', questionController.getQuestions); // Fetch all questions

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

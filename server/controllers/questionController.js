const fs = require('fs');
const Question = require('../models/QuestionModel');

const path = require('path');
const questionsPath = path.join(__dirname, '..', 'questions.json'); // Adjust the path based on your directory structure


// Core logic for syncing questions
const syncQuestionsLogic = async () => {
    // const questionsFile = './questions.json';
    const questionsFile = questionsPath;

    const questionsData = JSON.parse(fs.readFileSync(questionsFile, 'utf-8'));

    // Check for differences between DB and file
    const dbQuestions = await Question.find().lean();
    if (JSON.stringify(dbQuestions) !== JSON.stringify(questionsData)) {
        // Clear the old questions and insert new ones
        await Question.deleteMany();
        await Question.insertMany(questionsData);
        console.log('Questions synced with the database.');
    } else {
        console.log('No changes detected in questions.json.');
    }
};

// Adaptive logic for fetching the next question based on user performance
const getNextQuestion = async (userId, performance) => {
    // Example performance structure: { topic: {correct: X, total: Y}, difficulty: {correct: X, total: Y} }
    const { lastQuestionPerformance, topics, difficulty } = performance;

    // Find a question based on previous performance
    let nextQuestion;
    if (lastQuestionPerformance === 'correct') {
        // Increase difficulty for the next question
        nextQuestion = await Question.findOne({ difficulty: { $gt: difficulty } }).lean();
    } else {
        // Decrease difficulty for the next question
        nextQuestion = await Question.findOne({ difficulty: { $lt: difficulty } }).lean();
    }

    // If no question fits, return the next question with the same difficulty
    if (!nextQuestion) {
        nextQuestion = await Question.findOne({ difficulty }).lean();
    }

    return nextQuestion;
};

// Sync questions route
exports.syncQuestions = async (req, res) => {
    try {
        await syncQuestionsLogic();
        res.status(200).json({ message: 'Questions synced successfully.' });
    } catch (error) {
        console.error('Error syncing questions:', error);
        res.status(500).json({ error: 'Error syncing questions.' });
    }
};

// Get next question based on user performance
exports.getNextQuestion = async (req, res) => {
    const { userId, performance } = req.body;
    try {
        const nextQuestion = await getNextQuestion(userId, performance);
        res.status(200).json(nextQuestion);
    } catch (error) {
        console.error('Error fetching next question:', error);
        res.status(500).json({ error: 'Error fetching next question.' });
    }
};

// Fetch all questions
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Error fetching questions.' });
    }
};

// Export the core logic for use in index.js
exports.syncQuestionsLogic = syncQuestionsLogic;
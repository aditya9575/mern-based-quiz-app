const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    difficulty: { type: Number, required: true },
    topics: { type: [String], required: true },
    options: [
        {
            optionText: { type: String, required: true },
            isCorrect: { type: Boolean, required: true }
        }
    ]
});

module.exports = mongoose.model('Question', questionSchema);

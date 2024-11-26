// ------------------
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20,
    },
    age: {
        type: Number,
        min: 0,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    password: {
        type: String,
        minlength: 5,
    },
    googleId: {
        type: String,
        unique: true,
    },
    signupMethod: {
        type: String,
        enum: ['google', 'custom'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

// -------------------------------------------------------------
const bcryptjs = require('bcryptjs');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Google login function
exports.googleLogin = async (req, res) => {
    const { email, name, googleId } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists and used custom signup
            if (user.signupMethod === 'custom') {
                return res.status(400).json({
                    error: 'User already exists. Please log in with your email and password.',
                });
            }
        } else {
            // If user does not exist, create a new user
            user = new User({
                name,
                email,
                googleId,
                signupMethod: 'google',
            });
            await user.save();

            return res.status(201).json({
                message: 'User registered successfully',
                user,
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'User logged in successfully',
            token,
            user,
            name: user.name, //added extra 
        });
    } catch (err) {
        console.error('Error in Google Login:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};


// User signup function
exports.signup = async (req, res) => {
    const { name, age, email, phoneNumber, password } = req.body;

    if (!name || !age || !email || !phoneNumber || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // If user exists and used Google signup
            if (existingUser.signupMethod === 'google') {
                return res.status(400).json({
                    error: 'User already exists. Please log in with your Google account.',
                });
            }

            // If user exists and used custom signup
            return res.status(400).json({
                error: 'User already exists. Please log in with your email and password.',
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({
            name,
            age,
            email,
            phoneNumber,
            password: hashedPassword,
            signupMethod: 'custom',
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error in signup:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};



// User login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id }, // Payload
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '1h' } // Token expiration time (e.g., 1 hour)
        );

        res.status(200).json({ message: 'Login successful', token, name: user.name, });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
};

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
// exports.signup = async (req, res) => {
//     const { name, age, email, phoneNumber, password } = req.body;

//     if (!name || !age || !email || !phoneNumber || !password) {
//         return res.status(400).json({ error: 'Please fill in all fields' });
//     }

//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ email });

//         const existingNumber = await User.findOne({ phoneNumber });

//         if (existingNumber === phoneNumber) {
//             return res.status(400).json({
//                 error: 'Phone Number already registered. Use diffrent Number',
//             });
//         }

//         // if(phoneNumber)


//         if (existingUser) {
//             // If user exists and used Google signup
//             if (existingUser.signupMethod === 'google') {
//                 return res.status(400).json({
//                     error: 'User already exists. Please log in with your Google account.',
//                 });
//             }

//             // If user exists and used custom signup
//             return res.status(400).json({
//                 error: 'User already exists. Please log in with your email and password.',
//             });
//         }

//         // Hash the password
//         const saltRounds = 10;
//         const hashedPassword = await bcryptjs.hash(password, saltRounds);

//         // Create a new user
//         const newUser = new User({
//             name,
//             age,
//             email,
//             phoneNumber,
//             googleId: email,
//             password: hashedPassword,
//             signupMethod: 'custom',
//         });

//         await newUser.save();

//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//         console.error('Error in signup:', err);
//         res.status(500).json({ error: 'Server error. Please try again.' });
//     }
// };
exports.signup = async (req, res) => {
    const { name, age, email, phoneNumber, password } = req.body;

    // Basic field presence validation
    if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    try {
        // Check for duplicate email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.signupMethod === 'google') {
                return res.status(400).json({
                    error: 'User already exists. Please log in with your Google account.',
                });
            }
            return res.status(400).json({
                error: 'User already exists. Please log in with your email and password.',
            });
        }

        // Check for duplicate phone number
        const existingNumber = await User.findOne({ phoneNumber });
        if (existingNumber) {
            return res.status(400).json({
                error: 'Phone number already registered. Please use a different number.',
            });
        }

        // Validate age
        if (age < 0 || age > 100) {
            return res.status(400).json({
                error: 'Age must be between 0 and 100.',
            });
        }

        // Validate password length
        if (password.length < 5) {
            return res.status(400).json({
                error: 'Password must be at least 5 characters long.',
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
            googleId: email
        });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error in signup:', err);

        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ error: errors.join(', ') });
        }

        // Handle server errors
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

        // Check the signup method for error handling of mismatched login attempt
        if (user.signupMethod === 'google') {
            return res.status(400).json({
                error: 'User exists but registered with Google. Please log in using Google.',
            });
        }

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

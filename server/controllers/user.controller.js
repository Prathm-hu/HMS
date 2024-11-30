const express = require('express');
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model');

const userRouter = express.Router();

// Signup route to create a new user
userRouter.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input data
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await UserModel.create({ name, email, password:hashedPassword });
        res.status(201).json({ message: 'User  created successfully', user });
    } catch (error) {
        // Handle specific error cases
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        // Handle other errors (e.g., database errors)
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login User
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
            }
        // Find the user by email
        const user = await UserModel.findOne({ email });

        // Check if the user exists
        if (!user){
            return res.status(404).json({message : 'User not found'});
        }

        // Compare the password with hashed
        const isValidPassword = await bcrypt.compare(password, user.password);

        // If the password is incorrect
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
            }
        // If the password is valid, return the user
        res.status(200).json({message: 'login successful', user :{id: user._id, name: user.name, email: user.email}});
    } catch (error) {
        
    }
})

// Get user details route
userRouter.get('/user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Fetch user details from the database
        const user = await UserModel.findById(userId);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        res.json({ message: "User  data", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = userRouter;
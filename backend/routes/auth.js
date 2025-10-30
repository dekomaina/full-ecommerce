// Handling user registration and login
// Import necessary modules
const express = require('express'); // Express framework
const router = express.Router(); // Create a router instance to define routes
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens for authentication
const User = require('../models/user'); // User model is defined in models/User.js

// Secret key for signing tokens (just for demo)
const SECRET = "secret123";

// Route for user registration
router.post("/register", async (req, res) => {
    try {
        // Extract username and password from frontend form (request body)
        const { username, password } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user to the database
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Return a success response
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: "Registration failed" });
    }
});

// Route for user login
router.post("/login", async (req, res) => {
    try {
        // Extract username and password from frontend form (request body)
        const { username, password } = req.body;

        // Find the user in the database by username
        const user = await User.findOne({ username });
        // If user not found, return error
        if (!user) return res.status(400).json({ error: "User not found" });

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        // If password does not match, return error
        if (!isMatch) return res.status(400).json({ error: "Wrong Password" });

        // Create JWT token
        const token = jwt.sign({ id: user._id }, SECRET);

        // Success message 
        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(400).json({ error: "Login failed" });
    }
});

// Export the router to be used in the main server file
module.exports = router;

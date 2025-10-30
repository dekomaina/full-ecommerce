// The user model

// Initialize mongoose
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,},
    password: {
        type: String,
        required: true,},
    });

// Create the user model
const User = mongoose.model('User', userSchema);

// Export the user model
module.exports = User;
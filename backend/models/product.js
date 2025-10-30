// Import mongoose
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
});

// Create the product model
const Product = mongoose.model('Product', productSchema);

// Export the product model
module.exports = Product;
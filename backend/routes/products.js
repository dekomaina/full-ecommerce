// Products routes

// Import necessary modules
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a new product
router.post("/", async (req, res) => {
    try {
        const { name, price, description } = req.body;
        // Save the product to the database
        const product = new Product({ name, price, description });
        await product.save();
        res.status(200).json("Product created successfully", product);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Read/Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);

        // If no products found/exists
        if (products.length === 0) {
            return res.status(404).json("No products found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Read/get one product by its ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        // If product not found
        if (!product) {
            return res.status(404).json("Product not found");
        }
        res.status(200).json(product); // if product found
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a product by its ID
router.put("/:id", async (req, res) => {
    try {
        // Fetch the records from the form in the frontend
        const { name, price, description } = req.body;
        // Update the product in the database
        await Product.findByIdAndUpdate(req.params.id, { name, price, description }); // Update the product in the database
        // If product updated successfully
        res.status(200).json("Product updated successfully", { name, price, description });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a product by its ID
router.delete("/:id", async (req, res) => {
    try {
        // Get the product by its ID and delete it
        const product = await Product.findByIdAndDelete(req.params.id);
        // If product not found
        if (!product) {
            return res.status(404).json("Product not found");
        }
        // If product deleted successfully
        res.status(200).json("Product deleted successfully");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;




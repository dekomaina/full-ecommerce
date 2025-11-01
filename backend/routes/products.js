// Products routes

// Import necessary modules
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a new product
router.post("/", async (req, res) => {
    try {
        const { name, price, description } = req.body;
        // Validate required fields
        if (!name || price == null) {
            return res.status(400).json({ error: "Missing required fields: name and price" });
        }

        // Save the product to the database
        const product = new Product({ name, price, description });
        await product.save();
        return res.status(201).json({ message: "Product created successfully", product });
    } catch (err) {
        console.error("Create product error:", err.message || err);
        return res.status(500).json({ error: "Failed to create product" });
    }
});

// Read/Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        // Return empty array when no products exist (200) — frontend can handle empty lists
        return res.status(200).json(products);
    } catch (err) {
        console.error("Get products error:", err.message || err);
        return res.status(500).json({ error: "Failed to fetch products" });
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
        const { name, price, description } = req.body;
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Product not found" });
        return res.status(200).json({ message: "Product updated successfully", product: updated });
    } catch (err) {
        console.error("Update product error:", err.message || err);
        return res.status(500).json({ error: "Failed to update product" });
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




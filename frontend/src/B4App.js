
// src/App.js
// ----------------------------
// Simple React frontend for products
// ----------------------------

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });

  // Fetch all products when page loads
  useEffect(() => {
    axios.get("http://localhost:5000/simple-ecom/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add product
  const addProduct = () => {
    axios.post("http://localhost:5000/simple-ecom/products", form)
      .then(() => {
        alert("Product added!");
        window.location.reload(); // refresh list
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛍 Simple E-commerce Demo</h2>

      {/* Product form */}
      <div>
        <input name="name" placeholder="Product Name" onChange={handleChange} />
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <button onClick={addProduct}>Add Product</button>
      </div>

      <hr/>

      {/* Product list */}
      <h3>All Products</h3>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            <b>{p.name}</b> - ${p.price} <br />
            <small>{p.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
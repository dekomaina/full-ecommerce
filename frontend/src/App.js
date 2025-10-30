// src/App.js
// ---------------------------------------------
// 🛒 Simple E-commerce + PayPal + M-Pesa
// ---------------------------------------------

import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });

  // ✅ Load products when the app starts
  useEffect(() => {
    axios
      .get("https://full-ecommerce-1.onrender.com/simple-ecom/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ✏️ Handle form typing
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Add new product
  const addProduct = () => {
    axios
      .post("https://full-ecommerce-1.onrender.com/simple-ecom/products", form)
      .then(() => {
        alert("✅ Product added!");
        window.location.reload();
      })
      .catch(() => alert("❌ Error adding product"));
  };

  // 📲 M-Pesa payment handler
  const payWithMpesa = (price) => {
    axios
      .post("https://full-ecommerce-1.onrender.com/mpesa/stkpush", {
        phone: "254743524067", // your number in format 2547xxxxxxx
        amount: price,
      })
      .then(() => alert("📲 STK Push sent! Check your phone."))
      .catch((err) => {
        console.error("STK Push Error:", err.response ? err.response.data : err.message);
        alert("❌ Error sending STK push — check console for details");
      });
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AVdEVIGs2EVyUNKGM_P6dHfNE1zPuTfx_ruYUD_Yqvzgj-m_9pfQArYd1DrxBq4YEvMxxUZnJcU5bku4",
        currency: "USD",
      }}
    >
      <div style={{ padding: 20 }}>
        <h2>🛍 Simple E-commerce Demo</h2>

        {/* 🧾 Add Product Form */}
        <div style={{ marginBottom: 20 }}>
          <input name="name" placeholder="Product Name" onChange={handleChange} />
          <input name="price" placeholder="Price" onChange={handleChange} />
          <input name="description" placeholder="Description" onChange={handleChange} />
          <button onClick={addProduct}>Add Product</button>
        </div>

        <hr />

        {/* 🧾 Show all products */}
        <h3>Products</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {products.map((p) => (
            <li key={p._id} style={{ border: "1px solid #ccc", padding: 15, borderRadius: 10, marginBottom: 10 }}>
              <b>{p.name}</b> - ${p.price}
              <br />
              <small>{p.description}</small>
              <br />
              <br />

              {/* 💳 Pay with PayPal */}
              <PayPalButtons
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [{ description: p.name, amount: { value: p.price } }],
                  })
                }
                onApprove={(data, actions) =>
                  actions.order.capture().then((details) => {
                    alert(`✅ PayPal payment successful! Thank you, ${details.payer.name.given_name}`);
                  })
                }
                onError={(err) => {
                  console.error(err);
                  alert("❌ PayPal Payment failed!");
                }}
              />

              {/* 💰 Pay with M-Pesa */}
              <button onClick={() => payWithMpesa(p.price)}>💰 Pay with M-Pesa</button>
            
            </li>
            
          ))}
        </ul>
      </div>
    </PayPalScriptProvider>
  );
}

export default App;

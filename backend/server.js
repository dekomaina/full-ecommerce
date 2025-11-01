// server.js
// --------------------------------------
// 🌍 Node + Express + MongoDB + M-Pesa Server
// --------------------------------------

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// --------------------------------------
// 🔧 Middleware
// --------------------------------------
// Configure CORS: allow restricting to a single origin via CLIENT_ORIGIN env var.
// If CLIENT_ORIGIN is not set, fall back to allowing all origins (useful for quick deploys/tests).
const clientOrigin = process.env.CLIENT_ORIGIN;
if (clientOrigin) {
  app.use(cors({ origin: clientOrigin }));
  console.log(`CORS restricted to: ${clientOrigin}`);
} else {
  app.use(cors());
  console.log("CORS: allowing all origins (set CLIENT_ORIGIN in production to restrict).");
}

app.use(bodyParser.json());

// --------------------------------------
// 🗄️ Connect to MongoDB Atlas
// --------------------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --------------------------------------
// 🧩 Routes
// --------------------------------------
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const mpesaRoutes = require("./routes/mpesa_stk");

app.use("/simple-ecom/auth", authRoutes);
app.use("/simple-ecom/products", productRoutes);
app.use("/mpesa", mpesaRoutes);

// Default route (for health check)
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render!");
});

// --------------------------------------
// 🚀 Start Server
// --------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

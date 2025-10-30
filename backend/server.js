// server.js
// ----------------------------
// Basic Node + Express server
// ----------------------------

// Import required libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // allows frontend (React) to talk to backend
const bodyParser = require("body-parser");

const app = express();

// ----------------------------
// MIDDLEWARE SETUP
// ----------------------------
app.use(cors());                 // allow requests from React
app.use(bodyParser.json());      // parse incoming JSON data

// ----------------------------
// CONNECT TO MONGODB
// ----------------------------
// (Make sure MongoDB is running locally or use MongoDB Atlas)


//mongodb+srv://deckotronix21_db_mongodb+srv://deckotronix21_db_user:Deko12345@ecommerce.lozyswr.mongodb.net/?appName=ecommerceuser:Deko#202727#@ecommerce.lozyswr.mongodb.net/?appName=ecommerce
mongoose.connect(
  "mongodb+srv://deckotronix21_db_user:Deko12345@ecommerce.lozyswr.mongodb.net/ecommerce?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.log("❌ MongoDB connection error:", err));


// ----------------------------
// ROUTES
// ----------------------------
// Import routes for auth and products
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

app.use("/simple-ecom/auth", authRoutes); // use the auth routes
app.use("/simple-ecom/products", productRoutes);


// The mpesa route
const mpesaRoutes = require("./routes/mpesa_stk");
app.use("/mpesa", mpesaRoutes);


// ----------------------------
// START SERVER
// ----------------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
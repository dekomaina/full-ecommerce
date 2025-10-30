// routes/mpesa_stk.js
// --------------------------------------
// 💰 M-Pesa STK Push Route (Daraja Sandbox)
// --------------------------------------

const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔑 Credentials (from Safaricom Developer Portal)
const consumerKey = "VnJ4yppXZA7fMGKFV4ZOMvLpkaDwdiUNcACevALowAtakByj";
const consumerSecret = "QEzqMZdHGWsYtJVaIu8r3SuY9Dyu985fNGY7hE6bmEGSXAkdugv2V9cmmzPUwyE2";
const shortcode = "174379"; // Lipa Na M-Pesa sandbox shortcode
const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

// 🟢 Step 1: Get Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return response.data.access_token;
}

// 🟢 Step 2: Handle STK Push request
router.post("/stkpush", async (req, res) => {
  const { phone, amount } = req.body;

  try {
    // Create timestamp like 20251007183500
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "").slice(0, 14);

    // Combine Shortcode + Passkey + Timestamp, then encode in Base64
    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    // Get token
    const token = await getAccessToken();

    // Prepare M-Pesa STK Push payload
    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: "https://065a8efedb66.ngrok-free.app/mpesa/callback", // ngrok URL for testing
      AccountReference: "SimpleEcom",
      TransactionDesc: "E-commerce payment",
    };

    // Send request to M-Pesa API
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("STK Push Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to send STK Push" });
  }
});

module.exports = router;

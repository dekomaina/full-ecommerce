// routes/mpesa_stk.js
// --------------------------------------
// 💰 M-Pesa STK Push Route (Daraja Sandbox)
// --------------------------------------

const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔑 Credentials (from Safaricom Developer Portal)
// Prefer environment variables in production. Sandbox defaults remain for quick testing.
const consumerKey = process.env.MPESA_CONSUMER_KEY || "aS6bi64dQoKv4NZus89FyvSGek0Rj9ikWt2u0oSmavNgAbxm";
const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "yyomtF6hsNmTHf2JAgD0uVJeZmitD0LjNcpEqKvYA7NZ6Ktli0HrHfi6yyJwpdth";
const shortcode = process.env.MPESA_SHORTCODE || "174379"; // Lipa Na M-Pesa sandbox shortcode
const passkey = process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

// 🟢 Step 1: Get Access Token
async function getAccessToken() {
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Failed to get M-Pesa access token:", err.response ? err.response.data : err.message);
    throw err;
  }
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
   CallBackURL: process.env.CALLBACK_URL,// ngrok URL for testing
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

// M-Pesa will POST transaction results to the Callback URL you supplied when initiating STK Push.
// Expose a public endpoint to receive those callbacks. Make sure CALLBACK_URL used above points to
// `${YOUR_BACKEND_URL}/mpesa/callback` (or set CALLBACK_URL env var to that value).
router.post("/callback", async (req, res) => {
  try {
    console.log("Received M-Pesa callback:", JSON.stringify(req.body));
    // TODO: Persist callback to DB or process the response as needed.
    // Acknowledge receipt to Safaricom
    return res.status(200).json({ result: "Callback received" });
  } catch (err) {
    console.error("Error handling M-Pesa callback:", err.message || err);
    return res.status(500).json({ error: "Callback processing failed" });
  }
});

module.exports = router;

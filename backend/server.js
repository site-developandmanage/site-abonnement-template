const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/subscribe", async (req, res) => {
  try {
    const { email, token, priceId } = req.body;

    if (!email || !token || !priceId) {
      return res.status(400).json({
        success: false,
        message: "Champs manquants",
      });
    }

    const customer = await stripe.customers.create({
      email,
      source: token,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
    });

    res.json({ success: true, subscriptionId: subscription.id });

  } catch (err) {
    console.error("Erreur backend :", err);
    res.status(500).json({
      success: false,
      message: err.message || "Erreur serveur",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(bodyParser.json());

app.post("/subscribe", async (req, res) => {
  const { email, token, priceId } = req.body;

  try {
    const customer = await stripe.customers.create({
      email,
      source: token,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
    });

    res.json({ success: true, subscription });
  } catch (error) {
    console.error("Erreur Stripe :", error);
    res.json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend lancé sur le port ${PORT}`));

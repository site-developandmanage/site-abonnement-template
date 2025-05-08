const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const dotenv = require("dotenv");

// Charge les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route pour cr�er la session de paiement
app.post("/subscribe", async (req, res) => {
  try {
    const { email, token, priceId } = req.body;

    // Cr�e un client Stripe
    const customer = await stripe.customers.create({
      email,
      source: token,
    });

    // Cr�e un abonnement avec le client et le priceId
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
    });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// D�marre le serveur
app.listen(3000, () => {
  console.log("Serveur backend en �coute sur le port 3000");
});

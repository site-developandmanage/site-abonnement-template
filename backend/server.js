// backend/server.js

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

// Route pour créer la session de paiement
app.post("/subscribe", async (req, res) => {
  try {
    const { email, token, priceId } = req.body;

    // Crée un client Stripe
    const customer = await stripe.customers.create({
      email,
      source: token,
    });

    // Crée un abonnement avec le client et le priceId
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
    });

    // Réponse JSON complète et valide
    res.json({ success: true, subscriptionId: subscription.id });
  } catch (err) {
    console.error("Erreur Stripe:", err); // Important pour debug
    res.status(500).json({
      success: false,
      message: err.message || "Erreur serveur",
    });
  }
});

// Démarre le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur backend en écoute sur le port ${port}`);
});

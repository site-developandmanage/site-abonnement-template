// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const path = require('path');

// Charge les variables d'environnement depuis /backend/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 4242;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/subscribe', async (req, res) => {
  const { email, token, priceId } = req.body;

  try {
    // 1. Créer un client Stripe avec l’email
    const customer = await stripe.customers.create({
      email,
      source: token, // Utilise le token Stripe fourni
    });

    // 2. Créer un abonnement
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
    });

    res.json({ success: true, subscriptionId: subscription.id }); // Réponse JSON
  } catch (error) {
    console.error('Erreur lors de l’abonnement :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de l’abonnement.',
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${port}`);
});

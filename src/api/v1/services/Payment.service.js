import Stripe from 'stripe';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  
  async createStripePaymentIntent(amount, currency = 'usd') {
    try {
      // Create a PaymentIntent with the specific amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents (Stripe requirement)
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Return the secret required by the frontend
      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      };
    } catch (error) {
      throw new Error(`Stripe Error: ${error.message}`);
    }
  }
}

export default new PaymentService();
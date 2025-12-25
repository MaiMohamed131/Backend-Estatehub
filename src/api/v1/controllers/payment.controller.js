import paymentService from '../services/Payment.service.js';

class PaymentController {

  async createPaymentIntent(req, res) {
    try {
      const { amount } = req.body;

      if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
      }

      // Call the service to get the secret
      const result = await paymentService.createStripePaymentIntent(amount);

      // Send the clientSecret to the frontend
      res.status(200).json({
        clientSecret: result.clientSecret,
      });

    } catch (error) {
      console.error("Payment Controller Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PaymentController();
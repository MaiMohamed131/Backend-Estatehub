import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const router = express.Router();

// Route: POST /api/payment/create-payment-intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

export default router;
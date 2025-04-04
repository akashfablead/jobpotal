import express from 'express';
import { createSubscription, verifySubscription, cancelSubscription } from '../controllers/subscription.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/create', isAuthenticated, createSubscription);
router.get('/verify/:sessionId', isAuthenticated, verifySubscription);
router.post('/cancel/:subscriptionId', isAuthenticated, cancelSubscription);

export default router;
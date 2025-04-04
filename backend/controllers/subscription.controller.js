import Stripe from 'stripe';
import { Subscription } from '../models/subscription.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const SUBSCRIPTION_PRICES = {
//     monthly: {
//         price: 999,
//         months: 1,
//         methods: ['card', 'paypal']
//     },
//     semi_annual: {
//         price: 4999,
//         months: 6,
//         methods: ['card', 'paypal', 'google_pay']
//     },
//     annual: {
//         price: 8999,
//         months: 12,
//         methods: ['card', 'paypal', 'google_pay', 'apple_pay']
//     }
// };

const SUBSCRIPTION_PRICES = {
    monthly: {
        price: 999,
        months: 1,
        methods: ['card']
    },
    semi_annual: {
        price: 4999,
        months: 6,
        methods: ['card']
    },
    annual: {
        price: 8999,
        months: 12,
        methods: ['card']
    }
};

// export const createSubscription = async (req, res) => {
//     try {
//         const { planType } = req.body;
//         const userId = req.id;

//         if (!SUBSCRIPTION_PRICES[planType]) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid plan type"
//             });
//         }

//         // Create Stripe payment session with plan-specific payment methods
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: SUBSCRIPTION_PRICES[planType].methods,
//             mode: 'payment',
//             line_items: [{
//                 price_data: {
//                     currency: 'inr',
//                     product_data: {
//                         name: `${planType} Subscription`,
//                     },
//                     unit_amount: SUBSCRIPTION_PRICES[planType].price,
//                 },
//                 quantity: 1,
//             }],
//             success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
//         });

//         // ...existing code...
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error creating subscription"
//         });
//     }
// };
// export const createSubscription = async (req, res) => {
//     try {
//         console.log('Request body:', req.body);
//         console.log('Available plans:', Object.keys(SUBSCRIPTION_PRICES));
//         const { planType } = req.body;
//         const userId = req.id;

//         if (!SUBSCRIPTION_PRICES[planType]) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid plan type"
//             });
//         }

//         // Create Stripe payment session with plan-specific payment methods
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: SUBSCRIPTION_PRICES[planType].methods,
//             mode: 'payment',
//             line_items: [{
//                 price_data: {
//                     currency: 'inr',
//                     product_data: {
//                         name: `${planType} Subscription`,
//                     },
//                     unit_amount: SUBSCRIPTION_PRICES[planType].price,
//                 },
//                 quantity: 1,
//             }],
//             success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
//         });

//         // Create subscription record in database
//         const subscription = await Subscription.create({
//             userId,
//             planType,
//             amount: SUBSCRIPTION_PRICES[planType].price,
//             duration: SUBSCRIPTION_PRICES[planType].months,
//             stripeSubscriptionId: session.id,
//             status: 1 // 1 for active, 0 for cancelled
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Subscription initiated",
//             data: {
//                 sessionId: session.id,
//                 subscriptionId: subscription._id,
//                 url: session.url
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error creating subscription"
//         });
//     }
// };

export const createSubscription = async (req, res) => {
    try {
        if (!req.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const { planType, customerInfo } = req.body;
        const userId = req.id;

        if (!customerInfo?.name || !customerInfo?.address) {
            return res.status(400).json({
                success: false,
                message: "Customer name and address are required"
            });
        }

        if (!SUBSCRIPTION_PRICES[planType]) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan type"
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: SUBSCRIPTION_PRICES[planType].methods,
            mode: 'payment',
            customer_email: customerInfo.email,
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `${planType} Subscription`,
                        description: `${planType} Plan Subscription`,
                    },
                    unit_amount: SUBSCRIPTION_PRICES[planType].price * 100, // Convert to paise
                },
                quantity: 1,
            }],
            // success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            success_url: `${process.env.CLIENT_URL}/subscription/thank-you?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
            billing_address_collection: 'required',
        });

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + SUBSCRIPTION_PRICES[planType].months);

        const subscription = await Subscription.create({
            userId,
            planType,
            amount: SUBSCRIPTION_PRICES[planType].price,
            duration: SUBSCRIPTION_PRICES[planType].months,
            stripeSubscriptionId: session.id,
            status: 1,
            startDate,
            endDate,
            customerInfo: {
                name: customerInfo.name,
                email: customerInfo.email,
                address: customerInfo.address
            }
        });

        return res.status(200).json({
            success: true,
            message: "Subscription initiated",
            data: {
                sessionId: session.id,
                subscriptionId: subscription._id,
                url: session.url
            }
        });
    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error creating subscription"
        });
    }
};


export const verifySubscription = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Update subscription status to completed
            await Subscription.findOneAndUpdate(
                { stripeSubscriptionId: sessionId },
                { status: 2 }
            );

            return res.status(200).json({
                success: true,
                message: "Payment successful"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Payment not completed"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const userId = req.id;

        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            userId
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        subscription.status = 0; // cancelled
        await subscription.save();

        return res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error cancelling subscription"
        });
    }
};
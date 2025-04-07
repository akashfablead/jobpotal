import Stripe from 'stripe';
import { Subscription } from '../models/subscription.model.js';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
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
        await sendSubscriptionEmail(customerInfo.email, {
            planType,
            amount: SUBSCRIPTION_PRICES[planType].price,
            duration: SUBSCRIPTION_PRICES[planType].months,
            sessionId: session.id,
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


// export const sendSubscriptionEmail = async (email, subscriptionDetails) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Subscription Confirmation',
//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; border: 1px solid #ddd;">
//                 <table width="100%" cellpadding="0" cellspacing="0">
//                     <tr>
//                         <td style="text-align: center; padding: 20px 0;">
//                             <h1 style="color: #007BFF; margin: 0;">Subscription Confirmed</h1>
//                         </td>
//                     </tr>
//                     <tr>
//                         <td style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
//                             <p style="font-size: 16px; color: #333;">
//                                 Hello,
//                             </p>
//                             <p style="font-size: 16px; color: #333;">
//                                 Thank you for subscribing! Here are your subscription details:
//                             </p>
//                             <ul style="font-size: 16px; color: #333; padding-left: 20px;">
//                                 <li><strong>Plan Type:</strong> ${subscriptionDetails.planType}</li>
//                                 <li><strong>Amount:</strong> ${subscriptionDetails.amount}</li>
//                                 <li><strong>Duration:</strong> ${subscriptionDetails.duration} months</li>
//                             </ul>
//                             <p style="text-align: center; margin-top: 30px;">
//                                 <a href="/" style="display: inline-block; padding: 12px 25px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Visit Website</a>
//                             </p>
//                         </td>
//                     </tr>
//                     <tr>
//                         <td style="text-align: center; padding: 20px; font-size: 12px; color: #777;">
//                             © ${new Date().getFullYear()} Your Company Name. All rights reserved.
//                         </td>
//                     </tr>
//                 </table>
//             </div>
//         `,
//     };

//     await transporter.sendMail(mailOptions);
// };

const sendSubscriptionEmail = async (email, subscriptionDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Subscription Confirmation',
        html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <style type="text/css">
                  /* Include your CSS styles here */
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url(https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjxAwXjeu.woff2) format('woff2');
                    unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
                  }
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url(https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2) format('woff2');
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                  }
                  /* Add other font-face declarations and styles as needed */
                  * {
                    font-family: 'Open Sans', Arial, sans-serif;
                  }
                </style>
              </head>
              <body style="padding: 24px; background: linear-gradient(135deg, #ffffff, #d4d4d4);">
                <span style="display: none; font-size: 1px; color: #ffffff;">This is the preview text</span>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td align="center">
                      <table border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="#f3f1ff" style="border-radius: 24px; border-collapse: collapse; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border: 1px solid #e9e5ff;">
                        <tr>
                          <td style="padding: 24px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="border-radius: 24px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
                              <tr>
                                <td align="center" style="padding: 24px;">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                      <td align="center" style="font-size: 24px; font-weight: 700; color: #631bff;">
                                        Subscription Confirmation
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="padding-top: 8px; padding-bottom: 24px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td bgcolor="#7341ff" style="width: 64px; height: 4px; border-radius: 9999px;"></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="font-size: 16px; color: #374151;">
                                        Hello,<br><br>
                                        Thank you for subscribing! Here are your subscription details:
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="padding-top: 16px; padding-bottom: 16px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f3f1ff" style="border-left: 4px solid #7341ff; border-radius: 18px;">
                                          <tr>
                                            <td style="padding: 16px;">
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                  <td style="font-size: 16px; color: #374151;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                      <tr>
                                                        <td valign="top" width="24">
                                                          <span class="material-symbols-outlined" style="color: #631bff; font-size: 16px;">Plan Type:</span>
                                                        </td>
                                                        <td style="font-size: 16px;">
                                                          &nbsp;<span style="color: #4b5563;"><b>${subscriptionDetails.planType}</b></span>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td height="8" colspan="2">&nbsp;</td>
                                                      </tr>
                                                      <tr>
                                                        <td valign="top" width="24">
                                                          <span class="material-symbols-outlined" style="color: #631bff; font-size: 16px;">payments:</span>
                                                        </td>
                                                        <td style="font-size: 16px;">
                                                          &nbsp;<span style="color: #4b5563;"><b>${subscriptionDetails.amount}</b></span>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td height="8" colspan="2">&nbsp;</td>
                                                      </tr>
                                                      <tr>
                                                        <td valign="top" width="24">
                                                          <span class="material-symbols-outlined" style="color: #631bff; font-size: 16px;">Duration:</span>
                                                        </td>
                                                        <td style="font-size: 16px;">
                                                         &nbsp;<span style="color: #4b5563;"><b>${subscriptionDetails.duration} months</b></span>
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="font-size: 14px; color: #374151;">
                                        Your subscription will automatically renew at the end of your billing period unless canceled.
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="padding-top: 24px;">
                                        <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="display: inline-block; text-decoration: none; background-color: #631bff; color: #ffffff; font-weight: 500; border-radius: 18px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
                                          <span style="display: inline-block; padding-top: 12px; padding-bottom: 12px; padding-left: 24px; padding-right: 24px;">Visit Website</span>
                                        </a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td height="24">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="font-size: 12px; color: #6b7280;">
                                        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="padding-top: 12px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td>
                                              <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="text-decoration: none;">
                                                <i class="fa-brands fa-facebook" style="font-size: 18px; color: #9ca3af;"></i>
                                              </a>&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td>
                                              <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="text-decoration: none;">
                                                <i class="fa-brands fa-twitter" style="font-size: 18px; color: #9ca3af;"></i>
                                              </a>&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td>
                                              <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="text-decoration: none;">
                                                <i class="fa-brands fa-instagram" style="font-size: 18px; color: #9ca3af;"></i>
                                              </a>&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td>
                                              <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="text-decoration: none;">
                                                <i class="fa-brands fa-linkedin" style="font-size: 18px; color: #9ca3af;"></i>
                                              </a>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="padding-top: 12px; font-size: 12px; color: #9ca3af;">
                                        <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="color: #6b7280; text-decoration: none;">Privacy Policy</a>&nbsp;&bull;&nbsp;<a href="https://webcrumbs.cloud/placeholder" target="_blank" style="color: #6b7280; text-decoration: none;">Terms of Service</a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td height="12">&nbsp;</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const sendReminderEmail = async (email, subscriptionDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Subscription Renewal Reminder',
        html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <style type="text/css">
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url(https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjxAwXjeu.woff2) format('woff2');
                    unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
                  }
                  @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url(https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2) format('woff2');
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                  }
                  * {
                    font-family: 'Open Sans', Arial, sans-serif;
                  }
                </style>
              </head>
              <body style="padding: 24px; background: linear-gradient(135deg, #ffffff, #d4d4d4);">
                <span style="display: none; font-size: 1px; color: #ffffff;">This is the preview text</span>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td align="center">
                      <table border="0" cellpadding="0" cellspacing="0" width="600" bgcolor="#f3f1ff" style="border-radius: 24px; border-collapse: collapse; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); border: 1px solid #e9e5ff;">
                        <tr>
                          <td style="padding: 24px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff" style="border-radius: 24px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
                              <tr>
                                <td align="center" style="padding: 24px;">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                      <td align="center" style="font-size: 24px; font-weight: 700; color: #631bff;">
                                        Subscription Renewal Reminder
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="padding-top: 8px; padding-bottom: 24px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td bgcolor="#7341ff" style="width: 64px; height: 4px; border-radius: 9999px;"></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="font-size: 16px; color: #374151;">
                                        Hello,<br><br>
                                        Your subscription is about to expire in 5 days. Here are your subscription details:
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="padding-top: 16px; padding-bottom: 16px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f3f1ff" style="border-left: 4px solid #7341ff; border-radius: 18px;">
                                          <tr>
                                            <td style="padding: 16px;">
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                  <td style="font-size: 16px; color: #374151;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                      <tr>
                                                        <td valign="top" width="24">
                                                          <span class="material-symbols-outlined" style="color: #631bff; font-size: 16px;">Plan Type:</span>
                                                        </td>
                                                        <td style="font-size: 16px;">
                                                          &nbsp;<span style="color: #4b5563;">${subscriptionDetails.planType}</span>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td height="8" colspan="2">&nbsp;</td>
                                                      </tr>
                                                      <tr>
                                                        <td valign="top" width="24">
                                                          <span class="material-symbols-outlined" style="color: #631bff; font-size: 16px;">payments :</span>
                                                        </td>
                                                        <td style="font-size: 16px;">
                                                          &nbsp;<span style="color: #4b5563;">${subscriptionDetails.amount}</span>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td height="8" colspan="2">&nbsp;</td>
                                                      </tr>
                                                      <tr>
                                                        <td valign="top" width="24">
                                                          <span class="material-symbols-outlined" style="color: #631bff; font-size: 16px;">Duration :</span>
                                                        </td>
                                                        <td style="font-size: 16px;">
                                                          &nbsp;<span style="color: #4b5563;">${subscriptionDetails.duration} months</span>
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="padding-top: 24px;">
                                        <a href="/" target="_blank" style="display: inline-block; text-decoration: none; background-color: #631bff; color: #ffffff; font-weight: 500; border-radius: 18px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);">
                                          <span style="display: inline-block; padding-top: 12px; padding-bottom: 12px; padding-left: 24px; padding-right: 24px;">Renew Subscription</span>
                                        </a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td height="24">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="font-size: 12px; color: #6b7280;">
                                        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="padding-top: 12px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                          <tr>
                                            <td>
                                              <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="text-decoration: none;">
                                                <i class="fa-brands fa-facebook" style="font-size: 18px; color: #9ca3af;"></i>
                                              </a>&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td>
                                              <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="text-decoration: none;">
                                                <i class="fa-brands fa-twitter" style="font-size: 18px; color: #9ca3af;"></i>
                                              </a>&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td>
                                              <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="text-decoration: none;">
                                                <i class="fa-brands fa-instagram" style="font-size: 18px; color: #9ca3af;"></i>
                                              </a>&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td>
                                              <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="text-decoration: none;">
                                                <i class="fa-brands fa-linkedin" style="font-size: 18px; color: #9ca3af;"></i>
                                              </a>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="padding-top: 12px; font-size: 12px; color: #9ca3af;">
                                        <a href="https://webcrumbs.cloud/placeholder" target="_blank" style="color: #6b7280; text-decoration: none;">Privacy Policy</a>&nbsp;&bull;&nbsp;<a href="https://webcrumbs.cloud/placeholder" target="_blank" style="color: #6b7280; text-decoration: none;">Terms of Service</a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td height="12">&nbsp;</td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// Scheduled job to check for subscriptions ending in 5 days
cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        const fiveDaysFromNow = new Date(today);
        fiveDaysFromNow.setDate(today.getDate() + 5);

        const subscriptions = await Subscription.find({
            endDate: { $lte: fiveDaysFromNow },
            status: 1 // Active subscriptions
        });

        for (const subscription of subscriptions) {
            await sendReminderEmail(subscription.customerInfo.email, {
                planType: subscription.planType,
                amount: subscription.amount,
                duration: subscription.duration,
            });
        }
    } catch (error) {
        console.error('Error sending reminder emails:', error);
    }
});
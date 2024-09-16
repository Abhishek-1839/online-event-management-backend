const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();
module.exports = Stripe(process.env.STRIPE_SECRET_KEY);
// const stripe = require("stripe")(
//     "sk_test_51PyGFxHRivblCT2O3RyxhOInJuJcDCLHdAwKFM5fM8BmvsLsHbuYanVZyPauUJGsuDmhMj2fsXGYegoNtxxoXzdW00c7zkYAjY"
//   );
// //   console.log(process.env.key_id);
//   const makePayment = async (req, res) => {
//     try{
//     const product = await stripe.products.create({
//       name: "event ticket",
//       description: "Ticket for event, based on ticket type",
//     });
  
//     const price = await stripe.prices.create({
//       unit_amount: 100,
//       currency: "INR",
//       product: product.id,
//     });
//     // if (price) {
//     //   console.log(
//     //     "Success! Here is your event id: " + product.id
//     //   );
//     //   console.log(
//     //     "Success! Here is your event price id: " + price.id
//     //   );
//     //   res.send(
//     //     "Success! Here is your event product id: " + product.id
//     //   );
//     // } else {
//     //   console.log("error");
//     //   res.send("error");
//     // }
//     if (price) {
//         console.log("Success! Product and price created.");
//         res.status(200).json({
//           message: "Success! Product and price created.",
//           productId: product.id,
//           priceId: price.id,
//         });
//       }
//     } catch (error) {
//         console.error("Error creating payment:", error);
//         res.status(500).json({ error: "Failed to create product or price" });
//       }
// };
//   const checkout = async (req, res) => {
//     // This is your test secret API key.
//     try {
//     const { products } = await req.body;
  
//     const lineItems = products.map((product) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: product.name,
//         },
//         unit_amount: Math.round(product.price * 100),
//       },
//       quantity: 1,
//     }));
//     // console.log(lineItems);
//     const YOUR_DOMAIN = "http://localhost:5173";
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${YOUR_DOMAIN}/success`,
//       cancel_url: `${YOUR_DOMAIN}/failure`,
//     });
  
//     res.status(200).json({ id: session.id });
// } catch (error) {
//   console.error("Error creating checkout session:", error);
//   res.status(500).json({ error: "Failed to create checkout session" });
// }
// };
  
//   module.exports = { makePayment, checkout };

const stripe = require('../utils/stripe');
const dotenv = require('dotenv');
const Event = require('../models/event');
const TicketType = require('../models/TicketType');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Config env file
dotenv.config();

const handleCheckoutPayment = async (req, res) => {
  try {
    const { ticketTypeName, purchaserId, eventId, paymentAmount, currency } = req.body;

    // Validate the required data
    if (!ticketTypeName || !purchaserId || !eventId || !paymentAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const event = await Event.findById(eventId);
    const ticketType = await TicketType.findOne({ name: ticketTypeName });
    const purchaser = await User.findById(purchaserId);

    console.log('Event:', event);
    console.log('Ticket Type:', ticketType);
    console.log('Purchaser:', purchaser);

    if (!event || !ticketType || !purchaser) {
      return res.status(404).json({ error: "Event, ticket type, or user not found" });
    }

    const convertToUSD = (amountInINR) => {
      const conversionRate = 0.011; // Example conversion rate (INR to USD)
      return amountInINR * conversionRate;
    };
    
    // Convert INR to USD and then to cents
    const priceInUSD = convertToUSD(paymentAmount);
    const priceInCents = Math.round(priceInUSD * 100);
    // Create a new ticket

    
    const ticket = new Ticket({
      event: event._id,
      purchaser: purchaser._id,
      paymentMethod:"card",
      ticketType: ticketType._id,
      paymentStatus: 'pending'
    });
    console.log("Created ticket:", ticket);

    await ticket.save();

    const lineItems = [
      {
        price_data: {
          currency: "usd", // Currency in USD
          product_data: {
            name: `Ticket for ${event.title} - ${ticketType.name}`, // Product name
          },
          unit_amount: priceInCents, // Convert price to cents (Stripe expects smallest currency unit)
        },
        quantity: 1, // Specify the quantity of the item
      },
    ];

    // Create checkout session
 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`, // Properly include cancel_url
      metadata: { ticketId: ticket._id.toString() }, 
    });

  return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { handleCheckoutPayment };
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
const TicketType = require('../models/TicketType');

// Config env file
dotenv.config();

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// if (!process.env.STRIPE_SECRET_KEY) {
//   return res.status(500).send({ error: "Stripe secret key is not configured" });
// }

const handleCheckoutPayment = async (req, res) => {
  
     
  
  try {
    // const data = req.body;
    // // Check if data is missing or not an array
    // if (!Array.isArray(data) || data.length === 0) {
    //   return res.status(400).send({ error: "Product data is required and must be an array" });
    // }
    const { ticketTypeName, purchaserId, eventId } = req.body;

    // Validate the required data
    if (!ticketTypeName || !purchaserId || !eventId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const event = await Event.findById(eventId);
    const ticketType = await TicketType.findOne({ name: ticketTypeName });
    const purchaser = await User.findById(purchaserId);

    if (!event || !ticketType || !purchaser) {
      return res.status(404).json({ error: "Event, ticket type, or user not found" });
    }
    const lineItems = data.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Ticket for ${item.title} - ${ticketType.name}`,
          // images: [item.image_url], // Correct property name is 'images'
        },
        unit_amount: ticketType.price * 100, // Convert price to cents
      },
      quantity: 1,
    }));

    // Create checkout session
 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`, // Properly include cancel_url
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { handleCheckoutPayment };
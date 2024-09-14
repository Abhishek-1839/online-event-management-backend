const stripe = require("stripe")(
    "sk_test_51PyGFxHRivblCT2O3RyxhOInJuJcDCLHdAwKFM5fM8BmvsLsHbuYanVZyPauUJGsuDmhMj2fsXGYegoNtxxoXzdW00c7zkYAjY"
  );
//   console.log(process.env.key_id);
  const makePayment = async (req, res) => {
    try{
    const product = await stripe.products.create({
      name: "event ticket",
      description: "Ticket for event, based on ticket type",
    });
  
    const price = await stripe.prices.create({
      unit_amount: 100,
      currency: "INR",
      product: product.id,
    });
    // if (price) {
    //   console.log(
    //     "Success! Here is your event id: " + product.id
    //   );
    //   console.log(
    //     "Success! Here is your event price id: " + price.id
    //   );
    //   res.send(
    //     "Success! Here is your event product id: " + product.id
    //   );
    // } else {
    //   console.log("error");
    //   res.send("error");
    // }
    if (price) {
        console.log("Success! Product and price created.");
        res.status(200).json({
          message: "Success! Product and price created.",
          productId: product.id,
          priceId: price.id,
        });
      }
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ error: "Failed to create product or price" });
      }
};
  const checkout = async (req, res) => {
    // This is your test secret API key.
    try {
    const { products } = await req.body;
  
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: 1,
    }));
    // console.log(lineItems);
    const YOUR_DOMAIN = "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/failure`,
    });
  
    res.status(200).json({ id: session.id });
} catch (error) {
  console.error("Error creating checkout session:", error);
  res.status(500).json({ error: "Failed to create checkout session" });
}
};
  
  module.exports = { makePayment, checkout };
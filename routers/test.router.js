const router=require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.send({ clientSecret: paymentIntent.client_secret });
});
router.get('/payment-intent', async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:60,
      currency: 'usd',
    });
    res.send({ clientSecret: paymentIntent.client_secret });
});
router.post('/webhook', async (req, res) => {
    const event = req.body;
    // Handle specific Stripe events (payment success, etc.)
    res.json({ received: true });
  });
router.get('/ip',(req,res)=>{
  return res.json({status:"success",data:req.ip})
})
module.exports=router;
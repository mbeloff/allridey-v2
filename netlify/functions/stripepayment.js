const Stripe = require('stripe')
exports.handler = async function (event) {
  const body = JSON.parse(event.body)
  let sk = null
  if (body.currency == 'AUD') {
    sk = process.env.STRIPE_SK_AU
  } else if (body.currency == 'NZD') {
    sk = process.env.STRIPE_SK_NZ
  }
  const stripe = new Stripe(sk)
  const customer = await stripe.customers.create(body.customer)

  const params = {
    customer: customer.id,
    setup_future_usage: 'off_session',
    amount: body.amount,
    // amount: body.amount,
    currency: body.currency,
  }
  const paymentIntent = await stripe.paymentIntents.create(params)
  return {
    statusCode: 200,
    body: JSON.stringify({
      secret: paymentIntent.client_secret,
      cid: customer.id,
    }),
  }
}

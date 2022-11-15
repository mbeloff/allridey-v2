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

  const paymentMethod = await stripe.paymentMethods.retrieve(body.pm)
  return {
    statusCode: 200,
    body: JSON.stringify({
      paymentMethod,
    }),
  }
}

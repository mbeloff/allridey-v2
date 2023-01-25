<template>
  <div class="w-max-screen-xl w-full h-full py-4">
    <div
      class="max-w-screen-md mx-auto text-accent-500 grid place-items-center"
    >
      <i
        v-if="status == 'succeeded'"
        class="far fa-check-circle fa-3x fa-beat mb-5"
        style="--fa-animation-duration: 1s; --fa-animation-iteration-count: 2"
      ></i>
      <i
        v-if="status == 'processing'"
        class="far fa-loader fa-3x fa-beat mb-5"
        style="--fa-animation-duration: 1s; --fa-animation-iteration-count: 2"
      ></i>
      <i
        v-if="status == 'requires_payment_method'"
        class="far fa-face-confused fa-3x fa-beat mb-5"
        style="--fa-animation-duration: 1s; --fa-animation-iteration-count: 2"
      ></i>
      <p>{{ message }}</p>
    </div>
    <div v-if="loading">
      <!-- <TheSpinner class="pb-4"></TheSpinner> -->
      <p class="text-center text-sm">...please wait</p>
    </div>
  </div>
</template>

<script setup>
import { useGtag } from 'vue-gtag-next'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, defineProps } from 'vue'
import Mixins from '../../Mixins.js'
const route = useRoute()
const router = useRouter()
const store = useStore()
const props = defineProps({
  booking: {
    type: Object,
  },
})

const { query } = useGtag()
const trackPurchase = () => {
  let items = [
    {
      item_name: props.booking.vehiclecategory,
      price: props.booking.totalcost,
      quantity: 1,
    },
  ]
  query('event', 'purchase', {
    currency: props.booking.currencyname,
    event_category: 'ecommerce',
    transaction_id: props.booking.reservationref,
    value: props.booking.totalcost,
    items: items,
  })
}

const pk =
  props.booking.currencyname == 'AUD'
    ? import.meta.env.VITE_STRIPE_PK_AU
    : import.meta.env.VITE_STRIPE_PK_NZ

const stripe = Stripe(pk)

const cardholder = computed(() => {
  if (decodeURIComponent(route.query.cardholder)) {
    return decodeURIComponent(route.query.cardholder)
  } else {
    return ''
  }
})
const payment = ref(null)
const status = ref(null)
const loading = ref(true)

const setupClientSecret = new URLSearchParams(window.location.search).get(
  'setup_intent_client_secret'
)
const paymentClientSecret = new URLSearchParams(window.location.search).get(
  'payment_intent_client_secret'
)
const message = ref('')
const success = 'Success!'
const processing =
  "Processing payment details. We'll update you when processing is complete."
const fail =
  'Failed to process payment details. Please check your payment details and try again.'

// check payment details and confirm to RCM
if (paymentClientSecret) {
  stripe
    .retrievePaymentIntent(paymentClientSecret)
    .then(({ paymentIntent }) => {
      payment.value = paymentIntent
      loading.value = false
      status.value = paymentIntent.status
      console.log(paymentIntent)
      switch (paymentIntent.status) {
        case 'succeeded': {
          message.value = success
          trackPurchase()
          getCard(paymentIntent.payment_method)
          break
        }
        case 'requires_capture': {
          message.value = success
          trackPurchase()
          getCard(paymentIntent.payment_method)
          break
        }

        case 'processing': {
          message.value = processing
          break
        }

        case 'requires_payment_method': {
          message.value = fail
          router.push({ name: 'Checkout', query: { payment: 'fail' } })
          break
        }
      }
    })

  const getCard = async (pm) => {
    fetch('/.netlify/functions/stripegetcard', {
      method: 'POST',
      body: JSON.stringify({ pm: pm, currency: props.booking.currencyname }),
    })
      .then((res) => res.text())
      .then((res) => {
        confirmStripePayment(JSON.parse(res).paymentMethod)
      })
      .catch((err) => {
        console.log(err, 'payment method not found')
      })
  }

  const confirmStripePayment = async (card) => {
    console.log(card)
    let exp_month =
      card.card.exp_month <= 9
        ? '0' + card.card.exp_month.toString()
        : card.card.exp_month.toString()
    let exp_year = card.card.exp_year.toString().slice(2)
    let expiry = exp_month + '/' + exp_year

    let params = {
      method: 'confirmpayment',
      reservationref: props.booking.reservationref,
      amount: (payment.value.amount / 100).toFixed(2),
      success: true,
      paydate: new Date(payment.value.created * 1000).toLocaleDateString(
        'en-AU'
      ),
      paytype: card.card.brand,
      supplierid: 5,
      paysource: 'Allridey Stripe Online',
      transactid: card.customer,
      transtype:
        props.booking.reservationstatus == 'Reservation Request'
          ? 'Auth'
          : 'Payment',
      dpstxnref: payment.value.id,
      cardnumber: '############' + card.card.last4,
      cardexpiry: expiry,
      cardholder: cardholder.value,
      payscenario: 2,
      emailoption: 2,
    }

    finishTransaction(params)
  }
}

// * Check transaction and save card to rcm
if (setupClientSecret) {
  stripe.retrieveSetupIntent(setupClientSecret).then(({ setupIntent }) => {
    loading.value = false
    status.value = setupIntent.status
    switch (setupIntent.status) {
      case 'succeeded': {
        message.value = success
        getCard(setupIntent.payment_method)
        break
      }
      case 'processing': {
        message.value = processing
        break
      }
      case 'requires_payment_method': {
        message.value = fail
        router.push({ name: 'book-pay', query: { payment: 'fail' } })
        break
      }
    }
  })

  const getCard = async (pm) => {
    fetch('/.netlify/functions/stripegetcard', {
      method: 'POST',
      body: JSON.stringify({ pm: pm, currency: props.booking.currencyname }),
    })
      .then((res) => res.text())
      .then((res) => {
        saveCard(JSON.parse(res))
      })
      .catch((err) => {
        console.log(err, 'payment method not found')
      })
  }

  const saveCard = async (card) => {
    let exp_month =
      card.card.exp_month <= 9
        ? '0' + card.card.exp_month.toString()
        : card.card.exp_month.toString()
    let exp_year = card.card.exp_year.toString().slice(2)
    let expiry = exp_month + '/' + exp_year

    let params = {
      method: 'rebillingtoken',
      reservationref: props.booking.reservationref,
      paytype: card.card.brand,
      supplierid: 5,
      paysource: 'Website',
      rebillingtoken: card.customer,
      cardnumber: '############' + card.card.last4,
      cardexpiry: expiry,
      cardholder: cardholder.value,
    }

    finishTransaction(params)
  }
}

const finishTransaction = (params) => {
  console.log(params)
  Mixins.methods
    .apiCall(JSON.stringify(params))
    .then((res) => {
      console.log(res)
      refreshBookingAndShowSummary()
    })
    .catch((err) => {
      console.log('card not saved', err)
      router.push({ name: 'Summary' })
    })
}
console.log(props.booking.reservationref)
const refreshBookingAndShowSummary = () => {
  Mixins.methods
    .apiCall(
      JSON.stringify({
        method: 'bookinginfo',
        reservationref: props.booking.reservationref,
      })
    )
    .then((res) => {
      console.log(res)
      store.dispatch('bookinginfo', res)
      sendEmail()
      setTimeout(() => {
        router.push({ name: 'Summary' })
      }, 2000)
    })
}

const sendEmail = () => {
  Mixins.methods
    .apiCall(
      JSON.stringify({
        method: 'sendemail',
        reservationref: props.booking.reservationref,
      })
    )
    .then((res) => console.log(res))
}
</script>

<style lang="scss" scoped></style>

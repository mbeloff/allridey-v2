<template>
  <div class="grid max-w-screen-xl place-items-center mx-auto py-10 md:py-20">
    <div class="min-w-[320px] max-w-screen-sm w-full">
      <p v-if="route.query.payment" class="text-red-500 text-center pb-2">
        could not validate card details, please try again.
      </p>
      <div class="mb-4">
        <p class="font-bold text-primary text-2xl">
          <span class="font-normal">{{ booking.currencyname }}</span
          >{{ booking.currencysymbol + paymentamount.toFixed(2) }}
        </p>
        <p class="text-xs font-light text-gray-500">
          Reservation reference number: {{ booking.reservationref }}
        </p>
      </div>
      <div class="rounded-xl p-2 border bg-gray-100">
        <div v-show="!redirected" id="form">
          <div class="py-6">
            <div class="relative mb-2">
              <label
                class="text-left text-[#f43f5e] absolute bottom-full text-sm text-accent-500"
                for="cardname"
                >Cardholder name</label
              >
              <input
                id="cardname"
                v-model="cardholder"
                class="stripe-input w-full py-2 border rounded px-3 text-gray-600 focus:ring-[3px] ring-[#0573e157] focus:border-gray-400/90 outline-none uppercase"
                :class="{ 'ring-2 ring-[#dc1b40]': cardholdererror }"
                type="text"
                name="cardname"
                placeholder="John Doe"
                maxlentgh="25"
              />
              <p v-if="cardholdererror" class="text-[#dc1b40] text-[15px]">
                {{ cardholdererror }}
              </p>
            </div>
            <label id="cardEl" ref="cardEl"></label>
          </div>

          <div class="flex w-full justify-between">
            <div class="self-end text-sm text-gray-400">
              Powered by
              <i class="fab fa-stripe scale-[200%] translate-y-px ml-2"></i>
            </div>
            <button
              id="submit"
              class="px-6 py-2 btn-primary text-white rounded mt-2 w-full sm:w-auto"
              @click="submit()"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
      <p
        id="error-message"
        class="text-center text-red-500 font-bold text-sm my-2"
      ></p>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watchEffect, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const route = useRoute()
const props = defineProps({
  customer: {
    type: Object,
  },
  booking: {
    type: Object,
  },
})
const cardEl = ref(null)
const redirected = computed(() => {
  if (route.query.redirect_status) {
    return route.query.redirect_status
  } else {
    return false
  }
})

const customer = computed(() => {
  return {
    email: props.customer.email,
    phone: props.customer.phone,
    name:
      props.customer.firstname.toUpperCase() +
      ' ' +
      props.customer.lastname.toUpperCase(),
  }
})

const pk =
  props.booking.currencyname == 'AUD'
    ? import.meta.env.VITE_STRIPE_PK_AU
    : import.meta.env.VITE_STRIPE_PK_NZ

const stripe = Stripe(pk)

const paymentintent = ref()
const onRequest =
  store.state.step3.availablecars[0].availablemessage != 'Available for Booking'
const paymentamount = computed(() => {
  if (onRequest) {
    return props.booking.balancedue
  } else {
    return 1
  }
})

onBeforeMount(() => {
  fetch('/.netlify/functions/stripepayment', {
    method: 'POST',
    body: JSON.stringify({
      customer: customer.value,
      amount: (paymentamount.value * 100).toFixed(0),
      currency: props.booking.currencyname,
      isAuth: onRequest,
    }),
  })
    .then((res) => res.text())
    .then((res) => {
      paymentintent.value = JSON.parse(res)
    })
})

const elements = ref()
watch(paymentintent, (val) => {
  if (val.secret) {
    const options = {
      clientSecret: paymentintent.value.secret,
      fonts: [
        {
          cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
        },
      ],
      appearance: {
        variables: {
          fontFamily: 'Roboto, system-ui, sans-serif',
          // See all possible variables below
        },
        rules: {
          '.Label': {
            color: '#f43f5e',
            fontSize: '14px',
          },
        },
      },
    }
    elements.value = stripe.elements(options)
    const eloptions = {
      terms: { card: 'never' },
    }
    const cardElement = elements.value.create('payment', eloptions)
    cardElement.mount('#cardEl')
  }
})

const cardholder = ref('')
const cardholdererror = ref(null)

watchEffect(() => {
  if (cardholder.value.length > 0) {
    cardholdererror.value = null
  }
})

const submit = async () => {
  cardholdererror.value = null
  if (!cardholder.value) {
    cardholdererror.value = 'Cardholder name is incomplete'
    return
  }
  if (/^[a-zA-z'-][a-zA-z' -]{1,25}$/.test(cardholder.value)) {
    cardholdererror.value = null
  } else {
    cardholdererror.value =
      'Cardholder name is an improper length, or contains invalid characters'
    return
  }

  cardholdererror.value = null

  const { error } = await stripe.confirmPayment({
    //`Elements` instance that was used to create the Payment Element
    elements: elements.value,
    confirmParams: {
      return_url:
        window.location.origin +
        '/checkout?cardholder=' +
        encodeURIComponent(cardholder.value) +
        '&cid=' +
        paymentintent.value.cid,
    },
  })

  if (error) {
    const messageContainer = document.querySelector('#error-message')
    messageContainer.textContent = error.message
  }
}
</script>

<style lang="postcss" scoped></style>

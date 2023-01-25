<template>
  <div v-if="gotbooking" class="w-full h-full">
    <div v-if="!booking.agent">
      <StripePayment
        v-if="!redirected"
        :booking="booking"
        :customer="customer"
      ></StripePayment>
      <VerifyStripe v-if="redirected" :booking="booking"></VerifyStripe>
    </div>
    <div v-else>
      <div
        class="p-2 text-xs text-gray-600 max-w-screen-lg mx-auto flex place-items-center gap-2"
      >
        <div>
          <i class="fa-sharp fa-car-building fa-2x text-gray-300"></i>
        </div>
        <div>
          <p>
            <span class="font-bold">Agency:</span>
            {{ booking.agent }}
          </p>
          <p>
            <span class="font-bold">Branch:</span>
            {{ booking.agentbranch }}
          </p>
        </div>
      </div>

      <div
        class="grid max-w-screen-lg place-items-center mx-auto py-10 md:py-20"
      >
        <div class="min-w-[320px] max-w-sm w-full">
          <div class="rounded-xl p-4 border bg-white">
            <div class="mb-4 text-center">
              <p class="">Deposit Due</p>
              <p class="text-3xl font-bold my-10">
                <span class="font-light text-gray-400">
                  {{ booking.currencyname }}</span
                >{{ booking.currencysymbol + booking.agentcommission }}
              </p>

              <p class="text-sm text-left text-gray-700">
                Remaining balance of
                <span class="font-normal"> {{ booking.currencyname }}</span
                ><span class="font-bold">
                  {{ booking.currencysymbol + booking.balancedue.toFixed(2) }}
                </span>
                payable to Allridey within 7 days
              </p>
            </div>
            <div class="flex w-full">
              <button
                id="submit"
                class="px-6 py-2 btn-primary text-white rounded w-full"
                :disabled="loading"
                @click="refreshBookingAndShowSummary()"
              >
                Continue <loading-overlay v-if="loading" class="text-black" />
              </button>
            </div>
          </div>
          <p class="text-xs font text-center text-gray-500 my-2">
            Reservation reference number: #{{ booking.reservationno }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StripePayment from '@/components/stripe/StripePayment.vue'
import VerifyStripe from '@/components/stripe/VerifyStripe.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import Mixins from '../Mixins.js'
import { useRoute, useRouter } from 'vue-router'
import { ref, onBeforeMount, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const route = useRoute()
const router = useRouter()
const gotbooking = ref(false)
const booking = ref()
const resref = store.state.resinfo.reservationref
const customer = ref()
const loading = ref(false)
const redirected = computed(() => {
  if (route.query.redirect_status) {
    return route.query.redirect_status
  } else {
    return false
  }
})

onBeforeMount(() => {
  let params = JSON.stringify({
    method: 'bookinginfo',
    reservationref: resref,
  })
  Mixins.methods.apiCall(params).then((res) => {
    booking.value = res.bookinginfo[0]
    customer.value = res.customerinfo[0]
    store.dispatch('bookinginfo', res)
    store.dispatch('gotBooking', true)
    gotbooking.value = true
  })
})

onMounted(() => {
  window.scrollTo(0, 0)
})

watch(booking, (val) => {
  if (val.balancedue <= 0) {
    router.push({ name: 'Summary' })
  }
})

const refreshBookingAndShowSummary = () => {
  Mixins.methods
    .apiCall(
      JSON.stringify({
        method: 'bookinginfo',
        reservationref: booking.value.reservationref,
      })
    )
    .then((res) => {
      store.dispatch('bookinginfo', res)
      sendEmail()
      setTimeout(() => {
        router.push({ name: 'Summary' })
      }, 2000)
    })
}

const sendEmail = () => {
  loading.value = true
  Mixins.methods
    .apiCall(
      JSON.stringify({
        method: 'sendemail',
        reservationref: booking.value.reservationref,
      })
    )
    .then((res) => {
      loading.value = false
      console.log(res)
    })
}
</script>

<style lang="scss" scoped></style>

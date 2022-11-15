<template>
  <div v-if="gotbooking">
    <div>
      <StripePayment
        v-if="!redirected"
        :booking="booking"
        :customer="customer"
      ></StripePayment>
      <VerifyStripe v-if="redirected" :booking="booking"></VerifyStripe>
    </div>
  </div>
</template>

<script setup>
import StripePayment from '@/components/stripe/StripePayment.vue'
import VerifyStripe from '@/components/stripe/VerifyStripe.vue'
import Mixins from '../Mixins.js'
import { useRoute, useRouter } from 'vue-router'
import { ref, onBeforeMount, computed, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const route = useRoute()
const router = useRouter()
const gotbooking = ref(false)
const booking = ref()
const resref = store.state.resinfo.reservationref
const customer = ref()
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

watch(booking, (val) => {
  if (val.balancedue <= 0) {
    router.push({ name: 'Summary' })
  }
})
</script>

<style lang="scss" scoped></style>

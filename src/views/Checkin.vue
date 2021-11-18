<template>
  <div class="h-full flex flex-col justify-center" v-if="!bookingdata">
    <p class="text-red-500 text-center mb-4">{{error}}</p>
    <div class="max-w-sm mx-auto text-left flex flex-col">
      <div class="flex flex-col flex-grow group">
        <div class="flex flex-row place-items-center">
          <i class="form-i fal fa-book fa-fw"></i>
          <input class="my-input uppercase" type="text" name="resno" v-model="resno" placeholder="Reservation number">
        </div>
      </div>
      <div class="flex flex-col flex-grow group mt-2">
        <div class="flex flex-row place-items-center">
          <i class="form-i fal fa-user fa-fw"></i>
          <input class="my-input uppercase" type="text" name="lastname" v-model="lastname" placeholder="Last name">
        </div>
      </div>
      <button class="text-4xl text-right font-bold group focus:outline-none w-56" @click.prevent="findBooking(resno, lastname)">
        <p class="text-4xl mt-4 text-left">online</p><span>check in</span> <i class="fas fa-arrow-right align-middle transition ease-out duration-500 transform group-hover:translate-x-1 group-hover:text-blue-600"></i>
      </button>
    </div>
  </div>

  <div v-if="customer && bookingdata">
    <modify-booking @update="bookingInfo(this.pbresref)" :bookingdata="bookingdata" :customer="customer"></modify-booking>
  </div>

</template>

<script>
  import ModifyBooking from '../components/Modify.vue'
  import Mixins from '../Mixins'
  export default {
    mixins: [Mixins],
    components: {
      ModifyBooking
    },
    data() {
      return {
        resno: "U1157",
        lastname: "TEST",
        error: "",
        bookingdata: null,
        customer: null,
      }
    },
    mounted() {
      Mixins.methods.getToken()
    },
    computed: {
      pbresref() {
        return this.$store.state.pbresref
      }
    },
    methods: {
      findBooking(resno, lastname) {
        let method = JSON.stringify({
          "method": "findbooking",
          "reservationno": resno,
          "lastname": lastname
        });
        Mixins.methods.postapiCall(method)
          .then(res => JSON.parse(res))
          .then(result => {
            console.log(result)
            if (result.status == "OK") {
              let resref = result.results[0].reservationref
              this.$store.dispatch("pbresref", resref)
              this.bookingInfo(resref)
            } else if (result.status == "ERR") {
              throw result.error
            }
          }).catch(err => {
            this.error == err
            console.log(err)
          })
      },
      bookingInfo(resref) {
        let method = JSON.stringify({
          "method": "bookinginfo",
          "reservationref": resref
        });
        let bookingdata
        Mixins.methods.postapiCall(method).then(res => JSON.parse(JSON.stringify(res))).then(results => {
          bookingdata = JSON.parse(results).results
          this.bookingdata = bookingdata
          this.customer = bookingdata.customerinfo
        })
      }
    },
  }
</script>

<style>

</style>
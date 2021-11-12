<template>
  <div class="h-full flex flex-col justify-center" v-if="!bookinginfo">
    <p class="text-red-500 text-center mb-4">{{error}}</p>     
    <div class="max-w-sm mx-auto text-left flex flex-col">      
      <div class="flex flex-col flex-grow group">
        <!-- <label class="my-label has-icon" for="resno">Reservation Number</label> -->
        <div class="flex flex-row place-items-center">
          <i class="form-i fal fa-book fa-fw"></i>
          <input class="my-input uppercase" type="text" name="resno" v-model="resno" placeholder="Rservation number">
        </div>
      </div>
      <div class="flex flex-col flex-grow group mt-2">
        <!-- <label class="my-label has-icon" for="lastname">Last Name</label> -->
        <div class="flex flex-row place-items-center">
          <i class="form-i fal fa-user fa-fw"></i>
          <input class="my-input uppercase" type="text" name="lastname" v-model="lastname" placeholder="Last name">
        </div>
      </div>      
      <button class="text-4xl text-right font-bold group focus:outline-none"  @click.prevent="findBooking(resno, lastname)">
        <p class="text-4xl mt-4 text-left">online</p><span>check in</span> <i class="fas fa-arrow-right align-middle transition ease-out duration-500 transform group-hover:translate-x-1 group-hover:text-blue-600"></i></button>
    </div>    
  </div>

  <modify-booking v-if="bookinginfo" :bookinginfo="bookinginfo"></modify-booking>
</template>

<script>
import ModifyBooking from '../components/Modify.vue'
  export default {
    components: {
      ModifyBooking
    },
    data() {
      return {
        apiUrl: "https://api.rentalcarmanager.com/v32/api",
        token: "",
        tokenExp: "",
        resno: "U1157",
        lastname: "TEST",
        error: "",
        resref: null,
        bookinginfo: null,
      }
    },
    computed: {
      now() {
        return new Date().toGMTString()
      }
    },
    watch: {
      'resref': {
      handler: function(resref) {
        this.bookingInfo(resref)
      }
      },
    },
    mounted() {
      this.getToken()
    },
    methods: {
      getToken() {
        let fnHost =
          import.meta.env.VITE_FN_HOST
        var requestOptions = {
          method: 'POST',
          redirect: 'follow'
        };

        fetch(fnHost + "/.netlify/functions/getToken", requestOptions)
          .then(response => response.text())
          .then(result => {
            const res = JSON.parse(result)
            console.log(res)
            this.token = res.access_token
            this.tokenExp = res['.expires']
          })
          .catch(error => console.log('error', error));

          return this.token
      },
      async apiCall(method) {
        let auth = this.token
        if (!this.token || this.tokenExp < this.now) {
          console.log('getting new token')
          auth = this.getToken()
        }

        var requestOptions = {
          headers: {
            "Authorization": "Bearer " + auth,
            "Content-Type": "application/json"
          },
          method: "POST",
          body: method,
        }

        let response = await fetch(this.apiUrl, requestOptions)
          .then(response => response.text())
          .then(result => {
            return JSON.parse(result)
          })
          .catch(error => {
            this.error = error
            console.log('error', error)
          });

        return JSON.stringify(response)
      },
      findBooking(resno, lastname) {
        let method = JSON.stringify({
          "method": "findbooking",
          "reservationno": resno,
          "lastname": lastname
        });
        this.apiCall(method)
        .then(res => JSON.parse(JSON.stringify(res)))
        .then(results => {
          this.resref = JSON.parse(results).results[0].reservationref
        })
      },
      bookingInfo(resref) {
        let method = JSON.stringify({
          "method": "bookinginfo",
          "reservationref": resref
        });
        this.apiCall(method).then(res => JSON.parse(JSON.stringify(res))).then(results => {
          this.bookinginfo = JSON.parse(results).results
          })
      } 
    },

  }
</script>

<style>

</style>
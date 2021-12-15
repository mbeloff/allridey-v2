<template>
  <loading-overlay class="z-10" v-if="loading"></loading-overlay>
  
  <div class="h-full flex flex-col justify-center">
    <div class="h-12 my-2">
      <p v-show="error" class="text-red-500 text-center">{{error}}</p>
    </div>
    
    <form class="max-w-sm mx-auto text-left flex flex-col">      
      <div class="flex flex-col flex-grow group">
        <div class="flex flex-row place-items-center">
          <i class="form-i fal fa-book fa-fw"></i>
          <input :class="{ 'input-error' : missinginput && !resno.length }" class="my-input uppercase" type="text" name="resno" v-model="resno" placeholder="Reservation number">
        </div>
      </div>
      <div class="flex flex-col flex-grow group mt-2">
        <div class="flex flex-row place-items-center">
          <i class="form-i fal fa-user fa-fw"></i>
          <input :class="{ 'input-error' : missinginput && !lastname.length }" class="my-input uppercase" type="text" name="lastname" v-model="lastname" placeholder="Last name">
        </div>
      </div>
      <button class="text-4xl text-right font-bold group focus:outline-none w-56" @click.prevent="findBooking(resno, lastname)">
        <p class="text-4xl mt-4 text-left">online</p><span>check in</span> <i class="z-0 fas fa-arrow-right align-middle transition ease-out duration-500 transform group-hover:translate-x-1 group-hover:text-blue-600"></i>
      </button>
    </form>
  </div>
</template>

<script>
  import LoadingOverlay from '../components/LoadingOverlay.vue'
  import Mixins from '../Mixins'
  export default {
    mixins: [Mixins],
    components: {
      LoadingOverlay
    },
    data() {
      return {
        // resno: "U1157",
        // lastname: "TEST",
        resno: "",
        lastname: "",
        missinginput: false,
        error: "",
        loading: true,
      }
    },
    watch: {
      token: {
        handler(val) {
          if (val) {
            this.loading = false
          }
        }
      }
    },
    mounted() {
      Mixins.methods.getToken()
      if (this.$route.query.valid == "false") {
        this.error = "The requested booking is no longer available"
      }
    },
    computed: {
      resref() {
        return this.$store.state.pbresref
      },   
      token() {
        return this.$store.state.token
      }   
    },
    methods: {
      findBooking(resno, lastname) {
        this.loading = true
        this.error = ""
        let method = JSON.stringify({
          "method": "findbooking",
          "reservationno": resno,
          "lastname": lastname
        });
        if (resno && lastname) {
          Mixins.methods.postapiCall(method)
          .then(res => {
            if (res.status == "OK") {
              let resref = res.results[0].reservationref
              this.$store.dispatch("pbresref", resref)
              this.$router.push({name: 'ModifyBooking'})
            } else if (res.status == "ERR") {
              throw res.error
            }
          }).catch(err => {
            this.loading = false
            this.error = err
            console.log('find booking (error): ' + err)
          })
        } else {
          this.error = "Please enter reservation number and your last name."
          this.missinginput = true
          this.loading = false
          return
        }
        
      },     
    },
  }
</script>

<style lang="postcss">
@layer components {
  .btn-green {
    @apply text-sm border border-green-500 text-green-600 rounded px-2 h-8 
  }
  .btn-green:hover {
    @apply hover:bg-green-500 hover:text-white
  }
  .btn-red {
    @apply text-sm border border-red-400 text-red-600 rounded px-2 h-8 
  }
  .btn-red:hover {
    @apply hover:bg-red-400 hover:text-white
  }
  .input-error {
    @apply ring-2 ring-orange-400
  }
}
</style>
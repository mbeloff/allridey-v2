<template>
  <loading-overlay class="z-10" v-if="loading"></loading-overlay>
  <p v-if="error" class="text-red-500 text-center mb-4 py-2">{{error}}</p>
  <div class="h-full flex flex-col justify-center">
    
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
        <p class="text-4xl mt-4 text-left">online</p><span>check in</span> <i class="z-0 fas fa-arrow-right align-middle transition ease-out duration-500 transform group-hover:translate-x-1 group-hover:text-blue-600"></i>
      </button>
    </div>
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
        resno: "U1157",
        lastname: "TEST",
        error: "",
        loading: false,
      }
    },
    watch: {
    },
    mounted() {
      Mixins.methods.getToken()
    },
    computed: {
      resref() {
        return this.$store.state.pbresref
      },      
    },
    methods: {
      findBooking(resno, lastname) {
        this.loading = true
        let method = JSON.stringify({
          "method": "findbooking",
          "reservationno": resno,
          "lastname": lastname
        });
        Mixins.methods.postapiCall(method)
          .then(res => {
            console.log(res)
            if (res.status == "OK") {
              let resref = res.results[0].reservationref
              this.$store.dispatch("pbresref", resref)
              this.$router.push({name: 'ModifyBooking'})
            } else if (res.status == "ERR") {
              throw res.error
            }
          }).catch(err => {
            this.loading = false
            // this.error = err
            console.log('find booking (error): ' + err)
          })
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
}
</style>
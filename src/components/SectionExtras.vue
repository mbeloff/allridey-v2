<template>
  <div class="relative text-left">
    <!-- Kilometres -->    
    <div class="mb-4">
      <p class="font-bold mb-4 text-xl">Damage Cover:</p>
      <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="dc in options.insuranceoptions" :class="{'selected': dc.id == insuranceid}">
        <div class="flex items-center">
          <input type="radio" :checked="dc.id == insuranceid" class="mr-1 hidden" :value="dc.id" v-model="insuranceid" :id="'dc' + dc.id">
          <label :for="'dc' + dc.id" class="fee w-full">
            <div class="flex">
              <span class="fee-name">{{dc.feedescription}}</span>
              <div class="flex items-center"><i class="fas fa-plus-circle mr-2"></i>{{ bookingdata.bookinginfo[0].currencysymbol + dc.fees}} <span class="text-xs">/day</span>  </div>              
            </div>
          </label>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <p class="font-bold mb-4 text-xl">Kilometre Inclusions:</p>
      <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="km in options.kmcharges" :class="{'selected': km.id == bookingdata.bookinginfo[0].kmcharges_id}">
        <div class="flex items-center">
          <input type="radio" :checked="km.id == bookingdata.bookinginfo[0].kmcharges_id" class="mr-1 hidden" :value="km.id" v-model=" bookingdata.bookinginfo[0].kmcharges_id" :id="'km' + km.id">
          <label :for="'km' + km.id" class="fee w-full">
            <div class="flex">
              <span class="fee-name">{{km.description}}</span>
              <span class="price"><i class="fas fa-plus-circle mr-2"></i>{{ bookingdata.bookinginfo[0].currencysymbol + km.totalamount}}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <p class="font-bold mb-4 text-xl">Optional Extras:</p>
      <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="extra in options.optionalfees" :class="{'selected': extra.id == bookingdata.bookinginfo[0].kmcharges_id}">
        <div class="flex items-center">
          <input type="radio" :checked="extra.id == bookingdata.bookinginfo[0].kmcharges_id" class="mr-1 hidden" :value="rxtra.id" v-model=" bookingdata.bookinginfo[0].kmcharges_id" :id="'extra' + extra.id">
          <label :for="'extra' + extra.id" class="fee w-full">
            <div class="flex">
              <span class="fee-name">{{extra.description}}</span>
              <span class="price"><i class="fas fa-plus-circle mr-2"></i>{{ bookingdata.bookinginfo[0].currencysymbol + extra.dailyrate}}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
      
      
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  export default {
    mixins: [Mixins],
    props: {
      bookingdata: Object,
      insuranceid: Number,
      selectedFees: Array
    },
    watch: {
      insuranceid: {
        handler(val) {
          this.$emit('insuranceChanged', val)
        }
      }
    },
    data() {
      return {
        options: {},
      }
    },
    mounted() {
      this.getOptions()
    },
    methods: {
      getOptions() {
        let method = JSON.stringify({
          "method": "bookingoptions",
          "reservationref": this.bookingdata.bookinginfo[0].reservationref
        });
        Mixins.methods.postapiCall(method)
          .then(results => {
            this.options = JSON.parse(results).results
          })
      },
    }
  }
</script>
<style>

</style>
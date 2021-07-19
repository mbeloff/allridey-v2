<template>
  <div class="flex flex-col md:flex-row mt-2 border">
    <div class="flex w-full md:w-1/4 min-h-24 bg-contain bg-no-repeat">
      <img class="object-contain object-center" :src="data.imageurl" alt="">
    </div>

    <div class="flex flex-col flex-1">
      <!-- Vehicle Title -->
      <p class="text-blue-800 text-lg bg-gray-200 pl-1 py-0.5" v-html="data.categoryfriendlydescription"></p>
      <!-- Vehicle Details -->
      <div class="flex flex-col md:flex-row flex-1">
        <div class="flex flex-col flex-1 p-1">
          <p class="text-xs">{{data.vehicledescription1}}</p>
          <p class="text-xs">{{data.vehicledescription2}}</p>
          <!-- v-if location and vehicle avaialble -->
          <div class="text-xs">
            <span class='text-xs font-bold'>{{data["numberofdays"] + " Rental Days - daily rate " + currencysymbol + parseFloat(data["discounteddailyrate"]).toFixed(2)}}</span>


            <p v-for="(fee, i) in getFeeOfType('Daily')" :key="i" class="">
              <i class='fas fa-plus-circle '></i>
              {{currencysymbol + parseFloat(fee["totalfeeamount"]).toFixed(0) + ' FOR ' + fee["name"] + " @ " + currencysymbol + parseFloat(fee["fees"]).toFixed(0) + " per day"}}
            </p>
            <p v-for="(fee, i) in getFeeOfType('Fixed')" :key="i" class="">
              <i class='fas fa-plus-circle '></i>
              {{ currencysymbol + parseFloat(fee["totalfeeamount"]).toFixed(0) + ' FOR ' + fee["name"]}}
            </p>
            <p v-for="(fee, i) in getFeeOfType('Percentage')" :key="i" class="">
              <i class='fas fa-plus-circle '></i>
              {{ currencysymbol + parseFloat(fee["totalfeeamount"]).toFixed(0) + ' FOR ' + fee["name"]}}
            </p>
          </div>
        </div>
        <div v-if="isAvailable() == 'Available for booking'" class="flex flex-col justify-end p-1">
          <p class="text-xs">initial estimate:</p>
          <p class="text-blue-900 font-bold text-lg">{{currencyname + ' ' + currencysymbol + total.toFixed(0) + '.'}}<span class="text-xs">{{(total % 1).toFixed(2).substring(2)}}</span> </p>
          <button class="btn btn-secondary bg-gray-200" @click="getStep3()">Book Now</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import Mixins from '../Mixins'
  export default {
    data() {
      return {
        step3: {}
      }
    },
    props: {
      data: Object,
      manfees: Object,
      allData: Object,
      submittedParams: Object
    },
    computed: {
      total() {
        let sum = this.data.totalrateafterdiscount
        this.manfees.forEach(function(el){
          sum += el.totalfeeamount
        })
        return parseFloat(sum)
      },
      currencyname() {
        return this.allData.locationfees[0].currencyname
      },
      currencysymbol() {
        return this.allData.locationfees[0].currencysymbol
      },
    },
    mixins: [Mixins],
    methods: {
      async getStep3() {
        var params = await JSON.stringify({
          'method': 'step3',
          'vehiclecategorytypeid': this.data.vehiclecategorytypeid,
          'pickuplocationid': this.submittedParams.pickuplocationid,
          'pickupdate': this.submittedParams.pickupdate,
          'pickuptime': this.submittedParams.pickuptime,
          'dropofflocationid': this.submittedParams.dropofflocationid,
          'dropoffdate': this.submittedParams.dropoffdate,
          'dropofftime': this.submittedParams.dropofftime,
          'ageid': this.submittedParams.ageid,
          'vehiclecategoryid': this.data.vehiclecategoryid
        })
        let data = await Mixins.methods.apiCall(params)
        this.step3 = data
        this.$emit("select-vehicle", data, 3)
        this.$router.push({name: "Vehicle"})
      },
      getFeeOfType(type) {
        let arr = []
        this.manfees.forEach(function (el) {
          if (el.type == type) {
            arr.push(el)
          }
        })
        return arr
      },
      isAvailable() {
        if (this.data.availablemessage === 'Not available due to incomplete rates.') {
          return false
        } else if (this.data.availablemessage.length > 0) {
          return this.data.availablemessage
        } else {
          return false
        }
      },
    }
  }
</script>

<style>

</style>
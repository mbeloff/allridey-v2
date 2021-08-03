<template>
  <div class="flex flex-col md:flex-row mt-2 border shadow-lg">
    <div class="flex w-full md:w-1/3 min-h-24 bg-white">
      <img class="object-contain object-center mx-auto" :src="data.imageurl" alt="">
    </div>

    <div class="flex flex-col flex-1 bg-white">
      <!-- Vehicle Title -->
      <p class="text-blue-800 text-lg font-bold border-b py-1 mb-1 mx-2" v-html="data.categoryfriendlydescription"></p>
      <!-- Vehicle Details -->
      <div class="flex flex-col md:flex-row flex-1">
        <div class="flex flex-col flex-1 p-1">
          <div class="flex flex-col gap-1 mb-1 flex-grow p-2">
            <p class="text-sm" v-if="data.vehicledescription1"><i class="fal fa-cogs mr-2 text-blue-800"></i>{{data.vehicledescription1}}</p>
            <p class="text-sm" v-if="data.vehicledescription2"><i class="fal fa-bed mr-2 text-blue-800"></i>{{data.vehicledescription2}}</p>
          </div>

          <!-- v-if location and vehicle avaialble -->
          <div class="text-xs gap-1 flex flex-col mt-auto mb-2 text-gray-600">
            <p v-for="(fee, i) in getFeeOfType('Daily')" :key="i" class="">
              <i class='fas fa-plus-circle '></i>
              {{currencysymbol + parseFloat(fee.totalfeeamount).toFixed(0) + ' FOR ' + fee["name"] + " @ " + currencysymbol + parseFloat(fee["fees"]).toFixed(0) + " per day"}}
            </p>
            <p v-for="(fee, i) in getFeeOfType('Fixed')" :key="i" class="">
              <i class='fas fa-plus-circle '></i>
              {{ currencysymbol + parseFloat(fee.totalfeeamount).toFixed(0) + ' FOR ' + fee["name"]}}
            </p>
            <p v-for="(fee, i) in getFeeOfType('Percentage')" :key="i" class="">
              <i class='fas fa-plus-circle '></i>
              {{ currencysymbol + parseFloat(fee.totalfeeamount).toFixed(0) + ' FOR ' + fee["name"]}}
            </p>
          </div>
        </div>
        <div v-if="isAvailable() == 'Available for booking'" class="flex flex-col justify-end p-1 md:p-2">
          <div class="flex md:flex-col justify-between">
            <div class="text-blue-900 opacity-70">
              <p class='text-xs'>daily rate:</p>
              <p class="mb-3 text-lg font-bold -mt-1">{{currencysymbol + parseFloat(data["discounteddailyrate"]).toFixed(2)}}</p>
            </div>
            <div class="relative cursory-pointer text-blue-900">
              <tippy >
                <p class="text-xs" >initial estimate: <i class="fal fa-question-circle fa-fw"></i></p>
                <template #content>
                  <div class="text-xs">
                    <p>Included in Estimate: <br> daily rental / accomodation fees, <br> one-way or remote location fees, <br> other mandatory fees</p>
                    <p>Not Included: <br> Damage cover, optional extras</p>
                  </div>                   
                </template>
              </tippy>
              <p class="text-blue-900 font-bold -mt-1 text-lg mb-1">{{currencyname + ' ' + currencysymbol + total.toFixed(0) + '.'}}<span class="text-xs">{{(total % 1).toFixed(2).substring(2)}}</span> </p>
            </div>
          </div>
          <button class="btn btn-secondary bg-gray-200 w-full" @click="getStep3()">Book Now</button>
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
        showTip: false
      }
    },
    props: {
      data: Object,
      manfees: Object,
      allData: Object,
    },
    computed: {
      total() {
        let sum = this.data.totalrateafterdiscount
        this.manfees.forEach(function (el) {
          sum += el.totalfeeamount
        })
        return parseFloat(sum)
      },
      step3() {
        return this.$store.state.step3
      },
      currencyname() {
        return this.allData.locationfees[0].currencyname
      },
      currencysymbol() {
        return this.allData.locationfees[0].currencysymbol
      },
      searchParams() {
        return this.$store.state.searchParams
      }
    },
    mixins: [Mixins],
    methods: {
      async getStep3() {
        var params = await JSON.stringify({
          'method': 'step3',
          'vehiclecategorytypeid': this.data.vehiclecategorytypeid,
          'pickuplocationid': this.searchParams.pickuplocationid,
          'pickupdate': this.searchParams.pickupdate,
          'pickuptime': this.searchParams.pickuptime,
          'dropofflocationid': this.searchParams.dropofflocationid,
          'dropoffdate': this.searchParams.dropoffdate,
          'dropofftime': this.searchParams.dropofftime,
          'ageid': this.searchParams.ageid,
          'vehiclecategoryid': this.data.vehiclecategoryid
        })
        let data = await Mixins.methods.apiCall(params)
        this.$store.dispatch('step3', data);
        // this.step3 = data
        this.$emit("select-vehicle", data, 3)
        this.$router.push({
          name: "Vehicle"
        })
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
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
          <div class="flex flex-col gap-1 mb-1">
            <p class="" v-if="data.vehicledescription1"><i class="far fa-cogs mr-2"></i>{{data.vehicledescription1}}</p>
            <p class="" v-if="data.vehicledescription2"><i class="far fa-bed mr-2"></i>{{data.vehicledescription2}}</p>
          </div>

          <!-- v-if location and vehicle avaialble -->
          <div class="text-xs gap-1 flex flex-col">



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
        <div v-if="isAvailable() == 'Available for booking'" class="flex flex-col justify-end p-1 md:p-2">
          <div class="flex md:flex-col justify-between">
            <div class="text-blue-900 font-bold opacity-70">
            <p class='text-xs'>{{"daily rate:"}}</p>
            <p class="mb-3 text-lg ">{{currencysymbol + parseFloat(data["discounteddailyrate"]).toFixed(2)}}</p>
          </div>
          <div class="text-blue-900 font-bold">
            <p class="text-xs">initial estimate:</p>
            <p class="text-blue-900 font-bold text-lg">{{currencyname + ' ' + currencysymbol + total.toFixed(0) + '.'}}<span class="text-xs">{{(total % 1).toFixed(2).substring(2)}}</span> </p>
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
      return {}
    },
    props: {
      data: Object,
      manfees: Object,
      allData: Object,
      // searchParams: Object
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
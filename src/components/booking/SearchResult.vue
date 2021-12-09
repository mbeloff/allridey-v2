<template>
  <div class="flex flex-col md:flex-row print:flex-row mt-2 rounded bg-white border border-gray-300 shadow-lg">
    <div class="flex w-full md:w-1/3 print:w-1/3 min-h-24 rounded">
      <img class="object-contain object-center mx-auto rounded" :src="data.imageurl" alt="">
    </div>
    <div class="flex flex-col flex-1">
      
      
      <!-- Vehicle Details -->
      <div class="flex flex-col md:flex-row print:flex-row flex-1">
        <div class="flex flex-col flex-1 p-1">
          <div class="px-2 pt-2">
        <p class="text-blue-800 text-xl font-bold">{{data.categoryfriendlydescription}}</p>
        <p class="text-sm text-gray-500">{{data.vehicledescription2}}</p>
      </div>
          <div class="flex flex-col mb-1 p-2 text-sm">
            <p><i class="fal fa-fw fa-male mr-2 text-blue-800"></i>Seats {{data.numberofadults}}
           </p>
            <p v-if="data.numberofchildren"><i class="fal fa-bed fa-fw mr-2 text-blue-800"></i>Sleeps {{data.numberofchildren}}
           </p>
           <p v-for="feature in list" v-html="renderFeature(feature)"></p>
           <p><i class="fal fa-tachometer-fast fa-fw text-blue-800 mr-2"></i>
           250km/day included</p>            
          </div>
          <!-- v-if location and vehicle avaialble -->
          <!-- <div class="text-xs gap-1 flex flex-col mt-auto mb-2 text-gray-600">
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
          </div> -->
        </div>
        <div v-if="isAvailable() == 'Available for booking'" class="flex flex-col justify-end p-1 md:p-2 md:w-40 bg-gray-100">
          <div class="flex md:flex-col print:flex-col justify-between  px-1 md:px-0">
             
              <div class=" flex flex-col self-end md:self-start mb-1">
                
                <p v-if="data.discountname" class="  text-xs -mb-1 font-normal mr-2 text-red-500"><span class="line-through">{{currencysymbol + parseFloat(data["avgrate"]).toFixed(2)}}/day</span>  <span v-if="data.discountname" class="text-xs font-normal text-red-500">({{data.discountname}})</span></p>
                 
                  
                  <p class="text-lg -mb-1 text-blue-900">{{currencysymbol + parseFloat(data["discounteddailyrate"]).toFixed(2)}}<span class="text-sm">/day</span>    </p>  
                                   
                   
              </div>                  

                          
            <div class="relative cursor-default text-blue-900 self-end md:self-start md:mt-3">
              <tippy >
                <p class="text-xs" >initial estimate: <i class="fal fa-question-circle fa-fw"></i></p>
                <template #content>
                  <div class="text-xs">
                    <p>Estimate Includes: <br> daily rental rate, <br> one-way or remote location fees, <br> other mandatory fees</p>
                    <br>
                    <p>Not Included: <br> Damage cover, optional extras</p>
                  </div>                   
                </template>
              </tippy>              
              <p class="text-blue-900 font-bold -mt-1 text-xl md:mb-1">{{currencyname + ' ' + currencysymbol + total.toFixed(0) + '.'}}<span class="text-xs">{{(total % 1).toFixed(2).substring(2)}}</span> </p>
            </div>            
          </div>
          <button class="btn btn-secondary bg-gray-200 w-full border-blue-600" @click="getStep3()">Book Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '@/Mixins'
  export default {
    data() {
      return {
        showTip: false,
        images: []
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
      },
      list() {
        return this.data.vehicledescription1.split(' !! ')
      },
    },
    mixins: [Mixins],
    methods: {
      renderFeature(item) {
        if (item == 'a/m') {
          return '<i class="fal fa-fw fa-cogs mr-2 text-blue-800"></i>Auto & Manual'
        }
        if (item == 'a') {
          return '<i class="fal fa-fw fa-cogs mr-2 text-blue-800"></i>Automatic'
        }
        if (item == 'm') {
          return '<i class="fal fa-fw fa-cogs mr-2 text-blue-800"></i>Manual'
        }
        if (item == 'k') {
          return '<i class="fal fa-fw fa-sink mr-2 text-blue-800"></i>Kitchenette & Cookware'
        }
      },
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
          'vehiclecategoryid': this.data.vehiclecategoryid,
          'agentcode': this.searchParams.agentcode
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
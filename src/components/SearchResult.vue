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
          <p class="mt-auto text-blue-800" :class="{'text-red-600': isAvailable() == 'Not available due to incomplete rates.'}">{{isAvailable()}}</p>
        </div>
        <div v-if="isAvailable() == 'Available for booking'" class="flex flex-col justify-end p-1">
          <p class="text-xs">initial estimate:</p>
          <p class="text-blue-900 font-bold text-lg">{{currencyname + ' ' + currencysymbol + total.toFixed(0) + '.'}}<span class="text-xs">{{(total % 1).toFixed(2).substring(2)}}</span> </p>
          <button class="bg-blue-500 text-white px-8 py-1" @click="getStep3()">Book Now</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
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
      // puloc() {
      //   let location
      //   let typeid = this.data.vehiclecategorytypeid
      //   this.allData.locationfees.forEach(function(el){
      //     if (el.vehiclecategorytypeid == typeid && el.loctype == 'pickup') {
      //       location = el
      //     }
      //   })
      //   return location
      // },
      // doloc() {
      //   let location
      //   let typeid = this.data.vehiclecategorytypeid
      //   this.allData.locationfees.forEach(function(el){
      //     if (el.vehiclecategorytypeid == typeid && el.loctype == 'dropoff') {
      //       location = el
      //     }
      //   })
      //   return location
      // },
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
          'ageid': 9,
          'vehiclecategoryid': this.data.vehiclecategoryid
        })
        let data = await this.apiCall(params)
        this.step3 = data
      },
      async signRequest(method) {
        let signString = await fetch("http://localhost:3000/signRequest.php", {
            method: 'POST',
            headers: {
              "content-Type": "text/plain"
            },
            body: method,
          })
          .then(response => response.text())
          .then(data => {
            return JSON.parse(data).signature;
          })
        return signString
      },
      async apiCall(method) {
        let signString = await this.signRequest(method);
        let formdata = new FormData();
        formdata.append("request", method);
        formdata.append("signature", signString);
        let responseData = await fetch("https://apis.rentalcarmanager.com/booking/v3.2?apikey=QXVBbGxSaWRleTUzNFt1bmRlZmluZWRdfE1pY2hhZWxXaWNrZWR8ZXVucGNGdEI=", {
            method: "POST",
            body: formdata,
          })
          .then(response => response.text())
          .then(result => {
            return JSON.parse(result)
          })
        return responseData.results
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
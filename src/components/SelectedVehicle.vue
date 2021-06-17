<template>

  <div class=" rounded bg-opacity-90 w-full p-1 flex flex-col gap-3">
    <div class="flex flex-col md:flex-row shadow-xl ">

      <!-- Vehicle Image -->
      <div class="bg-gray-200 w-full md:w-2/5 md:pr-1">
        <img :src="car.imageurl" alt="" class="w-full border">
      </div>

      <!-- Vehicle and Trip Details -->
      <div class="flex flex-col md:w-3/5 justify-center bg-gray-200">
        <div class="flex-shrink pt-4">
          <p class="text-center text-blue-700 font-bold">{{car.categoryfriendlydescription}}</p>
        </div>

        <div class="w-full flex gap-3 items-center text-sm text-gray-500 py-4">

          <div class="text-right flex-grow">
            <p class="uppercase text-sm font-bold text-gray-500 mb-1">Picking Up</p>
            <ul>
              <li>{{this.step3.locationfees[0].location}}</li>
              <li>{{this.step3.locationfees[0].dayofweekname + ' ' + this.step3.locationfees[0].locdate.substring(1, this.step3.locationfees[0].locdate.length - 4) + ' ' + this.step3.locationfees[0].loctime}}</li>
              
            </ul>
          </div>
          <div class="flex-shrink grid place-items-center">
            <div class="grid grid-flow-col place-items-center">
              <i class="fal fa-ellipsis-h mr-0.5"></i> <i class="fal fa-arrow-right"></i>
            </div>

          </div>
          <div class="text-left flex-grow ">
            <p class="uppercase text-sm font-bold text-gray-500 mb-1">Dropping Off</p>
            <ul>
              <li>{{this.step3.locationfees[1].location}}</li>
              <li>{{this.step3.locationfees[1].dayofweekname + ' ' + this.step3.locationfees[1].locdate.substring(1, this.step3.locationfees[1].locdate.length - 4) + ' ' + this.step3.locationfees[1].loctime}}</li>

            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Mandatory Fees and Total Rate -->
    <div class="flex gap-3">
      <div class="w-2/5 text-left p-1 px-2 border text-sm bg-white shadow-xl">
        <p class="font-bold">Daily Rental Rate:</p>
        <div class="flex justify-between py-2">
          <span>
            {{ this.step3.seasonalrates[0].numberofdays + " days @ $" + this.step3.seasonalrates[0].dailyrateafterdiscount}}
          </span>
          <span class="w-12">{{"$" + this.step3.seasonalrates[0].ratesubtotal }}</span>
        </div>
        <p class="font-bold">Extra Fees:</p>
        <div class="py-2">
          <div v-for="(fee, i) in getFeeOfType('Daily')" :key="i" class="flex justify-between">
          <span><i class='fas fa-plus-circle '></i>
            {{fee["name"] + " @ " + currencysymbol + parseFloat(fee["fees"]).toFixed(0) + " per day"}}</span>
          <span class="w-12">{{currencysymbol + parseFloat(fee["totalfeeamount"]).toFixed(0)}}</span>
        </div>
        <div v-for="(fee, i) in getFeeOfType('Fixed')" :key="i" class="flex justify-between">
          <span><i class='fas fa-plus-circle '></i>
            {{ fee["name"]}}</span>
          <span class="w-12">{{ currencysymbol + parseFloat(fee["totalfeeamount"]).toFixed(0)}}</span>
        </div>
        <div v-for="(fee, i) in getFeeOfType('Percentage')" :key="i" class="flex justify-between">
          <span>
            <i class='fas fa-plus-circle '></i>
            {{  fee["name"]}}
          </span>
          <span class="w-12">{{currencysymbol + parseFloat(fee["totalfeeamount"]).toFixed(0)}}</span>
        </div>
        </div>        
      </div>

      <!-- Optional Fees -->
      <div class="w-3/5 border bg-white shadow-xl text-left p-1 px-2 text-sm">
        <p class="font-bold">Damage Cover Options:</p>
        <div class="py-3">
          <div class="flex flex-col" v-for="(damage, i) in this.step3.insuranceoptions">
            <div class="flex items-center mb-1">
              <input type="radio" class="mr-1"><span>{{damage.name}}</span>
            </div>
           <p class="pl-4 text-gray-500">{{damage.feedescription}}</p>
        </div>
        </div>
        
      </div>
    </div>
  </div>
  <div class="bg-white shadow-xl rounded bg-opacity-90 w-full p-1 mt-20">
    <div>
      <p>{{car}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      step3: Object
    },
    computed: {
      car() {
        return this.step3.availablecars[0]
      },
      currencysymbol() {
        return this.step3.locationfees[0].currencysymbol
      }
    },
    methods: {
      getFeeOfType(type) {
        let arr = []
        this.step3.mandatoryfees.forEach(function (el) {
          if (el.type == type) {
            arr.push(el)
          }
        })
        return arr
      },
    }
  }
</script>

<style>

</style>
<template>

  <div class=" rounded bg-opacity-90 w-full p-1 flex flex-col gap-3">
    <div class="flex flex-col md:flex-row  gap-3">

      <!-- Vehicle Image -->
      <div class="w-full md:w-2/5 md:pr-1">
        <img :src="this.step3.availablecars[0].imageurl" alt="" class="m-auto">
      </div>

      <!-- Vehicle and Trip Details -->
      <div class="flex flex-col md:w-3/5 justify-center shadow-xl bg-gray-200">
        <div class="flex-shrink pt-4">
          <p class="text-center text-blue-700 font-bold">{{this.step3.availablecars[0].categoryfriendlydescription}}</p>
        </div>

        <div class="w-full flex gap-3 items-center text-sm text-gray-500 py-4">

          <div class="text-right flex-grow">
            <p class="uppercase text-sm font-bold text-gray-500 mb-1">Picking Up</p>
            <ul>
              <li>{{this.step3.locationfees[0].location}}</li>
              <li>{{this.step3.locationfees[0].dayofweekname + ' ' + this.step3.locationfees[0].locdate.substring(0, this.step3.locationfees[0].locdate.length - 4) + ' ' + this.step3.locationfees[0].loctime}}</li>

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
              <li>{{this.step3.locationfees[1].dayofweekname + ' ' + this.step3.locationfees[1].locdate.substring(0, this.step3.locationfees[1].locdate.length - 4) + ' ' + this.step3.locationfees[1].loctime}}</li>

            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Mandatory Fees and Total Rate -->
    <div class="flex flex-col md:flex-row gap-3 items-start justify-items-start">
      <div class="w-full md:w-2/5 text-left border text-sm shadow-xl">
        <div class="bg-white px-2 py-1">
          <p class="font-bold">Daily Rental Rate:</p>
          <div class="flex justify-between py-2">
            <span>
              {{ this.step3.seasonalrates[0].numberofdays + " days @ " + currencysymbol + this.step3.seasonalrates[0].dailyrateafterdiscount}}
            </span>
            <span class="w-14 font-bold">{{currencysymbol + this.step3.seasonalrates[0].ratesubtotal.toFixed(2) }}</span>
          </div>

          <!-- EXTRAS -->
          <div >
            <div v-if="totals.mandatory.length || totals.optional.length">
              <p class="font-bold">Fees:</p>
              <div v-for="fee in totals.optional" class="flex justify-between">
                <span>{{fee.name}}</span><span class="font-bold w-14">{{currencysymbol + fee.total.toFixed(2)}}</span>
              </div>
              
              <div v-for="fee in totals.damage" class="flex justify-between">
                <span>Damage Cover</span><span class="font-bold w-14">{{currencysymbol + fee.total.toFixed(2)}}</span>
              </div>
              <div v-for="fee in totals.kms" class="flex justify-between">
                <span>Km Charges</span><span class="font-bold w-14">{{currencysymbol + fee.total.toFixed(2)}}</span>
              </div>
              <div v-for="fee in totals.mandatory" class="flex justify-between">
                <span>{{fee.name}}</span><span class="font-bold w-14">{{currencysymbol + fee.total.toFixed(2)}}</span>
              </div>
              <br><br>
            </div>
          </div>
        </div>

        <!-- CALCULATED TOTAL -->
        <div v-if="totals.all.length > 0" class="bg-gray-200 p-2">
          <div class="flex justify-end text-lg mb-2">
            <span class="font-bold">TOTAL: </span>
            <span v-if="calculating" class="w-24 text-right grid place-items-center justify-items-end">
              <spinner></spinner>
            </span>
            <span v-else class="w-24 text-right">{{currencysymbol + totals.all[totals.all.findIndex(el => el.name === "TOTAL")].total}}</span>

          </div>
          <div class="text-right italic" v-if="totals.tax[0].total">
            <span>includes GST of:</span><span>{{' ' + currencysymbol + totals.tax[0].total}}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="w-full md:w-3/5 border bg-white shadow-xl text-left p-1 px-2 text-sm">
        <!-- Damage Cover -->
        <p class="font-bold">Damage Cover:</p>
        <div class="py-3">
          <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" :class="{'selected': damage.id == insurance}" v-for="damage in this.step3.insuranceoptions">
            <div class="">
              <input type="radio" :checked="damage.isdefault" class="mr-1 hidden" :value="damage.id" v-model="insurance" :id="'damage' + damage.id">
              <label :for="'damage' + damage.id" class="">
                <div class="flex justify-between">
                  <span>{{damage.name}}</span>
                  <p class="font-bold price">{{currencysymbol + damage.fees}}<span class="text-xs font-normal">/day</span></p>
                </div>
                <p v-if="damage.feedescription" class="">{{damage.feedescription}}</p>
              </label>
            </div>
          </div>
        </div>

        <!-- Extras -->
        <p v-if="step3.optionalfees.length > 0" class="font-bold">Extras:</p>
        <div v-if="step3.optionalfees.length > 0" class="py-3">
          <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="extra in step3.optionalfees" :class="{'selected': selectedExtras.indexOf(extra.id) != -1}">
            <div class="">
              <input type="checkbox" class="mr-1 hidden" :value="extra.id" v-model="selectedExtras" :id="'extra' + extra.id">
              <label :for="'extra' + extra.id" class="">
                <div class="flex justify-between">
                  <span>{{extra.name}}</span>
                  <p class="font-bold price" v-if="extra.type == 'Percentage'">{{ currencysymbol + extra.totalfeeamount }}</p>
                  <p v-else class="font-bold price"><span>{{currencysymbol + extra.fees}}</span><span v-if="extra.type == 'Daily'" class="text-xs font-normal">/day</span></p>
                </div>
                <p v-if="extra.feedescription" class="">{{extra.feedescription}}</p>
              </label>
            </div>
          </div>
        </div>

        <!-- Kilometres -->
        <p class="font-bold">Kilometre Inclusions:</p>
        <div class="py-3">
          <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="km in this.step3.kmcharges" :class="{'selected': km.id == extrakmsid}">
            <div class="flex items-center">
              <input type="radio" :checked="km.isdefault" class="mr-1 hidden" :value="km.id" v-model="extrakmsid" :id="'km' + km.id">
              <label :for="'km' + km.id" class="flex flex-grow justify-between">
                <span>{{km.description}}</span>
                <span class="font-bold price">{{currencysymbol + km.totalamount}}</span>
              </label>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    <make-booking @submitBooking="submitBooking" :key="count" :optionalfees="optionalfees" :submittedParams="submittedParams" :calcTotals="calcTotals"></make-booking>
  </div>
</template>

<script>
import Mixins from '../Mixins'
  import Spinner from './Spinner.vue'
  import MakeBooking from './MakeBooking.vue'
  export default {
    components: {
      Spinner, MakeBooking
    },
    data() {
      return {
        count: 1,
        calculating: true,
        insurance: 0,
        extrakmsid: 0,
        selectedExtras: [],
        totals: {
          all: [],
          daily: [],
          mandatory: [],
          optional: [],
          damage: [],
          kms: [],
          total: [],
          tax: [],
        }
      }
    },
    watch: {
      'calcTotals': function() {
        this.getTotals()
        this.count++
      }
    },
    props: {
      step3: Object,
      submittedParams: Object
    },
    mixins: [Mixins],
    computed: {
      currencysymbol() {
        return this.step3.locationfees[0].currencysymbol
      },
      mandatoryfees() {
        let arr = []
        this.step3.mandatoryfees.forEach(function (el) {
          arr.push({
            'id': el.id,
            'qty': el.qty
          })
        })
        return arr
      },
      optionalfees() {
        let arr = []
        let selected = this.selectedExtras
        this.step3.optionalfees.forEach(function (el) {
          if (selected.indexOf(el.id) >= 0) {
            // TODO implement quantity for optional fees
            arr.push({
              'id': el.id,
              'qty': 1
            })
          }
        })
        return arr
      },
      calcTotals() {
        return {
          "method": "calctotal",
          "pickuplocationid": this.submittedParams.pickuplocationid,
          "pickupdate": this.submittedParams.pickupdate,
          "vehiclecategoryid": this.step3.availablecars[0].vehiclecategoryid,
          "numberofdays": this.step3.availablecars[0].numberofdays,
          "totalrateafterdiscount": this.step3.availablecars[0].totalrateafterdiscount,
          "freedaysamount": this.step3.availablecars[0].freedaysamount,
          "insuranceid": this.insurance,
          "extrakmsid": this.extrakmsid,
          "mandatoryfees": this.mandatoryfees,
          "optionalfees": this.optionalfees
        }
      },      
    },
    mounted() {
      let insuranceid = this.step3.insuranceoptions[0].id    
        this.step3.insuranceoptions.forEach(function (el) {
        if (el.isdefault) {
          insuranceid = el.id
        }
      })        
      
      this.insurance = insuranceid
      let kmid
      this.step3.kmcharges.forEach(function (el) {
        if (el.isdefault) {
          kmid = el.id
        }
      })
      this.extrakmsid = kmid
    },
    methods: {
      submitBooking(e) {
        Mixins.methods.apiCall(JSON.stringify(e)).then(res => {
          console.log(res)
        })
      },
      getTotals() {
        this.calculating = true
        Mixins.methods.apiCall(JSON.stringify(this.calcTotals)).then(res => {
          this.totals.all = res.totals
          this.totals.daily = this.getTotalOfType(res.totals, 'total rate')
          this.totals.mandatory = this.getTotalOfType(res.totals, 'mandatory')
          this.totals.optional = this.getTotalOfType(res.totals, 'optional')
          this.totals.damage = this.getTotalOfType(res.totals, 'insurance')
          this.totals.kms = this.getTotalOfType(res.totals, 'kmsrate')
          this.totals.tax = this.getTotalOfType(res.totals, 'country tax')
          this.calculating = false
        })
      },
      getTotalOfType(list, type) {
        let arr = []
        list.forEach(function (el) {
          if (el.type == type) {
            arr.push(el)
          }
        })
        return arr
      },
    }
  }
</script>

<style lang="postcss">
  @layer components {
    .selected {
      @apply border-opacity-100 bg-gray-200 text-blue-900
    }
  }

  .price {
    opacity: .5
  }

  .selected .price {
    opacity: 1
  }
</style>
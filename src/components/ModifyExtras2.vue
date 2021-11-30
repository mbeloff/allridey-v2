<template>
  <div class="flex flex-col md:flex-row gap-3 items-start">
    <!-- LEFT SIDE -->
    <div class="w-full md:w-2/6 order-2 md:order-1 px-1">
      <section-summary :resref="resref" :totals="totals" :bookingdata="bookingdata"></section-summary>
    </div>
    <!-- RIGHT SIDE -->
    <div class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2 p-2 md:p-5 bg-white rounded">
      <div class="relative text-left text-sm" v-if="gotOptions">
        <!-- Kilometres -->
        <div class="mb-4">
          <p class="font-bold mb-4 text-xl">Damage Cover:</p>
          <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="extra in options.insuranceoptions.filter(el=>el.totalinsuranceamount >= currentinsurance.totalfeeamount)" :class="{'selected': extra.id == insurancefee.id}">
            <div class="flex items-center">
              <input type="radio" :checked="extra.id == insurancefee.id" class="mr-1 hidden" :value="extra" v-model="insurancefee" :id="'dc' + extra.id">
              <label :for="'dc' + extra.id" class="fee w-full">
                <div class="flex">
                  <span class="fee-name">{{extra.feedescription}} <i v-show="locked(extra.id, 'insurance')" class="fas fa-lock-alt"></i></span>
                  <div class="flex items-center font-bold"><i class="fas fa-plus-circle mr-2"></i>{{ symbol + extra.fees}} <span class="text-xs font-normal">/day</span> </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <p class="font-bold mb-4 text-xl">Kilometre Inclusions:</p>
          <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="extra in options.kmcharges.filter(el=>el.totalamount >= bookingdata.bookinginfo[0].kmcharges_totalfordailyrate)" :class="{'selected': extra.id == selectedkm}">
            <div class="flex items-center">
              <input type="radio" :checked="extra.id == selectedkm" class="mr-1 hidden" :value="extra.id" v-model="selectedkm" :id="'km' + extra.id">
              <label :for="'km' + extra.id" class="fee w-full">
                <div class="flex">
                  <span class="fee-name">{{extra.description}} <i v-show="locked(extra.id, 'kms')" class="fas fa-lock-alt"></i></span>
                  <div class="flex items-center font-bold"><i class="fas fa-plus-circle mr-2"></i>{{ symbol + extra.dailyrate}} <span class="text-xs font-normal">/day</span> </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <p class="font-bold mb-4 text-xl">Optional Extras:</p>
          <div class="flex mb-1" v-for="extra in options.optionalfees">
            <div v-if="extra.qtyapply && extra.selected" class="flex flex-col justify-around items-center w-8" :class="{'opacity-50': !extra.selected}">
              <i @click="incQty(extra)" class="grid place-items-center far fa-plus fa-fw py-1 w-6 h-5 text-center rounded bg-blue-900 text-white"></i>
              <input type="text" disabled v-model="extra.qty" class="w-6 text-center">
              <i @click="decQty(extra)" class="grid place-items-center far fa-minus fa-fw py-1 w-6 h-5 text-center rounded bg-blue-900 text-white"></i>
            </div>
            <div class="flex flex-col flex-grow p-1 border border-opacity-0 rounded" :class="{'selected': extra.selected == true}">
              <input type="checkbox" class="mr-1 hidden" v-model="extra.selected" :disabled="locked(extra.id, 'optional')" :id="'extra' + extra.id">
              <label :for="'extra' + extra.id" class="fee">
                <div class="flex justify-between">
                  <span class="fee-name">{{extra.name}} <i v-show="locked(extra.id, 'optional')" class="ml-2 fas fa-lock-alt"></i></span>

                  <p class="font-bold price" v-if="extra.type == 'Percentage'">{{ symbol + extra.totalfeeamount }}</p>
                  <div v-else class="font-bold price">
                    <span><i class="fas fa-plus-circle mr-2"></i>{{symbol + extra.fees}}</span>
                    <span v-if="extra.type == 'Daily'" class="text-xs font-normal">/day</span>
                  </div>
                </div>
                <p v-if="extra.feedescription" class="fee-description">{{extra.feedescription}}</p>
              </label>
            </div>
          </div>
        </div>

        <div class="flex w-full h-8">
          <button @click="$emit('saveChanges')" class="btn-green ml-auto">save changes <i class="far fa-cloud-upload"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  import SectionSummary from './SectionSummary2.vue'
  export default {
    components: {
      SectionSummary
    },
    mixins: [Mixins],
    props: {
      bookingdata: Object,
      insuranceid: Number,
      initialtotals: Array,
      customer: Object,
      resref: String,
    },
    watch: {},
    data() {
      return {
        gotOptions: false,
        options: {},
        insurancefee: 0,
        selectedkm: 0,
        totals: []
      }
    },
    computed: {
      symbol() {
        return this.bookingdata.bookinginfo[0].currencysymbol
      },
      currentinsurance(){
        return this.bookingdata.extrafees.find(el=>el.isinsurancefee)
      },
    },
    created() {
      this.getOptions()
      this.bookingdata.extrafees.forEach(el => {
        if (el.isinsurancefee) {
          this.insurancefee = el
        }
      })
      this.selectedkm = this.bookingdata.bookinginfo[0].kmcharges_id
    },
    mounted() {
    },
    methods: {
      incQty(fee) {
        if (fee.qty < 10) {
          fee.qty++
        }
      },
      decQty(fee) {
        if (fee.qty > fee.qtyinit) {
          fee.qty--
        }
      },
      locked(id, type) {
        if (type == 'optional') {
          return this.bookingdata.extrafees.find(el => el.extrafeeid == id)
        }

        if (type == 'insurance') {
          let arr = this.options.insuranceoptions.filter(el=>el.totalinsuranceamount >= this.currentinsurance.totalfeeamount)
          if (arr.length == 1) {
            return true
          } else return false
        }

        if (type == 'kms') {
          let arr = this.options.kmcharges.filter(el=>el.totalamount >= this.bookingdata.bookinginfo[0].kmcharges_totalfordailyrate)
          if (arr.length == 1) {
            return true
          }
        }
      },
      getOptions() {
        this.gotOptions = false
        let method = JSON.stringify({
          "method": "bookingoptions",
          "reservationref": this.resref
        });
        Mixins.methods.postapiCall(method)
          .then(results => {
            this.options = results.results
            delete this.options.countries
            delete this.options.rentalsource
            this.options.optionalfees.forEach(el => {
              el.selected = undefined
              el.qty = 1
              el.qtyinit = 1
              this.bookingdata.extrafees.forEach(x => {
                if (x.extrafeeid == el.id) {
                  el.selected = true
                  el.qty = x.qty
                  el.qtyinit = x.qty
                }
              })
            })
            this.options.insuranceoptions.forEach(el => {
              if (el.id == this.insuranceid) {
                this.insurancefee = el
              }
            })
            // this.initialOptions = JSON.parse(JSON.stringify(this.options))
            this.calcTotal()
            this.gotOptions = true
          })
      },
      selectedOptions() {
        let arr = []
        this.options.optionalfees.forEach(el=>{
          if (el.selected) {
            arr.push({id: el.id, qty: el.qty})
          }
        })
        console.log(arr)
        return arr
      },
      mandatoryFees() {
        let arr = []
        this.bookingdata.extrafees.forEach(el=>{
          if (el.isoptionalfee == false) {
            arr.push({id: el.extrafeeid, qty: el.qty})
          }
        })
        console.log(arr)
        return arr
      },
      calcTotal() {
        this.loading = true;
        let method = JSON.stringify({
          "method": "calctotal",
          "pickuplocationid": this.bookingdata.bookinginfo[0].pickuplocationid,
          "pickupdate": this.bookingdata.bookinginfo[0].pickupdate,
          "vehiclecategoryid": this.bookingdata.bookinginfo[0].vehiclecategoryid,
          "numberofdays": this.bookingdata.bookinginfo[0].numberofdays,
          "totalrateafterdiscount": this.bookingdata.rateinfo[0].ratesubtotal,
          "freedaysamount": 0,
          "insuranceid": this.insurancefee.id,
          "extrakmsid": this.selectedkm,
          "mandatoryfees": this.mandatoryFees(),
          "optionalfees": this.selectedOptions(),
          "reservationref": this.bookingdata.bookinginfo[0].reservationref
        })
        Mixins.methods.postapiCall(method)
          .then(res => {
            this.loading = false
            console.log(res)
            if (res.status == 'OK') {
              this.totals = res.results.totals
              this.ready = true
            } else if (res.status == 'ERR') {
              throw res.error
            }
          })
      },
    }
  }
</script>
<style>

</style>
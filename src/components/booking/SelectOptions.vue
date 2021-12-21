<template>
  <div class="rounded bg-opacity-90 w-full p-1 flex flex-col gap-5">
    <!-- Vehicle and Trip Details -->
    <div class="flex flex-col md:w-full justify-center shadow-xl shadow-black/5 bg-gray-200 rounded">
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

    
    <div class="flex flex-col md:flex-row gap-5 items-start justify-items-start">
    <!-- // ? LEFT SIDE -->
      <div class="w-full md:w-2/6 text-left text-sm shadow-xl">
        <!-- Vehicle Image -->
        <img v-if="!gallery.length" class="object-contain object-center mx-auto rounded" :src="this.step3.availablecars[0].imageurl" alt="">
        <keen-slider v-if="gallery.length" :slides="gallery" class="rounded-t"></keen-slider>          

        <div class="bg-white px-2 py-1 ">
          <p class="font-bold">Daily Rental Rate:</p>
          <p v-if="step3.availablecars[0].discountname" class="bg-green-500 text-white text-center">discount applied: {{step3.availablecars[0].discountname}}</p>
          <div class="flex justify-between">
            <span>
              {{ step3.seasonalrates[0].numberofdays + " days @ " + currencysymbol + step3.seasonalrates[0].dailyrateafterdiscount}}
            </span>
            <span class="w-14 font-bold">{{currencysymbol + step3.seasonalrates[0].ratesubtotal.toFixed(2) }}</span>            
          </div>
          
          <!-- //? EXTRAS -->
          <div class="mt-2">
            <div v-if="totals.mandatory.length || totals.optional.length">
              <p class="font-bold">Fees:</p>
              <div v-for="fee in totals.optional" class="flex justify-between">
                <span>{{fee.name}}</span><span v-if="fee.qty > 1" class="mr-auto ml-3">x {{fee.qty}}</span><span class="font-bold w-14">{{currencysymbol + fee.total.toFixed(2)}}</span>
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
              <br>
            </div>
          </div>
        </div>

        <!-- // ? CALCULATED TOTAL -->
        <div v-if="totals.all.length > 0" class="bg-blue-900 text-white p-2 rounded-b">
          <div class="flex justify-end text-lg mb-2">
            <span class="font-bold">TOTAL: </span>
            <span v-if="calculating" class="w-24 text-right grid place-items-center justify-items-end">
              <spinner></spinner>
            </span>
            <span v-else class="w-24 text-right">{{currencysymbol + totals.all[totals.all.findIndex(el => el.name === "TOTAL")].total}}</span>

          </div>
          <div class="text-right italic" v-if="totals.tax[0].total">
            <span v-for="tax in totals.tax">{{ tax.name.replace('include', 'incl.') }} of:</span><span>{{' ' + currencysymbol + totals.tax[0].total}}</span>
          </div>
        </div>
      </div>

      <!-- // ? RIGHT SIDE -->
      <div class="w-full md:w-4/6 bg-white shadow-xl text-left p-1 px-2 md:px-5 text-sm py-5 rounded">
        <!-- Damage Cover -->
        <div class="mb-4" v-if="this.step3.insuranceoptions.length">
          <p class="font-bold text-xl mb-4">Damage Cover:</p>
          <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" :class="{'selected': damage.id == insurance}" v-for="damage in this.step3.insuranceoptions">

            <input type="radio" :checked="damage.isdefault" class="mr-1 hidden" :value="damage.id" v-model="insurance" :id="'damage' + damage.id">
            <label :for="'damage' + damage.id" class="fee">
              <div class="flex justify-between">
                <span class="fee-name">{{damage.name}}</span>

                <p class="font-bold price"><i class="fas fa-plus-circle mr-2"></i>{{currencysymbol + damage.fees}}<span class="text-xs font-normal">/day</span></p>
              </div>
              <p v-if="damage.feedescription1" class="fee-description" v-html="damage.feedescription1"></p>
            </label>
          </div>
        </div>
        


        <!-- Extras -->

        <div v-if="optionalfees.length > 0" class="mb-4">
          <p class="font-bold mb-4 text-xl">Extras:</p>
          <div class="flex mb-1" v-for="extra in optionalfees">
            <div v-if="extra.sel && extra.qtyapply" class="flex flex-col justify-around items-center w-8">
              <i @click="incQty(extra)" class="grid place-items-center far fa-plus fa-fw py-1 w-6 h-5 text-center rounded bg-blue-900 text-white"></i>
              <input type="text" disabled v-model="extra.qty" class="w-6 text-center">
              <i @click="decQty(extra)" class="grid place-items-center far fa-minus fa-fw py-1 w-6 h-5 text-center rounded bg-blue-900 text-white"></i>
            </div>
            <div class="flex flex-col flex-grow p-1 border border-opacity-0 rounded" :class="{'selected': extra.sel == true}">
              <input type="checkbox" class="mr-1 hidden" v-model="extra.sel" :id="'extra' + extra.id">
              <label :for="'extra' + extra.id" class="fee">
                <div class="flex justify-between">
                  <span class="fee-name">{{extra.name}}</span>

                  <p class="font-bold price" v-if="extra.type == 'Percentage'">{{ currencysymbol + extra.totalfeeamount }}</p>
                  <div v-else class="font-bold price">
                    <span><i class="fas fa-plus-circle mr-2"></i>{{currencysymbol + extra.fees*extra.qty}}</span>
                    <span v-if="extra.type == 'Daily'" class="text-xs font-normal">/day</span>
                  </div>
                </div>
                <p v-if="extra.feedescription" class="fee-description">{{extra.feedescription}}</p>
              </label>
            </div>
          </div>
        </div>

        <!-- Kilometres -->
        <p class="font-bold mb-4 text-xl">Kilometre Inclusions:</p>
        <div class="mb-4">
          <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="km in this.step3.kmcharges" :class="{'selected': km.id == extrakmsid}">
            <div class="flex items-center">
              <input type="radio" :checked="km.isdefault" class="mr-1 hidden" :value="km.id" v-model="extrakmsid" :id="'km' + km.id">
              <label :for="'km' + km.id" class="fee w-full">
                <div class="flex">
                  <span class="fee-name">{{km.description}}</span>
                  <span class="price"><i class="fas fa-plus-circle mr-2"></i>{{currencysymbol + km.totalamount}}</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <make-booking @create-booking="createBooking" @modeChange="changeMode" :key="count" :optionalfees="optionalfees" :searchParams="searchParams" :calcTotals="calcTotals" :step3="step3"></make-booking>
  </div>
</template>

<script>
import KeenSlider from '@/components/Gallery.vue'
  import Mixins from '@/Mixins'
  import Spinner from '@/components/Spinner.vue'
  import MakeBooking from '@/components/booking/MakeBooking.vue'
  export default {
    components: {
      Spinner,
      MakeBooking,
      KeenSlider
    },
    data() {
      return {
        pleaseWait: false,
        count: 1,
        calculating: true,
        insurance: 0,
        extrakmsid: 0,
        optionalfees: [],
        gallery: [],
        totals: {
          all: [],
          daily: [],
          mandatory: [],
          optional: [],
          damage: [],
          kms: [],
          total: [],
          tax: [],
        },
        gotBooking: false,
        mode: undefined,
        ref: undefined
      }
    },
    watch: {
      'calcTotals': function () {
        this.getTotals()
        this.count++
      },
      'ref': function (ref) {
        if (ref && this.mode) {
          this.bookingMade()
        }
      }
    },
    mixins: [Mixins],
    computed: {
      step3() {
        return this.$store.state.step3
      },
      searchParams() {
        return this.$store.state.searchParams
      },
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
      selectedExtras() {
        let arr = []
        this.optionalfees.forEach(function (el) {
          if (el.sel) {
            arr.push({
              'id': el.id,
              'qty': el.qty
            })
          }
        })
        return arr
      },
      calcTotals() {
        return {
          "method": "calctotal",
          "pickuplocationid": this.searchParams.pickuplocationid,
          "pickupdate": this.searchParams.pickupdate,
          "vehiclecategoryid": this.step3.availablecars[0].vehiclecategoryid,
          "numberofdays": this.step3.availablecars[0].numberofdays,
          "totalrateafterdiscount": this.step3.availablecars[0].totalrateafterdiscount,
          "freedaysamount": this.step3.availablecars[0].freedaysamount,
          "insuranceid": this.insurance,
          "extrakmsid": this.extrakmsid,
          "mandatoryfees": this.mandatoryfees,
          "optionalfees": this.selectedExtras
        }
      },
    },
    mounted() {
      if (this.step3.insuranceoptions.length){
      let insuranceid = this.step3.insuranceoptions[0].id
      this.step3.insuranceoptions.forEach(function (el) {
        if (el.isdefault) {
          insuranceid = el.id
        }
      })

      this.insurance = insuranceid
      }
     
      let kmid
      this.step3.kmcharges.forEach(function (el) {
        if (el.isdefault) {
          kmid = el.id
        }
      })
      this.extrakmsid = kmid

      let arr = []
      this.step3.optionalfees.forEach(function (el) {
        let obj = el
        obj.sel
        obj.qty = 1
        arr.push(obj)
      })
      this.optionalfees = arr
      this.getGallery()
    },
    methods: {
      getGallery() {
        let catid = this.step3.availablecars[0].vehiclecategoryid
        let baseimg = this.step3.availablecars[0].imageurl
        let Host =
          import.meta.env.VITE_HOST
        let baseurl = 'https://res.cloudinary.com/allridey/image/upload/'
        let transform = 'f_auto,q_auto/c_fill,h_295,w_563/'
        let raw = JSON.stringify({
          "catid": catid
        });
        let requestOptions = {
          method: 'POST',
          body: raw,
          redirect: 'follow'
        };
        fetch(Host + "/.netlify/functions/getGallery", requestOptions)
          .then(response => response.text())
          .then(res => JSON.parse(res))
          .then(files => {           
            files.forEach(el => this.gallery.unshift(baseurl + transform + el + '.jpg'))
            this.gallery.unshift(baseimg)
          })
          .catch(error => console.log('error', error))
      },
      changeMode(e) {
        this.mode = e
        this.$forceUpdate()
      },
      incQty(el) {
        let max = 10
        if (el.qty < max) {
          el.qty++
        }
      },
      decQty(el) {
        if (el.qty > 1) {
          el.qty--
        }
      },
      createBooking() {
        Mixins.methods.apiCall(JSON.stringify(this.$store.state.bookingparams)).then(data => {
          this.$store.dispatch('resinfo', JSON.parse(JSON.stringify(data)))
          this.ref = JSON.parse(JSON.stringify(data)).reservationref         
        })
        
      },
      bookingMade() {
        this.$emit('bookingMade', this.mode, this.ref)
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

    .selected {
      @apply border-opacity-100 bg-gray-200
    }

    .selected .fee {
      @apply text-blue-900 divide-gray-300 opacity-100
    }

    .fee {
      @apply divide-y divide-gray-200 opacity-50
    }

    .fee-name {
      @apply py-1 tracking-tight flex-1
    }

    .price {
      @apply py-1 font-bold w-20
    }

    .fee-description {
      @apply pl-2 pt-1.5
    }

</style>
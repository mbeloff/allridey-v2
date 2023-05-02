<template>
  <div class="flex flex-col w-full gap-5 p-1 rounded bg-opacity-90">
    <!-- Vehicle and Trip Details -->
    <div
      class="flex flex-col justify-center bg-gray-200 rounded shadow-xl md:w-full shadow-black/5"
    >
      <div class="flex-shrink pt-4">
        <p class="font-bold text-center text-blue-700">
          {{ step3.availablecars[0].categoryfriendlydescription }}
        </p>
      </div>

      <div class="flex items-center w-full gap-3 py-4 text-sm text-gray-500">
        <div class="flex-grow text-right">
          <p class="mb-1 text-sm font-bold text-gray-500 uppercase">
            Picking Up
          </p>
          <ul>
            <li>{{ step3.locationfees[0].location }}</li>
            <li>
              {{
                step3.locationfees[0].dayofweekname +
                ' ' +
                step3.locationfees[0].locdate.substring(
                  0,
                  step3.locationfees[0].locdate.length - 4
                ) +
                ' ' +
                tConvert(step3.locationfees[0].loctime)
              }}
            </li>
          </ul>
        </div>
        <div class="grid flex-shrink place-items-center">
          <div class="grid grid-flow-col place-items-center">
            <i class="fal fa-ellipsis-h mr-0.5"></i>
            <i class="fal fa-arrow-right"></i>
          </div>
        </div>
        <div class="flex-grow text-left">
          <p class="mb-1 text-sm font-bold text-gray-500 uppercase">
            Dropping Off
          </p>
          <ul>
            <li>{{ step3.locationfees[1].location }}</li>
            <li>
              {{
                step3.locationfees[1].dayofweekname +
                ' ' +
                step3.locationfees[1].locdate.substring(
                  0,
                  step3.locationfees[1].locdate.length - 4
                ) +
                ' ' +
                tConvert(step3.locationfees[1].loctime)
              }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col items-start gap-5 md:flex-row justify-items-start"
    >
      <!-- // ? LEFT SIDE -->
      <div class="w-full text-sm text-left shadow-xl md:w-2/6">
        <!-- Vehicle Image -->
        <img
          v-if="!gallery.length"
          class="object-contain object-center mx-auto rounded"
          :src="'https:' + step3.availablecars[0].imageurl"
          alt=""
        />
        <keen-slider
          v-if="gallery.length"
          :slides="gallery"
          class="rounded-t"
        ></keen-slider>
        <div class="relative">
          <loading-overlay v-if="calculating"></loading-overlay>
          <div class="py-1 bg-white">
            <p class="px-2 font-bold">Daily Rental Rate:</p>
            <p
              v-if="step3.availablecars[0].totaldiscountamount > 0"
              class="text-center text-white bg-green-500"
            >
              discount of ${{
                step3.availablecars[0].totaldiscountamount
              }}
              applied ({{ step3.availablecars[0].discountname }})
            </p>
            <div class="flex justify-between px-2">
              <span>
                {{
                  step3.seasonalrates[0].numberofdays +
                  ' days @ ' +
                  currencysymbol +
                  step3.seasonalrates[0].dailyrateafterdiscount
                }}
              </span>
              <span class="font-bold w-14">{{
                currencysymbol + step3.seasonalrates[0].ratesubtotal.toFixed(2)
              }}</span>
            </div>

            <!-- //? EXTRAS -->
            <div class="px-2 mt-2">
              <div v-if="totals.mandatory.length || totals.optional.length">
                <p class="font-bold">Fees:</p>
                <div
                  v-for="fee in totals.optional"
                  :key="fee.id"
                  class="flex justify-between"
                >
                  <span>{{ fee.name }}</span
                  ><span v-if="fee.qty > 1" class="ml-3 mr-auto"
                    >x {{ fee.qty }}</span
                  ><span class="font-bold w-14">{{
                    currencysymbol + fee.total.toFixed(2)
                  }}</span>
                </div>

                <div
                  v-for="fee in totals.damage"
                  :key="fee.id"
                  class="flex justify-between"
                >
                  <span>Damage Cover</span
                  ><span class="font-bold w-14">{{
                    currencysymbol + fee.total.toFixed(2)
                  }}</span>
                </div>
                <div
                  v-for="fee in totals.kms"
                  :key="fee.id"
                  class="flex justify-between"
                >
                  <span>Km Charges</span
                  ><span class="font-bold w-14">{{
                    currencysymbol + fee.total.toFixed(2)
                  }}</span>
                </div>
                <div
                  v-for="fee in totals.mandatory"
                  :key="fee.id"
                  class="flex justify-between"
                >
                  <span>{{ fee.name }}</span
                  ><span class="font-bold w-14">{{
                    currencysymbol + fee.total.toFixed(2)
                  }}</span>
                </div>
                <br />
              </div>
            </div>
          </div>

          <!-- // ? CALCULATED TOTAL -->
          <div
            v-if="totals.all.length > 0"
            class="relative px-2 py-4 text-white bg-blue-900 rounded-b"
          >
            <div class="flex justify-end text-base">
              <span class="font-bold">TOTAL COST: </span>
              <span class="w-24 text-right">{{
                currencysymbol +
                totals.all[totals.all.findIndex((el) => el.name === 'TOTAL')]
                  .total
              }}</span>
            </div>
            <!-- <div
              v-if="totals.tax[0].total"
              class="text-xs italic text-right"
            >
              <span v-for="tax in totals.tax" :key="tax.id"
                >(includes GST of:
                {{ ' ' + currencysymbol + totals.tax[0].total }})</span
              >
            </div> -->
          </div>
        </div>
      </div>

      <!-- // ? RIGHT SIDE -->
      <div
        class="w-full p-1 px-2 py-5 text-sm text-left bg-white rounded shadow-xl md:w-4/6 md:px-5"
      >
        <!-- Damage Cover -->
        <div v-if="step3.insuranceoptions.length" class="mb-4">
          <p class="mb-4 text-xl font-bold">Damage Cover:</p>
          <div
            v-for="damage in step3.insuranceoptions"
            :key="damage.id"
            class="flex flex-col p-1 mb-1 border border-opacity-0 rounded"
            :class="{ selected: damage.id == insurance }"
          >
            <input
              :id="'damage' + damage.id"
              v-model="insurance"
              type="radio"
              :checked="damage.isdefault"
              class="hidden mr-1"
              :value="damage.id"
            />
            <label :for="'damage' + damage.id" class="fee">
              <div class="flex justify-between">
                <span class="flex-1 py-1 tracking-tight">{{
                  damage.name
                }}</span>
                <p class="font-bold price">
                  <i class="mr-2 fal fa-plus-circle"></i
                  >{{ currencysymbol + damage.fees
                  }}<span class="text-xs font-normal">/day</span>
                </p>
              </div>
              <p
                v-if="damage.feedescription1"
                class="pl-2 pt-1.5"
                v-html="damage.feedescription1"
              ></p>
            </label>
          </div>
        </div>

        <!-- Extras -->

        <div v-if="optionalfees.length > 0" class="mb-4">
          <p class="mb-4 text-xl font-bold">Extras:</p>
          <div v-for="extra in optionalfees" :key="extra.id" class="flex mb-1">
            <div
              v-if="extra.sel && extra.qtyapply"
              class="flex flex-col items-center justify-around w-8"
            >
              <i
                class="grid w-6 h-5 py-1 text-center text-white bg-blue-900 rounded place-items-center fal fa-plus fa-fw"
                @click="incQty(extra)"
              ></i>
              <input
                v-model="extra.qty"
                type="text"
                disabled
                class="w-6 text-center"
              />
              <i
                class="grid w-6 h-5 py-1 text-center text-white bg-blue-900 rounded place-items-center fal fa-minus fa-fw"
                @click="decQty(extra)"
              ></i>
            </div>
            <div
              class="flex flex-col flex-grow p-1 border border-opacity-0 rounded"
              :class="{ selected: extra.sel == true }"
            >
              <input
                :id="'extra' + extra.id"
                v-model="extra.sel"
                type="checkbox"
                class="hidden mr-1"
                :disabled="shuttleDisabled(extra.id)"
              />
              <label :for="'extra' + extra.id" class="fee">
                <div class="flex justify-between">
                  <span class="flex-1 py-1 tracking-tight"
                    >{{ extra.name }}
                    <span v-if="shuttleDisabled(extra.id)"
                      ><i
                        class="ml-1 text-xs fal fa-lock-alt opacity-70"
                      ></i></span
                  ></span>

                  <p v-if="extra.type == 'Percentage'" class="font-bold price">
                    {{ currencysymbol + extra.totalfeeamount }}
                  </p>
                  <div v-else class="font-bold price">
                    <span
                      ><i class="mr-2 fal fa-plus-circle"></i
                      >{{ currencysymbol + extra.fees * extra.qty }}</span
                    >
                    <span
                      v-if="extra.type == 'Daily'"
                      class="text-xs font-normal"
                      >/day</span
                    >
                  </div>
                </div>
                <div>
                  <p
                    v-if="extra.feedescription1"
                    class="pl-2 pt-1.5"
                    v-html="extra.feedescription1"
                  ></p>
                  <p
                    v-if="extra.feedescription2"
                    class="pl-2 pt-1.5"
                    v-html="extra.feedescription2"
                  ></p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Kilometres -->
        <p class="mb-4 text-xl font-bold">Kilometre Inclusions:</p>
        <div class="mb-4">
          <div
            v-for="km in step3.kmcharges"
            :key="km.id"
            class="flex flex-col p-1 mb-1 border border-opacity-0 rounded"
            :class="{ selected: km.id == extrakmsid }"
          >
            <div class="flex items-center">
              <input
                :id="'km' + km.id"
                v-model="extrakmsid"
                type="radio"
                :checked="km.isdefault"
                class="hidden mr-1"
                :value="km.id"
              />
              <label :for="'km' + km.id" class="w-full fee">
                <div class="flex">
                  <span class="flex-1 py-1 tracking-tight">{{
                    km.description
                  }}</span>
                  <span class="price"
                    ><i class="mr-2 fal fa-plus-circle"></i
                    >{{ currencysymbol + km.totalamount }}</span
                  >
                </div>
                <p v-if="km.notes" class="pl-2 pt-1.5" v-html="km.notes"></p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <make-booking
      :key="count"
      :optionalfees="optionalfees"
      :search-params="searchParams"
      :totals-params="totalsParams"
      :step3="step3"
      :shuttle="shuttleSelected"
      @create-booking="setRef"
      @mode-change="changeMode"
    ></make-booking>
  </div>
</template>

<script>
import KeenSlider from '@/components/PhotoGallery.vue'
import Mixins from '@/Mixins'
import MakeBooking from '@/components/booking/MakeBooking.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { mapState } from 'vuex'
export default {
  components: {
    MakeBooking,
    KeenSlider,
    LoadingOverlay,
  },
  mixins: [Mixins],
  emits: ['booking-made'],
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
      ref: undefined,
    }
  },
  computed: {
    ...mapState(['step3', 'searchParams']),
    currencysymbol() {
      return this.step3.locationfees[0].currencysymbol
    },
    mandatoryfees() {
      let arr = []
      this.step3.mandatoryfees.forEach(function (el) {
        arr.push({
          id: el.id,
          qty: el.qty,
        })
      })
      return arr
    },
    shuttleSelected() {
      return this.totals.optional.find((el) =>
        el.name.toLowerCase().includes('shuttle')
      )
        ? true
        : false
    },
    selectedExtras() {
      let arr = []
      this.optionalfees.forEach(function (el) {
        if (el.sel) {
          arr.push({
            id: el.id,
            qty: el.qty,
          })
        }
      })
      return arr
    },
    totalsParams() {
      return {
        method: 'calctotal',
        pickuplocationid: this.searchParams.pickuplocationid,
        pickupdate: this.searchParams.pickupdate,
        vehiclecategoryid: this.step3.availablecars[0].vehiclecategoryid,
        numberofdays: this.step3.availablecars[0].numberofdays,
        totalrateafterdiscount:
          this.step3.availablecars[0].totalrateafterdiscount,
        freedaysamount: this.step3.availablecars[0].freedaysamount,
        insuranceid: this.insurance,
        extrakmsid: this.extrakmsid,
        mandatoryfees: this.mandatoryfees,
        optionalfees: this.selectedExtras,
      }
    },
  },
  watch: {
    totalsParams: function () {
      this.getTotals()
      this.count++
    },
    ref: function (ref) {
      if (ref && this.mode) {
        this.bookingMade()
      }
    },
  },
  mounted() {
    window.scrollTo(0, 0)

    if (this.step3.insuranceoptions.length) {
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
      let baseimg = 'https:' + this.step3.availablecars[0].imageurl
      // let host = import.meta.env.VITE_HOST
      let baseurl = 'https://res.cloudinary.com/allridey/image/upload/'
      let transform = 'f_auto,q_auto/c_fill,h_295,w_563/'
      let raw = JSON.stringify({
        catid: catid,
      })
      let requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow',
      }
      fetch('/.netlify/functions/getGallery', requestOptions)
        .then((response) => response.text())
        .then((res) => JSON.parse(res))
        .then((files) => {
          files.forEach((el) =>
            this.gallery.unshift(baseurl + transform + el + '.jpg')
          )
          this.gallery.unshift(baseimg)
        })
        .catch((error) => console.log('error', error))
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
    setRef() {
      this.ref = this.$store.state.resinfo.reservationref
    },
    bookingMade() {
      this.$emit('booking-made', this.mode, this.ref)
    },
    getTotals() {
      this.calculating = true
      Mixins.methods.apiCall(JSON.stringify(this.totalsParams)).then((res) => {
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
    shuttleDisabled(id) {
      if (id == 111 && this.mandatoryfees.find((el) => el.id == (112 || 113))) {
        return true
      }
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
    tConvert(time) {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1) // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM' // Set AM/PM
        time[0] = +time[0] % 12 || 12 // Adjust hours
      }
      return time.join('') // return adjusted time or original string
    },
  },
}
</script>

<style lang="postcss">
.selected {
  @apply bg-gray-200;
}

.selected .fee {
  @apply text-blue-900 divide-gray-300 opacity-100;
}

.selected .price {
  @apply opacity-100;
}

.fee {
  @apply divide-y divide-gray-200 opacity-80;
}

.price {
  @apply py-1 font-bold w-20 opacity-50;
}
</style>

<template>
  <div class="flex flex-col md:flex-row gap-3 items-start">
    <div
      v-if="modal"
      class="fixed max-w-full w-full h-screen bg-black bg-opacity-70 z-50 top-0 left-0 grid items-center justify-center px-2"
    >
      <div class="rounded-md shadow-4xl bg-white p-2">
        <p class="text-sm p-5">
          Are you sure you want to update your booking? This may not be undone.
        </p>
        <div class="flex gap-2 justify-between">
          <button class="btn-red" @click="modal = false">
            <span class="text-base"
              >cancel <i class="far fa-times-square"></i
            ></span>
          </button>
          <button class="btn-green" @click="editBooking()">
            <span class="text-base"
              >save changes <i class="fal fa-cloud-upload"></i
            ></span>
          </button>
        </div>
      </div>
    </div>
    <!-- LEFT SIDE -->
    <div class="w-full md:w-2/6 order-2 md:order-1 px-1">
      <section-summary
        :resref="resref"
        :totals="totals"
        :bookingdata="bookingdata"
        :loading="loading"
        @save-changes="modal = true"
        @update="$emit('update')"
      ></section-summary>
    </div>
    <!-- RIGHT SIDE -->
    <div
      class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2 p-2 md:p-5 bg-white rounded"
    >
      <div v-if="gotOptions" class="relative text-left text-sm">
        <!-- Damage Cover -->
        <div class="mb-4">
          <p class="font-bold mb-4 text-xl">Damage Cover:</p>
          <div
            v-for="extra in options.insuranceoptions.filter(
              (el) => el.totalinsuranceamount >= initialinsurance.totalfeeamount
            )"
            :key="extra.id"
            class="flex flex-col p-1 mb-1 border border-opacity-0 rounded"
            :class="{ selected: extra.id == insurancefee.id }"
          >
            <div class="flex items-center">
              <input
                :id="'dc' + extra.id"
                v-model="insurancefee"
                type="radio"
                :checked="extra.id == insurancefee.id"
                class="mr-1 hidden"
                :value="extra"
              />
              <label :for="'dc' + extra.id" class="fee w-full">
                <div class="flex">
                  <span class="py-1 tracking-tight flex-1"
                    >{{ extra.feedescription }}
                    <i
                      v-show="locked(extra.id, 'insurance')"
                      class="fas fa-lock-alt opacity-70 text-xs ml-1"
                    ></i
                  ></span>
                  <div class="flex items-center font-bold">
                    <i class="fas fa-plus-circle mr-2"></i
                    >{{ currencysymbol + extra.fees }}
                    <span class="text-xs font-normal">/day</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <!-- Kilometres -->
          <p class="font-bold mb-4 text-xl">Kilometre Inclusions:</p>
          <div
            v-for="km in options.kmcharges.filter(
              (el) =>
                el.totalamount >=
                bookingdata.bookinginfo[0].kmcharges_totalfordailyrate
            )"
            :key="km.id"
            class="flex flex-col p-1 mb-1 border border-opacity-0 rounded"
            :class="{ selected: km.id == selectedkm }"
          >
            <div class="flex items-center">
              <input
                :id="'km' + km.id"
                v-model="selectedkm"
                type="radio"
                :checked="km.id == selectedkm"
                class="mr-1 hidden"
                :value="km.id"
              />
              <label :for="'km' + km.id" class="fee w-full">
                <div class="flex">
                  <span class="py-1 tracking-tight flex-1"
                    >{{ km.description }}
                    <i
                      v-show="locked(km.id, 'kms')"
                      class="fas fa-lock-alt opacity-70 text-xs ml-1"
                    ></i
                  ></span>
                  <div class="py-1 font-bold w-20 opacity-50 price">
                    <i class="fas fa-plus-circle mr-2"></i
                    >{{ currencysymbol + km.totalamount }}
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <p class="font-bold mb-4 text-xl">Optional Extras:</p>
          <div
            v-for="extra in options.optionalfees"
            :key="extra.id"
            class="flex mb-1"
          >
            <div
              v-if="extra.qtyapply && extra.selected"
              class="flex flex-col justify-around items-center w-8"
              :class="{ 'opacity-70 text-xs': !extra.selected }"
            >
              <i
                class="grid place-items-center far fa-plus fa-fw py-1 w-6 h-5 text-center rounded bg-blue-900 text-white"
                @click="incQty(extra)"
              ></i>
              <input
                v-model="extra.qty"
                type="text"
                disabled
                class="w-6 text-center"
              />
              <i
                class="grid place-items-center far fa-minus fa-fw py-1 w-6 h-5 text-center rounded bg-blue-900 text-white"
                @click="decQty(extra)"
              ></i>
            </div>
            <div
              class="flex flex-col flex-grow p-1 border border-opacity-0 rounded"
              :class="{ selected: extra.selected == true }"
            >
              <input
                :id="'extra' + extra.id"
                v-model="extra.selected"
                type="checkbox"
                class="mr-1 hidden"
                :disabled="locked(extra.id, 'optional')"
              />
              <label :for="'extra' + extra.id" class="fee">
                <div class="flex justify-between">
                  <span class="py-1 tracking-tight flex-1"
                    >{{ extra.name }} {{ extra.qtyapply ? 'x ' + extra.qty : ''
                    }}<i
                      v-show="locked(extra.id, 'optional')"
                      class="ml-2 fas fa-lock-alt opacity-70 text-xs"
                    ></i
                  ></span>

                  <p
                    v-if="extra.type == 'Percentage'"
                    class="py-1 font-bold w-20 opacity-50 price"
                  >
                    {{ currencysymbol + extra.totalfeeamount }}
                  </p>
                  <div v-else class="py-1 font-bold w-20 opacity-50 price">
                    <span
                      ><i class="fas fa-plus-circle mr-2"></i
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

        <div class="flex w-full h-8">
          <button class="btn-green ml-auto" @click="modal = true">
            save changes <i class="far fa-cloud-upload"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mixins from '@/Mixins'
import SectionSummary from '@/components/postbooking/BookingSummary.vue'
export default {
  components: {
    SectionSummary,
  },
  mixins: [Mixins],
  props: {
    bookingdata: Object,
    insuranceid: Number,
    initialtotals: Array,
    customer: Object,
    resref: String,
  },
  emits: ['update'],
  data() {
    return {
      gotOptions: false,
      options: {},
      insurancefee: {},
      selectedkm: 0,
      totals: [],
      loading: true,
      modal: false,
    }
  },
  computed: {
    currencysymbol() {
      return this.bookingdata.bookinginfo[0].currencysymbol
    },
    initialinsurance() {
      return this.bookingdata.extrafees.find((el) => el.isinsurancefee)
    },
  },
  watch: {
    bookingdata: {
      handler() {
        this.getOptions()
      },
      deep: true,
    },
    'options.optionalfees': {
      handler(val, oldVal) {
        if (this.gotOptions && oldVal != undefined) {
          this.calcTotal()
        }
      },
      deep: true,
    },
    selectedkm: {
      handler(val, oldVal) {
        if (this.gotOptions && JSON.stringify(val) != JSON.stringify(oldVal)) {
          this.calcTotal()
        }
      },
    },
    insurancefee: {
      handler(val, oldVal) {
        if (
          this.gotOptions &&
          JSON.stringify(oldVal) != '{}' &&
          JSON.stringify(val) != JSON.stringify(oldVal)
        ) {
          this.calcTotal()
        }
      },
    },
  },
  created() {
    // this.getOptions()
    this.selectedkm = this.bookingdata.bookinginfo[0].kmcharges_id
  },
  mounted() {
    this.getOptions()
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
        return this.bookingdata.extrafees.find((el) => el.extrafeeid == id)
      }

      if (type == 'insurance') {
        let arr = this.options.insuranceoptions.filter(
          (el) =>
            el.totalinsuranceamount >= this.initialinsurance.totalfeeamount
        )
        if (arr.length == 1) {
          return true
        } else return false
      }

      if (type == 'kms') {
        let arr = this.options.kmcharges.filter(
          (el) =>
            el.totalamount >=
            this.bookingdata.bookinginfo[0].kmcharges_totalfordailyrate
        )
        if (arr.length == 1) {
          return true
        }
      }
    },
    getOptions() {
      this.gotOptions = false
      let method = {
        method: 'bookingoptions',
        reservationref: this.resref,
      }
      Mixins.methods.postapiCall(method).then((results) => {
        if (results.status == 'OK') {
          this.options = results.results
          delete this.options.countries
          delete this.options.rentalsource
          this.options.optionalfees.forEach((el) => {
            el.selected = undefined
            el.qty = 1
            el.qtyinit = 1
            this.bookingdata.extrafees.forEach((x) => {
              if (x.extrafeeid == el.id) {
                el.selected = true
                el.qty = x.qty
                el.qtyinit = x.qty
              }
            })
          })
          this.options.insuranceoptions.forEach((el) => {
            if (el.id == this.insuranceid) {
              this.insurancefee = el
            }
          })
          this.calcTotal()
          this.gotOptions = true
        }
      })
    },
    selectedOptions() {
      let arr = []
      this.options.optionalfees.forEach((el) => {
        if (el.selected) {
          arr.push({ id: el.id, qty: el.qty })
        }
      })
      return arr
    },
    mandatoryFees() {
      let arr = []
      this.bookingdata.extrafees.forEach((el) => {
        if (el.isoptionalfee == false) {
          arr.push({ id: el.extrafeeid, qty: el.qty })
        }
      })
      return arr
    },
    calcTotal() {
      this.loading = true
      let method = {
        method: 'calctotal',
        pickuplocationid: this.bookingdata.bookinginfo[0].pickuplocationid,
        pickupdate: this.bookingdata.bookinginfo[0].pickupdate,
        vehiclecategoryid: this.bookingdata.bookinginfo[0].vehiclecategoryid,
        numberofdays: this.bookingdata.bookinginfo[0].numberofdays,
        totalrateafterdiscount: this.bookingdata.rateinfo[0].ratesubtotal,
        freedaysamount: 0,
        insuranceid: this.insurancefee.id,
        extrakmsid: this.selectedkm,
        mandatoryfees: this.mandatoryFees(),
        optionalfees: this.selectedOptions(),
        reservationref: this.bookingdata.bookinginfo[0].reservationref,
      }
      Mixins.methods.postapiCall(method).then((res) => {
        if (res.status == 'OK') {
          this.totals = res.results.totals
          this.ready = true
          this.loading = false
        } else if (res.status == 'ERR') {
          this.loading = false
          throw res.error
        }
      })
    },
    editBooking() {
      this.modal = false
      let bookingtype = this.bookingdata.bookinginfo[0].isquotation ? 1 : 2
      this.loading = true
      let method = {
        method: 'editbooking',
        reservationref: this.resref,
        bookingtype: bookingtype,
        insuranceid: this.insurancefee.id,
        extrakmsid: this.selectedkm,
        numbertravelling: this.bookingdata.bookinginfo[0].numbertravelling,
        customer: {
          ...this.customer,
        },
        optionalfees: this.selectedOptions(),
      }
      Mixins.methods.postapiCall(method).then((res) => {
        this.loading = false
        if (res.status == 'OK') {
          this.$emit('update')
        } else if (res.status == 'ERR') {
          throw res.error
        }
      })
    },
  },
}
</script>
<style lang="postcss"></style>

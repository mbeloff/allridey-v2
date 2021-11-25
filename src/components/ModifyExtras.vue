<template>
  <div class="relative text-left">
    <!-- Kilometres -->    
    <div class="mb-4">
      <p class="font-bold mb-4 text-xl">Damage Cover:</p>
      <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="dc in options.insuranceoptions" :class="{'selected': dc.id == insuranceid}">
        <div class="flex items-center">
          <input type="radio" :checked="dc.id == insuranceid" class="mr-1 hidden" :value="dc.id" v-model="insuranceid" :id="'dc' + dc.id">
          <label :for="'dc' + dc.id" class="fee w-full">
            <div class="flex">
              <span class="fee-name">{{dc.feedescription}}</span>
              <div class="flex items-center"><i class="fas fa-plus-circle mr-2"></i>{{ bookingdata.bookinginfo[0].currencysymbol + dc.fees}} <span class="text-xs">/day</span>  </div>              
            </div>
          </label>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <p class="font-bold mb-4 text-xl">Kilometre Inclusions:</p>
      <div class="flex flex-col p-1 mb-1 border border-opacity-0 rounded" v-for="km in options.kmcharges" :class="{'selected': km.id == bookingdata.bookinginfo[0].kmcharges_id}">
        <div class="flex items-center">
          <input type="radio" :checked="km.id == bookingdata.bookinginfo[0].kmcharges_id" class="mr-1 hidden" :value="km.id" v-model=" bookingdata.bookinginfo[0].kmcharges_id" :id="'km' + km.id">
          <label :for="'km' + km.id" class="fee w-full">
            <div class="flex">
              <span class="fee-name">{{km.description}}</span>
              <span class="price"><i class="fas fa-plus-circle mr-2"></i>{{ bookingdata.bookinginfo[0].currencysymbol + km.totalamount}}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <p class="font-bold mb-4 text-xl">Optional Extras:</p>      
      <div class="flex mb-1" v-for="extra in options.optionalfees">
            <div v-if="extra.qtyapply" class="flex flex-col justify-around items-center w-8" :class="{'opacity-50': !extra.selected}">
              <i @click="extra.qty++" class="grid place-items-center far fa-plus fa-fw py-1 w-6 h-5 text-center rounded bg-blue-900 text-white"></i>
              <input type="text" disabled v-model="extra.qty" class="w-6 text-center">
              <i @click="extra.qty--" class="grid place-items-center far fa-minus fa-fw py-1 w-6 h-5 text-center rounded bg-blue-900 text-white"></i>
            </div>
            <div class="flex flex-col flex-grow p-1 border border-opacity-0 rounded" :class="{'selected': extra.selected == true}">
              <input type="checkbox" class="mr-1 hidden" v-model="extra.selected" :id="'extra' + extra.id">
              <label :for="'extra' + extra.id" class="fee">
                <div class="flex justify-between">
                  <span class="fee-name">{{extra.name}}</span>

                  <p class="font-bold price" v-if="extra.type == 'Percentage'">{{ symbol + extra.totalfeeamount }}</p>
                  <div v-else class="font-bold price">
                    <span><i class="fas fa-plus-circle mr-2"></i>{{symbol + extra.fees*extra.qty}}</span>
                    <span v-if="extra.type == 'Daily'" class="text-xs font-normal">/day</span>
                  </div>
                </div>
                <p v-if="extra.feedescription" class="fee-description">{{extra.feedescription}}</p>
              </label>
            </div>
          </div>
    </div>
      
      <div class="flex w-full h-8">
        <button @click="$emit('saveChanges')" class="bg-green-300 rounded px-2 ml-auto">save changes</button>
      </div>
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  export default {
    mixins: [Mixins],
    props: {
      bookingdata: Object,
      insuranceid: Number,
    },
    watch: {
      insuranceid: {
        handler(val) {
          this.$emit('insuranceChanged', val)
        }
      },
      'options.optionalfees': {
        handler(val) {
          this.$emit('optionsChanged', val)
        }
      }
    },
    data() {
      return {
        options: {},
      }
    },
    computed: {
      symbol() {
        return this.bookingdata.bookinginfo[0].currencysymbol
      }
    },
    mounted() {
      this.getOptions()
    },
    methods: {
      toggleFee(fee){
        if (!this.selectedFees.find(el=>el.id == fee.id)) {
          this.selectedFees.push(fee)
        } else {
          this.selectedFees.splice(this.selectedFees.indexOf(fee), 1)
        }       
      },
      getOptions() {
        let method = JSON.stringify({
          "method": "bookingoptions",
          "reservationref": this.bookingdata.bookinginfo[0].reservationref
        });
        Mixins.methods.postapiCall(method)
        .then(results => {
          this.options = results.results
          this.options.optionalfees.forEach(el=>{
            el.selected = undefined
            el.qty = 1
            this.bookingdata.extrafees.forEach(x=>{
              if (x.extrafeeid == el.id) {
                el.selected = true
              }
              el.qty = x.qty
            })
          })
        })
      },
    }
  }
</script>
<style>

</style>
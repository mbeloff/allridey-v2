<template>
  <div>
    <div class="bg-white p-2 rounded shadow-xl py-5 pr-8 w-full relative print:hidden">
      <loading-overlay v-if="loading"></loading-overlay>
      <p class="font-bold text-4xl mb-4 text-left pl-6 text-yellow-400 uppercase">Find a Vehicle</p>
      <div class="text-left">
        <div class="grid gap-2 mb-2 grid-flow-row md:grid-flow-col">
          <div class="flex flex-col  gap-2">
            <div class="flex flex-col flex-grow group">
              <label for="puloc" class="my-label has-icon">Pickup Location</label>
              <div class="flex flex-row place-items-center">
                <i class="form-i fal fa-map-marker fa-fw"></i>
                <select v-if="step1" name="puloc" id="puloc" class="my-input" v-model="this.formData.pickuplocationid" @change="update()">
                  <option v-for="(loc, i) in locations" :key="loc.id" :value="loc.id" :disabled="!loc.id">{{loc.location}}</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col flex-grow group">
              <label for="doloc" class="my-label has-icon">Dropoff Location</label>
              <div class="flex flex-row place-items-center">
                <i class="form-i fal fa-map-marker fa-fw"></i>
                <select name="doloc" id="doloc" class="my-input" v-model="this.formData.dropofflocationid" @change="update()">
                  <option v-for="(loc, i) in locations" :key="loc.id" :value="loc.id" :disabled="!loc.id">{{loc.location}}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <date-picker class="flex flex-col items-center gap-2" v-model="daterange" mode="date" is-range :min-date="new Date()">
              <template v-slot="{ inputValue, inputEvents, isDragging }">
                <div class="flex flex-col md:flex-row flex-1 w-full gap-2">
                  <div class="flex flex-col flex-1 group">
                    <label for="pudate" class="my-label has-icon">Pickup Date</label>
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-calendar fa-fw"></i>
                      <input name="pudate" id='pudate' class="my-input pl-3" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 group">
                    <label class="my-label has-icon" for="putime">Pickup Time</label>
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-clock fa-fw"></i>
                      <select name="putime" id="putime" class="my-input" v-model="formData.pickuptime">
                        <!-- use putimearray to update times on date change -->
                        <option v-for="(time, i) in putimearr" :key="i" :value="time">
                          {{to12hr(time)}}
                        </option>
                        <option v-if="!putimearr.length" value="10:00" disabled selected>Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col md:flex-row flex-1 w-full gap-2">
                  <div class="flex flex-col flex-1 group">
                    <label for="dodate" class="my-label has-icon">Dropoff Date</label>
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-calendar fa-fw"></i>
                      <input name="dodate" id="dodate" class="my-input pl-3" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 group">
                    <label class="my-label has-icon" for="dotime">Dropoff Time</label>
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-clock fa-fw"></i>
                      <select name="dotime" id="dotime" class="my-input" v-model="formData.dropofftime">
                        <!-- dotimearray -->
                        <option v-for="(time, i) in dotimearr" :key="i" :value="time">{{to12hr(time)}}</option>
                        <option v-if="!dotimearr.length" value="10:00" disabled selected>Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </template>
            </date-picker>
          </div>
        </div>
        <div class="flex flex-row justify-between gap-2">
            <div class="flex flex-col flex-grow group max-w-xs">
              <label for="agentcode" class="my-label has-icon opacity-60">Agent Code</label>
              <div class="flex flex-row place-items-center">
                <i class="form-i fal fa-user-headset fa-fw"></i>
                <input type="text" v-if="step1" name="agentcode" id="agentcode" class="my-input" v-model="this.formData.agentcode" placeholder="(agent use only)">
              </div>
            </div>
           <div class="text-right flex justify-end flex-col">
          <button @click="getStep2()" class="btn btn-primary pl-6">SEARCH <i class="mr-2 text-gray-200 far fa-search"></i></button>
        </div>
        </div>
        

      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '../../Mixins'
  import LoadingOverlay from '../LoadingOverlay.vue'
  export default {
    components: {
      LoadingOverlay
    },
    data() {
      return {
        count: 1,
        alltimes: [
           '08:00','08:30','09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
        ],
        daterange: {},
        formData: {
          method: 'step2',
          vehiclecategorytypeid: '0',
          pickuplocationid: undefined,
          dropofflocationid: undefined,
          pickuptime: "10:00",
          dropofftime: "10:00",
          pickupdate: "",
          dropoffdate: "",
          ageid: 9,
          agentcode: ""
        },
        pickuptime: {open:"", close:""},
        dropofftime: {open:"", close:""},
        locations: []
      }
    },
    watch: {
      "daterange": function (val) {
        this.formData.pickupdate = val.start.toLocaleDateString('en-AU')
        this.formData.dropoffdate = val.end.toLocaleDateString('en-AU')
      },
      "formData.pickuplocationid": function (val) {
        this.pickuphours(val)
      },
      "formData.dropofflocationid": function (val) {
        this.dropoffhours(val)
      },
      "formData.pickupdate": function () {
        this.pickuphours(this.formData.pickuplocationid)
      },
      "formData.dropoffdate": function () {
        this.dropoffhours(this.formData.dropofflocationid)
      },
    },
    computed: {
      loading() {
        return this.isEmpty(this.step1)
      },
      step1() {
        return this.$store.state.step1
      },
      putimearr() {
        let all = [...this.alltimes]
        return all.slice(all.indexOf(this.pickuptime.open), all.indexOf(this.pickuptime.close) + 1)
      },
      dotimearr() {
        let all = [...this.alltimes]
        return all.slice(all.indexOf(this.dropofftime.open), all.indexOf(this.dropofftime.close) + 1)
      }
    },
    mounted() {
      if (!this.isEmpty(this.$store.state.step1)) {
        this.init(this.step1)
      } else {
        this.getStep1()
      }
    },
    mixins: [Mixins],
    methods: { 
      pickuphours(id) {
        let dayofweek = this.daterange.start.getDay() + 1
        let pickuphours = this.step1.officetimes.find(el => el.locationid == id && el.dayofweek == dayofweek)
        if (pickuphours == undefined) {
          this.pickuptime.open = this.step1.locations.find(el => el.id == id).officeopeningtime
          this.pickuptime.close = this.step1.locations.find(el => el.id == id).officeclosingtime
        } else {
          this.pickuptime.open = pickuphours.openingtime
          this.pickuptime.close = pickuphours.closingtime
        }        
      },
      dropoffhours(id) {
        let dayofweek = this.daterange.end.getDay() + 1
        let dropoffhours = this.step1.officetimes.find(el => el.locationid == id && el.dayofweek == dayofweek)
        if (dropoffhours == undefined) {
          this.dropofftime.open = this.step1.locations.find(el => el.id == id).officeopeningtime
          this.dropofftime.close = this.step1.locations.find(el => el.id == id).officeclosingtime
        } else {
          this.dropofftime.open = dropoffhours.openingtime
          this.dropofftime.close = dropoffhours.closingtime
        }      
      },
      isEmpty(obj) {
        if (Object.keys(obj).length === 0) {
          return true
        } else {
          return false
        }
      },
      getDateTimeObject(dat, time) {
        let y = parseInt(dat.substring(6, 10))
        let m = parseInt(dat.substring(3, 5) - 1)
        let d = parseInt(dat.substring(0, 2))
        let hr = parseInt(time.substring(0, 2))
        let min = parseInt(time.substring(3, 5))
        return new Date(y, m, d, hr, min)
      },
      validate() {
        // push custom error message before search
        let pudt = this.getDateTimeObject(this.formData.pickupdate, this.formData.pickuptime)
        let dodt = this.getDateTimeObject(this.formData.dropoffdate, this.formData.dropofftime)
        let errs = []
        if (pudt < new Date()) {
          errs.push('Pickup date is in the past')
        }
        if (Date.parse(dodt) <= Date.parse(pudt)) {
          errs.push('Dropoff date/time must by after pickup date/time')
        }
        if (!this.putimearr.length) {
          errs.push('There are no pickup times available for your selected dates. Please select a different Pickup Date')
        }
        if (!this.dotimearr.length) {
          errs.push('There are no dropoff times available for your selected dates. Please select a different Dropoff Date')
        }
        if (errs.length > 0) {
          this.$emit('errs', errs)
          this.$emit('searching', false)
          console.log('errs found')
          return false
        } else {
          return true
        }
      },
      async getStep2() {
        this.$emit('errs', [])
        this.$store.dispatch('step2', {}).then(this.$emit('searching', true));       
        this.$store.dispatch('searchParams', this.formData)
        this.getDateStrings()
        if (this.validate() == true) {
          var params = JSON.stringify(this.formData)
          let data = await Mixins.methods.apiCall(params)
          // .catch(console.log('catch triggered'))
          this.$store.dispatch('step2', data);
          this.count++
          this.$emit('update-step2')
          this.$router.push({
            name: 'Results'
          })
        }
      },
      async getStep1() {
        var step1 = JSON.stringify({
          'method': 'step1'
        })
        let data = await Mixins.methods.apiCall(step1)
        this.$store.dispatch('step1', data);
        console.log(step1)
        this.init(data)
      },
      init(data) {
        this.locations = data.locations
        this.getDefaultLocation(data.locations)
        // this.splitLocations(data.locations)
        this.initDates()
      },
      splitLocations(list) {
        let arr = [...list]
        let index = arr.indexOf(arr.find(el => el.location == 'Auckland'))
        arr.splice(index,0,{location:'-----',id:null})
        this.locations = arr
      },
      getDefaultLocation(arr) {
        let defaultId = arr.find(el => el.isdefault).id
        this.formData.pickuplocationid = defaultId
        this.formData.dropofflocationid = defaultId
      },
      getDateStrings() {
        this.formData.pickupdate = this.daterange.start.toLocaleDateString()
        this.formData.dropoffdate = this.daterange.end.toLocaleDateString()
      },
      initDates() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(10);
        tomorrow.setMinutes(0);
        tomorrow.setSeconds(0);
        tomorrow.setMilliseconds(0);
        var week = new Date();
        week.setDate(week.getDate() + 7);
        week.setHours(10);
        week.setMinutes(0);
        week.setSeconds(0);
        week.setMilliseconds(0);
        this.daterange = {
          start: tomorrow,
          end: week,
        }
      },     
      to12hr(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
          time = time.slice(1); // Remove full string match value
          time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
      },
    },
  }
</script>

<style lang="postcss">
  @layer components {
    .form-i {
      @apply text-blue-800 mr-2
    }
  }
</style>
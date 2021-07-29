<template>
  <div>
    <div class="bg-white p-2 rounded shadow-xl py-8 w-full relative">
      <loading-overlay v-if="loading"></loading-overlay>
      <p class="font-bold text-xl mb-4 text-left text-yellow-500">FIND A VEHICLE</p>
      <div class="text-left ">
        <div class="grid gap-2 mb-6 grid-flow-row md:grid-flow-col">
          <div class="flex flex-col  gap-2">
            <div class="flex flex-col flex-grow group">
              <label class="my-label">Pickup Location</label>
              <div class="flex flex-row place-items-center">
                <i class="form-i fal fa-map-marker fa-fw"></i>
                <select class="my-input" v-model="this.formData.pickuplocationid" @change="update()">
                  <option v-for="(loc, i) in step1.locations " :key="loc.id" :value="loc.id">{{loc.location}}</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col flex-grow group">
              <label class="my-label">Dropoff Location</label>
              <div class="flex flex-row place-items-center">
                <i class="form-i fal fa-map-marker fa-fw"></i>
                <select class="my-input" v-model="this.formData.dropofflocationid" @change="update()">
                  <option v-for="(loc, i) in step1.locations " :key="loc.id" :value="loc.id">{{loc.location}}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <date-picker class="flex flex-col items-center gap-2" v-model="daterange" mode="date" is-range :min-date="new Date()">
              <template v-slot="{ inputValue, inputEvents, isDragging }">
                <div class="flex flex-col md:flex-row flex-1 w-full gap-2">
                  <div class="flex flex-col flex-1 group">
                    <label for="" class="my-label">Pickup Date</label>
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-calendar fa-fw"></i>
                      <input class="my-input pl-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 group">
                    <label class="my-label" for="">Pickup Time</label>
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-clock fa-fw"></i>
                      <select name="" id="" class="my-input" v-model="formData.pickuptime">
                        <!-- use putimearray to update times on date change -->
                        <option v-for="(time, i) in alltimes" :key="i" :value="time">
                          {{to12hr(time)}}
                        </option>
                        <!-- <option v-if="pumaxtime == '00:00'" value="" disabled>Closed</option> -->
                      </select>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col md:flex-row flex-1 w-full gap-2">
                  <div class="flex flex-col flex-1 group">
                    <label for="" class="my-label">Dropoff Date</label>
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-calendar fa-fw"></i>
                      <input class="my-input pl-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 group">
                    <label class="my-label" for="">Dropoff Time</label>
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-clock fa-fw"></i>
                      <select name="" id="" class="my-input" v-model="formData.dropofftime">
                        <!-- dotimearray -->
                        <option v-for="(time, i) in alltimes" :key="i" :value="time">{{to12hr(time)}}</option>
                        <!-- <option v-if="domaxtime == '00:00'" value="" disabled>Closed</option> -->
                      </select>
                    </div>
                  </div>
                </div>
              </template>
            </date-picker>
          </div>
        </div>
        <div class="text-right flex justify-end">
          <button @click="getStep2()" class="btn btn-primary pl-6">SEARCH <i class="mr-2 text-gray-200 far fa-search"></i></button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  import LoadingOverlay from '../components/LoadingOverlay.vue'
  export default {
    components: {
      LoadingOverlay
    },
    data() {
      return {
        searchParams: "",
        count: 1,
        alltimes: [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
        ],
        // searchResults: undefined,
        selectedpulocation: {},
        selecteddolocation: {},
        daterange: this.tomorrow,
        pumintime: "10:00",
        pumaxtime: "16:30",
        putimearray: [],
        domintime: "10:00",
        domaxtime: "16:30",
        dotimearray: [],
        // step1: {},
        formData: {
          method: 'step2',
          vehiclecategorytypeid: '0',
          pickuplocationid: 3,
          dropofflocationid: 3,
          pickuptime: "10:00",
          dropofftime: "10:00",
          pickupdate: "",
          dropoffdate: "",
          ageid: 9
        },
      }
    },
    watch: {
      "daterange.start": function () {
        this.update()
      },
      '$store.state.step1': function () {
        this.initDates()
        this.update()
      }
    },
    computed: {
      loading() {
        return this.isEmpty(this.step1)
      },
      step1() {
        return this.$store.state.step1
      },
      step2() {
        return this.$store.state.step2
      }
    },
    mounted() {
      if (!this.isEmpty(this.$store.state.step1)) {
        this.initDates()
        this.update()
      } else {
        this.getStep1()
      }
    },
    mixins: [Mixins],
    methods: {
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
        // looks for date errors before calling step2
        let pudt = this.getDateTimeObject(this.formData.pickupdate, this.formData.pickuptime)
        let dodt = this.getDateTimeObject(this.formData.dropoffdate, this.formData.dropofftime)
        let errs = []
        if (pudt < new Date()) {
          errs.push('Pickup date is in the past')
        }
        if (Date.parse(dodt) <= Date.parse(pudt)) {
          errs.push('Dropoff date/time must by after pickup date/time')
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
          this.searchParams = this.formData
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
        this.initDates()
        this.update()
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
      // updateputimes() {
      //   let id = this.formData.pickuplocationid
      //   let pudate = this.daterange.start
      //   let start = this.pumintime
      //   let end = this.pumaxtime
      //   let arr = this.alltimes
      //   if (pudate.getDay() + 1 == 1 || pudate.getDay() + 1 == 7) {
      //     this.step1.officetimes.forEach(function (el) {
      //       if (
      //         el.locationid == id &&
      //         el.dayofweek == pudate.getDay() + 1
      //       ) {
      //         start = el.openingtime
      //         end = el.closingtime
      //       }
      //     })
      //   } else {
      //     start = this.selectedpulocation.officeopeningtime
      //     end = this.selectedpulocation.officeclosingtime
      //   }
      //   this.pumintime = start
      //   this.pumaxtime = end
      //   this.putimearray = arr.slice(arr.indexOf(start), arr.indexOf(end) + 1)
      // },
      // updatedotimes() {
      //   let id = this.formData.dropofflocationid
      //   let dodate = this.daterange.end
      //   let start = this.domintime
      //   let end = this.domaxtime
      //   let arr = this.alltimes
      //   if (dodate.getDay() + 1 == 1 || dodate.getDay() + 1 == 7) {
      //     this.step1.officetimes.forEach(function (el) {
      //       if (
      //         el.locationid == id &&
      //         el.dayofweek == dodate.getDay() + 1
      //       ) {
      //         start = el.openingtime
      //         end = el.closingtime
      //       }
      //     })
      //   } else {
      //     start = this.selecteddolocation.officeopeningtime
      //     end = this.selecteddolocation.officeclosingtime
      //   }
      //   this.domintime = start
      //   if (this.domintime == '') {
      //     this.domintime = this.selecteddolocation.officeopeningtime
      //   }
      //   this.domaxtime = end
      //   this.dotimearray = arr.slice(arr.indexOf(start), arr.indexOf(end) + 1)

      // },
      update() {
        this.updatepulocation()
        this.updatedolocation()
        // this.updateputimes()
        // this.updatedotimes()
      },
      updatepulocation() {
        let id = this.formData.pickuplocationid
        let data = {}
        this.step1.locations.forEach(function (loc) {
          if (loc.id == id) {
            data = loc
          }
        })
        this.selectedpulocation = data
      },
      updatedolocation() {
        let id = this.formData.dropofflocationid
        let data = {}
        this.step1.locations.forEach(function (loc) {
          if (loc.id == id) {
            data = loc
          }
        })
        this.selecteddolocation = data
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
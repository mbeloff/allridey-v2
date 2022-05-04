<template>
  <div>
    <div
      class="bg-white p-2 rounded shadow-xl py-5 pr-8 w-full relative print:hidden"
    >
      <loading-overlay v-if="loading"></loading-overlay>
      <p
        class="font-bold text-4xl mb-4 text-left pl-6 text-yellow-400 uppercase"
      >
        Find a Vehicle
      </p>
      <div class="text-left">
        <div class="grid gap-2 mb-2 grid-flow-row md:grid-flow-col">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col flex-grow group">
              <label for="puloc" class="my-label has-icon"
                >Pickup Location</label
              >
              <div class="flex flex-row place-items-center">
                <i class="form-i fal fa-map-marker fa-fw"></i>
                <select
                  v-if="step1"
                  id="puloc"
                  v-model="form.pickuplocationid"
                  name="puloc"
                  class="my-input"
                >
                  <option
                    v-for="loc in locations"
                    :key="loc.id"
                    :value="loc.id"
                    :disabled="!loc.id"
                  >
                    {{ loc.location }}
                  </option>
                </select>
              </div>
            </div>
            <div class="flex flex-col flex-grow group">
              <label
                for="doloc"
                class="my-label text-gray-400 group-hover:text-gray-400 has-icon"
                >Dropoff Location <i class="fal fa-link fa-fw pl-1"></i
              ></label>
              <div class="flex flex-row place-items-center">
                <i
                  class="form-i fal fa-map-marker fa-fw text-gray-400 group-hover:text-gray-400"
                ></i>
                <select
                  id="doloc"
                  v-model="form.dropofflocationid"
                  name="doloc"
                  class="my-input"
                  disabled
                >
                  <option
                    v-for="loc in locations"
                    :key="loc.id"
                    :value="loc.id"
                    :disabled="!loc.id"
                  >
                    {{ loc.location }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <date-picker
              v-model="daterange"
              class="flex flex-col items-center gap-2"
              mode="date"
              :update-on-input="false"
              is-range
              :min-date="new Date()"
              :model-config="dateconfig"
            >
              <template #default="{ inputValue, inputEvents, isDragging }">
                <div class="flex flex-col md:flex-row flex-1 w-full gap-2">
                  <div class="flex flex-col flex-1 group">
                    <label for="pudate" class="my-label has-icon"
                      >Pickup Date</label
                    >
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-calendar fa-fw"></i>
                      <input
                        id="pudate"
                        name="pudate"
                        class="my-input pl-3"
                        :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                        :value="inputValue.start"
                        v-on="inputEvents.start"
                      />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 group">
                    <label class="my-label has-icon" for="putime"
                      >Pickup Time</label
                    >
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-clock fa-fw"></i>
                      <select
                        id="putime"
                        v-model="form.pickuptime"
                        name="putime"
                        class="my-input"
                      >
                        <option
                          v-for="(time, i) in alltimes"
                          :key="i"
                          :value="time"
                        >
                          {{ to12hr(time) }}
                          <span
                            v-if="
                              !openingHoursPickup.find((el) => el == time) ||
                              time == '00:00'
                            "
                            >{{ '- after hours fee' }}</span
                          >
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col md:flex-row flex-1 w-full gap-2">
                  <div class="flex flex-col flex-1 group">
                    <label for="dodate" class="my-label has-icon"
                      >Dropoff Date</label
                    >
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-calendar fa-fw"></i>
                      <input
                        id="dodate"
                        name="dodate"
                        class="my-input pl-3"
                        :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                        :value="inputValue.end"
                        v-on="inputEvents.end"
                      />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 group">
                    <label class="my-label has-icon" for="dotime"
                      >Dropoff Time</label
                    >
                    <div class="flex flex-row place-items-center">
                      <i class="form-i fal fa-clock fa-fw"></i>
                      <select
                        id="dotime"
                        v-model="form.dropofftime"
                        name="dotime"
                        class="my-input"
                      >
                        <option
                          v-for="(time, i) in alltimes"
                          :key="i"
                          :value="time"
                        >
                          {{ to12hr(time) }}
                          <span
                            v-if="
                              !openingHoursDropoff.find((el) => el == time) ||
                              time == '00:00'
                            "
                            >{{ '- after hours fee' }}</span
                          >
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </template>
            </date-picker>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-between gap-2">
          <!-- // ? agent code input -->
          <!-- <div class="flex flex-col group">
              <label for="agentcode" class="my-label has-icon opacity-60">Agent Code</label>
              <div class="flex flex-row place-items-center">
                <i class="form-i fal fa-user-headset fa-fw"></i>
                <input type="text" v-if="step1" name="agentcode" id="agentcode" class="my-input" v-model="this.form.agentcode" placeholder="(agent use only)">
              </div>
            </div> -->
          <div class="text-right flex-grow">
            <button class="btn btn-primary ml-7 mt-4" @click="getStep2()">
              SEARCH <i class="text-gray-200 fal fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Mixins from '@/Mixins'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
export default {
  components: {
    LoadingOverlay,
  },
  mixins: [Mixins],
  emits: ['errs', 'searching'],
  data() {
    return {
      alltimes: [
        '00:00',
        '00:30',
        '01:00',
        '01:30',
        '02:00',
        '02:30',
        '03:00',
        '03:30',
        '04:00',
        '04:30',
        '05:00',
        '05:30',
        '06:00',
        '06:30',
        '07:00',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
        '22:00',
        '22:30',
        '23:00',
        '23:30',
      ],
      daterange: {},
      loading: true,
      form: {
        method: 'step2',
        vehiclecategorytypeid: '0',
        pickuplocationid: undefined,
        dropofflocationid: undefined,
        pickuptime: '10:00',
        dropofftime: '10:00',
        pickupdate: '',
        dropoffdate: '',
        ageid: 9,
        agentcode: '',
      },
      pickuptime: {
        open: '',
        close: '',
      },
      dropofftime: {
        open: '',
        close: '',
      },
      locations: [],
      dateconfig: {
        type: 'string',
        mask: 'DD/MM/YYYY', // Uses 'iso' if missing
      },
    }
  },
  computed: {
    ...mapState(['step1', 'searchParams']),
    openingHoursPickup() {
      let all = [...this.alltimes]
      return all.slice(
        all.indexOf(this.pickuptime.open),
        all.indexOf(this.pickuptime.close) + 1
      )
    },
    openingHoursDropoff() {
      let all = [...this.alltimes]
      return all.slice(
        all.indexOf(this.dropofftime.open),
        all.indexOf(this.dropofftime.close) + 1
      )
    },
    pickupDateRaw() {
      let str = this.form.pickupdate.split('/')
      return new Date(str[2], str[1] - 1, str[0])
    },
    dropoffDateRaw() {
      let str = this.form.dropoffdate.split('/')
      return new Date(str[2], str[1] - 1, str[0])
    },
  },
  watch: {
    daterange: function (val) {
      this.form.pickupdate = val.start
      this.form.dropoffdate = val.end
    },
    'form.pickuplocationid': function (val) {
      this.pickuphours(val)
      this.updateDropoffLocation()
    },
    'form.dropofflocationid': function (val) {
      this.dropoffhours(val)
    },
    'form.pickupdate': function () {
      this.pickuphours(this.form.pickuplocationid)
    },
    'form.dropoffdate': function () {
      this.dropoffhours(this.form.dropofflocationid)
    },
  },

  mounted() {
    if (!this.isEmpty(this.$store.state.step1)) {
      this.init(this.step1)
    } else {
      this.getStep1()
    }
  },

  methods: {
    pickuphours(id) {
      let parts = this.daterange.start.split('/')
      let newDate = new Date(parts[2], parts[1] - 1, parts[0])
      let dayofweek = newDate.getDay() + 1
      let hours = this.step1.officetimes.find(
        (el) => el.locationid == id && el.dayofweek == dayofweek
      )
      if (hours == undefined) {
        this.pickuptime.open = this.step1.locations.find(
          (el) => el.id == id
        ).officeopeningtime
        this.pickuptime.close = this.step1.locations.find(
          (el) => el.id == id
        ).officeclosingtime
      } else {
        this.pickuptime.open = hours.openingtime
        this.pickuptime.close = hours.closingtime
      }
    },
    dropoffhours(id) {
      let parts = this.daterange.end.split('/')
      let newDate = new Date(parts[2], parts[1] - 1, parts[0])
      let dayofweek = newDate.getDay() + 1
      let hours = this.step1.officetimes.find(
        (el) => el.locationid == id && el.dayofweek == dayofweek
      )
      if (hours == undefined) {
        this.dropofftime.open = this.step1.locations.find(
          (el) => el.id == id
        ).officeopeningtime
        this.dropofftime.close = this.step1.locations.find(
          (el) => el.id == id
        ).officeclosingtime
      } else {
        this.dropofftime.open = hours.openingtime
        this.dropofftime.close = hours.closingtime
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
      let pickupDateTime = this.getDateTimeObject(
        this.form.pickupdate,
        this.form.pickuptime
      )
      let dropoffDateTime = this.getDateTimeObject(
        this.form.dropoffdate,
        this.form.dropofftime
      )
      let errs = []
      // if (pickupDateTime < new Date()) {
      //   errs.push('Selected pickup date is in the past')
      // }
      if (Date.parse(dropoffDateTime) <= Date.parse(pickupDateTime)) {
        errs.push('Dropoff date/time must by after pickup date/time')
      }

      // pickup blocked?
      let pickupHol = this.isDateBlocked(
        this.form.pickuplocationid,
        this.pickupDateRaw,
        'P'
      )
      if (pickupHol) {
        errs.push('Pickup date is not available - ' + pickupHol)
      }

      // dropoff blocked
      let dropoffHol = this.isDateBlocked(
        this.form.dropofflocationid,
        this.dropoffDateRaw,
        'D'
      )
      if (dropoffHol) {
        errs.push('Dropoff date is not available - ' + dropoffHol)
      }

      if (errs.length > 0) {
        this.$emit('errs', errs)
        this.$emit('searching', false)
        return false
      } else {
        return true
      }
    },
    isDateBlocked(id, date, type) {
      let holiday
      this.step1.holidays.forEach((el) => {
        let start = new Date(el.startdate)
        let end = new Date(el.enddate)
        if (
          id == el.locationid &&
          date >= start &&
          date <= end &&
          el.type == type
        ) {
          holiday = el.holidayname
        }
      })
      return holiday
    },
    getStep2() {
      this.$emit('errs', [])
      this.$store.dispatch('step2', {}).then(this.$emit('searching', true))
      let savedParams = JSON.parse(JSON.stringify(this.form))
      this.$store.dispatch('searchParams', savedParams)
      if (!this.validate()) return
      var params = JSON.stringify(this.form)
      Mixins.methods.apiCall(params).then((res) => {
        this.$store.dispatch('step2', res)
        if (res.availablecars.find(el=>el.available) == undefined) {
          this.$emit('errs', [''])
        }
        this.$router.push({
          name: 'Results',
        })
      })
    },
    getStep1() {
      var step1 = JSON.stringify({
        method: 'step1',
      })
      Mixins.methods.apiCall(step1).then((data) => {
        this.$store.dispatch('step1', data)
        this.init(data)
      })
    },
    init(data) {
      this.locations = data.locations
      this.setInitialLocation(data.locations)
      // this.splitLocations(data.locations)
      this.initDates()
      this.loading = false
    },
    // ? split locations to sort aus/nz location list
    // splitLocations(list) {
    //   let arr = [...list]
    //   let index = arr.indexOf(arr.find(el => el.location == 'Auckland'))
    //   arr.splice(index,0,{location:'-----',id:null})
    //   this.locations = arr
    // },
    setInitialLocation(arr) {
      // Set pickup location to previously searched value, or current route location parameter
      let defaultId = arr.find((el) => el.isdefault).id
      this.form.pickuplocationid = defaultId
      this.form.dropofflocationid = defaultId
      if (this.searchParams.pickuplocationid) {
        this.form.pickuplocationid = this.searchParams.pickuplocationid
      }
      if (this.$route.params.loc) {
        let param = this.$route.params.loc.replaceAll('-', ' ').toLowerCase()
        if (param && arr.find((el) => el.location.toLowerCase() == param)) {
          let id = arr.find((el) => el.location.toLowerCase() == param).id
          this.form.pickuplocationid = id
          this.form.dropofflocationid = id
        }
      }
    },
    initDates() {
      var tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      var nextweek = new Date()
      nextweek.setDate(nextweek.getDate() + 7)
      this.daterange = {
        start: tomorrow.toLocaleDateString('en-AU'),
        end: nextweek.toLocaleDateString('en-AU'),
      }
    },
    to12hr(time) {
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]
      if (time.length > 1) {
        // If time format correct
        time = time.slice(1) // Remove full string match value
        time[5] = +time[0] < 12 ? 'am' : 'pm' // Set AM/PM
        time[0] = +time[0] % 12 || 12 // Adjust hours
      }
      return time.join('') // return adjusted time or original string
    },
    updateDropoffLocation() {
      this.form.dropofflocationid = this.form.pickuplocationid
    },
  },
}
</script>

<style lang="postcss"></style>

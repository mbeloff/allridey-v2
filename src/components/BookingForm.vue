<template>
<div>
  <div class="bg-white p-2 rounded bg-opacity-90 shadow-xl py-8 w-full">
    <p class="font-bold text-xl mb-4 text-left text-yellow-500">FIND A VEHICLE</p>
    <div v-if="!loading" class="text-left ">
      <div class="grid gap-2 mb-6">
        <div class="flex flex-col lg:flex-row gap-2">
          <div class="flex flex-col flex-grow group">
            <label class="text-xs mb-1 group-hover:text-yellow-500">Pickup Location</label>
            <div class="flex flex-row place-items-center">
              <i class="mr-2 fal fa-map-marker fa-fw text-blue-500 group-hover:text-yellow-500"></i>
              <select class="border h-10  flex-1" v-model="this.formData.pickuplocationid" @change="update()">
                <option v-for="(loc, i) in step1.locations " :key="loc.id" :value="loc.id">{{loc.location}}</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col flex-grow group">
            <label class="text-xs mb-1 group-hover:text-yellow-500">Dropoff Location</label>
            <div class="flex flex-row place-items-center">
              <i class="mr-2 fal fa-map-marker fa-fw text-blue-500 group-hover:text-yellow-500"></i>
              <select class="border h-10  flex-1" v-model="this.formData.dropofflocationid" @change="update()">
                <option v-for="(loc, i) in step1.locations " :key="loc.id" :value="loc.id">{{loc.location}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex flex-col">
          <date-picker v-model="daterange" mode="date" is-range :min-date="new Date()">
            <template v-slot="{ inputValue, inputEvents, isDragging }">

              <div class="flex flex-col sm:flex-row items-center gap-2">
                <div class="flex flex-col md:flex-row flex-1 w-full gap-2">
                  <div class="flex flex-col flex-1 group">
                    <label for="" class="text-xs mb-1 group-hover:text-yellow-500">Pickup Date</label>
                    <div class="flex flex-row place-items-center">
                      <i class="mr-2 fal fa-calendar fa-fw text-blue-500 group-hover:text-yellow-500"></i>
                      <input class="border h-10 pl-1 flex-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.start" v-on="inputEvents.start" />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 group">
                    <label class="text-xs mb-1 group-hover:text-yellow-500" for="">Pickup Time</label>
                    <div class="flex flex-row place-items-center">
                      <i class="mr-2 fal fa-clock fa-fw text-blue-500 group-hover:text-yellow-500"></i>
                      <select name="" id="" class="h-10  border flex-1" v-model="formData.pickuptime">
                        <option v-for="(time, i) in putimearray" :key="i" :value="time">
                          {{to12hr(time)}}
                        </option>
                        <option v-if="pumaxtime == '00:00'" value="" disabled>Unavailable</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col md:flex-row flex-1 w-full gap-2">
                  <div class="flex flex-col flex-1 group">
                    <label for="" class="text-xs mb-1 group-hover:text-yellow-500">Dropoff Date</label>
                    <div class="flex flex-row place-items-center">
                      <i class="mr-2 fal fa-calendar fa-fw text-blue-500 group-hover:text-yellow-500"></i>
                      <input class="border h-10 pl-1 flex-1" :class="isDragging ? 'text-gray-600' : 'text-gray-900'" :value="inputValue.end" v-on="inputEvents.end" />
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 group">
                    <label class="text-xs mb-1 group-hover:text-yellow-500" for="">Dropoff Time</label>
                    <div class="flex flex-row place-items-center">
                      <i class="mr-2 fal fa-clock fa-fw text-blue-500 group-hover:text-yellow-500"></i>
                      <select name="" id="" class="h-10  border flex-1" v-model="formData.dropofftime">
                        <option v-for="(time, i) in dotimearray" :key="i" :value="time">{{to12hr(time)}}</option>
                        <option v-if="domaxtime == '00:00'" value="" disabled>Unavailable</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </date-picker>
        </div>
      </div>
      <div class="text-right flex justify-end">
        <button @click="getStep2()" class="border border-blue-500 bg-white px-6 py-2 rounded text-blue-500 hover:bg-blue-500 hover:text-white">SEARCH <i class="mr-2 fal fa-search"></i></button>
      </div>

    </div>
  </div>
  <div v-if="this.apiResponse && this.searching == false" class="bg-white py-10 mt-10 px-2 rounded bg-opacity-90 shadow-xl py-8 w-full">
    <search-results :results="this.apiResponse" :key="count" :step2="submittedParams"></search-results>
  </div>
  <div v-if="this.searching == true" class="bg-white py-10 mt-10 px-2 rounded bg-opacity-90 shadow-xl py-8 w-full">
    <p class="font-xl">SEARCHING...</p>
  </div>
</div>
</template>

<script>
import SearchResults from './SearchResults.vue'
  import {
    DatePicker
  } from 'v-calendar';
  export default {
    components: {
      DatePicker, SearchResults
    },
    data() {
      return {
        submittedParams: "",
        searching: false,
        count: 1,
        alltimes: [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
        ],
        apiResponse: undefined,
        selectedpulocation: {},
        selecteddolocation: {},
        daterange: this.tomorrow,
        pumintime: "10:00",
        pumaxtime: "16:30",
        putimearray: [],
        domintime: "10:00",
        domaxtime: "16:30",
        dotimearray: [],
        step1: {},
        loading: true,
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
    },
    computed: {

    },
    mounted() {
      this.getStep1()
    },
    methods: {
      
      async getStep2() {
        this.searching = true    
        this.convertdates()        
        var params = JSON.stringify(this.formData)
        this.submittedParams = this.formData
        let data = await this.apiCall(params)
        this.apiResponse = await data
        this.count++
        this.searching = false
      },  
      async getStep1() {
         var step1 = JSON.stringify({
        'method': 'step1'
        })
        let data = await this.apiCall(step1)
        this.step1 = await data
        this.initDates()
        this.update()
        this.loading = false
      }, 
      convertdates() {
        this.formData.pickupdate = this.daterange.start.toLocaleDateString()
        this.formData.dropoffdate = this.daterange.end.toLocaleDateString()
      },
      update() {
        this.updatepulocation()
        this.updatedolocation()
        this.updateputimes()
        this.updatedotimes()
      },
      initDates() {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(10);
        tomorrow.setMinutes(0);
        tomorrow.setSeconds(0);
        tomorrow.setMilliseconds(0);
        var week = new Date();
        week.setDate(tomorrow.getDate() + 7);
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
      updateputimes() {
        let id = this.formData.pickuplocationid
        let pudate = this.daterange.start
        let start = this.pumintime
        let end = this.pumaxtime
        let arr = this.alltimes
        if (pudate.getDay() + 1 == 1 || pudate.getDay() + 1 == 7) {
          this.step1.officetimes.forEach(function (el) {
            if (
              el.locationid == id &&
              el.dayofweek == pudate.getDay() + 1
            ) {
              start = el.openingtime
              end = el.closingtime
            }
          })
        } else {
          start = this.selectedpulocation.officeopeningtime
          end = this.selectedpulocation.officeclosingtime
        }
        this.pumintime = start
        if (this.pumintime == '') {
          this.pumintime = this.selectedpulocation.officeopeningtime
        }
        this.pumaxtime = end
        this.putimearray = arr.slice(arr.indexOf(start), arr.indexOf(end) + 1)
      },
      updatedotimes() {
        let id = this.formData.dropofflocationid
        let dodate = this.daterange.end
        let start = this.domintime
        let end = this.domaxtime
        let arr = this.alltimes
        if (dodate.getDay() + 1 == 1 || dodate.getDay() + 1 == 7) {
          this.step1.officetimes.forEach(function (el) {
            if (
              el.locationid == id &&
              el.dayofweek == dodate.getDay() + 1
            ) {
              start = el.openingtime
              end = el.closingtime
            }
          })
        } else {
          start = this.selecteddolocation.officeopeningtime
          end = this.selecteddolocation.officeclosingtime
        }
        this.domintime = start
        if (this.domintime == '') {
          this.domintime = this.selecteddolocation.officeopeningtime
        }
        this.domaxtime = end
        this.dotimearray = arr.slice(arr.indexOf(start), arr.indexOf(end) + 1)
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
      async signRequest(method) {
        let signString = await fetch("http://localhost:3000/signRequest.php", {
            method: 'POST',
            headers: {
              "content-Type": "text/plain"
            },
            body: method,
          })
          .then(response => response.text())
          .then(data => {
            return JSON.parse(data).signature;
          })
        return signString
      },
      async apiCall(method) {
        let signString = await this.signRequest(method);
        let formdata = new FormData();
        formdata.append("request", method);
        formdata.append("signature", signString);
        let responseData = await fetch("https://apis.rentalcarmanager.com/booking/v3.2?apikey=QXVBbGxSaWRleTUzNFt1bmRlZmluZWRdfE1pY2hhZWxXaWNrZWR8ZXVucGNGdEI=", {
            method: "POST",
            body: formdata,
          })
          .then(response => response.text())
          .then(result => {
            return JSON.parse(result)
          })
        return responseData.results
      }
    },
  }
</script>

<style>
  label {
    color: rgb(14, 165, 233);
    font-weight: bold
  }
</style>
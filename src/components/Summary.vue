<template>
  <div class="text-left p-2">
    <div class="rounded bg-opacity-90 w-full p-2 flex flex-col gap-3">
      <div class="flex flex-col md:flex-row gap-3 items-start">

        <!--LEFT SIDE -->
        <div class="md:w-2/6 md:pr-1 order-2 md:order-1">
          <img :src="booking.urlpathfordocuments + booking.vehicleimage" alt="" class="m-auto">
          <div class="bg-white px-2 py-1 text-sm">
            <p class="font-bold">Trip Information:</p>
            <div class="flex justify-between py-2">
              <span class="flex-shrink">
                Pickup:
              </span>
              <div class="grid font-bold">
                <span class="text-right">{{booking.pickuplocationname}}</span>
                <span>{{tConvert(booking.pickuptime)}} - {{booking.pickupdate}}</span>
              </div>              
            </div>
            <div class="flex justify-between py-2">
              <span class="flex-shrink">
                Dropoff:
              </span>
              <div class="grid font-bold">
                <span class="text-right">{{booking.dropofflocationname}}</span>
                <span>{{tConvert(booking.dropofftime)}} - {{booking.dropoffdate}}</span>
              </div>              
            </div>
            <p class="font-bold">Daily Rental Rate:</p>
            <div class="flex justify-between py-2">
              <span class="flex-shrink">
                {{rate[0].numberofdays + ' days @ ' + booking.currencysymbol + rate[0].dailyrateafterdiscount}}
              </span>
              <span class="font-bold">{{booking.currencysymbol + rate[0].ratesubtotal.toFixed(2)}}</span>
            </div>

            <!-- EXTRAS -->
            <div class="">
              <p class="font-bold">Fees:</p>
              <div class="flex justify-between" v-for="fee in fees" :key="fee">
                <span> {{fee.name}} </span><span class="font-bold">{{booking.currencysymbol + fee.totalfeeamount.toFixed(2)}}</span>
              </div>
              <div class="flex justify-between">
                <span> {{booking.kmcharges_description}} </span><span class="font-bold ml-5">{{booking.currencysymbol + booking.kmcharges_totalfordailyrate.toFixed(2)}}</span>
              </div>
              <br>
            </div>

            <div v-if="booking.payment" class="flex justify-end">
              <span>Payment received:</span><span>{{booking.currencysymbol + booking.payment}}</span>
            </div>
          </div>

          <!-- CALCULATED TOTAL -->
          <div class="bg-blue-800 text-blue-100 p-2">
            <div class="flex justify-end mb-2">
              <span v-if="booking.inquotation" class="font-bold mr-2 ">TOTAL: </span>
              <span v-else class="font-bold mr-2 ">BALANCE DUE: </span>
              <span class="text-right">{{booking.currencyname + ' ' + booking.currencysymbol + booking.balancedue.toFixed(2)}}</span>
            </div>
            <div class="text-right italic text-xs">
              <span>includes GST of: </span><span> {{ booking.currencysymbol + booking.gst }}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="flex flex-col md:w-4/6 flex-shrink order-1 md:order-2">
        <div class="flex flex-col shadow-xl bg-gray-200 p-5 gap-2 py-10 mb-5">
          <p v-if="booking.isquotation" class='text-xl font-bold'>Thank you for requesting a quote with All Ridey</p>
          <p v-else class='text-xl font-bold'>Thanks for booking with All Ridey.</p>
          <p class="text-sm">We've sent you an email for your records. <span v-if="booking.isquotation">You can convert this quote into a booking by clicking the button below, or via the link in the email.</span></p>
          <div class="grid grid-cols-2 text-sm">
            <span class="font-bold">Quote number:</span>
            <span class="font-bold">{{ booking.reservationdocumentno }}</span>
            <span class="font-bold">Reservation Type:</span>
            <span>{{ booking.reservationstatus }}</span>
            <span class="font-bold">Name:</span><span>{{ customer.firstname }} {{ customer.lastname }}</span>
            <span class="font-bold">Email:</span><span class="break-all">{{customer.email}}</span>
          </div>
          
        </div>
        <a v-if="booking.isquotation" :href="booking.quoteconversionurl" class="btn btn-primary ">Convert to Booking</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      bookinginfo: Object
    },
    data() {
      return {
      //   bookinginfo: {
      //     "bookinginfo": [{
      //       "reservationref": "0005643FE23F453",
      //       "reservationno": 895,
      //       "reservationdocumentno": "#Q-895",
      //       "reservationstatus": "Reservation Request",
      //       "reservationtypedescription": "Online Quotation",
      //       "reservationcreateddate": "06/Jul/2021",
      //       "isvehicleallocated": false,
      //       "isquotation": true,
      //       "quoteconversionurl": "https://web.rentalcarmanager.com/Workflow/Workflow.aspx?server=30&rcmtoken=4950e25e-0c9c-4624-9546-c9bb3a9f9de7",
      //       "agreementpage": "Agreement.asp?RTA4B=895&refID=0005643FE23F453",
      //       "quoteconversionvalidmessage": "Please note this quote is valid for 2 days subject to availability.",
      //       "driverageid": 9,
      //       "pickuplocationid": 3,
      //       "pickupdate": "07/Jul/2021",
      //       "pickuptime": "10:00",
      //       "pickuplocationname": "Brisbane",
      //       "pickuplocationaddress": "100 Longlands Street Woolloongabba",
      //       "arrivalpoint": "",
      //       "flightin": "",
      //       "dropofflocationid": 3,
      //       "dropoffdate": "13/Jul/2021",
      //       "dropofftime": "10:00",
      //       "dropofflocationname": "Brisbane",
      //       "dropofflocationaddress": "100 Longlands Street Woolloongabba",
      //       "departurepoint": "",
      //       "flightout": "",
      //       "rentalsource": "Online search",
      //       "customerid": "564",
      //       "customerremark": "",
      //       "numbertravelling": "",
      //       "areaofusedescription": "",
      //       "transmission": "",
      //       "urlpathfordocuments": "https://rentalcarmanagerau.blob.core.windows.net/public/auallridey534/",
      //       "vehiclecategoryid": 3,
      //       "vehiclecategory": "Allridey car",
      //       "vehicleimage": "allridey-i20.jpg",
      //       "vehicledescription1": "",
      //       "vehicledescription2": "",
      //       "vehicle_numberofadults": 5,
      //       "vehicle_numberofchildren": 0,
      //       "vehicle_numberoflargecases": 0,
      //       "vehicle_numberofsmallcases": 0,
      //       "sippcode": "",
      //       "currencyname": "AUD",
      //       "currencysymbol": "$",
      //       "shouldhiderates": false,
      //       "shouldhideextrarates": false,
      //       "shouldhideinsurancerates": false,
      //       "numberofdays": 6,
      //       "dailyrate": 25,
      //       "totalcost": 408.74,
      //       "campaigncode": "",
      //       "payment": 0,
      //       "balancedue": 408.74,
      //       "taxname1": "GST",
      //       "taxname2": "",
      //       "stampduty": 0,
      //       "gst": 37.16,
      //       "isgstinclusive": true,
      //       "mileagedesc": "Kms",
      //       "kmcharges_id": 11,
      //       "kmcharges_description": "250 Kms free per day, additional per Kms $ 0.20",
      //       "kmcharges_feeforeachadditionalkm": 0.2,
      //       "kmcharges_additionalkmtotalamount": 0,
      //       "kmcharges_dailyrate": 0,
      //       "kmcharges_maximumprice": 0,
      //       "kmcharges_totalfordailyrate": 0,
      //       "kmcharges_totalnumberofkmsfree": 1500,
      //       "kmcharges_notes": null,
      //       "agentrefno": "",
      //       "agent": null,
      //       "agentbranch": null,
      //       "agentcommission": 0,
      //       "agentnetamountdue": 0,
      //       "agentemail": null
      //     }],
      //     "customerinfo": [{
      //       "customerid": 564,
      //       "firstname": "test",
      //       "lastname": "TEST",
      //       "dateofbirth": "01/Jan/1990",
      //       "licenseno": "12341231",
      //       "licenseissued": "Australia",
      //       "licenseexpires": "",
      //       "email": "michael@wickedcampers.com",
      //       "phone": "1234123123",
      //       "mobile": "",
      //       "fulladdress": "",
      //       "address": "",
      //       "city": "",
      //       "state": "",
      //       "postcode": "",
      //       "country": "Australia",
      //       "countryid": 7,
      //       "localaddress": "",
      //       "passport": "",
      //       "loyaltycardno": ""
      //     }],
      //     "companyinfo": [{
      //       "logo": "allridey-logo-sm.png",
      //       "companyemail": "allridey@campervanvillage.com",
      //       "companyname": "Juicy Love Trust ATF Juicy Love Pty Ltd T/as Wicked Campers",
      //       "companycolour": "#0080c0",
      //       "branchaddress": "100 Longlands St",
      //       "branchcity": "Woolloongabba",
      //       "branchpostcode": "QLD 4102 Australia",
      //       "branchphone": "",
      //       "branchfax": "",
      //       "website": "www.allridey.com.au",
      //       "freephone": ""
      //     }],
      //     "rateinfo": [{
      //       "season": "Rate",
      //       "numberofdays": 6,
      //       "numberofhours": 0,
      //       "dailyratebeforediscount": 25,
      //       "dailyrateafterdiscount": 25,
      //       "discountname": "",
      //       "discountdescription": "",
      //       "discountpercentagerate": 0,
      //       "discountdailyrate": 0,
      //       "monthlyrate_numberofmonths": 0,
      //       "monthlyrate_afterdiscount": 0,
      //       "monthlyrate_numberofextradays": 0,
      //       "monthlyrate_extradaysrateafterdiscount": 25,
      //       "ratesubtotal": 150
      //     }],
      //     "extrafees": [{
      //       "extrafeeid": 98,
      //       "name": "Cover One (Liability Reduction Fee) - 2WD Manual",
      //       "type": "Daily",
      //       "qty": 1,
      //       "numberofdays": 6,
      //       "fees": 32,
      //       "totalfeeamount": 192,
      //       "feedescription": "",
      //       "isoptionalfee": true,
      //       "isbondfee": false,
      //       "isinsurancefee": true,
      //       "insuranceexcessamount": 0
      //     }, {
      //       "extrafeeid": 83,
      //       "name": "Toll Road Fee",
      //       "type": "Fixed",
      //       "qty": 1,
      //       "numberofdays": 6,
      //       "fees": 40,
      //       "totalfeeamount": 40,
      //       "feedescription": "",
      //       "isoptionalfee": false,
      //       "isbondfee": false,
      //       "isinsurancefee": false,
      //       "insuranceexcessamount": 0
      //     }, {
      //       "extrafeeid": 53,
      //       "name": "Admin Fee",
      //       "type": "Percentage",
      //       "qty": 1,
      //       "numberofdays": 6,
      //       "fees": 7,
      //       "totalfeeamount": 26.74,
      //       "feedescription": "",
      //       "isoptionalfee": false,
      //       "isbondfee": false,
      //       "isinsurancefee": false,
      //       "insuranceexcessamount": 0
      //     }],
      //     "paymentinfo": [],
      //     "extradrivers": []
      //   }
      }
    },
    computed: {
      booking() {
        return this.bookinginfo.bookinginfo[0]
      },
      customer() {
        return this.bookinginfo.customerinfo[0]
      },
      company() {
        return this.bookinginfo.companyinfo[0]
      },
      drivers() {
        return this.bookinginfo.extradrivers
      },
      fees() {
        return this.bookinginfo.extrafees
      },
      payment() {
        return this.bookinginfo.paymentinfo
      },
      rate() {
        return this.bookinginfo.rateinfo
      }
    },
    methods: {
      tConvert (time) {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
      }
    }
  }
</script>

<style>

</style>
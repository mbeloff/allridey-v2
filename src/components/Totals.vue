<template>
  <div class="bg-white px-2 py-1">
          <p class="font-bold">Daily Rental Rate:</p>
          <div class="flex justify-between py-2">
            <span>
              {{ this.step3.seasonalrates[0].numberofdays + " days @ $" + this.step3.seasonalrates[0].dailyrateafterdiscount}}
            </span>
            <span class="w-14 font-bold">{{"$" + this.step3.seasonalrates[0].ratesubtotal.toFixed(2) }}</span>
          </div>

          <!-- new totals section -->
          <div>
            <div v-if="totals.mandatory.length || totals.optional.length">
              <p class="font-bold">Fees:</p>
              <div v-for="fee in totals.optional" class="flex justify-between">
                <span>{{fee.name}}</span><span class="font-bold w-14">{{currencysymbol + fee.total.toFixed(2)}}</span>
              </div>
              <div v-for="fee in totals.mandatory" class="flex justify-between">
                <span>{{fee.name}}</span><span class="font-bold w-14">{{currencysymbol + fee.total.toFixed(2)}}</span>
              </div>
              <div v-if="totals.damage[0]" class="flex justify-between">
                <span>Damage Cover</span><span class="font-bold w-14">{{currencysymbol + totals.damage[0].total.toFixed(2)}}</span>
              </div>
              <br><br>
            </div>
          </div>
        </div>

        <div class="bg-gray-200 p-2">
          <div class="flex justify-end text-lg mb-2">
            <span class="font-bold">TOTAL: </span>
            <span v-if="calculating" class="w-24 text-right grid place-items-center justify-items-end">
              <spinner></spinner>
            </span>
            <span v-else class="w-24 text-right">{{currencysymbol + totals.all[totals.all.findIndex(el => el.name === "TOTAL")].total}}</span>

          </div>
          <div class="text-right italic">
            <span>includes GST of:</span><span>{{' ' + currencysymbol + totals.all[totals.all.findIndex(el => el.name === "include GST")].total}}</span>
          </div>
        </div>
</template>

<script>
export default {
  props: {
    totals: Object,
    step3: Object,
    currencysymbol: String
  },
  methods: {
  }
}
</script>

<style>

</style>
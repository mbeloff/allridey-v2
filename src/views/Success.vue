<template>
  <p v-if="!paymentInfo">please wait...</p>
</template>

<script>
import Mixins from '../Mixins'
export default {
  data() {
    return {
      paymentInfo: {},
      target: ""
    }
  },
  mounted() {
    console.log(this.$route.query)
    var search = location.search.substring(1);
    console.log(search)
    this.target = search;
    this.getDPSpayment()
  },
  watch: {
    'paymentInfo': function() {
      this.changeParent()
    }
  },
  mixins: [Mixins],
  methods: {
    changeParent() {
      top.window.location = '/?' + this.target;
    },
    async getDPSpayment() {
    let params = JSON.stringify({
      "method":"getdpspayment",
      "reservationref":this.$route.query.ref,
      "result":this.$route.query.result
    })
    console.log(params)
    Mixins.methods.apiCall(params).then(res=>{console.log(res), this.paymentInfo = res})
    }
  }
}
</script>

<style>

</style>
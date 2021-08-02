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
    this.processPayResult()
  },
  watch: {
    'paymentInfo': function() {
      
    }
  },
  mixins: [Mixins],
  methods: {
    changeParent() {
      top.window.location = '/?' + this.target;
    },

    processPayResult() {
      let fnHost = import.meta.env.VITE_FN_HOST
            var myHeaders = new Headers();

            var body = JSON.stringify({
              transresponse: this.$route.query.result
            });
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: body,
              redirect: 'follow'
            };
            fetch( fnHost + "/.netlify/functions/processtrans", requestOptions)
              .then(response => response.text())
              .then(result => {
                // console.log(result)
                // console.log(JSON.parse(result))
                let res = JSON.parse(result).Response
                this.paymentInfo = res
                window.parent.postMessage(res)
              })
              .catch(error => {console.log('process result failed: ', error)
          });
    },    
    // getDPSpayment() {
    // let params = JSON.stringify({
    //   "method":"getdpspayment",
    //   "reservationref":this.$route.query.ref,
    //   "result":this.$route.query.result
    // })
    // Mixins.methods.apiCall(params).then(res=>{this.paymentInfo = res})
    // }
  }
}
</script>

<style>

</style>
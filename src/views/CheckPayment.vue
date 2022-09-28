<template>
  <p v-if="loading">please wait...</p>
</template>

<script>
import Mixins from '../Mixins'
export default {
  mixins: [Mixins],
  data() {
    return {
      paymentInfo: {},
      loading: true,
    }
  },
  mounted() {
    this.processPayResult()
  },
  methods: {
    processPayResult() {
      // let Host = import.meta.env.VITE_HOST
      var myHeaders = new Headers()

      var body = JSON.stringify({
        transresponse: this.$route.query.result,
      })
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow',
      }
      fetch('/.netlify/functions/processtrans', requestOptions)
        .then((response) => response.text())
        .then((result) => {
          let res = JSON.parse(result).Response
          this.paymentInfo = res
          this.loading = false
          window.parent.postMessage(res)
        })
        .catch((error) => {
          console.log('process result failed: ', error)
        })
    },
  },
}
</script>

<style></style>

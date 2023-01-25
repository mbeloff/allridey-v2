export default {
  methods: {
    signRequest(method) {
      // let Host = import.meta.env.VITE_HOST

      var raw = method
      var requestOptions = {
        method: 'POST',
        body: raw,
      }
      return fetch('/.netlify/functions/signRequest', requestOptions)
        .then((response) => response.text())
        .then((result) => {
          return JSON.parse(result).signature
        })
        .catch((error) => {
          console.log("Couldn't get token!", error)
        })
    },

    async apiCall(method) {
      let signature = await this.signRequest(method)
      let formdata = new FormData()
      formdata.append('request', method)
      formdata.append('signature', signature)
      return fetch(
        'https://apis.rentalcarmanager.com/booking/v3.2?apikey=QXVBbGxSaWRleTUzNFt1bmRlZmluZWRdfE1pY2hhZWxXaWNrZWR8ZXVucGNGdEI=',
        {
          method: 'POST',
          body: formdata,
        }
      )
        .then((response) => response.text())
        .then((result) => {
          let data = JSON.parse(result)
          if (data.status == 'OK') {
            if (data.issues.length > 0) {
              console.log('issues: ', data.issues)
            }
            // console.log(JSON.parse(method).method, data.status,data)
            return data.results
          }
          return data
        })
        .catch((error) => {
          console.log(JSON.parse(method).method, error)
          return error
        })
    },
  },
}

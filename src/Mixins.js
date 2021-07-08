export default {
  methods: {
    async signRequest(method) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = method;
      console.log(raw)
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      console.log(method)
      let _this = this
      // ! update functions dir on deploy
      let sign = fetch("http://localhost:8888/.netlify/functions/signRequest", requestOptions)
        .then(response => response.text())
        .then(result => {
          let sig = JSON.parse(result).signature
          console.log(sig)
          return sig
        })
        .catch(error => {console.log('Couldn\'t get token!', error)
        _this.gettingToken = false
        _this.tokenFailed = true});
        return sign
    },
    // ORIGINAL (working) signRequest
    // async signRequest(method) {
    //   let signString = await fetch("http://localhost:3000/signRequest.php", {
    //       method: 'POST',
    //       headers: {
    //         "content-Type": "text/plain"
    //       },
    //       body: method,
    //     })
    //     .then(response => response.text())
    //     .then(data => {
    //       return JSON.parse(data).signature;
    //     })
    //   return signString
    // },
    async apiCall(method) {
      let signString = await this.signRequest(method);
      let formdata = new FormData();
      formdata.append("request", method);
      formdata.append("signature", signString);
      let apierror = undefined
      let responseData = await fetch("https://apis.rentalcarmanager.com/booking/v3.2?apikey=QXVBbGxSaWRleTUzNFt1bmRlZmluZWRdfE1pY2hhZWxXaWNrZWR8ZXVucGNGdEI=", {
          method: "POST",
          body: formdata,
        })
        .then(response => response.text())
        .then(result => {
          let data = JSON.parse(result)
          if (data.status == 'OK') {
            if (data.issues.length > 0) {
              console.log('issues: ' + data.issues)
            }
            console.log('received ' + method + ' response')
            return data
          } else {
            apierror = data.error
            throw new Error(data.error)
          }
        }).catch((error)=>{alert(error)})

        if(responseData) {
          return responseData.results 
        } else {
          console.log('returning error:' + apierror)
          return apierror
        }
             
    }
  }
}
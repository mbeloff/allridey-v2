export default {
  methods: {
    signRequest(method) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "method": "step1"
      });
      console.log(raw)
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      console.log(method)
      let _this = this
      fetch("http://localhost:8888/.netlify/functions/signRequest?", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
          // _this.response = result
        })
        .catch(error => {console.log('Couldn\'t get token!', error)
        _this.gettingToken = false
        _this.tokenFailed = true});
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
      console.log('fuck')
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
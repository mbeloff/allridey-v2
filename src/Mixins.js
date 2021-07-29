export default {
  methods: {    
    signRequest(method) {
      let fnHost = import.meta.env.VITE_FN_HOST
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = method;
      console.log(JSON.parse(method))
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      let sign = fetch( fnHost + "/.netlify/functions/signRequest", requestOptions)
        .then(response => response.text())
        .then(result => {
          let sig = JSON.parse(result).signature
          return sig
        })
        .catch(error => {console.log('Couldn\'t get token!', error)
    });
        return sign
    },
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
            let request = JSON.parse(method)
            console.log(request.method + ' ' + data.status)
            console.log(data.results)
            return data
          } else {
            apierror = data.error
            throw new Error(apierror)
          }
        }).catch((error)=>{console.log(error)})

        if(responseData) {
          return responseData.results 
        } else {
          console.log('returning error:' + apierror)
          return apierror
        }
             
    }
  }
}


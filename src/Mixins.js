import store from './store.js'
export default {
  methods: {    

    signRequest(method) {
      let Host = import.meta.env.VITE_HOST

      var raw = method;
      var requestOptions = {
        method: 'POST',
        body: raw,
      };
      return fetch( Host + "/.netlify/functions/signRequest", requestOptions)
        .then(response => response.text())
        .then(result => {
          return JSON.parse(result).signature
        })
        .catch(error => {console.log('Couldn\'t get token!', error)
    });
    },

    async apiCall(method) {
      let signature = await this.signRequest(method);
      let formdata = new FormData();
      formdata.append("request", method);
      formdata.append("signature", signature);
      return fetch("https://apis.rentalcarmanager.com/booking/v3.2?apikey=QXVBbGxSaWRleTUzNFt1bmRlZmluZWRdfE1pY2hhZWxXaWNrZWR8ZXVucGNGdEI=", {
          method: "POST",
          body: formdata,
        })
        .then(response => response.text())
        .then(result => {
          let data = JSON.parse(result)
          if (data.status == 'OK') {
            if (data.issues.length > 0) {
              console.log('issues: ', data.issues)
            }
            // console.log(JSON.parse(method).method, data.status,data.results)
            return data.results
          }
        }).catch((error)=>{
          console.log(JSON.parse(method).method, data.status, error)
          return error
        })    
    },

    getToken() {
      let Host =
        import.meta.env.VITE_HOST
      var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };
      fetch(Host + "/.netlify/functions/getToken", requestOptions)
        .then(response => response.text())
        .then(result => {
          const res = JSON.parse(result)
          store.dispatch("token", res.access_token)
          store.dispatch("tokenExp", res['.expires'])
        })
        .catch(error => console.log('error', error));
      // return store.state.token
    },
    
    async postapiCall(method) {
      let token = store.state.token
      let expires = new Date(store.state.tokenExp).getTime()
      let now = new Date().getTime()
      if (expires < now) {
        console.log('refreshing token')
        this.getToken()
      }
      var requestOptions = {
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: method,
      }
      return await fetch("https://api.rentalcarmanager.com/v32/api", requestOptions)
      .then(response => response.text())
      .then(result => {return JSON.parse(result)})
    },
  }
}


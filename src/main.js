import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'

Vue.mixin({
  methods:
  {
    signRequest(body) {
      var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        var raw = JSON.stringify(body);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("https://allridey-rcm-app.herokuapp.com/signRequest.php", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

    },
  }
})

createApp(App).use(router).mount('#app')

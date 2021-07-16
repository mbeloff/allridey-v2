<template>
<div class="bg-gray-200 w-full h-full py-10">
  <div class="max-w-screen-lg mx-auto bg-white rounded shadow-xl place-items-center justify-center relative">
    <div v-if="loading" class="absolute grid place-items-center w-full h-full bg-gray-200 bg-opacity-80">
      <spinner></spinner>
    </div>
    <div class="w-full h-36">
      <iframe :src=" data.mapurl " style="border:0;" allowfullscreen="" width="100%" loading="lazy"></iframe>
    </div>
    <div class="p-5 text-left flex flex-col gap-3">
      <p class="font-bold text-lg text-blue-700">AllRidey {{data.location}}</p>
      <p><i class="fal fa-map-marker fa-fw text-blue-500"></i>{{data.address}}, {{data.suburb}} {{data.postcode}} {{data.state}}</p>
      <a :href="`tel:` + this.$store.state.phoneuri"><i class="fal fa-phone fa-fw text-blue-500"></i>{{this.$store.state.phone}}</a>

    <p class="text-red-500">display location specific data here</p>
    </div>
    
    
  </div>
</div>
  
</template>

<script>
import Spinner from '../components/Spinner.vue'
import Mixins from '../Mixins'
export default {
  components: {Spinner},
  data() {
    return {
      loading: true,
      data: {},
      all: []
    }
  },
  mounted() {
    if (this.$attrs.id) {
      this.getLocation(this.$attrs.id)
    } else {
      this.getall()
    }    
  },
  watch: {
    // ! get location via attr.id or derive from attr.name
    '$attrs.id': function() {
      this.loading = true
      this.getLocation(this.$attrs.id)
    },
    'id': function() {
      if (!this.$attrs.id) {
        this.loading = true
        this.getLocation(this.id)
      }      
    }
  },
  mixins: [Mixins],
  computed: {
    id() {
      if(!this.$attrs.id) {
          let name = this.$attrs.name
        let id
        this.all.forEach(el => {
          if(this.convert(el.location) == name) {
            id = el.id
          }
        })
        return id        
      }     
    },
  },
  methods: {   
    getall() {        
      var params = JSON.stringify({
        'method':'locationdetails'
      })
      Mixins.methods.apiCall(params).then(res=> this.all = res)
    },
    getLocation(id) {        
      var params = JSON.stringify({
        'method':'locationdetails',
        'id': id
      })
      Mixins.methods.apiCall(params).then(res=> this.data = res[0])  
      let _this = this
      setTimeout(function(){ _this.loading = false }, 1000);    
    },
    convert(str) {
      return str.replace(/\s+/g, '-').toLowerCase();
    }
  }
}
</script>

<style>

</style>
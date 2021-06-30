<template>
  <div class="rounded bg-opacity-90 w-full h-full p-1 flex flex-col gap-3">
    <p class="font-bold text-center">Payment</p>

    <div class="flex-grow flex flex-col">
      <iframe :src="url" frameborder="0" class="flex-grow"></iframe>
      <p>{{vaultnote}}</p>
    </div>
  </div>
</template>

<script>
import Mixins from '../Mixins'
export default {
  props: {
    reservation: Object
  },
  data() {
    return {
      url: "",
      vaultnote: "",
    }
  },
  mounted() {
    this.getVaultUrl()
  },
  mixins: [Mixins],
  methods: {
    getVaultUrl(){
      let params = JSON.stringify(
        // {"method":"getvaulturl","reservationref":this.reservation.reservationref}
        {"method":"getvaulturl","reservationref":'000023BD26C6D21'}
      )
      Mixins.methods.apiCall(params).then(res => {
        console.log(res),
        this.vaultnote = res.vaultnote
        this.url = atob(res.url)
        })
    }
  }
}
</script>

<style>

</style>
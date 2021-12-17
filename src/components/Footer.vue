<template>
  <div class="bg-gray-200 grid place-items-center h-32">
    <div class="gap-2 text-sm text-left grid grid-flow-col w-screen-lg">
      <a class="hover:underline" :href="test" download><i class=" far fa-file-pdf mr-2"></i>Terms and Conditions</a>  
      <router-link class="hover:underline" :to="'privacy'" download><i class=" far fa-file-pdf mr-2"></i>Privacy Policy</router-link>  
    </div>


    
    <div>
      <a :href="`mailto:` + this.$store.state.email"><i class="far fa-envelope mr-2"></i>{{this.$store.state.email}}</a>
      <p class="text-gray-500 text-xs self-end">© Allridey Pty Ltd | ACN: 
652772980</p>
    </div>
      
  </div>
</template>

<script>
import vraUrl from '../assets/ALLRIDEY-VRA.pdf?url'
export default {
  data() {
    return {
      test: vraUrl
    }
  }
}
</script>

<style>

</style>
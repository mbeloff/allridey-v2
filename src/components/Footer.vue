<template>
  <div class="bg-gray-200 grid place-items-center h-32">
    <div class="flex justify-center gap-2 text-sm text-left flex-col">
      <a :href="test" download><i class=" far fa-file-pdf mr-2"></i>Terms and Conditions</a>  
      <router-link :to="'privacy'" download><i class=" far fa-file-pdf mr-2"></i>Privacy Policy</router-link>  
    </div>


    
    <div>
      <a href="mailto:sales@allridey.com.au"><i class="far fa-envelope mr-2"></i>sales@allridey.com.au</a>
      <p class="text-gray-500 text-xs self-end">© Allridey Pty Ltd | ACN: 
652772980</p>
    </div>
      
  </div>
</template>

<script>
import vraUrl from '../assets/ALLRIDEY-VRA-02092020.pdf?url'
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
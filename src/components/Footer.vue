<template>
  <div class="bg-gray-200 grid place-items-center h-32">
    <div class="grid grid-cols-3 w-screen-lg">
      <div class=""></div>
    <div class="flex justify-center gap-2">
      <a :href="test" download><i class=" far fa-file-pdf mr-2"></i>Terms and Conditions</a>  
    </div>
    <div class="text-right text-sm">
      <!-- <p>94 Kennedy Dr
        <br>
        Cambridge 7170
        <br>
        TAS
      </p> -->
    </div>
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
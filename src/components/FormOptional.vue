<template>
  <div class="bg-white p-2 rounded bg-opacity-90 shadow-xl py-8 w-full text-left md:max-w-screen-lg mx-auto">
    <p class="font-bold text-lg mb-3">Optional Details</p>
    <div class="flex flex-col md:flex-row gap-3 mb-2">
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs mb-1 my-label">asd</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-user fa-fw"></i>
          <input type="text" id="" class="my-input">
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs mb-1 my-label">dfg</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-user fa-fw invisible"></i>
          <input type="text" id="" class="my-input">
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-3">
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs mb-1 my-label">hjk</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-at fa-fw"></i>
          <input type="text" id="" class="my-input">
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs mb-1 my-label">Pqwe</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-phone fa-fw"></i>
          <input type="text" id="" class="my-input">
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-3">
      
      <div class="flex flex-col md:w-1/2">
      <label for="travellers" class="text-xs mb-1 my-label">How Many Travelling?</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-users fa-fw"></i>
          <select id="travellers" class="my-input">
            <option value=""></option>
          </select>
        </div>
      </div>
      <div class="flex flex-col md:w-1/2"></div>
      </div>
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex flex-col md:w-1/2">
        <label for="" class="text-xs mb-1 my-label">Pqwe</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-phone fa-fw"></i>
          <input type="text" id="" class="my-input">
        </div>
        </div>
        <div class="flex flex-col md:w-1/2"></div>
      </div>
      
    </div>
</template>

<script>
  export default {
    props: {
      parameters: Object
    }
  }
</script>

<style>

</style>
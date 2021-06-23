<template>
  <div class="bg-white p-2 rounded bg-opacity-90 shadow-xl py-8 w-full text-left md:max-w-screen-lg mx-auto mt-5">
    <p class="font-bold text-lg mb-3">Customer Details (All Fields Required)</p>
    <div class="flex flex-col md:flex-row mx-auto gap-3 mb-2">
      <div class="flex flex-col w-full md:w-1/2 group">
        <label for="fName" class="text-xs mb-1 my-label">First Name</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-user fa-fw"></i>
          <input type="text" id="fName" class="my-input" v-model="parameters.customer.firstname">
        </div>
      </div>
      <div class="flex flex-col w-full md:w-1/2 group">
        <label for="lName" class="text-xs mb-1 my-label">Last Name</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-user fa-fw invisible"></i>
          <input type="text" id="lName" class="my-input" v-model="parameters.customer.lastname">
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-3">
      <div class="flex flex-col w-full md:w-1/2 group">
        <label for="email" class="text-xs mb-1 my-label">Email</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-at fa-fw"></i>
          <input type="email" id="email" class="my-input" v-model="parameters.customer.email">
        </div>
      </div>
      <div class="flex flex-col w-full md:w-1/2 group mb-2">
        <label for="phone" class="text-xs mb-1 my-label">Phone</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-phone fa-fw"></i>
          <input type="tel" id="phone" class="my-input" v-model="parameters.customer.phone">
        </div>
      </div>
    </div>
    <div v-if="mode == 2" class="flex flex-col md:flex-row gap-3">
      <date-picker v-model="dateofbirth" :max-date="new Date()" class="flex flex-col group w-full md:w-1/2">
        <template v-slot="{ inputValue, inputEvents }">
          <label for="" class="my-label">Date of Birth</label>
          <div class="flex flex-row place-items-center">
            <i class="mr-2 fal fa-calendar fa-fw"></i>
            <input class="my-input" :value="inputValue" v-on="inputEvents" />
          </div>
        </template>
      </date-picker>
      <div class="flex flex-col w-full md:w-1/2"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      mode: Number,
      parameters: Object
    },
    data() {
      return {
        dateofbirth: ""
      }
    },
    watch: {
      'dateofbirth': function () {
        this.parameters.customer.dateofbirth = this.dateofbirth.toLocaleDateString()
      }
    },
    mounted() {
      let d = new Date(1990, 0, 1)
      this.dateofbirth = d
    }
  }
</script>

<style>

</style>
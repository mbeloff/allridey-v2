<template>
  <div
    class="bg-white p-2 rounded shadow-xl py-8 w-full text-left md:max-w-screen-lg mx-auto mt-5"
  >
    <p class="font-bold text-lg mb-3">Required Details</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="fName" class="text-xs mb-1 my-label">First Name</label>
        <div class="flex flex-row place-items-center">
          <input
            id="fName"
            v-model="parameters.customer.firstname"
            maxlength="30"
            required
            type="text"
            class="my-input"
          />
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="lName" class="text-xs mb-1 my-label">Last Name</label>
        <div class="flex flex-row place-items-center">
          <input
            id="lName"
            v-model="parameters.customer.lastname"
            maxlength="40"
            required
            type="text"
            class="my-input"
          />
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="email" class="text-xs mb-1 my-label">Email</label>
        <div class="flex flex-row place-items-center">
          <input
            id="email"
            v-model="parameters.customer.email"
            maxlength="50"
            required
            type="email"
            class="my-input"
          />
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="phone" class="text-xs mb-1 my-label">Phone</label>
        <div class="flex flex-row place-items-center">
          <input
            id="phone"
            v-model="parameters.customer.mobile"
            maxlength="25"
            required
            type="tel"
            class="my-input"
          />
        </div>
      </div>

      <date-picker
        v-if="mode == 2"
        v-model="parameters.customer.dateofbirth"
        :max-date="new Date()"
        :model-config="dateconfig"
        class="flex flex-col flex-grow group"
      >
        <template #default="{ inputValue, inputEvents }">
          <label for="" class="my-label">Date of Birth</label>
          <div class="flex flex-row place-items-center">
            <i class="mr-2 fal fa-calendar fa-fw"></i>
            <input class="my-input" :value="inputValue" v-on="inputEvents" />
          </div>
        </template>
      </date-picker>
      <div class="flex flex-col flex-grow group"></div>
    </div>

    <div v-if="parameters.agentcode" class="pt-4">
      <p class="font-bold text-lg mb-3">Agent Use</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
        <div class="flex flex-col flex-grow group pointer-events-none">
          <label for="agentcode" class="text-xs mb-1 my-label"
            >Agency Code</label
          >
          <div class="flex flex-row place-items-center">
            <input
              id="agentcode"
              v-model="parameters.agentcode"
              maxlength="30"
              disabled
              required
              type="text"
              class="my-input text-gray-500 bg-gray-100"
            />
          </div>
        </div>
        <div class="flex flex-col flex-grow group">
          <label for="agentname" class="text-xs mb-1 my-label"
            >Agent Name</label
          >
          <div class="flex flex-row place-items-center">
            <input
              id="agentname"
              v-model="parameters.agentname"
              maxlength="40"
              required
              type="text"
              class="my-input"
            />
          </div>
        </div>
        <div class="flex flex-col flex-grow group">
          <label for="agentemail" class="text-xs mb-1 my-label"
            >Agent Email</label
          >
          <div class="flex flex-row place-items-center">
            <input
              id="agentemail"
              v-model="parameters.agentemail"
              maxlength="50"
              required
              type="email"
              class="my-input"
            />
          </div>
        </div>
        <div class="flex flex-col flex-grow group">
          <label for="agentrefno" class="text-xs mb-1 my-label"
            >Agent Voucher/Ref</label
          >
          <div class="flex flex-row place-items-center">
            <input
              id="agentrefno"
              v-model="parameters.agentrefno"
              maxlength="25"
              required
              type="text"
              class="my-input"
            />
          </div>
        </div>
        <div class="flex flex-col flex-grow group"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  mode: Number,
  parameters: Object,
})

const dateconfig = {
  type: 'string',
  mask: 'DD/MM/YYYY', //
}
</script>

<style></style>

<template>
  <div class="bg-gray-100 h-full py-20">
    <div
      class="container max-w-screen-lg mx-auto p-2 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 gap-5 items-start"
    >
      <div
        class="bg-white p-2 rounded-lg shadow-lg md:col-span-3 lg:col-span-3 relative"
      >
        <loading-overlay v-if="loading"></loading-overlay>

        <p class="font-bold text-xl py-2 text-left border-b mb-2">Contact Us</p>
        <div
          v-if="success != null"
          class="p-1 text-center h-20 grid items-center text-sm"
        >
          <p v-if="success == true" class="text-green-500">
            Message receieved. Thank you
          </p>
          <p v-if="success == false" class="text-red-500">
            Something went wrong. If this error persists, you can contact us via
            phone or email.
          </p>
        </div>

        <form
          v-show="success != true"
          class="p-1 text-left grid gap-2 grid-cols-1 md:grid-cols-2"
        >
          <div class="flex flex-col group">
            <label for="fname" class="my-label"
              ><span>First Name</span>
              <span class="font-normal text-gray-300">required</span></label
            >
            <div class="flex flex-row place-items-center">
              <input
                id="fname"
                v-model="form.fname"
                maxlength="30"
                required
                type="text"
                class="my-input"
                name="first name"
              />
            </div>
          </div>
          <div class="flex flex-col group">
            <label for="lname" class="my-label"
              >Last Name
              <span class="font-normal text-gray-300">required</span></label
            >
            <div class="flex flex-row place-items-center">
              <input
                id="lname"
                v-model="form.lname"
                maxlength="40"
                required
                type="text"
                name="surname"
                class="my-input"
              />
            </div>
          </div>
          <div class="flex flex-col group">
            <label for="email" class="my-label"
              >Email
              <span class="font-normal text-gray-300">required</span></label
            >
            <div class="flex flex-row place-items-center">
              <input
                id="email"
                v-model="form.email"
                maxlength="50"
                required
                type="email"
                class="my-input"
                name="email"
              />
            </div>
          </div>
          <div class="flex flex-col group">
            <label for="phone" class="my-label"
              >Phone
              <span class="font-normal text-gray-300">required</span></label
            >
            <div class="flex flex-row place-items-center">
              <input
                id="phone"
                v-model="form.phone"
                maxlength="25"
                required
                type="tel"
                class="my-input"
                name="phone"
              />
            </div>
          </div>
          <div class="flex flex-col group">
            <label for="resno" class="my-label flex-col lg:flex-row"
              ><span>Reservation or Quote Number</span>
              <span class="font-normal text-gray-300"
                >(if applicable)</span
              ></label
            >
            <div class="flex flex-row place-items-center">
              <input
                id="resno"
                v-model="form.resno"
                maxlength="10"
                type="text"
                class="my-input"
              />
            </div>
          </div>
          <div class="flex flex-col group">
            <label for="depot" class="my-label flex-col lg:flex-row"
              ><span>Location</span>
              <span class="font-normal text-gray-300"
                >(if applicable)</span
              ></label
            >
            <select id="depot" v-model="form.depot" class="my-input">
              <option value="" selected>---</option>
              <option
                v-for="loc in $store.state.locations"
                :key="loc.id"
                :vlaue="loc.location"
              >
                {{ loc.location }}
              </option>
            </select>
          </div>
          <div class="flex flex-col group col-span-full">
            <label for="message" class="my-label"
              >Message
              <span class="font-normal text-gray-300">required</span></label
            >
            <textarea
              id="message"
              v-model="form.message"
              maxlength="1500"
              rows="3"
              class="my-input"
            ></textarea>
          </div>
          <button
            class="btn btn-primary w-full col-span-full ml-auto sm:max-w-max px-16 mt-1"
            @click.prevent="submit()"
          >
            SUBMIT
          </button>
        </form>
      </div>
      <div
        class="md:col-span-2 lg:col-span-1 text-left text-sm flex flex-col gap-5"
      >
        <div class="bg-white rounded-lg shadow-lg p-2 pb-5">
          <p class="font-bold text-xl py-2 text-left border-b mb-2">
            Contact Details
          </p>
          <p>
            AUS:
            <a
              class="hover:underline decoration-blue-500 text-blue-700 hover:text-blue-500"
              :href="`tel:${$store.state.phone.replaceAll(' ', '')}`"
              >{{ $store.state.phone }}</a
            >
          </p>
          <p>
            NZ:
            <a
              class="hover:underline decoration-blue-500 text-blue-700 hover:text-blue-500"
              :href="`tel:${$store.state.phonenz.replaceAll(' ', '')}`"
              >{{ $store.state.phonenz }}</a
            >
          </p>
          <p>
            Email:
            <a
              class="hover:underline decoration-blue-500 text-blue-700 hover:text-blue-500 break-all"
              :href="'mailto:' + $store.state.email"
              >{{ $store.state.email }}</a
            >
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-2 pb-5">
          <p class="font-bold text-xl py-2 text-left border-b mb-3">About Us</p>
          <p class="text-xs text-gray-500">
            Allridey is a discount car rental company operating in
            {{ $store.state.locations.length }} locations around Australia. Our
            aim is to provide the best value car hire options with competitive
            rates and straight forward fees.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useHead, useSeoMeta } from '@vueuse/head'
import { computed } from 'vue'
export default {
  components: { LoadingOverlay },
  setup() {
    useHead({
      title: computed(() => 'Contact Us'),
      titleTemplate: (title) => `${title} | Allridey`,
      // script: [{ src: 'https://example.com/script.js' }],
      link: [
        {
          rel: 'canonical',
          href: computed(() => {
            return 'https://allridey.com.au/contact'
          }),
        },
      ],
    })
    useSeoMeta({
      description:
        'Get in touch with Allridey for the best deals on car hire in Aurstralia and New Zealand',
      ogDescription:
        'Get in touch with Allridey for the best deals on car hire in Aurstralia and New Zealand',
      ogTitle: 'Contact Allridey Car Hire',
      ogSite_name: 'Allridey',
      // ogImage: 'https://example.com/image.png',
      // twitterCard: 'summary_large_image',
      url: 'https://allridey.com.au/contact',
    })
  },
  data() {
    return {
      loading: false,
      success: null,
      form: {
        fname: '',
        lname: '',
        email: '',
        phone: '',
        resno: '',
        depot: '',
        message: '',
      },
    }
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  methods: {
    submit() {
      this.loading = true
      var requestOptions = {
        method: 'POST',
        body: JSON.stringify(this.form),
        redirect: 'follow',
      }
      fetch(
        import.meta.env.VITE_HOST + '/.netlify/functions/emailcontact',
        requestOptions
      )
        .then((response) => {
          if (response.ok) {
            return response.text()
          }
          throw new Error(response)
        })
        .then((result) => {
          this.loading = false
          console.log(result)
          if (result == 'Ok') {
            this.success = true
            this.form = {
              fname: '',
              lname: '',
              email: '',
              phone: '',
              resno: '',
              depot: '',
              message: '',
            }
          }
        })
        .catch((error) => {
          this.loading = false
          this.success = false
          console.log('failed to submit: ', JSON.stringify(error))
        })
    },
  },
}
</script>

<style lang="postcss" scoped>
.my-input {
  @apply w-full;
}

.my-label {
  @apply flex justify-between;
}
</style>

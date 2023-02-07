<template>
  <div class="bg-gray-200 grid place-items-center px-2">
    <div class="flex gap-10 py-10">
      <div class="gap-2 text-sm text-left flex flex-col">
        <a href="https://allridey.com.au">Allridey Car Hire Australia</a>
        <a href="https://allridey.co.nz">Allridey Car Hire New Zealand</a>
      </div>
      <div class="gap-2 text-sm text-left flex flex-col justify-between">
        <router-link :to="{ name: 'Contact' }"
          ><i class="fal fa-comment-alt mr-2 text-blue-500 fa-fw"></i> Contact
          Us</router-link
        >
        <a :href="$store.state.checkinurl"
          ><i class="fal fa-sign-in mr-2 text-blue-500 fa-fw"></i> Online
          Checkin</a
        >
        <div class="flex flex-col gap-1">
          <a class="hover:underline" href="/ALLRIDEY-vra.pdf" download
            ><i class="fal fa-file-pdf mr-2 text-blue-500 fa-fw"></i>Terms and
            Conditions</a
          >
          <router-link class="hover:underline" :to="'privacy'" download
            ><i class="fal fa-file-pdf mr-2 text-blue-500 fa-fw"></i>Privacy
            Policy</router-link
          >
        </div>
      </div>
    </div>

    <div>
      <a :href="`mailto:` + $store.state.email"
        ><i class="fal fa-envelope mr-2 text-blue-500"></i
        >{{ $store.state.email }}</a
      >
      <a href="/" class="left flex"
        ><img
          src="/src/assets/allridey_text_outline.svg"
          alt="Go to Allridey homepage"
          class="flex-grow w-32 md:w-48 py-5"
      /></a>
      <p class="text-gray-500 text-xs self-end pb-2">
        © Allridey Pty Ltd | ACN: 652772980
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    locations() {
      return this.$store.state.locations
    },
  },
}
</script>

<style></style>

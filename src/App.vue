<template>
  <div class="wrapper min-h-screen max-w-screen grid">
    <Nav v-if="this.$route.name != 'CheckPayment'" />
    <div class="z-0">
      <router-view />
    </div>

    <Footer v-if="this.$route.name != 'CheckPayment'" />
  </div>
</template>

<script>
  import Nav from './components/Navbar.vue'
  import Footer from './components/Footer.vue'
  export default {
    components: {
      Nav,
      Footer
    },
  }
</script>

<style lang="postcss">
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');

  #app {
    font-family: 'open Sans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .wrapper {
    display: grid;
    grid-template-rows: auto 1fr auto
  }

  @layer components {
    .btn {
      @apply px-4 py-2 font-bold rounded shadow
    }

    .btn-primary {
      @apply bg-gradient-to-tr from-blue-400 to-blue-600 text-white
    }

    .btn-primary:hover {
      @apply from-blue-800 to-blue-900 ring-2 ring-blue-200
    }

    .btn-secondary {
      @apply text-blue-600 rounded bg-gray-200 border shadow
    }

    .btn-secondary:hover {
      @apply bg-gradient-to-tr from-blue-500 to-blue-600 text-white
    }

    .my-label {
      @apply text-blue-800 font-bold text-xs mb-0.5 pl-8
    }

    .group:hover .my-label {
      @apply text-yellow-500
    }

    .group:hover i {
      @apply text-yellow-500
    }

    .my-input {
      @apply h-8 border flex-1 pl-1 bg-gray-200 rounded
    }
  }
</style>
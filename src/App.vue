<template>
  <div class="wrapper min-h-screen max-w-screen grid">
    <Nav v-if="$route.name != 'CheckPayment'" />
    <div class="z-0 min-h-screen">
      <router-view />
    </div>

    <Footer v-if="$route.name != 'CheckPayment'" />
  </div>
</template>

<script>
import Nav from './components/TheNavbar.vue'
import Footer from './components/TheFooter.vue'
export default {
  components: {
    Nav,
    Footer,
  },
}
</script>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

#app {
  font-family: 'Poppins', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.wrapper {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.btn {
  @apply px-4 py-2 rounded shadow;
}

.btn-primary {
  @apply bg-gradient-to-tr from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30;
}

.btn-primary:hover {
  @apply from-blue-800 to-blue-900 shadow-lg shadow-blue-800/30;
}

.btn-secondary {
  @apply text-blue-700 rounded bg-gray-200 shadow-inner;
}

.btn-secondary:hover {
  @apply bg-gradient-to-tr from-blue-500 to-blue-600 text-white;
}

.my-label {
  @apply text-blue-800 font-bold text-xs mb-0.5;
}

.my-label.has-icon {
  @apply pl-8;
}

.group:hover .my-label {
  @apply text-yellow-500;
}

.group:hover .form-i {
  @apply text-yellow-500;
}

.my-input {
  @apply border flex-1 pl-2 bg-gray-200 rounded py-3;
}
</style>

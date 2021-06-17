<template>
<div class="wrapper min-h-screen max-w-screen grid">
  <Nav />
  <div class=" z-0 main-content">
     <router-view />
  </div>
   
  <Footer />
</div>
</template>

<script setup>
import Nav from './components/Navbar.vue'
import Footer from './components/Footer.vue'
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
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
</style>

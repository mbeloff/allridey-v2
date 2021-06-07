<template>
<div class="wrapper h-screen w-screen grid">
  <Nav />
  <div class=" z-0 main-content">
     <router-view />
  </div>
   
  <Footer>
    <div class="h-8 bg-gray-200 grid place-items-center">
      <p class="text-gray-500">© Allridey | All rights reserved</p>
    </div>
  </Footer>
</div>
</template>

<script setup>
import Nav from './components/Navbar.vue'

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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

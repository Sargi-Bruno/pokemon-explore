<script setup>
import { RouterView } from 'vue-router'
import NavbarVue from './components/Navbar.vue';
</script>

<template>
  <NavbarVue />
  <RouterView />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

*, *::after, *::before {
  box-sizing: border-box; 
}

:root {
  --content-color: #f4f3f2;
  --background-color: #F5F5F5;
  --nav-bar-red: #F32424;
  --white: #fff;
  --blue: #00308F;
  --cyan: #41d0bd;
  --dark-gray: #18191A;
  --gray: #242526;
  --green: #66FF00;
  --yellow: #FEBE10;
  --red: #AA0000;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  background-color: var(--background-color);
}

button {
  font-family: 'Roboto', sans-serif;
}

.content {
  width: 75rem;
  margin-left: auto;
  margin-right: auto;
}
</style>

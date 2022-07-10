<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { 
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'

const auth = getAuth()
const router = useRouter()
const isLoggedIn = ref(false)

const handleLogout = () => {
  signOut(auth)
  router.push({ name: 'home' })
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if(user) isLoggedIn.value = true
    else isLoggedIn.value = false
  })
})
</script>

<template>
  <div class="nav-bar">
    <div class="title-container">
      <h1>
        Pokémon Explore
      </h1>
    </div>
    <div class="nav-container-background">
      <div class="nav-container">
        <RouterLink
          v-if="isLoggedIn === false"
          :to="{ name: 'home' }"
          class="link"
        >
          Home
        </RouterLink>
        <RouterLink 
          v-if="isLoggedIn === true"
          :to="{ name: 'explore' }"
          class="link"
        >
          Explore
        </RouterLink>
        
        <RouterLink 
          v-if="isLoggedIn === true"
          :to="{ name: 'my-pokemons' }"
          class="link"
        >
          My Pokémons
        </RouterLink>
        <RouterLink :to="{ name: 'pokedex' }" class="link">
          Pokédex
        </RouterLink>
        <RouterLink :to="{ name: 'pokemon-masters' }" class="link">
          Pokémon Masters
        </RouterLink>
        <button v-if="isLoggedIn === true" @click="handleLogout" class="logout-button">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-bar {
  height: 8rem;
  background-color: var(--nav-bar-red);
  box-shadow: 0 10px 10px rgb(0 0 0 / 12%);
  margin-bottom: 1rem;
}
.title-container {
  width: 75rem;
  margin-left: auto;
  margin-right: auto;
}
.title-container h1 {
  font-size: 36px;
  margin-top: 0;
  padding-top: 1rem;
  color: var(--dark-gray);
}
.nav-container-background {
  height: 3rem;
  display: flex;
  align-items: center;
  background-color: var(--dark-gray);
}
.nav-container {
  display: flex;
  align-items: center;
  width: 75rem;
  margin-left: auto;
  margin-right: auto;
}
.link {
  font-size: 20px;
  margin-right: 1.5rem;
  color: var(--white);
  text-decoration: none;
}
.logout-button {
  width: 4.5rem;
  height: 2rem;
  font-size: 16px;
  color: var(--white);
  background-color: var(--blue);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
}
</style>
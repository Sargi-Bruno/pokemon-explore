<script setup>
import { onMounted, ref } from 'vue';
import { getAuth } from 'firebase/auth'
import { 
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore'
import PokemonCardVue from '../components/PokemonCard.vue';
import { computed } from '@vue/reactivity';

const firestore = getFirestore()
const auth = getAuth()
const pokemons = ref([])

const pokemonList = computed(() => {
  return pokemons.value.sort((a, b) => a.name.localeCompare(b.name))
})

onMounted(async () => {
  const querySnapshot = await getDoc(doc(firestore, 'users', auth.currentUser.uid))

  pokemons.value = querySnapshot.data().pokemons
})
</script>

<template>
  <div class="content">
    <div v-if="pokemonList.length">
      <div class="title-container">
        <h1>My Pokémons</h1>
      </div>
      <div 
        class="pokemon-list-container"
      >
        <div v-for="pokemon in pokemonList">
          <PokemonCardVue 
            :pokemon="pokemon"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="title-container">
        <h1>You didn't catch any pokémons yet...</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  display: flex;
  justify-content: center;
}
.pokemon-list-container {
  display: grid;
  grid-template-columns: repeat(4, 18.75rem);
}
</style>
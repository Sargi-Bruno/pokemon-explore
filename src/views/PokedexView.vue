<script setup>
import { onMounted, ref } from 'vue';
import { 
  getFirestore,
  collection,
  getDocs,
} from 'firebase/firestore'
import PokemonCardVue from '../components/PokemonCard.vue';
import { computed } from '@vue/reactivity';

const firestore = getFirestore()
const pokemons = ref([])

const pokemonList = computed(() => {
  return pokemons.value.sort((a, b) => a.name.localeCompare(b.name))
})

onMounted(async () => {
  let docs = []

  const querySnapshot = await getDocs(collection(firestore, 'pokemons'))

  querySnapshot.docs.forEach((doc) => {
    docs.push({
      ...doc.data(),
      id: doc.id
    })
  })

  pokemons.value = docs
})
</script>

<template>
  <div class="content">
    <div class="title-container">
      <h1>Pokédex</h1>
    </div>
    <div class="list-container">
      <div v-for="pokemon in pokemonList">
        <PokemonCardVue 
          :pokemon="pokemon"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  display: flex;
  justify-content: center;
}
.list-container {
  display: grid;
  grid-template-columns: repeat(4, 18.75rem);
}
</style>
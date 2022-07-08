<script setup>
import { onMounted, ref } from 'vue';
import { 
    getFirestore,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore'

const firestore = getFirestore()
const pokemonMasters = ref([])

onMounted(async () => {
  let docs = []

  const usersRef = collection(firestore, 'users')
  const pokemonMastersRef = query(usersRef, where('pokemonMaster', '==', true))

  const querySnapshot = await getDocs(pokemonMastersRef)

  querySnapshot.docs.forEach((doc) => {
    docs.push({
      ...doc.data(),
      id: doc.id
    })
  })

  pokemonMasters.value = docs
})
</script>

<template>
  <div class="content">
    <div class="title-container">
      <h1>Pokém Masters</h1>
    </div>
    <div class="list-container">
      <div v-for="master in pokemonMasters" class="card">
        <img :src="master.pokemons[0].image" alt="first pokémon">
        <h1>{{ master.name }}</h1>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}
.card {
  display: flex;
  align-items: center;
  width: 40rem;
  height: 5rem;
  background-color: var(--content-color);
  margin-bottom: 2rem;
  padding: 1rem;
  box-shadow: 0 5px 10px rgb(0 0 0 / 12%);
  border-radius: 4px;
  cursor: pointer;
}
.card:hover h1 {
  color: var(--cyan);
}
.card img {
  height: 3rem;
  margin-right: 2rem;
}
</style>
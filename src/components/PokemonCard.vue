<script setup>
defineProps({
  pokemon: Object
})
</script>

<template>
  <div class="pokemon-card">
    <img :src="pokemon.image" alt="Pokémon Icon">
    <h1>{{ pokemon.name }}</h1>
  </div>
</template>

<style scoped>
.pokemon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 15.75rem;
  height: 15.75rem;
  background-color: var(--content-color);
  margin-bottom: 2rem;
  padding: 1rem;
  box-shadow: 0 5px 10px rgb(0 0 0 / 12%);
  border-radius: 4px;
  cursor: pointer;
}
.pokemon-card:hover h1 {
  color: var(--cyan);
}
.pokemon-card img {
  width: 10rem;
  height: 10rem;
}
.pokemon-card h1 {
  margin-top: .5rem;
  margin-bottom: 0;
}
</style>
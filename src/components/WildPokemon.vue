<script setup>
import { computed } from '@vue/reactivity'

const props = defineProps({
  pokemon: Object
})

const currentHpPercentage = computed(() => {
  const result = Math.floor((props.pokemon.currentHp / props.pokemon.hp) * 100)

  return `${result}%`
})

const hpBarColor = computed(() => {
  const result = Math.floor((props.pokemon.currentHp / props.pokemon.hp) * 100)

  if(result > 50) return '#66FF00'
  if(result > 20) return '#FEBE10'
  return '#AA0000'
})
</script>

<template>
  <div class="container">
    <div class="info">
      <h1>{{ pokemon.name }}</h1>
      <div class="hp-container">
        <h2>HP</h2>
        <div class="hp-bar">
          <div></div>
        </div>
      </div>
    </div>
    <div class="image-container">
      <img :src="pokemon.image" alt="Pokémon Icon">
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 16rem;
}
.info {
  width: 24rem;
  height: 8rem;
  padding: 1rem;
  background-color: var(--content-color);
  box-shadow: 0 5px 10px rgb(0 0 0 / 12%);
  border-radius: 4px;
}
.info h1 {
  margin: 0;
}
.hp-container {
  width: 15rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  margin-left: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: var(--dark-gray);
  border-radius: 200px;
}
.hp-container h2 {
  color: var(--red);
}
.hp-bar {
  width: 10rem;
  height: 1.5rem;
  border-radius: 200px;
}
.hp-bar div {
  width: v-bind(currentHpPercentage);
  height: 1.5rem;
  background-color: v-bind(hpBarColor);
  border-radius: 200px;
  transition: width 1s ease-in-out;
}
.image-container {
  margin: auto;
}
.image-container img {
  width: 15rem;
  height: 15rem;
}
</style>
<script setup>
import { computed } from '@vue/reactivity'
import { ref } from 'vue'

const props = defineProps({
  info: String,
  myPokemons: Array,
  myCurrentPokemon: Object,
})

const emit = defineEmits(['fight', 'capture', 'pokemon', 'run'])

const optionMenu = ref(true)
const fightMenu = ref(false)
const pokemonMenu = ref(false)

const isPokemonFainted = computed(() => {
  if(props.myCurrentPokemon.currentHp === 0) return true
  return false
})

const verifyChoosePokemon = (pokemon) => {
  if(pokemon.currentHp === 0) return true
  return false
}

const handleFight = () => {
  optionMenu.value = false
  fightMenu.value = true
}

const handleCapture = () => {
  emit('capture')
}

const handlePokemon = () => {
  optionMenu.value = false
  pokemonMenu.value = true
}

const handleRun = () => {
  emit('run')
}

const handleMove = (move) => {
  emit('fight', move)
  handleGoBack()
}

const handleChoosePokemon = (index) => {
  emit('pokemon', index)
  handleGoBack()
}

const handleGoBack = () => {
  optionMenu.value = true
  fightMenu.value = false
  pokemonMenu.value = false
}
</script>

<template>
  <div class="player-view">
    <div class="info">
      <h1>{{ info }}</h1>
    </div>
    <div>
      <div v-if="optionMenu" class="player-options">
        <button @click="handleFight" :disabled="isPokemonFainted" class="option">
          FIGHT
        </button>
        <button @click="handleCapture" :disabled="isPokemonFainted" class="option">
          CAPTURE
        </button>
        <button @click="handlePokemon" class="option">
          POKÉMON
        </button>
        <button @click="handleRun" class="option">
          RUN
        </button>
      </div>
      <div v-if="fightMenu" class="player-options">
        <button 
          v-for="(move, index) in myCurrentPokemon.moves" 
          :key="index"
          @click="handleMove(move)"
          class="option"
        >
          {{ move.name.toUpperCase() }}
        </button>
        <button @click="handleGoBack" class="option">
          GO BACK
        </button>
      </div>
      <div v-if="pokemonMenu">
        <div class="pokemon-options">
          <button 
            v-for="(pokemon, index) in myPokemons" 
            :key="index"
            @click="handleChoosePokemon(index)"
            :disabled="verifyChoosePokemon(pokemon)"
            class="choose-option"
          >
            <img :src="pokemon.image" alt="Pokémon Icon">
            {{ pokemon.name.toUpperCase() }}
          </button>
        </div>
        <button @click="handleGoBack" class="pokemon-go-back">
          GO BACK
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-view {
  display: flex;
  min-height: 14rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--content-color);
  box-shadow: 0 5px 10px rgb(0 0 0 / 12%);
  border: 2px solid var(--gray);
  border-radius: 4px;
}
.player-view h1 {
  margin: 0;
}
.info {
  margin-top: 1rem;
  margin-right: 2rem;
  width: 60%;
}
.player-options {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 16rem);
  row-gap: 2rem;
}
.option {
  width: fit-content;
  padding: .5rem;
  cursor: pointer;
  border: 2px solid transparent;
  font-size: 32px;
  font-weight: bold;
}
.option:hover {
  border: 2px solid var(--cyan);
}
.pokemon-options {
  width: 30rem;
  height: 9rem;
  overflow: auto;
}
.choose-option {
  display: flex;
  align-items: center;
  width: fit-content;
  padding: .5rem;
  cursor: pointer;
  border: 2px solid transparent;
  font-size: 32px;
  font-weight: bold;
}
.choose-option:hover {
  border: 2px solid var(--cyan);
}
.choose-option img {
  width: 3rem;
  height: 3rem;
  margin-right: 2rem;
}
.pokemon-go-back {
  width: fit-content;
  padding: .5rem;
  cursor: pointer;
  border: 2px solid transparent;
  font-size: 32px;
  font-weight: bold;
}
.pokemon-go-back:hover {
  border: 2px solid var(--cyan);
}
</style>
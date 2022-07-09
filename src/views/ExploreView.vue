<script setup>
import { onMounted, ref, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { 
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import PokemonCardVue from '../components/PokemonCard.vue'
import WildPokemonVue from '../components/WildPokemon.vue'
import MyPokemonVue from '../components/MyPokemon.vue'
import PlayerViewVue from '../components/PlayerView.vue'
import pokemonBattleMusic from '../assets/pokemonBattleMusic.mp3'
import VolumeUp from '../assets/volumeUp.svg'
import VolumeOff from '../assets/volumeOff.svg'

const auth = getAuth()
const firestore = getFirestore()
const loading = ref(true)
const playSound = ref(true)
const pokemons = ref([])
const myPokemons = ref([])
const pokemonMaster = ref()
const gameStarted = ref(false)
const wildPokemon = ref()
const myCurrentPokemon = ref()
const info = ref('')
const gameInfo = ref('Explore the wild to find pokémons')
const battleMusic = new Audio(pokemonBattleMusic)
battleMusic.volume = 0.1

const bulbasaur = {
  name: 'Bulbasaur',
  image: 'https://firebasestorage.googleapis.com/v0/b/pokemon-mini-game-vue.appspot.com/o/bulbasaur.svg?alt=media&token=9d42b5ec-c5a0-4acc-9d70-5082259263b6'
}
const charmander = {
  name: 'Charmander',
  image: 'https://firebasestorage.googleapis.com/v0/b/pokemon-mini-game-vue.appspot.com/o/charmander.svg?alt=media&token=73205d49-69e3-4787-b5ce-13c6617ab53f'
}
const squirtle = {
  name: 'Squirtle',
  image: 'https://firebasestorage.googleapis.com/v0/b/pokemon-mini-game-vue.appspot.com/o/squirtle.svg?alt=media&token=70ed2090-f26f-42ed-8086-dc8326a45a56'
}

onMounted(async () => {
  let docs = []

  const pokemonsSnapshot = await getDocs(collection(firestore, 'pokemons'))
  const myPokemonsSnapshot = await getDoc(doc(firestore, 'users', auth.currentUser.uid))

  pokemonsSnapshot.docs.forEach((doc) => {
    docs.push({
      ...doc.data(),
      id: doc.id
    })
  })

  pokemons.value = docs
  myPokemons.value = myPokemonsSnapshot.data().pokemons
  pokemonMaster.value = myPokemonsSnapshot.data().pokemonMaster

  loading.value = false
})

const handleChooseFirstPokemon = (pokemonName) => {
  const pokemon = pokemons.value.find(value => value.name === pokemonName)
  myPokemons.value.push(pokemon)
}

const handleVerifyAvailablePokemons = () => {
  for(const pokemon of myPokemons.value) {
    if(pokemon.currentHp > 0) return true
  }
  
  return false
}

const handleWildPokemonAttack = () => {
  const i = Math.floor(Math.random() * 2)
  const chanceToHit = Math.floor(Math.random() * 101)
  const chanceToEvade = Math.floor(Math.random() * 101)

  if(chanceToHit <= wildPokemon.value.moves[i].accuracy) {
    if(chanceToEvade > myCurrentPokemon.value.evasion) {
      let damage = wildPokemon.value.moves[i].damage - myCurrentPokemon.value.defense
      if(damage < 0) {
        info.value += ` ${wildPokemon.value.name} used ${wildPokemon.value.moves[i].name}, but ${myCurrentPokemon.value.name} blocked! What should ${myCurrentPokemon.value.name} do?`
      } else {
        let newCurrentHp = myCurrentPokemon.value.currentHp - damage
        if(newCurrentHp <= 0) {
          myCurrentPokemon.value.currentHp = 0
          const isOtherPokemonAvailable = handleVerifyAvailablePokemons()
          if(isOtherPokemonAvailable) {
            info.value += ` ${myCurrentPokemon.value.name} fainted! Choose another pokémon to fight!`
          } else {
            info.value += ` ${myCurrentPokemon.value.name} fainted! You're out o pokémons! Run!`
          } 
        } else {
          myCurrentPokemon.value.currentHp = newCurrentHp
          info.value += ` ${wildPokemon.value.name} used ${wildPokemon.value.moves[i].name}! What should ${myCurrentPokemon.value.name} do?`
        }    
      }
    } else {
      info.value += ` ${wildPokemon.value.name} used ${wildPokemon.value.moves[i].name}, but ${myCurrentPokemon.value.name} evaded! What should ${myCurrentPokemon.value.name} do?`
    }
  } else {
    info.value += ` ${wildPokemon.value.name} used ${wildPokemon.value.moves[i].name}, but it missed! What should ${myCurrentPokemon.value.name} do?`
  }
}

const handleHealPokemons = () => {
  myPokemons.value.forEach((e, index) => {
    myPokemons.value[index].currentHp = myPokemons.value[index].hp
  })

  myCurrentPokemon.value.currentHp = myCurrentPokemon.value.hp
}

const handleExplore = () => {
  const i = Math.floor(Math.random() * 10)
  wildPokemon.value = {...pokemons.value[i]}
  myCurrentPokemon.value = myPokemons.value[0]

  handleHealPokemons()

  gameStarted.value = true
  gameInfo.value = 'Explore the wild to find pokémons'

  if(myCurrentPokemon.value.speed < wildPokemon.value.speed) handleWildPokemonAttack()
  else info.value = `A wild ${wildPokemon.value.name} appeared! What should ${myCurrentPokemon.value.name} do?`
}

const handleRun = () => {
  gameStarted.value = false
  info.value = ''
  handleHealPokemons()
}

const handleCapture = () => {
  const value = Math.floor(Math.random() * 101)
  const hpInPercentage = Math.floor((wildPokemon.value.currentHp / wildPokemon.value.hp) * 100)
  let chanceToCapture

  if(hpInPercentage <= 20) chanceToCapture = 95
  else if(hpInPercentage < 50 && hpInPercentage > 21) chanceToCapture = 70
  else chanceToCapture = 30

  if(value <= chanceToCapture) {
    info.value = ''
    gameStarted.value = false
    myPokemons.value.push(wildPokemon.value)
    gameInfo.value = `You have captured ${wildPokemon.value.name}!`
    
  } else {
    info.value = `You tried to capture ${wildPokemon.value.name}, but it escaped!`
    handleWildPokemonAttack()
  }
}

const handleFight = (move) => {
  const chanceToHit = Math.floor(Math.random() * 101)
  const chanceToEvade = Math.floor(Math.random() * 101)

  if(chanceToHit <= move.accuracy) {
    if(chanceToEvade > wildPokemon.value.evasion) {
      let damage = move.damage - wildPokemon.value.defense
      if(damage < 0) {
        info.value = `${myCurrentPokemon.value.name} used ${move.name}, but ${wildPokemon.value.name} blocked!`
      } else {
        let newCurrentHp = wildPokemon.value.currentHp - damage
        if(newCurrentHp <= 0) {
          wildPokemon.value.currentHp = 0
          info.value = `${myCurrentPokemon.value.name} used ${move.name}, ${wildPokemon.value.name} fainted!`
          handleHealPokemons()
          gameStarted.value = false
          gameInfo.value = `${wildPokemon.value.name} fainted!`
        } else {
          wildPokemon.value.currentHp = newCurrentHp
          info.value = `${myCurrentPokemon.value.name} used ${move.name}!`
          handleWildPokemonAttack()
        }
      }
    } else {
      info.value = `${myCurrentPokemon.value.name} used ${move.name}, but ${wildPokemon.value.name} evaded!`
      handleWildPokemonAttack()
    }
  } else {
    info.value = `${myCurrentPokemon.value.name} used ${move.name}, but it missed!`
    handleWildPokemonAttack()
  }
}

const handlePokemon = (index) => {
  myCurrentPokemon.value = myPokemons.value[index]
  info.value = `Go! ${myCurrentPokemon.value.name}!`

  if(wildPokemon.value.speed > myCurrentPokemon.value.speed) handleWildPokemonAttack()
}

const verifyPokemonsMaster = () => {
  const uniquePokemons = [...new Set(myPokemons.value.map(pokemon => pokemon.name))]

  if(uniquePokemons.length === 10) {
    return true
  }

  return false
}

watch([gameStarted, playSound], () => {
  if(!playSound.value) {
    battleMusic.pause()
    battleMusic.currentTime = 0
    return
  }

  if(gameStarted.value) battleMusic.play()
  else {
    battleMusic.pause()
    battleMusic.currentTime = 0
  }
})

watch(myPokemons, () => {
  if(loading.value) return
  if(myPokemons.value.length === 0) return

  if(verifyPokemonsMaster()) {
    const update = {
      pokemons: myPokemons.value,
      pokemonMaster: true
    }

    pokemonMaster.value = true

    updateDoc(doc(firestore, 'users', auth.currentUser.uid), update)
  } else {
    const update = {
      pokemons: myPokemons.value,
    }

    updateDoc(doc(firestore, 'users', auth.currentUser.uid), update)
  }
}, { deep: true })
</script>

<template>
  <div v-if="!loading" class="content">
    <div class="volume-row">
      <button v-if="playSound" @click="playSound = false">
        <img :src="VolumeUp" alt="Volume Up">
      </button>
      <button v-else @click="playSound = true">
        <img :src="VolumeOff" alt="Volume Off">
      </button>
    </div>
    <div v-if="!myPokemons.length">
      <div class="title-container">
        <h1>Start your journey!</h1>
      </div>
      <div class="choose-pokemon-container">
        <PokemonCardVue 
          :pokemon="bulbasaur"
          @click="handleChooseFirstPokemon('Bulbasaur')"
        />
        <PokemonCardVue 
          :pokemon="charmander"
          @click="handleChooseFirstPokemon('Charmander')"
        />
        <PokemonCardVue 
          :pokemon="squirtle"
          @click="handleChooseFirstPokemon('Squirtle')"
        />
      </div>
    </div>
    <div v-else>
      <div v-if="!gameStarted" class="explore-container">
        <h1 v-if="pokemonMaster" class="pokemon-master-title">
          You got them all! You're now a Pokém Master!
        </h1>
        <h1>{{ gameInfo }}</h1>
        <button @click="handleExplore">
          EXPLORE
        </button>
      </div>
      <div v-else class="game-container">
        <WildPokemonVue :pokemon="wildPokemon" />
        <MyPokemonVue :pokemon="myCurrentPokemon" />
        <PlayerViewVue 
          :info="info"
          :my-current-pokemon="myCurrentPokemon"
          :my-pokemons="myPokemons"
          :play-sound="playSound"
          @fight="handleFight"
          @capture="handleCapture"
          @pokemon="handlePokemon"
          @run="handleRun"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.volume-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  margin-bottom: -2rem;
}
.volume-row button {
  width: 2.5rem;
  height: 2.5rem;
  background: none;
  border: none;
  cursor: pointer;
}
.volume-row img {
  width: 2rem;
  height: 2rem;
}
.title-container {
  display: flex;
  justify-content: center;
}
.title-container h1 {
  font-size: 48px;
  margin-bottom: 2rem;
}
.choose-pokemon-container {
  display: flex;
  justify-content: space-around;
}
.game-container {
  margin-top: 2rem;
}
.explore-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15rem;
}
.explore-container button {
  width: 12rem;
  height: 3rem;
  font-size: 28px;
  color: var(--white);
  background-color: var(--nav-bar-red);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
.pokemon-master-title {
  color: var(--nav-bar-red);
}
</style>
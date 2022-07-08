<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

const firestore = getFirestore()
const auth = getAuth()
const router = useRouter()
const loading = ref(true);

const handleSignIn = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
    .then(async () => {
      const querySnapshot = await getDoc(doc(firestore, 'users', auth.currentUser.uid))

      if(querySnapshot.data()) {
        router.push({ name: 'explore' })

      } else {
        const newUser = {
          name: auth.currentUser.displayName,
          pokemons: [],
          pokemonMaster: false
        }

        setDoc(doc(firestore, 'users', auth.currentUser.uid), newUser)
        router.push({ name: 'explore' })
      }
    })
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if(user) {
      router.push({ name: 'explore' })
    } else {
      loading.value = false
    }
  })
})
</script>

<template>
  <div v-if="!loading" class="content">
    <div class="home-container">
      <h1>Welcome to Pokémon Explore</h1>
      <h2>Choose your first pokémon</h2>
      <h2>Explore the wildness to find more pokémons</h2>
      <h2>Catch them all to win!</h2>
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/pokemon-mini-game-vue.appspot.com/o/Pokemon-Pokeball.png?alt=media&token=c5a4f119-647f-4429-90ec-1b869fa32b0b" 
        alt="Pokeball"
      >
      <button @click="handleSignIn">Start</button>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.home-container h2 {
  margin-top: 0;
  margin-bottom: .75rem;
}
.home-container img {
  height: 14rem;
}
.home-container button {
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
</style>
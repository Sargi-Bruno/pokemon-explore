import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyB6IgqQTH2beRRq4rF2_TO5nFLr5t8olXY",
  authDomain: "pokemon-mini-game-vue.firebaseapp.com",
  projectId: "pokemon-mini-game-vue",
  storageBucket: "pokemon-mini-game-vue.appspot.com",
  messagingSenderId: "249626881275",
  appId: "1:249626881275:web:1eebbbf8d8b59620d1145e"
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(router)

app.mount('#app')

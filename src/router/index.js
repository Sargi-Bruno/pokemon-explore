import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { 
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pokedex',
      name: 'pokedex',
      component: () => import('../views/PokedexView.vue'),
    },
    {
      path: '/pokemon-masters',
      name: 'pokemon-masters',
      component: () => import('../views/PokemonMastersView.vue'),
    },
    {
      path: '/my-pokemons',
      name: 'my-pokemons',
      component: () => import('../views/MyPokemonsView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    },
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(), 
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(await getCurrentUser()) {
      next()
    } else {
      next({name: 'login'})
    }
  } else {
    next()
  }
})

export default router
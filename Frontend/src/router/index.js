import { createWebHistory, createRouter } from 'vue-router'

import HomeScreen from '../views/Home.vue'
import StartScreen from '../views/Start.vue'
import TremorScreen from '../views/Tremor.vue'
import VoiceScreen from '../views/Voice.vue'
import WriteScreen from '../views/Write.vue'

const routes = [
  { path: '/', component: StartScreen },
  { path: '/home', component: HomeScreen },
  { path: '/tremor', component: TremorScreen },
  { path: '/voice', component: VoiceScreen },
  { path: '/write', component: WriteScreen },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
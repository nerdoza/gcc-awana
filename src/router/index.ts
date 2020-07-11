import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const isCordova = typeof process.env.CORDOVA_PLATFORM !== 'undefined'
const isElectron = typeof process.env.IS_ELECTRON !== 'undefined'

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: async () => await import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: isCordova || isElectron ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

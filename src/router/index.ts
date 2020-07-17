import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { isWeb } from '@/const'
import AuthStart from '@/views/authStart.vue'
import AuthVerification from '@/views/authVerification.vue'
import Registration from '@/views/registration.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/auth',
    name: 'AuthStart',
    component: AuthStart
  },
  {
    path: '/auth-verify',
    name: 'AuthVerification',
    component: AuthVerification
  },
  {
    path: '/registration/:step',
    name: 'Registration',
    component: Registration,
    props: route => ({ step: +(route.params.step ?? 1) })
  },
  {
    path: '/registration',
    redirect: '/registration/1'
  },
  {
    path: '/*',
    redirect: '/auth'
  }
]

const router = new VueRouter({
  mode: isWeb ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

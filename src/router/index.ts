import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { isWeb } from '@/const'
import { vxm } from '@/store'
import AuthStart from '@/views/authStart.vue'
import AuthVerification from '@/views/authVerification.vue'
import Dashboard from '@/views/dashboard.vue'
import Landing from '@/views/landing.vue'
import SignUp from '@/views/signUp.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
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
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/*',
    redirect: '/'
  }
]

const unauthenticatedRoutes = ['Landing', 'AuthStart', 'AuthVerification']

const router = new VueRouter({
  mode: isWeb ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const defaultRoute = vxm.auth.defaultRoute
  if (!vxm.auth.authenticated && !unauthenticatedRoutes.includes(to.name ?? '')) {
    return next(defaultRoute)
  } else if (vxm.auth.authenticated && unauthenticatedRoutes.includes(to.name ?? '')) {
    return next(defaultRoute)
  }
  next()
})

export default router

import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { isWeb } from '@/const'
import { vxm } from '@/store'
import AuthStart from '@/views/authStart.vue'
import AuthVerification from '@/views/authVerification.vue'
import Landing from '@/views/landing.vue'
import Registration from '@/views/registration.vue'

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
  if (!vxm.auth.authenticated && !unauthenticatedRoutes.includes(to.name ?? '')) {
    return next({ name: 'AuthStart' })
  } else if (vxm.auth.authenticated && unauthenticatedRoutes.includes(to.name ?? '')) {
    return next({ name: 'Registration', params: { step: '1' } })
  }
  next()
})

export default router

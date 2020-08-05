import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Admin from '@/components/dashboard/admin.vue'
import Director from '@/components/dashboard/director.vue'
import Leader from '@/components/dashboard/leader.vue'
import Parent from '@/components/dashboard/parent.vue'
import Updates from '@/components/dashboard/updates.vue'
import User from '@/components/dashboard/user.vue'
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
    component: Dashboard,
    children: [
      {
        path: '',
        redirect: 'updates'
      },
      {
        path: 'user',
        name: 'User',
        component: User
      },
      {
        path: 'updates',
        name: 'Updates',
        component: Updates
      },
      {
        path: 'parent',
        name: 'ParentTools',
        component: Parent
      },
      {
        path: 'leader',
        name: 'LeaderTools',
        component: Leader
      },
      {
        path: 'director',
        name: 'DirectorTools',
        component: Director
      },
      {
        path: 'admin',
        name: 'AdminTools',
        component: Admin
      }
    ]
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

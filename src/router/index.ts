import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { isWeb } from '@/const'
import Dashboard from '@/views/dashboard.vue'
import Calendar from '@/views/dashboard/calendar.vue'
import Landing from '@/views/landing.vue'
import Privacy from '@/views/privacy.vue'
import Terms from '@/views/terms.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy
  },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        redirect: 'calendar'
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: Calendar,
        meta: {
          title: 'Club Calendar'
        }
      }
    ]
  },
  {
    path: '/*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: isWeb ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { isWeb } from '@/const'
import { vxm } from '@/store'
import AuthStart from '@/views/authStart.vue'
import AuthVerification from '@/views/authVerification.vue'
import Dashboard from '@/views/dashboard.vue'
import Admin from '@/views/dashboard/admin.vue'
import Leader from '@/views/dashboard/leader.vue'
import Parent from '@/views/dashboard/parent.vue'
import Updates from '@/views/dashboard/updates.vue'
import User from '@/views/dashboard/user.vue'
import DirectorClubberEdit from '@/views/director/clubberEdit.vue'
import DirectorClubbersList from '@/views/director/clubbersList.vue'
import Landing from '@/views/landing.vue'
import Privacy from '@/views/privacy.vue'
import SignUp from '@/views/signUp.vue'
import AppUserEdit from '@/views/superUser/appUserEdit.vue'
import AppUsersList from '@/views/superUser/appUsersList.vue'
import SuperClubberCreate from '@/views/superUser/clubberCreate.vue'
import SuperClubberEdit from '@/views/superUser/clubberEdit.vue'
import SuperClubbersList from '@/views/superUser/clubbersList.vue'
import NotificationCreate from '@/views/superUser/notificationCreate.vue'
import NotificationEdit from '@/views/superUser/notificationEdit.vue'
import NotificationsList from '@/views/superUser/notificationsList.vue'
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
        component: Updates,
        meta: {
          title: 'Weekly Updates'
        }
      },
      {
        path: 'parent',
        name: 'ParentTools',
        component: Parent,
        meta: {
          title: 'Parent Tools'
        }
      },
      {
        path: 'leader',
        name: 'LeaderTools',
        component: Leader,
        meta: {
          title: 'Leader Tools'
        }
      },
      {
        path: 'admin',
        name: 'AdminTools',
        component: Admin,
        meta: {
          title: 'Admin Tools'
        }
      },
      {
        path: 'director/clubbers',
        name: 'DirectorClubbersList',
        component: DirectorClubbersList,
        meta: {
          title: 'Director Tools'
        }
      },
      {
        path: 'director/clubbers/:cid',
        name: 'DirectorClubberEdit',
        component: DirectorClubberEdit,
        props: true,
        meta: {
          title: 'Director Tools'
        }
      },
      {
        path: 'super/notifications',
        name: 'NotificationsList',
        component: NotificationsList,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/notifications/create',
        name: 'NotificationCreate',
        component: NotificationCreate,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/notifications/:nid',
        name: 'NotificationEdit',
        component: NotificationEdit,
        props: true,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/app-users',
        name: 'AppUsersList',
        component: AppUsersList,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/app-users/:uid',
        name: 'AppUserEdit',
        component: AppUserEdit,
        props: true,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/clubbers',
        name: 'SuperClubbersList',
        component: SuperClubbersList,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/clubbers/create',
        name: 'SuperClubberCreate',
        component: SuperClubberCreate,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/clubbers/:cid',
        name: 'SuperClubberEdit',
        component: SuperClubberEdit,
        props: true,
        meta: {
          title: 'Super User Tools'
        }
      }
    ]
  },
  {
    path: '/*',
    redirect: '/'
  }
]

const unauthenticatedRoutes = ['Landing', 'AuthStart', 'AuthVerification']
const openRoutes = ['Terms', 'Privacy']

const router = new VueRouter({
  mode: isWeb ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const defaultRoute = vxm.user.defaultRoute
  if (openRoutes.includes(to.name ?? '')) {
    return next()
  }
  if (!vxm.user.authenticated && !unauthenticatedRoutes.includes(to.name ?? '')) {
    return next(defaultRoute)
  } else if (vxm.user.authenticated && unauthenticatedRoutes.includes(to.name ?? '')) {
    return next(defaultRoute)
  }
  next()
})

export default router

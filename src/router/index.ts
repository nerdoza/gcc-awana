import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import ClubberProgressCard from '@/components/cards/clubberProgressCard.vue'
import { isWeb } from '@/const'
import { vxm } from '@/store'
import AdminClubbersList from '@/views/admin/clubbersList.vue'
import AdminClubberView from '@/views/admin/clubberView.vue'
import AuthStart from '@/views/authStart.vue'
import AuthVerification from '@/views/authVerification.vue'
import Dashboard from '@/views/dashboard.vue'
import Calendar from '@/views/dashboard/calendar.vue'
import Updates from '@/views/dashboard/updates.vue'
import User from '@/views/dashboard/user.vue'
import DirectorClubberEdit from '@/views/director/clubberEdit.vue'
import DirectorClubbersList from '@/views/director/clubbersList.vue'
import DirectorUpdateCreate from '@/views/director/updateCreate.vue'
import DirectorUpdateEdit from '@/views/director/updateEdit.vue'
import DirectorUpdatesList from '@/views/director/updatesList.vue'
import Landing from '@/views/landing.vue'
import LeaderClubbersList from '@/views/leader/clubbersList.vue'
import LeaderClubberView from '@/views/leader/clubberView.vue'
import ParentClubbersList from '@/views/parent/clubbersList.vue'
import ParentClubberView from '@/views/parent/clubberView.vue'
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
import SuperUpdateCreate from '@/views/superUser/updateCreate.vue'
import SuperUpdateEdit from '@/views/superUser/updateEdit.vue'
import SuperUpdatesList from '@/views/superUser/updatesList.vue'
import Terms from '@/views/terms.vue'
import Tutorial from '@/views/tutorial.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    component: Tutorial
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
        component: User,
        meta: {
          title: 'My Profile'
        }
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
        path: 'calendar',
        name: 'Calendar',
        component: Calendar,
        meta: {
          title: 'Club Calendar'
        }
      },
      {
        path: 'parent/clubbers',
        name: 'ParentClubbersList',
        component: ParentClubbersList,
        meta: {
          title: 'My Clubbers'
        }
      },
      {
        path: 'parent/clubbers/:cid',
        name: 'ParentClubberView',
        component: ParentClubberView,
        props: true,
        meta: {
          title: 'My Clubbers'
        }
      },
      {
        path: 'leader/clubbers',
        name: 'LeaderClubbersList',
        component: LeaderClubbersList,
        meta: {
          title: 'Leader Tools'
        }
      },
      {
        path: 'leader/clubbers/:cid',
        name: 'LeaderClubberView',
        component: LeaderClubberView,
        props: true,
        meta: {
          title: 'Leader Tools'
        }
      },
      {
        path: 'admin/clubbers',
        name: 'AdminClubbersList',
        component: AdminClubbersList,
        meta: {
          title: 'Admin Tools'
        }
      },
      {
        path: 'admin/clubbers/:cid',
        name: 'AdminClubberView',
        component: AdminClubberView,
        props: true,
        meta: {
          title: 'Admin Tools'
        }
      },
      {
        path: 'director/updates',
        name: 'DirectorUpdatesList',
        component: DirectorUpdatesList,
        meta: {
          title: 'Director Tools'
        }
      },
      {
        path: 'director/updates/create',
        name: 'DirectorUpdateCreate',
        component: DirectorUpdateCreate,
        meta: {
          title: 'Director Tools'
        }
      },
      {
        path: 'director/updates/:uid',
        name: 'DirectorUpdateEdit',
        component: DirectorUpdateEdit,
        props: true,
        meta: {
          title: 'Director Tools'
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
        path: 'director/clubbers/:cid/progress',
        name: 'DirectorClubberProgress',
        component: ClubberProgressCard,
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
        path: 'super/updates',
        name: 'SuperUpdatesList',
        component: SuperUpdatesList,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/updates/create',
        name: 'SuperUpdateCreate',
        component: SuperUpdateCreate,
        meta: {
          title: 'Super User Tools'
        }
      },
      {
        path: 'super/updates/:uid',
        name: 'SuperUpdateEdit',
        component: SuperUpdateEdit,
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
      },
      {
        path: 'super/clubbers/:cid/progress',
        name: 'SuperClubberProgress',
        component: ClubberProgressCard,
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
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (typeof savedPosition === 'object' && savedPosition !== null) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
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

import Vue from 'vue'
import Router from 'vue-router'
import { addDynamicRoutes } from '@/utils/router'
import { menu } from '@/config/menu-config'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)


const routes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    component: () => import('@/views/layout/Layout'),
    children: [{
      path: '',
      component: () => import('@/views/Home')
    }]
  }
]

const router = new Router({routes})

router.beforeEach((to, from, next) => {
  let username = sessionStorage.getItem('username')
  let role = sessionStorage.getItem('role')
  if (menu.length != 0) {
    next()
    return
  }
  if (to.path === '/login') {
    if (username) {
      next( { path: '/home' })
    } else {
      next()
    } 
  } else {
    if (username) {
      addDynamicRoutes(role)
      next(to)
  
    } else {
      next({ path: '/login' })
    }
  }
})
export default router


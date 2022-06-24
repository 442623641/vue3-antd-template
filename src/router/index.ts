import { createRouter, createWebHashHistory } from "vue-router"
import Layout from '@/layout/index.vue'
import type { RouteRecordRaw } from 'vue-router'
import { homeRouting } from "@/pages/home/home.routing"
import { aboutRouting } from "@/pages/about/about.routing"

export const constantRoutes: RouteRecordRaw[] = [
  homeRouting,
  aboutRouting,
  {
    path: '/',
    component: Layout,
    redirect: '/home'
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteRecordRaw[] = [
]

const router = createRouter({
  // process.env.BASE_URL
  history: createWebHashHistory(''),
  scrollBehavior: (to: any, from: any, savedPosition: any) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: constantRoutes,
});


// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { path } = route;
    // if (path && !constantRoutes.some((n) => n === path)) {
    //   router.hasRoute(path) && router.removeRoute(path);
    // }
  });
}

export default router

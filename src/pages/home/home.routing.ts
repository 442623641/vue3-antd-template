
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const homeRouting: RouteRecordRaw = {
  path: '/home',
  component: Layout,
  redirect: '/home',
  children: [{
    path: '',
    component: () => import(/* webpackChunkName: "home-page" */ '@/pages/home/home.page.vue'),
    name: 'home-page',
    meta: {
      title: 'home',
    }
  }]
}
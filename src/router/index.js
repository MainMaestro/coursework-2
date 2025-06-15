import { createRouter, createWebHistory } from 'vue-router'
import GroupsPage from '../pages/GroupsPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/groups',
  },
  {
    path: '/groups',
    name: 'Groups',
    component: GroupsPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

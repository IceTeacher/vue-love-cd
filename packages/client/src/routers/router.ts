import { RouteRecordRaw } from 'vue-router';

export const constantRoute: RouteRecordRaw[] = [
  {
    path: '/hello',
    component: () => import('../components/HelloWorld.vue'),
    name: 'hello',
  },
  {
    path: '/',
    component: () => import('../views/HomePage.vue'),
    name: 'index',
  },
  {
    path: '/news',
    component: () => import('../views/NewsPage.vue'),
    name: 'news',
  },
  {
    path: '/order',
    component: () => import('../views/ServerPage.vue'),
    name: 'order',
  },
  {
    path: '/contact',
    component: () => import('../views/ContactUsPage.vue'),
    name: 'ContactUsPage',
  },
  {
    path: '/news/:id',
    component: () => import('../views/NewsDetailsPage.vue'),
    props: true,
  },
  {
    path: '/form',
    component: () => import('../views/FormPage.vue'),
    name: 'form',
    props: true,
  },
  {
    path: '/404',
    component: () => import('../views/NotFoundPage.vue'),
    name: 'notFound',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '404',
    name: 'Any',
  },
];

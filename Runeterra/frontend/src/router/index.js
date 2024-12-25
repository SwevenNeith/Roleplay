// ======= src/router/index.js =======
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import About from '../views/AboutPage.vue';
import UserList from '../views/UserList.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/users', name: 'UserList', component: UserList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

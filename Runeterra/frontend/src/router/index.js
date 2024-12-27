// ======= src/router/index.js =======
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import About from '../views/AboutPage.vue';
import UserList from '../views/UserList.vue';
import ClasseList from '../views/ClasseList.vue'; // Import de la vue
import VoieList from "../views/VoieList.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/users', name: 'UserList', component: UserList },
  { path: '/classes', name: 'ClasseList', component: ClasseList }, // Nouvelle route
  { path: "/voies", name: "VoieList", component: VoieList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

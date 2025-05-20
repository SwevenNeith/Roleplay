// ======= src/router/index.js =======
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import About from '../views/AboutPage.vue';
import UserList from '../views/UserList.vue';
import ClasseList from '../views/ClasseList.vue'; // Import de la vue
import VoieList from "../views/VoieList.vue";
import ClasseDetails from "../views/ClasseDetails.vue";
import VoieDetails from "../views/VoieDetails.vue";
import Map from '../views/Map.vue';
import OrigineDetails from '../views/OrigineDetails.vue';
import RuneterraHomePage from '../views/RuneterraHomePage.vue';
import Outils from '../views/Outils.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/users', name: 'UserList', component: UserList },
  { path: '/runeterra-classes', name: 'ClasseList', component: ClasseList }, // Nouvelle route
  { path: "/runeterra-voies", name: "VoieList", component: VoieList },
  { path: "/runeterra-classes/:slug", name: "ClasseDetails", component: ClasseDetails },
  { path: "/runeterra-voies/:slug", name: "VoieDetails", component: VoieDetails },
  { path: '/runeterra-map', name: 'Map', component: Map },
  { path: '/runeterra-origins/:slug', name: 'OrigineDetails', component: OrigineDetails },
  { path: '/runeterra', name: 'RuneterraHomePage', component: RuneterraHomePage },
  { path: '/runeterra-outils', name: 'Outils', component: Outils },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

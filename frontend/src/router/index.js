// ======= src/router/index.js =======
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import ClasseList from '../views/ClasseList.vue'; // Import de la vue
import VoieList from "../views/VoieList.vue";
import CompetenceList from "../views/CompetenceList.vue";
import ClasseDetails from "../views/ClasseDetails.vue";
import VoieDetails from "../views/VoieDetails.vue";
import CompetenceDetails from "../views/CompetenceDetails.vue";
import Map from '../views/Map.vue';
import OrigineDetails from '../views/OrigineDetails.vue';
import RuneterraHomePage from '../views/RuneterraHomePage.vue';
import Outils from '../views/Outils.vue';
import Journal from '../views/Journal.vue';
import Musique from '../views/Musique.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/runeterra', name: 'RuneterraHomePage', component: RuneterraHomePage },
  { path: '/runeterra-classes', name: 'ClasseList', component: ClasseList },
  { path: "/runeterra-classes/:slug", name: "ClasseDetails", component: ClasseDetails }, // Nouvelle route
  { path: "/runeterra-voies", name: "VoieList", component: VoieList },
  { path: "/runeterra-voies/:slug", name: "VoieDetails", component: VoieDetails },
  { path: "/runeterra-competences", name: "CompetenceList", component: CompetenceList },
  { path: "/runeterra-competences/:slug", name: "CompetenceDetails", component: CompetenceDetails },
  { path: '/runeterra-map', name: 'Map', component: Map },
  { path: '/runeterra-origins/:slug', name: 'OrigineDetails', component: OrigineDetails },
  { path: '/runeterra-outils', name: 'Outils', component: Outils },
  { path: '/runeterra-journal', name: 'Journal', component: Journal },
  { path: '/runeterra-musique', name: 'Musique', component: Musique },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

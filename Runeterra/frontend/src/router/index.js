// ======= src/router/index.js =======
import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/HomePage.vue';
import About from '../views/AboutPage.vue';
import UserList from '../views/UserList.vue';

Vue.use(Router);

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/users', name: 'UserList', component: UserList },
];

export default new Router({
  mode: 'history',
  routes,
});
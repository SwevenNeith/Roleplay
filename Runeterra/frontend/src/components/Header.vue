<template>
    <header>
    <nav>
        <ul>
            <li v-for="page in pages" :key="page.id">
                <router-link :to="page.path">{{ page.title }}</router-link>
            </li>
        </ul>
    </nav>
    </header>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Header',
    data() {
        return {
            pages: [], // Liste des pages récupérées depuis l'API backend
        };
    },
    mounted() {
      // Appel de l'API pour récupérer les pages du Header
    axios.get('http://localhost:3000/api/pages')
    .then(response => {
        this.pages = response.data;
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des pages :', error);
    });
    },
};
</script>

<style>
header {
    background-color: #333;
    color: white;
    padding: 1rem;
}
nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
}
nav a {
    color: white;
    text-decoration: none;
}
</style>

// ======= src/components/Header.vue =======
<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/users">Users</router-link></li>
        <li><router-link to="/classes">Classes</router-link></li> <!-- Nouveau lien -->
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
};
</script>

<style>
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}
nav ul li {
  display: inline;
}
</style>
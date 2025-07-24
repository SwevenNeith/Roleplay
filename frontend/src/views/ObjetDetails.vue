<template>
  <div v-if="objet">
    <h1>{{ objet.nom }}</h1>
    <button class="btn-edit" @click="showEdit = !showEdit">
      {{ showEdit ? 'Annuler' : 'Modifier' }}
    </button>
    <button class="btn-delete" @click="deleteObjet">Supprimer</button>
    <ObjetForm
      v-if="showEdit"
      :initialData="objet"
      @objet-updated="handleObjetUpdated"
      @cancel="showEdit = false"
    />
    <div v-if="!showEdit">
      <p v-if="objet.description"><strong>Description :</strong> {{ objet.description }}</p>
    </div>
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script>
import ObjetForm from '../components/ObjetForm.vue';
export default {
  name: 'ObjetDetails',
  components: { ObjetForm },
  data() {
    return {
      objet: null,
      showEdit: false
    };
  },
  created() {
    this.fetchObjet();
  },
  methods: {
    async fetchObjet() {
      const slug = this.$route.params.slug;
      const res = await fetch(`http://localhost:3000/api/objets`);
      const objets = await res.json();
      this.objet = objets.find(o => o.slug === slug);
    },
    async handleObjetUpdated() {
      await this.fetchObjet();
      this.showEdit = false;
    },
    async deleteObjet() {
      if (!confirm('Voulez-vous vraiment supprimer cet objet ?')) return;
      const slug = this.objet.slug;
      const res = await fetch(`http://localhost:3000/api/objets/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        this.$router.push('/runeterra-objets');
      } else {
        alert('Erreur lors de la suppression de l\'objet');
      }
    }
  }
}
</script>

<style scoped>
h1 {
  color: #c8aa6e;
  margin-bottom: 18px;
}
.btn-edit {
  background: #2c6578;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 18px;
  font-size: 1em;
  margin-bottom: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-edit:hover {
  background: #1e4a5a;
}
.btn-delete {
  background: #c65757;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 18px;
  font-size: 1em;
  margin-left: 12px;
  margin-bottom: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-delete:hover {
  background: #8f4040;
}
p {
  margin: 8px 0;
  color: #eee;
  font-size: 1.08em;
}
strong {
  color: #c8aa6e;
}
</style>
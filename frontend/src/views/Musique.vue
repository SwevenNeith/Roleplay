<template>
    <div class="musique-page">
        <h1>Musique</h1>
        <p>Une liste des musiques rangées par thèmes avec une banque de son</p>
        
        <button 
            class="add-button" 
            @click="showForm = !showForm"
            v-text="showForm ? 'Fermer le formulaire' : 'Ajouter une musique'"
        />

        <MusiqueForm 
            v-if="showForm" 
            @musique-added="handleMusiqueAdded"
            @cancel="showForm = false"
        />

        <MusiqueList ref="musiqueList" />
    </div>
</template>

<script>
import MusiqueForm from '@/components/MusiqueForm.vue'
import MusiqueList from '@/components/MusiqueList.vue'

export default {
    name: 'Musique',
    components: {
        MusiqueForm,
        MusiqueList
    },
    data() {
        return {
            showForm: false
        }
    },
    methods: {
        handleMusiqueAdded() {
            this.showForm = false;
            this.$refs.musiqueList.fetchMusiques();
        }
    }
}
</script>

<style scoped>
.musique-page {
    padding: 20px;
}

.add-button {
    margin: 20px 0;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.add-button:hover {
    background-color: #45a049;
}
</style>
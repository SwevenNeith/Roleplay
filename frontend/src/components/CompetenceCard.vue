<template>
    <div class="competence-card" v-if="competence">
        <h2>{{ competence.nom }}</h2>
        <p>{{ competence.description }}</p>
    </div>
</template>

<script>
export default {
    name: 'CompetenceCard',
    props: {
        competence: {
            type: Object,
            required: true
        }
    }
}
</script>
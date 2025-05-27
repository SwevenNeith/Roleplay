<template>
    <div>
        <!-- Titre principal de la page -->
        <h1>Journal</h1>
        <!-- Description de la page -->
        <p>Page d'accueil du journal.</p>

        <!-- Bouton pour afficher le formulaire d'ajout de session -->
        <button @click="showForm = true" class="add-button" v-if="!showForm">
            Ajouter une session
        </button>
        <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>

        <!-- Formulaire d'ajout de session -->
        <SessionForm
            v-if="showForm"
            :initial-data="{ title: '', content: '', _id: null }"
            @submit="handleSubmit"
            @cancel="handleCancel"
        />

        <!-- Liste des dates -->
        <ul class="combined-list">
            <li v-for="(items, date) in groupedData" :key="date">
                <!-- Affiche la date -->
                <div @click="toggleDetails(date)" class="date-header">
                    {{ date }}
                </div>
                <!-- Affiche les détails si la date est visible -->
                <ul v-if="visibleDates.includes(date)" class="details-list">
                    <!-- Affiche les informations des sessions -->
                    <li v-for="(item, index) in items" :key="index">
                        <div v-if="item.type === 'Session'">
                            <!-- Mode édition -->
                            <SessionForm
                                v-if="editingSession && editingSession._id === item._id"
                                :initial-data="item"
                                @submit="handleSubmit"
                                @cancel="handleCancel"
                            />
                            <!-- Mode affichage -->
                            <div v-else>
                                <h1 class="item-title"><strong>{{ item.title }}</strong></h1>
                                <p class="session-content">{{ item.content }}</p>
                                <div class="button-group">
                                    <button @click="editSession(item)" class="form-button edit-button">Modifier</button>
                                    <button @click="deleteSession(item)" class="form-button cancel-button">Supprimer</button>
                                </div>
                                <hr class="divider" />
                            </div>
                        </div>
                        <!-- Affiche les informations des combats -->
                        <div v-if="item.type === 'Combat'">
                            <h1 class="item-title"><strong>Combats</strong></h1>
                            <p><strong>Participants :</strong></p>
                            <ul>
                                <li v-for="participant in item.participants" :key="participant.nom">
                                    Nom : {{ participant.nom }}, Initiative : {{ participant.initiative }}, PV Début : {{ participant.pvDebut[0] }}/{{ participant.pvDebut[1] }}
                                </li>
                            </ul>
                            <p><strong>Tours :</strong></p>
                            <ul>
                                <li v-for="tour in item.tours" :key="tour.numero">
                                    Tour {{ tour.numero }}
                                    <ul>
                                        <li v-for="action in tour.actions" :key="action.acteur + action.cible">
                                            Acteur : {{ action.acteur }}, Compétence : {{ action.competence.nom }} ({{ action.competence.type }}), 
                                            Cible : {{ action.cible }}, Réussi : {{ action.reussi ? 'Oui' : 'Non' }}, Dégats : {{ action.degats }}
                                            <!-- Affiche les PV actuels après l'action -->
                                            <p><strong>PV Actuels :</strong></p>
                                            <ul>
                                                <li v-for="(pv, nom) in action.pvActuels" :key="nom">
                                                    {{ nom }} : {{ pv }}
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <p><strong>PV Finaux :</strong></p>
                            <ul>
                                <li v-for="pvFinal in item.pvFinaux" :key="pvFinal.nom">
                                    Nom : {{ pvFinal.nom }}, PV Fin : {{ pvFinal.pvFin[0] }}/{{ pvFinal.pvFin[1] }}
                                </li>
                            </ul>
                            <p>Nombre de tours : {{ item.nombreTours }}</p>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import SessionForm from '@/components/SessionForm.vue';

export default {
    components: {
        SessionForm
    },
    data() {
        return {
            showForm: false,
            saveMessage: '',
            combinedData: [],
            visibleDates: [],
            editingSession: null
        };
    },
    computed: {
        // Regroupe les données par date
        groupedData() {
            return this.combinedData.reduce((acc, item) => {
                if (!acc[item.date]) {
                    acc[item.date] = [];
                }
                acc[item.date].push(item);
                return acc;
            }, {});
        }
    },
    methods: {
        handleCancel() {
            this.showForm = false;
            this.editingSession = null;
        },
        async handleSubmit(formData) {
            try {
                if (formData._id) {
                    // Mode édition
                    const response = await fetch(`http://localhost:3000/api/sessions/${formData._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    if (response.ok) {
                        this.saveMessage = 'Session modifiée avec succès';
                        this.editingSession = null;
                    }
                } else {
                    // Mode création
                    const response = await fetch('http://localhost:3000/api/sessions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...formData,
                            createdAt: new Date().toISOString().split('T')[0]
                        })
                    });

                    if (response.ok) {
                        this.saveMessage = 'Session enregistrée avec succès';
                        this.showForm = false;
                    }
                }

                setTimeout(() => {
                    this.saveMessage = '';
                }, 1200);
                
                await this.fetchCombinedData();
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'enregistrement de la session');
            }
        },
        async fetchCombinedData() {
            try {
                const response = await fetch('http://localhost:3000/api/combined');
                if (response.ok) {
                    const data = await response.json();
                    this.combinedData = data;
                } else {
                    console.error('Erreur lors de la récupération des données combinées');
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        },
        toggleDetails(date) {
            if (this.visibleDates.includes(date)) {
                this.visibleDates = this.visibleDates.filter(d => d !== date);
            } else {
                this.visibleDates.push(date);
            }
        },
        editSession(session) {
            this.editingSession = session;
        },
        async deleteSession(session) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
                try {
                    const response = await fetch(`http://localhost:3000/api/sessions/${session._id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        this.saveMessage = 'Session supprimée avec succès';
                        setTimeout(() => {
                            this.saveMessage = '';
                        }, 1200);
                        await this.fetchCombinedData();
                    } else {
                        alert('Erreur lors de la suppression de la session');
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    alert('Erreur lors de la suppression de la session');
                }
            }
        }
    },
    mounted() {
        this.fetchCombinedData();
    }
};
</script>

<style scoped>
/* Centrage des titres */
.item-title {
    text-align: center;
    margin-bottom: 20px;
}

/* Justification du texte */
p, ul, li {
    text-align: justify;
}

/* Augmentation de la taille de la police pour le contenu des sessions */
.session-content {
    font-size: 18px;
    line-height: 1.6;
    margin: 20px 0;
}

.divider { 
    margin: 40px 0 20px 0; 
    border: none; 
    border-top: 2px solid #c8aa6e; 
}

/* Bouton d'ajout */
.add-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin: 20px 0;
    transition: background-color 0.3s;
}

.add-button:hover {
    background-color: #388e3c;
}

/* Message de sauvegarde */
.save-message {
    color: #4CAF50;
    margin: 10px 0;
    font-weight: bold;
}

/* Liste combinée */
.combined-list {
    margin-top: 20px;
    padding: 0;
    list-style-type: none;
}

.date-header {
    font-weight: bold;
    cursor: pointer;
    margin: 20px 0;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-size: 18px;
    color: #2c6578;
    transition: background-color 0.3s;
}

.date-header:hover {
    background-color: #e0e0e0;
}

.details-list {
    margin-left: 20px;
    list-style-type: none;
    padding: 20px;
}

.details-list li {
    margin-bottom: 20px;
    font-size: 16px;
    color: #333;
}

/* Groupe de boutons */
.button-group {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

/* Boutons */
.form-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.edit-button {
    background-color: #2196F3;
    color: white;
}

.edit-button:hover {
    background-color: #1976D2;
}

.cancel-button {
    background-color: #f44336;
    color: white;
}

.cancel-button:hover {
    background-color: #d32f2f;
}
</style>
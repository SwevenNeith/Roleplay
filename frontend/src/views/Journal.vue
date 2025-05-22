<template>
    <div>
        <!-- Titre principal de la page -->
        <h1>Journal</h1>
        <!-- Description de la page -->
        <p>Page d'accueil du journal.</p>

        <!-- Bouton pour afficher le formulaire d'ajout de session -->
        <button @click="showForm = true">Ajouter une session</button>
        <div v-if="saveMessage" class="save-message">{{ saveMessage }}</div>

        <!-- Formulaire d'ajout de session, affiché uniquement si showForm est vrai -->
        <div v-if="showForm" class="form-container">
            <input 
                type="text" 
                v-model="sessionTitle" 
                placeholder="Titre" 
                class="form-input"
            />
            <textarea 
                v-model="sessionContent" 
                placeholder="Commencer à écrire la session" 
                class="form-textarea"
            ></textarea>
            <button @click="cancelForm" class="form-button cancel-button">Annuler</button>
            <button @click="saveSession" class="form-button save-button">Sauvegarder</button>
        </div>

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
                            <h1 class="item-title"><strong>{{ item.title }}</strong></h1>
                            <p class="session-content">{{ item.content }}</p>
                            <hr class="divider" />
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
                                            Cible : {{ action.cible }}, Réussi : {{ action.reussi ? 'Oui' : 'Non' }}
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
export default {
    data() {
        return {
            showForm: false,
            sessionTitle: '',
            sessionContent: '',
            saveMessage: '',
            combinedData: [],
            visibleDates: [] // Liste des dates actuellement visibles
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
        cancelForm() {
            this.showForm = false;
            this.sessionTitle = '';
            this.sessionContent = '';
        },
        async saveSession() {
            try {
                const response = await fetch('http://localhost:3000/api/sessions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: this.sessionTitle,
                        content: this.sessionContent,
                        createdAt: new Date().toISOString().split('T')[0]
                    })
                });

                if (response.ok) {
                    this.saveMessage = 'Les données du combat sont envoyées';
                    this.cancelForm();
                    setTimeout(() => {
                        this.saveMessage = '';
                    }, 1200);
                    this.fetchCombinedData();
                } else {
                    alert('Erreur lors de l\'enregistrement de la session');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors de l\'enregistrement de la session');
            }
        },
        async fetchCombinedData() {
            try {
                const response = await fetch('http://localhost:3000/api/combined');
                if (response.ok) {
                    this.combinedData = await response.json();
                } else {
                    console.error('Erreur lors de la récupération des données combinées');
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        },
        toggleDetails(date) {
            // Ajoute ou supprime la date de la liste des dates visibles
            if (this.visibleDates.includes(date)) {
                this.visibleDates = this.visibleDates.filter(d => d !== date);
            } else {
                this.visibleDates.push(date);
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
}

/* Justification du texte */
p, ul, li {
    text-align: justify;
}

/* Augmentation de la taille de la police pour le contenu des sessions */
.session-content {
    font-size: 18px;
    line-height: 1.6;
}

.divider { margin: 40px 0 20px 0; border: none; border-top: 2px solid #c8aa6e; }

/* Conteneur du formulaire, centré horizontalement */
.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

/* Style pour les champs de texte */
.form-input, .form-textarea {
    width: 80%; /* Largeur identique pour les deux champs */
    margin-bottom: 10px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Style pour la zone de texte */
.form-textarea {
    height: 150px; /* Hauteur de la zone de texte */
    resize: none; /* Désactiver le redimensionnement */
}

/* Style pour les boutons */
.form-button {
    margin: 5px;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

/* Bouton Annuler */
.cancel-button {
    background-color: #f44336; /* Rouge */
    color: white;
}

/* Bouton Sauvegarder */
.save-button {
    background-color: #4CAF50; /* Vert */
    color: white;
}

/* Liste combinée */
.combined-list {
    margin-top: 20px;
    padding: 0;
    list-style-type: none;
}

.combined-list .date-header {
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 10px;
    font-size: 18px;
    color: #2c6578;
}

.details-list {
    margin-left: 20px;
    list-style-type: none;
    padding: 0;
}

.details-list li {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
}
</style>
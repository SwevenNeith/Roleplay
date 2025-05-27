<template>
    <div class="session-form">
        <h2>{{ isEditing ? 'Modifier la session' : 'Nouvelle session' }}</h2>
        <div class="form-container">
            <input 
                type="text" 
                v-model="formData.title" 
                placeholder="Titre" 
                class="form-input"
            />
            <textarea 
                v-model="formData.content" 
                placeholder="Contenu de la session" 
                class="form-textarea"
            ></textarea>
            <div class="button-group">
                <button @click="$emit('cancel')" class="form-button cancel-button">Annuler</button>
                <button @click="saveSession" class="form-button save-button">
                    {{ isEditing ? 'Enregistrer' : 'Sauvegarder' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SessionForm',
    props: {
        initialData: {
            type: Object,
            default: () => ({
                title: '',
                content: '',
                _id: null
            })
        }
    },
    data() {
        return {
            formData: JSON.parse(JSON.stringify(this.initialData))
        }
    },
    computed: {
        isEditing() {
            return !!this.formData._id;
        }
    },
    methods: {
        saveSession() {
            this.$emit('submit', this.formData);
        }
    }
}
</script>

<style scoped>
.session-form {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.form-input, 
.form-textarea {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-textarea {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 150px;
    resize: vertical;
    min-height: 100px;
    max-height: 400px;
}

.button-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    width: 100%;
}

.form-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.cancel-button {
    background-color: #f44336;
    color: white;
}

.save-button {
    background-color: #4CAF50;
    color: white;
}

.cancel-button:hover {
    background-color: #d32f2f;
}

.save-button:hover {
    background-color: #388e3c;
}

h2 {
    color: #2c6578;
    margin-bottom: 20px;
    text-align: center;
}
</style> 
// /models/Competence.js
const mongoose = require('mongoose');

const competenceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  systeme: { type: String, enum: ['PM', 'Cooldown', 'Action', 'PM + CD', 'CD + Action', 'PM + Action', 'D&D', 'Chroniques Oubliées', 'Mixte'], required: false },
  systeme_value: { type: String, required: false },
  voie_slug: { type: String, required: false },
  // type: { type: String, enum: ['Attaque', 'Soin', 'Défense'], required: false },
  description: { type: String },
  prerequis: { type: String },
  niveau: { type: Number },
  composant: { type: [String], default: [] }, // Liste des composants (Verbal, Matériel, Somatique)
  portee: { type: String },
  zone: { type: String },
  temps_incantation: { type: String },
  duree: { type: String },
  degats: { type: String },
  allie: { type: String },
  ennemi: { type: String },
  sauvegarde: { type: String },
  theme: { type: [String], default: [] }, // Liste de thèmes

  // Champs spécifiques D&D
  // Voir Explication/Explication_Formulaire_Competence.md pour les détails
  ecole_magie: { type: String },
  type_action: { type: String }, // Enum retiré pour permettre "Autre" personnalisé
  condition_declenchement: { type: String },
  composante_materielle_details: { type: String },
  composante_materielle_consommee: { type: Boolean },
  portee_type: { type: String, enum: ['Personnelle', 'Toucher', 'Distance fixe', 'Ligne de vue', 'Rayon'] },
  portee_distance: { type: String },
  zone_type: { type: String, enum: ['Cône', 'Ligne', 'Sphère', 'Cube'] },
  zone_taille: { type: String },
  cible_type: { type: String, enum: ['Unique', 'Plusieurs', 'Toutes dans la zone', 'Auto-ciblage uniquement'] },
  cible_nombre: { type: Number },
  jet_attaque_type: { type: String, enum: ['Corps à Corps', 'A distance', 'Magique'] },
  jet_attaque_modificateur: { type: String, enum: ['INT', 'SAG', 'FOR', 'DEX', 'CON', 'CHA'] },
  sauvegarde_attribut: { type: String, enum: ['INT', 'SAG', 'FOR', 'DEX', 'CON', 'CHA'] },
  sauvegarde_reussite: { type: String, enum: ['Aucun effet', 'Demi-dégâts', 'Effet réduit'] },
  sauvegarde_effet_reduit: { type: String },
  degre_difficulte: { type: String },
  effet_principal: { type: String },
  degats_formule: { type: String },
  degats_type: { type: String },
  effets_secondaires: { type: [String] },
  effets_secondaires_repousse_distance: { type: String },
  effets_secondaires_autre: { type: String },
  duree_type: { type: String, enum: ['Instantané', '1 round', 'X rounds', 'Concentration', 'Fixe'] },
  duree_valeur: { type: String },
  concentration: { type: Boolean },
  dissipable: { type: Boolean },
  notes_lore: { type: String },
}, { strict: false }); // strict: false permet d'accepter d'autres champs si besoin

// Exporte le modèle 'Competence' pour l'utiliser dans les routes
module.exports = mongoose.model('Competence', competenceSchema, 'runeterra_competences');

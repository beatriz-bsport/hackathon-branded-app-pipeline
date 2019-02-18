export default {
  columns: {
    identifier: 'Identifiant',
    first_name: 'Prénom',
    last_name: 'Nom',
    email: 'Email',
    phonenumber: 'Téléphone',
    date_joined: 'Date d\'inscription',
    gender: 'Sexe',
    payment_pack: 'Abonnement',
    activity_name: 'Activité',
    activity_date: 'Date de l\'activité',
    activity_duration: 'Durée',
    member_identifier: 'ID Membre',
    payment_date: 'Date de paiement',
    payment_method: 'Méthode de paiement',
    payment_identifier: 'Identifiant de paiement',
    product_price: 'Prix',
    product: 'Produit',
    product_type: 'Type de produit',
  },
  payment_method: {
    cash: 'Espèces',
    check: 'Chèque',
    stripe: 'CB',
  },
  product_type: {
    payment_pack: 'Abonnement',
  },
  report: {
    delete_message: 'Êtes-vous sûr de vouloir supprimer le rapport {{name}} ?',
  },
  form: {
    title: 'Nouveau rapport',
    name: 'Nom',
    description: 'Description',
    category: 'Catégorie',
    columns: 'Colonnes',
  },
  list: {
    empty: 'Aucun rapport ? Créer un premier rapport !',
    button_new: 'Je crée mon premier rapport',
  },
};

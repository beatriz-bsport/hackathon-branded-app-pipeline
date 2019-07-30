export default {
  metaActivity: 'Activité',
  forms: {
    create: {
      steps: {
        activity_form: "Création de l'activité",
        pass_form: "Création d'un abonnement (optionnel)",
        offer_form: 'Création des séances (optionnel)',
        workshop_form: "Création de l'atelier",
      },
    },
  },
  name: 'Nom',
  category: 'Sport',
  addOffers: 'Ajouter des séances',
  offersThisDay: 'Séances ce jour :',
  description: 'Description',
  modal: {
    delete: {
      title: "Suppression de l'activité",
      content:
        'Êtes-vous sûr de vouloir supprimer cette activité ? Les séances et réservations ne seront pas affectées. Cette opération est définitive.',
      cancel: 'Annuler',
      confirm: 'Supprimer',
    },
  },
  settings: {
    title: 'Paramètres',
    lastBookingBeforeMinutes:
      "Avant le début de l'activité, dernière réservation possible",
    lastDiscardBeforeMinutes:
      "Avant le début de l'activité, dernière annulation possible",
  },
  packsAvailable: 'Eligible aux pass :',
  reviews: 'Avis clients: ',
};

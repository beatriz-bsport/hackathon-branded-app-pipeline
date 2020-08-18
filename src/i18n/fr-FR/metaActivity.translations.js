exports.default = {
  metaActivity: 'Activité',
  search: 'Chercher une activité',
  noActivities:
    'Gérez ici vos activités, une activité permet de regrouper un ensemble de séances (généralement collectives) de la même pratique.',
  actions: {
    addActivity: 'Ajouter une activité',
    search: 'Rechercher une activité',
  },
  navigation: {
    goToPaymentPack: 'Cartes de cours',
  },
  forms: {
    create: {
      compatible_packs: {
        seeMore: 'Voir plus',
        createPass: 'Créer une carte de cours',
        goToActivity: "Aller à l'activité",
        passHelperText:
          "Les cartes de cours suivantes sont compatibles avec l'activité créée:",
        noCompatiblePass:
          'Aucune carte de cours compatible avec cette activité, pensez à en créer un',
      },
      steps: {
        activity_form: "Création de l'activité",
        pass_form: "Création d'une carte de cours (optionnel)",
        pass_list: 'Finalisation',
        offer_form: 'Création des séances (optionnel)',
        workshop_form: "Création de l'atelier",
      },
    },
    delete: {
      title: "Suppression de l'activité",
      content: {
        canDelete:
          'Êtes-vous sûr de vouloir supprimer cette activité ? Les séances et réservations passées ne seront pas affectées. Cette opération est définitive.',
        cannotDelete:
          "Des séances sont prévues dans le futur, vérifiez qu'elles ont bien été annulées.",
      },
      actions: {
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
    },
  },
  detail: {
    pack: {
      noCompatiblePass: 'Aucune carte de cours compatible',
      consumerPacks: 'Carte de cours possédées par les membres',
      paymentPacks: 'Carte compatibles',
    },
    tab: {
      general: 'Général',
      pack: 'Cartes compatibles',
    },
  },

  name: 'Nom',
  category: 'Catégorie',
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
    conditions: 'Conditions',
    title: 'Paramètres',
    lastBookingBeforeMinutes:
      "Les réservations sont possibles sur cette activité jusqu'à {{m}}  avant le début de la séance",
    lastDiscardBeforeMinutes:
      "Les annulations sont possibles jusqu'à {{m}} avant le début de la séance",
    firstBookingMinutesUntil:
      'Les réservations sont bloquées avant {{m}} du début de la séance',
  },
  packsAvailable: 'Eligible aux pass :',

  reviews: 'Avis clients: ',
  disabledMetaActivities: 'Activités archivées',
};

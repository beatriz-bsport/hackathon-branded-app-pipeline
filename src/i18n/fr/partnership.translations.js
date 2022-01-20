const {
  MULTIPLE_MERGE_MODE,
  SIMPLE_MULTIPLE_MODE,
  OVERRIDE_MODE,
} = require('../../libs/partnership/utils.tsx');

exports.default = {
  configurationType: {
    [SIMPLE_MULTIPLE_MODE]: {
      label: 'Etablissements indépendants',
      helperText:
        'Chaque établissement apparaitra comme un lieu indépendant sur ClassPass',
    },
    [OVERRIDE_MODE]: {
      label: 'Fusionner tous les établissements',
      helperText:
        'Tous les établissements apparaitront comme un seul et unique établissement',
    },
    [MULTIPLE_MERGE_MODE]: {
      label: 'Avancé',
      helperText: 'Grouper les établissements similaires par adresse',
    },
  },
  pageTitle: 'Partenariat',
  parameters: {
    establishmentMergeMaster: 'Fusionner dans cet établissement ⬇️',
    establishmentMergedAs: 'Fusionner ces établissements',
    partnerId: 'PartnerID: {{ company }}',
    venueIds: 'VenueIDs: {{ establishmentIdList }}',
    enabled: 'Actif',
    allEstablishment: 'Toutes les salles',
    pleaseChoseEstablishment: 'Veuillez sélectionnez un établissement',
    pleaseChoseEstablishmentMany:
      'Veuillez sélectionnez au moins un établissement',
    establishment: 'Etablissement',
    configurationTitle: 'Configurez votre intégration',
    add: 'Ajouter',
  },
  requestDialog: {
    explain:
      "Vous avez demandé l'intégration bsport X classpass, votre chargé de compte va vous contacter pour valider cette opération",
    close: 'Bien compris',
  },
  actions: {
    save: 'Enregistrer',
    requestPartnership: "Activer l'intégration",
  },
};

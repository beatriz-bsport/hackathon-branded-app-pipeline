exports.default = {
  search: 'Chercher un atelier',
  actions: {
    addWorkshopActivity: 'Ajouter un atelier',
    search: 'Rechercher un atelier',
  },
  noWorkshops:
    "Gérez ici vos ateliers, un atelier est un évènement dont la date est fixée à l'avance.",
  navigation: {
    goToPaymentPack: 'Cartes de cours',
  },
  modal: {
    delete: {
      title: "Suppression de l'atelier",
      content:
        'Êtes-vous sûr de vouloir supprimer cet atelier ? Les séances et réservations ne seront pas affectées. Cette opération est définitive.',
      cancel: 'Annuler',
      confirm: 'Supprimer',
    },
  },
  forms: {
    delete: {
      title: "Suppression de l'atelier",
      content: {
        canDelete:
          'Êtes-vous sûr de vouloir supprimer cet atelier ? Les séances et réservations passées ne seront pas affectées. Cette opération est définitive.',
        cannotDelete:
          "Des séances sont prévues dans le futur, vérifiez qu'elles sont bien supprimées et pas seulement annulées.",
      },
      actions: {
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
    },
  },
  disabledWorkshops: 'Ateliers archivés',
};

exports.default = {
  parameters: {
    companyId: 'Votre identifiant club est : {{ company }}',
    establishmentId: 'Vos identifiant salles sont : {{ establishmentIdList }}',
    enabled: 'Actif',
    allEstablishment: 'Toutes les salles',
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

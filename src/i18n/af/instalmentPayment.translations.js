exports.default = {
  paymentAllInOnce: 'Payer en une fois',
  basket: {
    instalmentAmountTitle: 'Échéancier',
    instalmentAmount: 'Echéance de ',
    fee: 'Frais fixes : ',
  },
  action: {
    edit: {
      success: 'La configuration a bien été modifiée',
      error: 'Erreur lors de la modification de la configuration',
    },
    create: {
      success: 'La configuration a bien été crée',
      error: 'Erreur lors de la création de la configuration',
    },
    disable: {
      success: 'La configuration a bien été supprimée',
      error: 'Erreur lors de la supression de la configuration',
    },
  },
  list: {
    infoNoInstalmentPayment:
      "Le paiement en plusieurs fois permet à vos membres d'étaler le paiement de leur achat sur une période de temps. Configurez vos paiements en plusieurs fois et sur quels articles les appliquer.",
    addInstalmentPayment: 'ajouter une configuration',
  },
  title: 'Paiement en plusieurs fois',
  deleteDialog: {
    title: 'Voulez-vous vraiment supprimer cette configuration ?',
    content: 'Seuls les futurs paiements seront affectés.',
  },
  detail: {
    noConfiguration: 'Sélectionnez une configuration pour voir ses détails',
    title: 'Détails de la configuration',
    giftcard: 'Cartes cadeaux',
    paymentPack: 'Cartes de cours',
    privatePass: 'Cartes de rendez-vous',
    shopItem: 'Produits',
    combo: 'Packs',
    recurrency: 'Récurrence',
    duration:
      'Tous les {{frequency}} {{recurrency}} pendant {{number_of_billing}} {{recurrency_ponderate_by_number_of_billing}}',
    number_of_billing: 'Nombre de paiements',
    paymentNumber: '{{number_of_billing}} paiement',
    paymentNumber_plural: '{{number_of_billing}} paiements',
    fee: 'Frais fixes',
    minimumAmount: 'Montant minimum du panier',
    compatibility: 'Compabilité',
    seeAll: 'tout voir',
    packAvailableForAll: 'Toutes les cartes de cours compatibles',

    packAvailable: '{{length}} carte de cours compatible',
    packAvailable_plural: '{{length}} cartes de cours compatibles',
    privatePassAvailableForAll: 'Toutes les cartes de rendez-vous compatibles',

    privatePassAvailable: '{{length}} carte de rendez-vous compatible',
    comboAvailableForAll: 'Tous les packs compatibles',
    privatePassAvailable_plural: '{{length}} cartes de rendez-vous compatibles',

    comboAvailable: '{{length}} pack compatible',
    comboAvailable_plural: '{{length}} packs compatibles',
    giftcardAvailableForALl: 'Toutes les cartes cadeaux compatibles',

    giftcardAvailable: '{{length}} carte cadeaux compatible',
    giftcardAvailable_plural: '{{length}} cartes cadeaux compatibles',
    shopItemAvailableForALl: 'Tous les produits du magasins compatibles',

    shopItemAvailable: '{{length}} produit du magasins compatible',
    shopItemAvailable_plural: '{{length}} produits du magasins compatibles',
    onlyWhenAllAvailable:
      'Proposé seulement quand tous les objets du panier sont compatibles',
    whenOneAvailable: "Proposé dès qu'un objet du panier est compatible",
    noCompability: "Votre paiement en plusieurs fois n'a aucune compatibilité",
  },
  close: 'Fermer',
  modify: 'Modifier',
  delete: 'Supprimer',
  menu: {
    secondary: {
      allMasculine: 'Tous les {{frequency}} ',
      allFeminine: 'Toutes les {{frequency}} ',
      numberOfBilling: '{{number_of_billing}} encaissement',
      numberOfBilling_plural: '{{number_of_billing}} encaissements',
    },
  },
  form: {
    numberOfBilling: "Nombre d'encaissements",
    add: 'ajouter une configuration',
    search: 'Rechercher',
    onlyAvailableInfo:
      "Par défaut si des objets compatibles avec le paiement en plusieurs fois sont dans le panier avec des objets incompatibles, le paiement en plusieurs fois ne sera pas proposé. En désactivant cette fonctionnalié, le paiement en plusieurs fois sera quand même proposé, tant qu'un objet compatible est dans le panier.",
    onlyAvailable:
      'Proposer seulement quand tous les objets du panier sont compatibles',
    minimumAmountHelperText:
      'Pour un panier inférieur à ce montant, le paiement en plusieurs fois ne sera pas proposé.',
    minimum_amount: 'Montant minimum du panier',
    advanced: 'Avancé',
    requiredField: 'ce champ est requis',
    cancel: 'Annuler',
    save: 'Enregistrer',
    compatibility: 'Compatibilité',
    create: 'Paiement en plusieurs fois',
    generalInfo: 'Informations générales',
    compabilityInfo:
      "Sélectionnez les articles sur lesquels vous souhaitez appliquer le paiement en plusieurs fois, il sera compatible seulement avec ceux-ci. A l'achat de l'un des articles sélectionnés, le paiement en plusieurs fois sera proposé.",
    name: 'Nom',
    info: {
      startDay: 'Le paiement sera facturé tous les {{frequency}} jours',
      startWeek: 'Le paiement sera facturé toutes les {{frequency}} semaines',
      startMonth: 'Le paiement sera facturé tous les {{frequency}} mois',
      startYear: 'Le paiement sera facturé tous les {{frequency}} ans',
      middle: ' sur une durée totale de {{total}} ',
      end: ' et générera {{number_of_billing}} encaissement',
      end_plural: ' et générera {{number_of_billing}} encaissements',
    },
    frequency: {
      start: 'Répéter tous les',
    },
    fee: 'Frais fixes',
    feeHelperText:
      "Frais à payer par le membre pour utiliser le paiement en plusieurs fois, ils s'ajouteront automatiquement au premier paiement.",
    recurrency: {
      title: 'Récurrence',
      week: 'semaine',
      week_plural: 'semaines',
      month: 'mois',
      year: 'an',
      year_plural: 'ans',
      day: 'jour',
      day_plural: 'jours',
      daily: 'Quotidienne',
      weekly: 'Hebdomadaire',
      montly: 'Mensuelle',
      annual: 'Annuelle',
    },
    compability: {
      selectPack: 'Sélectionner une cartes de cours',
      selectPrivatePass: 'Sélectionner une cartes de rendez-vous',
      selectCombo: 'Sélectionner un pack',
      selectShopItem: 'Sélectionner un produit',
      selectGiftcard: 'Sélectionner une carte cadeaux',

      allPass: 'Compatible avec toutes les cartes de cours',
      pack: 'Carte de cours',
      privateBooking: 'Carte de rendez-vous',
      allPrivateBooking: 'Compatible avec toutes les cartes de rendez-vous',
      combo: 'Pack',
      allCombo: 'Compatible avec tous les packs',
      shopItem: 'Produits du magasin',
      allShopItem: 'Compatible avec tous les produits du magasin',
      giftcard: 'Cartes cadeaux',
      allGiftcard: 'Compatible avec toutes les cartes cadeaux',
    },
  },
};

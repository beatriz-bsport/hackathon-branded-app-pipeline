const { BASKET_EVENTS } = require('@bsport/common/lib/master-data/events');

exports.default = {
  payment: {
    flat_fee: 'Frais de dossier',
    taxExcluded: 'Sous-total HT',
    tax: 'Taxes',
    total: 'Total TTC',
  },
  events: {
    [BASKET_EVENTS.created]: 'Panier créé',
    [BASKET_EVENTS.finalize]: 'Panier finalisé/payé',
    [BASKET_EVENTS.additem]: 'Ajout au panier',
    [BASKET_EVENTS.removeitem]: 'Retrait du panier',
    [BASKET_EVENTS.automaticclean]: 'Nettoyage automatique du panier',
  },
  eventHistory: {
    sectionTitle: 'Evènements',
    pleaseSelectABasket: "Sélectionnez un panier pour voir l'historique",
  },
  historyTitle: 'Historique des paniers',
  paymentIntent: {
    isProcessing: 'Veuillez patientez',
  },
  forms: {
    delivery: {
      first_name: 'Prénom',
      last_name: 'Nom',
      actions: {
        submit: 'Suivant',
        cancel: 'Précédent',
      },
    },
  },
  autoAdd: {
    paymentPack: {
      locked: "Ce produit n'est pas disponible.",
    },
    privatePass: {
      error: "Cette carte de rendez-vous n'est pas disponible",
    },
  },
  myBasket: {
    checkingPaymentStatus:
      'Veuillez patienter, nous vérifions le status de votre paiement',
    finalize: {
      steps: {
        address: 'Adresse',
        payment: 'Facturation',
      },
    },
    title: 'Mon panier',
    isEmpty: 'Votre panier est vide',
    isFinalized: 'Votre panier a été validé',
    featured: 'Nous vous recommandons',
    error: {
      invalidBasket:
        "Votre panier contenait des éléments qui ne sont plus disponibles à la vente. Aucun paiement n'a été enregistré",
    },
    totalQuantity: 'Contient {{ qty }} éléments',
    actions: {
      closeBasket: 'Continuer mes achats',
      checkoutBasket: 'Payer',
      payZero: 'Valider mon panier',
    },
  },
  payLater: {
    submit: 'Payer sur place',
    explain:
      'Votre moyen de paiement vous sera demandé sur place avant votre séance. Avant cela, la facture sera considérée comme impayée.',
  },
  or: 'ou',
  expire_in: 'Expire dans ',
  bookerMethod: {
    emptyMethod:
      "Aucune carte n'est compatible avec cette vidéo, veuillez contacter votre studio",
    actions: {
      bookVod: 'Débloquer la vidéo',
    },
    section: {
      consumerPass: 'Mes cartes',
      pass: 'Cartes disponibles',
      combo: 'Packs',
    },
  },
  validation: {
    actions: {
      continue: 'Continuer',
      back: 'Précédent',
    },
    sections: {
      title: 'Récapitulatif',
      basket: 'Votre panier',
      offerBooked: 'Vous êtes inscrit à',
      offerPreBooked: "Vous êtes sur liste d'attente pour",
      offerNotBookable: 'Impossible de vous inscrire à',
    },
  },
  internalAccount: {
    useMyInternalAccount: 'Utilisation de mon solde',
    myInternalAccount: 'Mon solde',
    use: 'Utiliser mon solde',
    label: 'Montant disponible : ',
    cancel: 'Annuler',
    confirm: 'Confirmer',
  },
};

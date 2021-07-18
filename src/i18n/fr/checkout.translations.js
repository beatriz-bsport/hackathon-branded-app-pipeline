exports.default = {
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
};

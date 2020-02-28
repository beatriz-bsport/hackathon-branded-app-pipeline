export default {
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
  },
  myBasket: {
    finalize: {
      steps: {
        address: 'Adresse',
        payment: 'Facturation',
      },
    },
    title: 'Mon panier',
    isEmpty: 'Votre panier est vide',
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
};

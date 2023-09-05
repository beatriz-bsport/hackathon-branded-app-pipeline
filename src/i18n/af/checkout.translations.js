const { BASKET_EVENTS } = require('@bsport/common/lib/master-data/events');

exports.default = {
  payment: {
    title: 'Paiement',
    flat_fee: 'Frais de dossier',
    deliveryFee: 'Frais de livraison',
    flatFeeSubscription: 'Frais de dossier',
    taxExcluded: 'Sous-total HT',
    tax: 'Taxes',
    total: 'Total TTC',
    globalTotal: 'Total',
    totalHiddingTax: 'Total',
    internalAccount: 'Compte interne',
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
    paymentCombo: {
      locked: "Ce pack n'est pas disponible",
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
      inconsistentBasket:
        "Votre panier a été modifié, veuillez rafraichir votre page avant de valider votre paiement.\nVous n'avez pas été débité.",
    },
    totalQuantity: 'Contient {{ qty }} éléments',
    actions: {
      closeBasket: 'Continuer mes achats',
      checkoutBasket: 'Payer',
      payZero: 'Valider mon panier',
    },
    almostDone: 'Dernière étape',
    checkAndFinalize:
      'Veuillez vérifier votre panier et finaliser votre réservation',
    acceptTermsAndFinalize:
      'Veuillez accepter les conditions générales et finaliser votre réservation',
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
      continue: 'Continuer mes achats',
      member: 'Espace Membre',
      back: 'Précédent',
      widgetContinue: 'Continuer',
      payNow: 'Payer',
      confirmPriceNull: 'Confirmer',
      goToCalendar: 'Retour au calendrier',
      myBookings: 'Mes réservations', 
      retry: 'Réessayer',
      newWorkshop: 'Nouvel atelier',
      retryBookingSession: 'Réessayer de réserver',
      mySubscription: 'Mon abonnement',
      myProducts: 'Mes achats',
      myGiftcards: 'Mes cartes cadeaux',
      myPasses: 'Mes cartes de cours'
    },
    sections: {
      explain:
        'Votre opération a bien été prise en compte. Nous vous enverrons un mail de confirmation.',
      recap: 'Récapitulatif',
      title: 'Félicitations !',
      basket: 'Mon panier',
      offerBooked: 'Ma séance',
      offerBooked_plural: 'Mes séances',
      offerPreBooked: "Inscription sur la liste d'attente",
      offerNotBookable: 'Inscription impossible',
      error: 'Erreur',
      errorExplain: {
        generic:
          "L'opération n'a pas pu être effectuée. Nous vous invitons à réessayer.",
        guestGeneric:
          'Un problème est survenu avec la réservation pour un invité.',
        guestOvercomeLimit:
          "Le nombre d'invités ajoutés pour cette réservation dépasse le nombre autorisé.",
        guestReachedLimit:
          "Vous avez déjà atteint la limite de réservation pour un invité sur la période en cours. Il n'est plus possible d'en faire.",
        guestSettings:
          'Le studio a désactivé la fonctionnalité de réservation pour un invité.',
        guestOffer:
          'Le studio a désactivé la fonctionnalité de réservation pour un invité pour cette session.',
        guestPass:
          'Le studio a désactivé la fonctionnalité de réservation pour un invité pour cette carte de cours.',
        guestNotEnoughSpot:
          "Il n'y a pas assez de places pour tous vos invités.",
        offerOnlyBookingError: "Désolé, mais malheureusement, la séance et le spot sélectionnés ne peuvent pas être réservés pour le moment. Nous vous invitons à réessayer.",
        genericOfferError:"Nous avons rencontré un problème lors du traitement de votre réservation de séance. Veuillez réessayer ultérieurement ou réserver une séance différente.",         
      },
      confirmationStatusTitle:{
        errors: {
          generic: "Oups ! Le paiement a échoué.",
          genericOfferError: "Oups ! La réservation a échoué."
        },
        success: {
          offerOnlySuccess:"Bonne séance !",
          paymentSuccess: "Paiement confirmé !",
          waitingList: "Vous vous êtes inscrit sur la liste d'attente",
        }
      },
      confirmationStatusMessage:{
        offerOnlySuccess:"La réservation a bien été effectuée. Vous recevrez bientôt un e-mail de confirmation avec tous les détails.",
        offerOnlySuccess_plural: 'Les réservations ont bien été effectuées. Vous recevrez bientôt un e-mail de confirmation avec tous les détails.',
        paymentSuccess: "Félicitations ! Votre achat est confirmé !",
        paymentSuccess_plural:"Félicitations ! Vos achats sont confirmés !",
        offerAndPurchaseSuccess: "Félicitations ! Vos achats et réservations sont confirmés. Vous recevrez sous peu un e-mail de confirmation contenant tous les détails."
      },
      alert: "Oups ! La réservation a échoué.\n Nous avons rencontré un problème lors du traitement de votre réservation de séance. Veuillez réessayer ultérieurement ou réserver une séance différente.",
      myPass: 'Ma carte de cours',
      myPass_plural: 'Mes cartes de cours',
      myPack: 'Mon pack',
      myPack_plural:'Mes packs',
      mySubscription: 'Mon abonnement',
      myProduct: 'Mon produit',
      myProduct_plural: 'Mes produits',
      myGiftcard: 'Ma carte cadeau',
      myGiftcard_plural: 'Mes cartes cadeaux',
    },
    bookingItem:{
      bookingItemStatus:{
        waitingList: "Liste d'attente",
        unpaid: "Impayé"
      }
    }
  },
  internalAccount: {
    useMyInternalAccount: 'Utilisation de mon solde',
    myInternalAccount: 'Mon solde',
    use: 'Utiliser mon solde',
    useAsManager: 'Utiliser le solde',
    label: 'Montant disponible : ',
    cancel: 'Annuler',
    confirm: 'Confirmer',
  },
};

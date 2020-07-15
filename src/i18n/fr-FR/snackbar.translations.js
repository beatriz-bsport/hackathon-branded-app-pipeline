exports.default = {
  invoice: {
    update: {
      success: 'Facture mise à jour avec succès',
    },
    create: {
      success: 'Facture enregistrée',
    },
    error: "Erreur lors de l'enregistrement - Annulé",
  },
  link: {
    copied: 'Lien copié dans le presse-papier',
  },
  coach: {
    linkByEmail: {
      success: 'Professeur lié avec succès',
    },
    error: 'Impossible de sauvegarder le professeur',
    error_email_exists:
      'Un professeur avec cet email existe déjà, utilisez le formulaire de création Professeur',
    create: {
      success: 'Professeur créé avec succès',
    },
    update: {
      success: 'Professeur modifié avec succès',
    },
    delete: {
      success: 'Professeur supprimé',
      error: 'Impossible de supprimer le professeur',
    },
  },
  relationship: {
    edit: {
      success: 'Relation modifiée',
    },
    create: {
      success: 'Relation enregistrée',
    },
    createOrUpdate: {
      error: "Impossible d'enregistrer la relation",
    },
    consumer_payment_pack_links: {
      create: {
        success: 'Carte partagée',
        error: 'Impossible de partager cette carte',
      },
      unlink: {
        success: 'Partage supprimé',
        error: 'Impossible de supprimer ce partage',
      },
      relink: {
        success: 'Partage enregistré',
        error: 'Impossible de partager cette carte',
      },
    },
  },
  paymentRules: {
    update: {
      success: 'Règle par défaut modifiée',
      error: 'Erreur lors de la modification',
    },
    create: {
      error: 'Erreur lors de la création',
      success: 'Règle ajoutée',
    },
    delete: {
      error: 'Erreur lors de la suppression',
      success: 'Règle supprimée',
    },
  },
  paymentPack: {
    paymentPackDisabled: {
      success: 'Carte de cours désactivée',
      error: 'Impossible de désactiver la carte',
    },
    credit: {
      updated: 'Crédits mis à jour',
      error: "Erreur lors de l'enregistrement",
    },
    createOrUpdate: {
      success: 'Carte de cours enregistrée',
      fail: "Erreur lors de l'enregistrement de la carte",
    },
  },
  coupon: {
    delete: {
      error: 'Impossible de supprimer cette promotion',
      success: 'Code promotionel supprimé',
    },
    update: {
      error: 'Impossible de modifier ce code',
      success: 'Code promotionnel modifié',
    },
    create: {
      error: 'Impossible de créer ce code',
      success: 'Code promotionnel enregistré',
    },
    attachToBasket: {
      error: 'Aucun code promo compatible trouvé',
    },
  },
  email: {
    create: {
      success: 'Email créé',
      error: "Impossible d'enrregistrer l'email",
    },
    update: {
      success: 'Email modifié',
      error: "Impossible de modifier l'email",
    },
    delete: {
      success: 'Email supprimé',
      error: "Impossible de supprimer l'email",
    },
  },
  establishment: {
    delete: {
      success: 'Etablissement supprimé',
      error: 'Impossible de supprimer cet établissement',
    },
    error: "Impossible de sauvegarder l'établissement",
    create: {
      success: 'Établissement créé avec succès',
    },
    update: {
      success: 'Établissement modifié avec succès',
    },
  },
  member: {
    link: {
      success: 'Compte lié avec succès',
    },
    merge: {
      success: 'Membres fusionnés',
      seeMemberPage: ' Voir la page du membre',

      error: 'Impossible de fusionner les membres',

      srcMember: 'Membre à fusionner (supprimé)',
      dstMember: 'Membre à conserver',
      title: 'Fusion membre',
      explainCredit: "L'acompte interne du membre sera transféré",
      explainBookingsAndPassAndInvoiceAndNotes:
        'Les cartes de cours, réservations, factures et notes seront transférés.',
      explainTags: 'Les tags du membre supprimés ne seront pas transférés',
      cancel: 'Annuler',
      submit: 'Fusionner',
    },
    error: 'Impossible de sauvegarder le membre',
    create: {
      title: 'Nouveau membre',
      success: 'Membre créé avec succès',
    },
    update: {
      title: 'Edition des informations',
      success: 'Membre modifié avec succès',
    },
    createOrUpdate: {
      success: 'Informations enregistrées',
      error: "Erreur lors de l'enregistrement",
    },
  },
  activity: {
    create: {
      success: 'Activité sauvegardée',
      error: "Impossible de sauvegarder l'activité",
    },
    update: {
      success: 'Activité mise à jour',
      error: "Impossible de mettre à jour l'activité",
    },
  },
  notificationRule: {
    createOrUpdate: {
      success: 'Modifié avec succès',
      error: "Impossible d'enregistrer",
    },
  },
  role: {
    update: {
      success: 'Autorisations modifiées',
    },
    error: {
      generic: 'Impossible de modifier cette autorisation',
      errorEmail:
        'Cet email est déjà utilisé pour un compte élève ou professeur',
    },
  },
  shop: {
    subShop: {
      createOrUpdate: {
        success: 'Catégorie enregistrée avec succès',
        error: "Impossible d'enregsitrer la catégorie",
      },
      delete: {
        success: 'Catégorie supprimée',
        error: 'Impossible de supprimer la catégorie',
      },
    },
    item: {
      updateProvisions: {
        success: 'Stock mis à jour',
        error: "Erreur lors de l'enregistrement du stock",
      },
      duplicate: {
        success: 'Produit dupliqué avec succès',
        error: 'Impossible de dupliquer le produit',
      },
      createOrUpdate: {
        success: 'Enregistré',
        error: "Erreur lors de l'enregistrement",
      },
      delete: {
        success: 'Elément supprimé',
        error: 'Erreur lors de la suppression',
      },
    },
  },
  smartlist: {
    create: {
      success: 'Smartlist créée avec succès',
      error: "Impossible d'enregistrer la smartlist",
    },
    update: {
      success: 'Smartlist mise à jour avec succès',
      error: "Impossible d'enregistrer la smartlist",
    },
    delete: {
      success: 'Smartlist supprimée',
      error: 'Impossible de supprimer la smartlist',
    },
  },
  subscription: {
    switchPaymentMethod: {
      success: 'Méthode de paiement mise à jour',
      error: 'Impossible de modifier la méthode de paiement',
    },
    switchPack: {
      success: 'Méthode de paiement modifiée',
      error: 'Impossible de modifier la carte de cours',
    },
    freeze: {
      success: 'Souscription mise en pause',
      alreadyPaused:
        'Impossible de mettre en pause une souscription déjà pausée',
      error: 'Impossible de mettre en pause cette souscription',
    },
    updatePrice: {
      success: 'Montant mis à jour',
      error: 'Impossible de modifier ce montant',
    },
    youSubscribed: {
      error: "Erreur lors de l'abonnement",
      success: 'Vous êtes désormais abonné',
    },
  },
  webhook: {
    success: 'Webhook enregistré',
    error: "Impossible d'enregistrer le webhook",
    testSuccess: 'Url correcte',
    testError: "Veuillez vérifier l'url",
  },
  login: {
    passwordChangedSuccess: 'Mot de passe modifié avec succès !',
  },
  booking: {
    register: {
      success: 'Réservation enregistrée',
    },
  },
  order: {
    success: 'Votre paiement a bien été enregistré',
  },
  communication: {
    success: "Mail en cours d'envoi",
    error: "Problème lors de l'envoi du mail",
  },
  privateBooking: {
    attachCoach: {
      success: 'RDV attribué au professeur',
      error: "Impossible d'attribuer au professeur",
    },
    updateCoach: {
      success: 'Le professeur a été modifié',
      error: 'Impossible de modifier le professeur',
    },
  },
  privateConsumerPass: {
    creditUpdate: {
      success: 'Crédits mis à jour',
      error: "Impossible d'enregistrer le crédit",
    },
  },
  video: {
    createOrUpdate: {
      success: 'Vidéo enregistrée avec succès',
      error: "Impossible d'enregistrer la vidéo",
    },
    delete: {
      success: 'Vidéo supprimée',
      error: 'Impossible de supprimer la vidéo',
    },
  },
  playlist: {
    createOrUpdate: {
      success: 'Playlist enregistrée avec succès',
      error: "Impossible d'enregistrer la playlist",
    },
    delete: {
      success: 'Playlist supprimée',
      error: 'Impossible de supprimer la playlist',
    },
    video: {
      add: {
        success: 'Vidéo ajoutée à la playlist',
        error: "Impossible d'ajouter la vidéo",
      },
      del: {
        success: 'Vidéo supprimée de la playlist',
        error: 'Impossible de supprimer la vidéo de la playlist',
      },
    },
  },
};

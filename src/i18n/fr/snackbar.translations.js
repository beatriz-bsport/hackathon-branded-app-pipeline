exports.default = {
  offer: {
    restore: {
      success: 'Séance restaurée',
      error: 'Impossible de restaurer cette séance',
    },
  },
  invoice: {
    update: {
      success: 'Facture mise à jour avec succès',
    },
    create: {
      success: 'Facture enregistrée',
    },
    error: "Erreur lors de l'enregistrement - Annulé",
  },
  zoom: {
    created: {
      success: 'Compte Zoom lié avec succès',
      error: 'Erreur lors du lien du compte Zoom',
    },
  },
  copied: 'Copié dans le presse-papier',
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
    restore: {
      success: 'Professeur restauré avec succès',
      error: 'Impossible de restaurer le professeur',
    },
  },
  relationship: {
    edit: {
      success: 'Relation modifiée',
    },
    create: {
      success: 'Relation enregistrée',
    },
    delete: {
      success: 'Relation supprimée',
      error: 'Impossible de supprimer cette relation',
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
    private_consumer_pass_links: {
      create: {
        success: 'Carte RDV partagée',
        error: 'Impossible de partager cette carte RDV',
      },
      unlink: {
        success: 'Partage supprimé',
        error: 'Impossible de supprimer ce partage',
      },
      relink: {
        success: 'Partage enregistré',
        error: 'Impossible de partager cette carte RDV',
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
    paymentPackEnabled: {
      success: 'Carte de cours restaurée',
      error: 'Impossible de restaurer la carte',
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
      error: "Impossible d'enregistrer l'email",
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
    restore: {
      success: 'Etablissement restoré',
      error: 'Impossible de restaurer cet établissement',
    },
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
  memberNote: {
    delete: {
      success: 'Note supprimée',
      error: 'Impossible de supprimer la note',
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
    duplicate: {
      success: 'Smartlist dupliquée',
      error: 'Imposible de dupliquer la smarlist',
    },
  },
  subscription: {
    switchPaymentMethod: {
      success: 'Méthode de paiement mise à jour',
      error: 'Impossible de modifier la méthode de paiement',
    },
    stop: {
      success: 'La souscription a été arrétée',
      warning:
        "Impossible d'arrêter pour le moment, un paiement est-il en cours de transfert ?",
      error: "Impossible d'arrêter la souscription pour le moment",
    },
    switchPack: {
      success: 'Méthode de paiement modifiée',
      error: 'Impossible de modifier la carte de cours',
    },
    freeze: {
      success: 'Souscription mise en pause',
      locked:
        'Impossible de mettre en pause pour le moment, un paiement est-il en attente ?',
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
    contract: {
      restore: {
        success: 'Contrat restauré avec succès',
        error: 'Impossible de restaurer le contrat',
      },
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
    restore: {
      success: 'Le rendez-vous a été restauré',
      error:
        "Impossible de restaurer le rendez-vous, il n'y a pas assez de crédits sur cette carte de rendez-vous.",
    },
  },
  privateConsumerPass: {
    creditUpdate: {
      success: 'Crédits mis à jour',
      error: "Impossible d'enregistrer le crédit",
    },
  },
  consumerPass: {
    success: 'Votre achat a bien été enregistré !',
  },
  privateRecurrentRule: {
    createOrUpdate: {
      success: 'Rendez-vous récurrent enregistré avec succès',
      error: "Impossible d'enregistrer le rendez-vous récurrent",
      locked: 'Une règle de récurrence existe déjà avec ces paramètres',
    },
    delete: {
      success: 'Rendez-vous récurrent supprimé',
      error: 'Impossible de supprimer le rendez-vous récurrent',
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
    register: {
      success: 'Vidéo enregistrée dans votre bibliothèque',
      error: "Impossible d'enregister cette vidéo, réessayez dans un moment",
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
  metaActivity: {
    restore: {
      success: 'Élément restauré',
      error: 'Impossible de restaurer cet élément',
    },
    del: {
      success: 'Élément supprimé',
      error: 'Impossible de supprimer cet élément',
    },
  },
  privatePass: {
    restore: {
      success: 'Carte de RDV restaurée',
      error: 'Impossible de restaurer cette carte de RDV',
    },
    del: {
      success: 'Carte de RDV supprimée',
      error: 'Impossible de supprimer cette carte de RDV',
    },
  },
  bookingNotification: {
    createOrUpdate: {
      success: 'Notification enregistrée avec succès',
      error: "Impossible d'enregistrer la notification",
    },
    delete: {
      success: 'Notification supprimée',
      error: 'Impossible de supprimer la notification',
    },
  },
  background: {
    pending: 'Traitement en cours, veuillez patienter',
    success: 'Terminé',
    error: 'Une erreur est survenue, réessayez plus tard',
    timeout:
      'Le serveur a mis trop longtemps à répondre. Essayez de rafraîchir la page',
    cannotFetch:
      'Une erreur est survenue. Vérifiez votre connexion et essayez de rafraîchir la page',
  },
  subscriptionScheduledStop: {
    create: {
      success: 'Arrêt de la souscription programmé',
      error: "Impossible de programmer l'arrêt de la souscription",
    },
    delete: {
      success: "L'arrêt programmé de la souscription a été supprimé",
      error: "Impossible de supprimer l'arrêt programmé de la souscription",
    },
  },
  dashboard: {
    save: {
      success: 'Les modifications ont été enregistrées',
      error: "Impossible d'enregistrer les modifications",
    },
  },
};

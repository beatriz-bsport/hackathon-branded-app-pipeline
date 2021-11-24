exports.default = {
  delete: {
    title: 'Archiver la carte cadeau',
    content:
      'Voules-vous vraiment archiver cette carte cadeau ? Elle ne sera plus facturable via le backoffice. Vous pourrez la réactiver plus tard.',
    cancel: 'Annuler',
    submit: 'Confirmer',
  },
  list: {
    validity: 'Valable {{ duration }} jours',
    unlimited: 'Illimitée',
    explainIfEmpty:
      "Les cartes cadeaux permettent à vos membres d'offrir à leurs proches un montant à dépenser dans votre studio.",
    visibility: 'Non visible',
    activeTitle: 'Disponible à la vente',
    unavailableForSaleTitle: 'Indisponible à la vente',
    archivedTitle: 'Archivé',
    isEmpty: 'Aucune carte cadeau disponible',
    addBackgroundImage: 'Ajouter des images de personnalisation',
    actions: {
      create: 'Créer une carte cadeau',
      goToGiftcard: 'Voir toutes les cartes cadeaux',
    },
  },
  consumerGiftcard: {
    activation: {
      title: 'Quelqu’un a voulu vous faire plaisir !',
      subtitle: 'Il semblerait que quelqu’un vous ait fait une surprise.',
      content1:
        'Votre carte cadeaux d’une valeur de {{price}} est compatible avec l’ensemble des produits de notre magasin. Cette carte n’a pas de date limite d’utilisation, faites vous plaisir !',
      content1withDate:
        'Votre carte cadeaux d’une valeur de {{price}} est compatible avec l’ensemble des produits de notre magasin. Cette carte expire {{ expiration_days }} jours après activation, faites vous plaisir !',
      content2:
        'Elle viendra automatiquement s’ajouter comme moyen de paiement dans votre panier. Vous pouvez retrouver toutes les informations de votre carte cadeau sur votre profil.',
      content3:
        'Si vous n’êtes pas connecté au bon compte, merci de vous déconnecter pour vous connecter au bon compte. Si cette carte cadeau ne vous est pas destinée, merci de ne pas la valider.',

      activate: 'Activer ma carte cadeau',
      alreadyActivated:
        'Cette carte cadeau a déjà été utilisée par un autre utilisateur',
    },
    invitationForm: {
      activationCodeLink:
        "Le mail d'invitation a été envoyé et ne peut plus être modifié, si celui-ci n'est pas arrivé au bon destinataire vous pouvez transmettre ce lien d'activation pour offrir la carte cadeau : ",
      title: "Envoyer un email d'invitation",
      content:
        "Vous pouvez modifier les destinataires de la carte cadeau. Attention, un seul pourra l'utiliser. Si l'email n'a pas été reçu vous pouvez aussi transmettre ce lien d'activation :",
      actions: {
        close: 'Fermer',
        submit: 'Envoyer',
      },
    },
    list: {
      myPurchases: 'Carte cadeaux achetées',
      myGifted: 'Cartes cadeaux reçues',
    },
    linkedInvoice: 'Facture liée',
    isEmpty: 'Aucune carte cadeau',
    isFor: "A l'attention de ",
    isFrom: 'De la part de ',
    value: 'Valeur',
    invitedOn: 'Envoyée le {{- d }}',
    willInviteOn: 'Invitation à envoyer le {{- d }}',
    expiresOn: 'Expire le {{- d }}',
    notAttributedYet: 'Non validée',
    sendTo: "Renvoyer l'invitation",
    previewPlaceholder: {
      name: '[Nom de la carte]',
      message_is_from: '[Nom acheteur]',
      message_is_for: '[Nom destinataire]',
      message_content: '[Message personnalisé]',
      giftcard_amount: '[Montant carte]',
    },
    form: {
      name: {
        label: 'Nom de la carte',
      },
      message_is_for: {
        label: "A l'attention de ",
      },
      message_is_from: {
        label: 'De la part de ',
      },
      message_content: { label: 'Message personnel' },
      recipients: {
        label: 'Email du destinataire',
      },
      select_image: 'Sélectionnez votre image de fond',
      date_send: {
        label: 'Date d’envoi de l’email',
      },
      hour_send: "Heure d'envoi",
      actions: {
        submit: 'Ajouter au panier',
        cancel: 'Annuler',
      },
      footer:
        'La carte sera envoyée par mail le {{- date_send }} à {{- hour_send }} aux adresses indiquées. Elle sera valide pendant {{ expiration_days }} jours après l’envoi du mail. Le compte du destinataire sera crédité de {{- price }} pour les prochains achats.',
      footerUnlimited:
        "La carte sera envoyée par mail le {{- date_send }} à {{- hour_send }} aux adresses indiquées. Elle ne contient pas de date d'expiration. Le compte du destinataire sera crédité de {{- price }} pour les prochains achats.",
    },
  },
  link: {
    copyLink: "Copier le lien d'achat",
    activationLink: "Copier le lien d'activation",
  },
  giftcard: {
    configurationTitle: 'Carte cadeau',
    detail: {
      expirationDate: 'Validité avant expiration : {{ expiration_days }} jours',
      availablePaymentMethods: 'Moyens de paiement disponibles',
      manager_only: 'Indisponible à la vente en ligne',
    },
    delete: {
      dialog: {
        title: 'Suppression',
        content:
          "Êtes-vous sûr de vouloir supprimer cette carte ? Les membres ayant déjà acheté la carte pourront continuer à s'en servir.",
        actions: {
          delete: 'Supprimer',
          close: 'Fermer',
        },
      },
    },
  },
  form: {
    giftcard: {
      actions: {
        cancel: 'Fermer',
        submit: 'Valider',
      },
      title: 'Carte cadeau',
      name: {
        label: 'Nom',
      },
      available_payment_method_identifiers: {
        helperText: '',
        label: 'Moyens de paiement disponibles',
      },
      description: {
        label: 'Description',
      },
      section: {
        parameters: {
          title: 'Paramètres',
        },
      },
      price: {
        label: 'Prix de vente',
        helperText: 'Définira la valeur de la carte offerte',
      },
      expiration_days: {
        label: 'Durée de validité en jours',
        helperText:
          'La validité de la carte commence à la date d’envoi de l’email carte cadeau',
      },
      unlimited: {
        label: 'Illimité',
      },
      manager_only: {
        label: 'Invisible pour les clients',
      },
    },
  },
  backgroundImage: {
    dialog: {
      title: 'Images de personnalisation',
      actions: {
        close: 'Fermer',
      },
      explain:
        'Ajouter des images pour permettre à vos membres de personnaliser leur carte cadeau. Pendant la création de leur carte vos membres pourront choisir une image de fond sur la carte cadeau.',
    },
  },
  search: 'Rechercher une carte cadeau',
  widget: 'Choisir des cartes cadeaux',
};

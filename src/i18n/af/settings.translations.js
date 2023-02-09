// @flow

exports.default = {
  pageTitle: 'Paramètres',
  companyOnboarding: {
    error: 'Vous ne pouvez pas modifier ces informations',
  },
  tab: {
    general: 'Général',
    broadcast: 'Visioconférence',
    notificationRule: 'Emails transactionnels',
    paymentRules: 'Règles de rémunération',
    company: 'Entreprise',
    invoice: 'Facturation',
    waitingList: "Liste d'attente",
    shop: 'Magasin',
    role: 'Staff',
    personalization: 'Personnalisation',
    webhook: 'Webhook',
    partnership: 'Partenariat',
    active_campaign: 'ActiveCampaign',
    coachUserspace: 'Espace professeur',
  },
  webhook: {
    cancel: 'annuler',
    submit: 'valider',
    createTitle: 'Formulaire Webhook',
    add: 'Ajouter un webhook',
    test: 'Tester',
    event: 'Evènement',
    selectEvent: 'Sélectionner un évènement',
    url: 'URL',
    urlHelper: "Entrez l'url à laquelle sera envoyée la payload",
    urlPlaceHolder: 'http://wwww.google.com',
    payload: 'Payload',
    modal: {
      delete: {
        title: 'Suppression du webhook',
        cancel: 'annuler',
        confirm: 'Confirmer',
        content:
          'Etes vous sûr de vouloir supprimer ce webhook, cette opération est définitive',
      },
    },
  },
  broadcast: {
    seeUpsell: 'En savoir plus',
    is_whereby_integration_enabled: {
      label: "Activer l'intégration whereby X bsport",
    },
    explainDisabled:
      'Désactivé : vous gérez vous-mêmes vos liens de visioconférence à configurer pour chaque séance (via ZOOM, etc...).',
    explainEnabled:
      "Activé : bsport gère vos salles de visioconférence, IMPOSSIBLE d'en réaliser deux en même temps.",
    submit: 'Enregistrer',
    zoom: {
      enabled: "Activer l'intégration de ZOOM",
      revoke: 'Désactiver ZOOM',
      label: 'Configuration des comptes ZOOM',
      explainValid:
        "Compte valide: Les liens des réunions ZOOM seront créés pour chaque séance 15 minutes avant qu'elles ne démarrent automatiquement. Le professeur recevra un lien pour accueillir la réunion tandis que les inscrits recevront un autre lien pour rejoindre la réunion. Notez que si le compte ZOOM est impayé, la réunion ZOOM est limitée à 40 minutes",
      explainInvalid: 'Compte invalide',
    },
  },
  active_campaign: {
    submit: 'Confirmer',
    cancel: 'Annuler',
    account: {
      helpTitle: 'Où trouver les informations de mon compte ?',
      helpContent:
        "L'url et la clé d'authentification de votre compte ActiveCampaign sont accessibles dans les paramètres de votre compte, en cliquant sur l'onglet 'Développeur'.",
      title: "Informations d'accès à votre API ActiveCampaign",
      helper: 'Où trouver ces informations ?',
      dialogTitle: 'Informations de mon compte ActiveCampaign',
      token: "Clé d'authentification",
      error: 'Vos informations sont incorrectes',
      empty: "Veuillez entrer l'url de votre API",
    },
    webhooks: {
      helpTitle: 'Comment se déroule la synchronisation ?',
      helpContent:
        "Les actions ci dessous ont lieu dès que l'évènement associé se produit sur ActiveCampaign.",
      title: "Intégrer les informations d'ActiveCampaign sur bsport",
      CLIENT_WON:
        "Créer un compte client sur bsport lorsque le prospect est passé en statut 'WON' sur un deal",
      CONTACT_TAG:
        "Créer un compte client sur bsport lorsque le prospect est tagé en 'won' sur ActiveCampaign",
    },
    link: {
      helpTitle: 'Comment se déroule la synchronisation ?',
      helpContent:
        "Les membres dans la smartlist sont envoyés chaque nuit vers la liste ActiveCampaign, ils apparaissent dessus comme 'actifs'. Les membres sortis de la smartlist sont également enlevés de la liste ActiveCampaign, leur statut est alors 'non-confirmé'.",
      title: 'Envoi des informations depuis bsport',
      add: 'Ajouter un lien entre listes',
      dialogTitle: 'Modifier un lien de listes',
      smartListSelection: 'Choisir une smartlist',
      listActiveCampaignSelection: 'Choisir une liste ActiveCampaign',
      helperForm:
        "Choisissez une smartlist de bsport et liez la à l'une de vos listes sur ActiveCampaign",
      noList: 'LISTE INTROUVABLE',
      listItemText:
        'Envoyer les membres de la smartlist <1>{{smartlist}}</2> à la liste ActiveCampaign <3>{{list}}</4>',
    },
  },
  marketplaceSettings: {
    addButton: 'Ajouter un onglet',
    explainMarketplace:
      'Vos adhérents peuvent accéder à votre marketplace (calendrier, magasin, VOD...) en ligne sur ordinateur tablette ou téléphone. Personnalisez votre page ici !',
    link: 'Accédez à la marketplace client (vous serez déconnecté)',
    saveButton: 'Sauvegarder',
    preview: 'Aperçu',
    componentType: {
      calendar: 'Calendrier',
      calendarV2: 'Calendrier',
      workshop: 'Ateliers',
      privateService: 'Sur rendez-vous',
      pass: 'Carte de cours',
      vod: 'VOD',
      subscription: 'Abonnement',
      shop: 'Magasin',
      playlist: 'Playlist',
      newsletter: 'Newsletter',
      loginButton: 'Bouton login',
      giftcard: 'Carte cadeau',
      paymentPackTemplate: 'Carte de cours partagée',
    },
    createDialog: {
      showAdvanced: "Voir plus d'options",
      selectComponent: 'Choisir un composant',
      selectCoach: 'Choisir un coach',
      selectEstablishment: 'Choisir une salle',
      selectActivity: 'Choisir une activité',
      selectPrivateService: 'Choisir un service',
      selectPrivateServiceType: 'Type',
      selectPrivateServiceTypeList: 'Tous les rendez-vous',
      selectPrivateServiceTypeDetail: 'Mon rendez-vous',
      selectPrivateServiceGroups: 'Choisissez vos catégories',
      selectVideo: 'Choisir une video',
      selectPlaylist: 'Choisir une playlist',
      inputTitle: "Nom de l'onglet",
      cancel: 'Annuler',
      submit: 'Valider',
      noComponentTypeError: 'Veuillez sélectionner un composant',
      noTitleError: 'Veuillez saisir un titre',
      noServiceError: 'Veuillez sélectionner un service',
      noPlaylistError: 'Veuillez sélectionner une playlist',
      dialogTitle: 'Edition onglet',
      hidePaymentPack: 'Ne pas afficher les cartes de cours',
      hidePrivatePass: 'Ne pas afficher les cartes de rendez-vous',
      hidePaymentCombo: 'Ne pas afficher les packs',
      todayOnly: 'Vision séances du jour',
      titleCaption: '{{max}} caractères max ({{count}}/{{max}})',
    },
  },
  paymentMethods: {
    title: 'Paiement en ligne',
    subtitle:
      'Vous pouvez activer ou désactiver les moyens de paiements utilisées par vos membres lors de leur paiement en ligne.',
    subtitle2:
      'En tant que manager, vous avez toujours accès à tous les moyens de paiements disponibles.',
    methodPaymentBasket: 'Paiement ponctuel',
    methodPaymentBasketHelper:
      "Autoriser les paiements du panier d'achat, règlement de la dette et des impayés.. uniquement via",
    methodPaymentSubscription: 'Paiement récurrent',
    methodPaymentSubscriptionHelper:
      'Autoriser les paiements des souscriptions (contrats) uniquement via',
    methodPaymentSubscriptionError:
      'Veuillez choisir au moins une méthode de paiement',
    save: 'Enregistrer',
  },
  billing_group: {
    add: 'Ajouter un groupe',
    helperText:
      'Si vous disposez de plusieurs studios appartenants à différentes raisons sociales, vous pouvez les regrouper ici par groupe de facturation. Les groupes de facturations apparaitront sur vos rapports pour relier plus facilement chaque facture à la bonne raison sociale.',
    header: 'Groupes de facturation',
  },
  quickbooks: {
    title: 'QuickBooks',
    enable: "Activer l'intégration Quickbooks",
    submit: 'Sauvegarder',
    explainEnable:
      'Transférer toutes vos factures directement sur QuickBooks. Le transfert de factures se fera toutes les 24h.',
    buttonConnect: 'Se connecter à Quickbooks',
    buttonReConnect: 'Rafraîchir ma connexion',
    buttonRevoke: 'Désactiver Quickbooks',
    confirmDialog: {
      title: 'QuickBooks Connection',
      text: 'Etes-vous sur de vouloir vous autoriser Bsport à accéder à votre application ?',
    },
    tax: {
      taxInfoTitle: 'Informations de taxes QuickBooks',
      taxCodeHeaderName: 'Nom',
      taxCodeHeaderDescription: 'Description',
      usedAsTaxCode: 'Utilisée en tant que taxe de référence',
      refresh: 'Rafraichir mes données Quickbooks',
      alertUnconfigured:
        "Vous n'avez pas configuré de taxe par default à appliquer aux produits inclus dans vos factures. Cette information est obligatoire afin de référencer la taxe adaptée lors du transfert de factures sur votre platforme Quickbooks.",
      alertNonTaxInformation:
        "Aucune information de taxe n'est synchronisée avec votre plateforme Quickbooks. Veuillez cliquer sur rafraîchir si après afin de les synchroniser",
      goToSettingsPage: 'Ouvrir la page de configuration QuickBooks',
    },
  },
  mobilePersonalization: {
    title: "Personnalisation de l'app",
    externalShopRedirection: {
      subtitle: 'Liens externes',
      helperText:
        'Vous pouvez ajouter des liens externes sur l’application pour rediriger vos mebres sur votre site internet ou sur un autre plateforme. Les liens apparaitront dans l’onglet achat de l’application mobile.',
      add: 'Ajouter un lien',
      updated: 'Mettre a jour',
      preview: "Apercu de l'app",
      icon: 'Icone',
      name: 'Nom',
      link: 'Lien',
      action: 'Actions',
      popup: {
        title: 'Lien externe',
        name: 'Nom',
        link: 'Lien de redirection',
        icon: 'Icône',
        cancel: 'Annuler',
        submit: 'Enregister',
      },
      deleteModal: {
        title: 'Suppresion',
        cancel: 'Annuler',
        confirm: 'Supprimer',
        content:
          'Êtes-vous sûr de vouloir supprimer ce lien ? Cette opération est définitive',
      },
      popupPreview: {
        title: 'Apercu',
        membershipCard: {
          contract: 'Abonnement',
          paymentPack: 'Cartes de cours',
          consumerPaymentPack: 'Mes cartes',
          invoice: 'Mes factures',
          paymentPackEmpty: 'Aucun pass proposé',
          privatePassListEmpty: 'Aucun RDV proposé',
          consumerPaymentPackEmpty: 'Aucun pass possédé',
          vod: 'Accéder à la VOD',
          privateConsumerPassListEmpty: 'Aucune carte RDV possédée',
          invoiceEmpty: 'Aucune facture',
          contractEmpty: "Aucun abonnement n'est proposé à la vente",
          paymentComboEmpty: 'Aucune offre proposée',
          mySubscription: 'Mes\nabonnements',
          paymentPackSubtitle:
            'Retrouvez ici toutes les cartes de votre studio',
          contractSubtitle:
            'Retrouvez ici toutes les offres d’abonnement de votre studio',
          vodSubtitle:
            'Retrouvez ici toute l’offre de vidéo à la demande de votre studio',
          paymentComboSubtitle:
            'Retrouvez ici toutes les offres promotionnelles de votre studio',
          giftcardSubtitle:
            'Retrouvez ici toutes les cartes-cadeaux de votre studio',
        },
        category: {
          paymentPack: 'Tous les pass',
          paymentCombo: 'Offres promotionnelles',
          contract: 'Abonnements',
          giftcard: 'Cartes-cadeaux',
        },
        ourOffers: 'Nos Offres',
        inventory: 'Votre inventaire',
        cancel: 'Fermer',
      },
    },
    popup: {
      subtitle: 'Pop-up de démarrage',
      helperText:
        'La pop-up de démarrage apparaitra une fois à l’ouverture de l’application par vos membres. Elle permet de porter l’attention de vos membres sur un événement spéciale (un nouveau cours, une promotion ...) et les redirigera vers la page web souhaitée.',
      add: 'Ajouter une pop-up',
      updated: 'Mettre a jour',
      name: 'Nom',
      link: 'Lien',
      image: 'Image',
      action: 'Action',
      deleteModal: {
        title: 'Suppresion',
        cancel: 'Annuler',
        confirm: 'Supprimer',
        content:
          'Êtes-vous sûr de vouloir supprimer cette popup ? Cette opération est définitive',
      },
      see: 'Visualiser',
      editPopup: {
        title: 'Pop-up de démarrage',
        name: 'Nom',
        image: 'Image',
        link: 'Lien de redirection',
        cancel: 'Annuler',
        submit: 'Enregister',
        preview: 'Prévisualiser',
        previewPopup: {
          title: 'Apercu',
          see: 'Voir',
        },
      },
    },
  },
  company: {
    bankAccountSuccess: {
      title: 'Modifications coordonnées bancaires',
      content:
        'Vos informations bancaires ont bien été mises à jour. Pour être crédité et débité sur un seul et même compte, vous pouvez également mettre à jour le moyen de paiement utilisé pour débiter votre abonnement Bsport.',
      note: 'Cliquez sur "Configurer" pour être redirigé.',
    },
    bankAccountInfo: {
      content:
        'Ce compte correspond au compte sur lequel seront crédités les paiements en ligne via Bsport. Pour configurer le moyen de paiement sur lequel votre abonnement Bsport sera débité, cliquez',
      link: 'ici',
    },
  },
};

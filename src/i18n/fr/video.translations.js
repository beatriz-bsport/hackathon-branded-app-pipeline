// @flow

exports.default = {
  playlist: {
    noVideo: 'Aucune vidéo dans cette playlist',
    name: 'Nom',
    description: 'Description',
    deleteVideo: 'Supprimer',
    open: 'Ouvrir',
    form: {
      cancel: 'Annuler',
      submit: 'Enregistrer',
    },
    playlist: 'Parcours',
    bottomActions: {
      create: 'Ajouter',
    },
  },
  video: {
    register: {
      title: 'Activer la lecture',
      buyPass: 'Acheter un pass',
      noPassAvailable: 'Vous ne possédez pas de pass compatible',
    },
    creditPrice: 'Coût (crédit)',
    lock: {
      accessDenied: "Vous n'avez pas accès à cette vidéo",
      pleaseAuthenticated:
        'Vous devez vous connecter pour accéder à cette vidéo',
      useConsumerPass: "Débloquer l'accès",
      buyPass: 'Acheter une carte',
    },
    filter: {
      duration: {
        all: 'Toute durée',
        explain: 'Entre {{min}} et {{max}} min',
      },
    },
    showMore: 'Voir plus',
    durationMinute: '{{ minute }} min',
    player: {
      with: 'avec',
    },
    thumbnailList: {
      addVideo: 'Ajouter une vidéo',
      count: '{{ count }} vidéos',
      similarVideoTitle: 'Vidéos similaires',
    },
    search: {
      placeholder: 'Rechercher',
      cancel: 'Annuler',
      isEmpty: 'Aucune vidéo :(',
    },
    bottomActions: {
      create: 'Ajouter',
    },
    coverMain: {
      alert: "L'image est obligatoire",
    },
    name: 'Nom',
    category: 'Catégorie',
    description: 'Description',
    level: 'Niveau',
    status: {
      submitted: 'Brouillon',
      processing: 'En cours',
      error: 'Réessayer',
      processed: 'Détail',
    },
    delete: {
      title: 'Suppression',
      content:
        'Êtes-vous sûr de vouloir supprimer cette vidéo ? Cette opération est irréversible.',
      confirm: 'Confirmer',
      cancel: 'Annuler',
    },
    upload: {
      title: 'Uploader une vidéo',
      content: 'Déposez ici ou sélectionnez une vidéo',
      dropHere:
        'Glissez-déposez ici une vidéo ou cliquez pour parcourir votre ordinateur',
      cancel: 'Annuler',
      submit: 'Valider',
      type: {
        file: 'Fichier',
        url: 'Url',
      },
      urlInputLabel: 'Lien youtube',
      urlInputError: 'Veuillez saisir une url',
    },
    form: {
      edit: 'Modifier',
      cancel: 'Annuler',
      submit: 'Enregistrer',
      title: 'Edition vidéo',
      coach: {
        isEmpty: 'Aucun professeur',
      },
      creditPrice: {
        label: 'Coût en crédit',
        helperText:
          'Laissé à zéro pour que la vidéo soit accessible à tous vos adhérents',
      },
    },
    noVideoPurchase: 'Aucun achat enregistré',
    noVideoView: 'Aucune vue',
    boughtOn: 'Achat effectué le {{-date}}',
    viewedOn: 'Vidéo vue le {{-date}} à {{hour}}',
    purchaseListTitle: 'Liste des achats',
    viewsListTitle: 'Liste des vues',
    analytics: {
      views: '{{nb_views}} visionnages',
      viewTitle: 'Visionnage',
      dateCreated: 'Mise en ligne',
      totalViews: 'Total',
      viewsLastWeek: '7 derniers jours',
      distinctViewers: 'Vues uniques',
      uploaded: 'Video mise en ligne le {{date}}',
    },
  },
};

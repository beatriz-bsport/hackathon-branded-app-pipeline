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
    manager_only: "Non disponible à l'achat",
    manager_only_helper:
      "La vidéo ne sera pas disponible à l'achat, elle sera visible par les managers uniquement",
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
        fileExplain:
          'Vous disposez du fichier video (mp4, avi, mov...), utilisez cette méthode pour uploader votre vidéo directement sur les serveurs de bsport.',
        youtube: 'Youtube',
        vimeo: 'Vimeo',
        youtubeExplain:
          'Votre vidéo est déjà disponible sur Youtube mais vous souhaitez la monétiser via le système de cartes de bsport.',
        vimeoExplain:
          'Votre vidéo est déjà disponible sur Vimeo mais vous souhaitez la monétiser via le système de cartes de bsport.',
      },
      youtubeUrlInput: 'Lien youtube',
      vimeoUrlInput: 'Lien vimeo',
      urlInputError: 'Veuillez saisir une url',
      durationLabel: 'Durée de la video',
      durationInputError: 'Veuillez saisir la durée de la vidéo',
      hours: 'Heures',
      minutes: 'Minutes',
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
      video_source: {
        title: 'Vidéo',
        youtube_video: 'Vidéo Youtube',
        vimeo_video: 'Vidéo Vimeo',
        uploaded_video: 'Fichier uploadé',
        edit_button: 'Changer la vidéo',
        change_popup_title: 'Changer la vidéo',
        change_popup_text:
          "Attention la vidéo actuelle sera supprimée. Les membres ayant acheté l'ancienne vidéo disposeront désormais de la nouvelle.",
      },
      video_label: 'Vidéo',
    },
    duplicate: 'Dupliquer',
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
  details: {
    title: 'Détails de la vidéo',
    consumerPaymentPackTitle: 'Carte de cours utilisée',
    invoiceTitle: 'Facture associée',
    pleaseSelectVod: 'Sélectionnez un achat pour voir les détails',
  },
};

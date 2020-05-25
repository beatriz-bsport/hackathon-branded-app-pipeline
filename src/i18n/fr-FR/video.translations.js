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
    bottomActions: {
      create: 'Ajouter',
    },
  },
  video: {
    lock: {
      accessDenied: "Vous n'avez pas accès à cette vidéo",
      pleaseAuthenticated:
        'Vous devez vous connecter pour accéder à cette vidéo',
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
    name: 'Nom',
    category: 'Catégorie',
    description: 'Description',
    level: 'Niveau',
    status: {
      submitted: 'Brouillon',
      processing: 'En cours',
      error: 'Réessayer',
      processed: 'Visionner',
    },
    delete: {
      title: 'Suppression',
      content:
        'Êtes-cous sûr de vouloir supprimer cette vidéo ? Cette opération est irréversible.',
      confirm: 'Confirmer',
      cancel: 'Annuler',
    },
    upload: {
      title: 'Uploader une vidéo',
      content: 'Déposez ici ou sélectionnez une vidéo',
      dropHere:
        'Glissez-déposez ici une vidéo ou cliquez pour parcourir votre ordinateur',
      cancel: 'Annuler',
    },
    form: {
      edit: 'Modifier',
      cancel: 'Annuler',
      submit: 'Enregistrer',
      title: 'Edition vidéo',
      coach: {
        isEmpty: 'Aucun professeur',
      },
    },
  },
};

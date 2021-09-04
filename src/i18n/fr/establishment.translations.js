exports.default = {
  list: {
    section: {
      archived: 'Salles archivées',
    },
  },
  detail: {
    tab: {
      general: 'Général',
      calendar: 'Calendrier',
    },
  },
  establishment: 'Établissement',
  localisation: 'Localisation',
  room: 'Salle',
  capacity: {
    label: 'Capacité de la salle',
    placeholder: null,
    explain: 'Capacité: {{ capacity }} place',
    explain_plural: 'Capacité: {{ capacity }} places',
    helperText:
      'Utilisé uniquement pour calculer la disponibilité pour les rendez-vous',
  },
  baseEstablishment: 'Habituel',
  overrider: 'Remplacement',
  establishment_override: 'Salle de remplacement',
  search: 'Chercher une salle',
  addButton: 'Ajouter une salle',
  pleaseSelectOne: 'Veuillez sélectionner un club sur la carte',
  noEstablishement:
    'Gérez ici vos salles, leur localisation, leur remplissage et consultez le calendrier',
  offers: 'Calendrier des séances:',
  noMoreOffers: 'Plus aucune séance de prévue',
  pleaseFill: 'Veuillez renseigner une salle',
  practical_info: {
    label: "Information d'accès",
    placeholder: 'Code 1234 porte de droite',
    helperText: "Cette information ne sera affichée qu'à la réservation",
  },
  form: {
    new: {
      title: 'Titre',
    },
  },
  card: {
    update: 'Modifier',
  },
  update: {
    imageUploaderRequireEditMessage:
      "Une fois votre salle créée, vous aurez la possibilité d'ajouter des images supplémentaires.",
  },
  forms: {
    edit: 'Modifier',
    delete: {
      title: "Suppression d'une salle",
      actions: {
        cancel: 'annuler',
        confirm: 'Supprimer',
      },
      content: {
        canDelete:
          'Êtes-vous sûr de vouloir supprimer cette salle ? Cette opération est irréversible. Les séances et réservations passées ne seront pas affectées',
        cannotDelete:
          "Impossible de supprimer cette salle, des séances sont prévues dans le futur. Vérifiez qu'elles ont bien été annulées puis supprimées",
      },
    },
    create: {
      title: 'Nouvelle salle',
    },
    update: {
      title: 'Édition des informations',
    },
  },
  location: {
    search_address: 'Rechercher une adresse',
    address: 'Adresse',
    address_line_1: 'Adresse ligne 1',
    address_line_2: 'Adresse ligne 2',
    city: 'Ville',
    zip_code: 'Code Postal',
    country: 'Pays',
  },
  notificationToolTip:
    'Des notifications sont définies pour les réservations concernant cette salle',
  spotScheduling: {
    title: 'Plan de salle',
    subtitle:
      'Utilisé pour le spot scheduling. Permet à vos élèves de réserver l’emplacement qu’ils souhaitent dans la salle.',
    add: 'Ajouter un plan de salle',
    delete: {
      title: 'Suppression plan de salle',
      content:
        'Êtes-vous sûr de vouloir supprimer ce plan de salle ? Cette opération est irréversible.',
    },
    placeCount: '{{count}} places',
    untitled: 'Sans titre',
  },
  group: {
    groupButton: 'Grouper les établissements',
    addLocalisation: 'Ajouter une localisation',
    name: ' Nom',
    actions: 'Actions',
    noGroupHelper:
      'Les localisations permettent de regrouper plusieurs adresses entre elles. Si vous possèdez plusieurs studios dans différentes villes vous pouvez regrouper les studios de la même ville dans une localisation. Sur la marketplace, le widget  et l’application personnalisée vos élèves pourront sélectionner la localisation qui les intéresse le plus pour ne voir que les cours proches de chez eux.',
    form: {
      name: 'Nom',
      associated_localizations: 'Etablissements associées',
      dialog: {
        title: 'Localisation',
        cancel: 'Annuler',
        save: 'Enregistrer',
      },
    },
    modal: {
      delete: {
        title: 'Supprimer une localisation',
        content:
          "Cette localisation n'appraitra plus dans les filtres disponibles sur la marketplace, le widget et l'application personnalisée.",
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
    },
    table: {
      actions: 'Actions',
      establishment: 'Etablissements',
      name: 'Nom',
    },
  },
};

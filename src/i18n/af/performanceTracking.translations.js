exports.default = {
  requiredField: 'ce champ est requis',
  form: {
    cancel: 'Annuler',
    save: 'Enregistrer',
    validate: 'Valider',
    search: 'Rechercher',
    delete: 'Supprimer',
    add: 'ajouter',
    close: 'fermer',
  },
  program: {
    actions: {
      update: {
        success: 'Programme modifié',
        error: 'Erreur lors de la modification du program',
      },
      create: {
        success: 'Programme créé',
        error: 'Erreur lors de la création du program',
      },
      enable: {
        success: 'Programme restauré',
        error: 'Erreur lors de la restauration du programme',
      },
      disable: {
        success: 'Programme archivé',
        error: "Erreur lors de l'archivation du programme",
      },
    },
    titleForConsumer: 'Mes programmes',
    default: 'Programme par défaut',
    selectProgram: 'Sélectionner un programme',
    detail: 'Détails du programme',
    infoSelectProgram: 'Sélectionnez un programme pour voir ses détails',
    deleteHeader: 'Voulez-vous vraiment supprimer ce programme ?',
    deleteContent:
      "Ce programme n'apparaitra plus sur les membres à qui il a été ajouté. Vous pourrez le récupérer dans la section 'Archivés'.",
    infoNoProgram:
      'Ajoutez un programme à vos membres pour suivre l’évolution de leurs métriques',
    archived: 'Archivés',
    title: 'Programmes',
    form: {
      addProgram: 'ajouter  un programme',
      delete: 'supprimer le programme',
      modify: 'modifier le programme',
      create: 'Créer un programme',
      generalInfo: 'Informations générales',
      name: 'Nom du programme',
      description: 'Description',
      color: 'Couleur',
      default:
        'Définir comme programme par défaut pour tous les nouveaux inscrits',
    },
    member: {
      addDate: 'Date d’inscription',
      title: 'Membres',
      name: 'Nom',
    },
  },
  metric: {
    deleteHeader: 'Voulez-vous vraiment supprimer cette métrique ?',
    deleteContent: 'La métrique sera supprimée définitivement.',
    statistic: 'Statistiques',
    title: 'Métriques',
    form: {
      minMax: 'La valeur minimale ne peut être suppérieur à la valeur maximale',
      range:
        "La valeur par défaut n'est pas entre la valeur minimale et maximale ",
      addMetric: 'ajouter une métrique',
      noMetric: 'Aucune métrique enregistrée',
      general: 'Général',
      name: 'Nom',
      machine: 'Identifiant machine',
      default_value: 'Valeur par défaut',
      default_valueHelperText: 'Valeur de base de la métrique',
      minValue: 'Valeur minimale',
      minValueHelperText: 'Valeur minimum de la métrique',
      maxValue: 'Valeur maximale',
      maxValueHelperText: 'Valeur maximum de la métrique',
      color: 'Couleur',
    },
  },
  memberProgram: {
    actions: {
      disable: {
        success: 'Programme dissocié du membre',
        error: 'Erreur lors de la dissociation du program',
      },
      create: {
        success: 'Programme associé au membre',
        error: "Erreur lors de l'assocation du program au membre",
        errorAlreadyExists: 'Ce membre a déjà été associé à ce programme',
      },
    },
    infoNoMemberProgram: 'Ce membre ne possède aucun programme pour le moment.',
    infoNoConsumerProgram:
      'Vous n’avez pas encore de programme, contactez votre studio pour commencer à suivre vos performances !',
    deleteHeader: 'Voulez-vous vraiment dissocier ce programme de ce membre?',
    deleteContent:
      'Vous perdrez les valeurs des métriques du programme pour ce membre',
  },
};

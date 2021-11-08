exports.default = {
  noCoachs:
    'Aucun professeur enregistré, gérez ici vos profs, intervenants, ainsi que leur rémunération.',
  detail: {
    tab: {
      general: 'Profil',
      calendar: 'Calendrier',
    },
  },
  noCoach: "Il n'y a aucun professeur enregistré pour l'instant",
  coach: 'Professeur',
  baseCoach: 'Habituel',
  overrider: 'Remplaçant',
  overrideSelectorTitle: 'Professeur',
  coach_override: 'Professeur de remplacement',
  color: 'Code couleur (RDV)',
  showPerformance: 'Rémunérer',
  showActivities: 'Afficher les activités',
  showDescription: 'Afficher la description',
  description: 'Description',
  pleaseFill: 'Veuillez renseigner un professeur',

  emptyDescription: 'Aucune description fournie',
  selector: {
    label: 'Professeur',
  },
  search: 'Rechercher un professeur',
  performance: {
    title: 'Récapitulatif professeur',
    coachName: 'Professeur',
    nbBookings: 'Réservations',
    nbOffersTotal: 'Séances',
    nbBookingsOverThreshold: 'Réservations bonus',
    pricePerOffer: 'Montant par séance',
    pricePerAdditionalBooking: 'Montant par réservation',
    calculate: 'Calculer',
    payment: 'Rémunération',
  },
  addCoach: 'Ajouter un professeur',
  noActivity: 'Ce professeur ne gère aucune activité.',
  // eslint-disable-next-line
  selfNoActivity: "Vous n'êtes en charge d'aucune activité.",
  card: {
    update: 'Modifier',
  },
  forms: {
    linkByEmail: {
      cancel: 'Annuler',
      submit: 'Valider',
      title: 'Adresse email du professeur',
      emailLabel: 'Email',
      explain:
        "Si cet email existe déjà dans notre système, nous vous créerons le professeur automatiquement. Si vous ne connaissez pas l'email de votre professeur, laissez ce champ vide.",
      emailPlaceHolder: 'professeur@bsport.io',
    },
    error_email_exists:
      'Un professeur avec cet email existe déjà, utilisez le formulaire de création Professeur',
    create: {
      title: 'Nouveau professeur',
      success: 'Professeur créé avec succès',
    },
    update: {
      title: 'Edition des informations',
      success: 'Professeur modifié avec succès',
    },
    delete: {
      content: {
        canDelete:
          "Êtes-vous sûr de vouloir supprimer ce professeur ? Vous n'aurez plus accès au calcul de ses rémunérations. Vous pourrez le rajouter de nouveau à partir de son email.",
        cannotDelete:
          'Vous ne pouvez pas supprimer ce professeur car des séances dans le futur sont prévues !',
      },
      title: 'Suppression professeur',
      actions: {
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      cancel: 'Annuler',
      confirm: 'Supprimer',
    },
  },
  inactiveCoaches: 'Professeurs archivés',
  paymentRule: 'Rémunération',
};

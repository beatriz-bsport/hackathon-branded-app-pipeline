export default {
  coach: 'Professeur',
  color: 'Code couleur (cours privé)',
  showPerformance: 'Rémunérer',
  showActivities: 'Afficher les activités',
  showDescription: 'Afficher la description',
  description: 'Description',
  emptyDescription: 'Aucune description fournie',
  selector: {
    label: 'Professeur',
  },
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
      success: 'Professeur lié avec succès',
      submit: 'Valider',
      title: 'Adresse email du professeur',
      emailLabel: 'Email',
      explain:
        "Si cet email existe déjà dans notre système, nous vous créerons le professeur automatiquement. Si vous ne connaissez pas l'email de votre professeur, laissez ce champ vide.",
      emailPlaceHolder: 'professeur@bsport.io',
    },
    error: 'Impossible de sauvegarder le professeur',
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
      success: 'Professeur supprimé',
      error: 'Impossible de supprimer le professeur',
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
};

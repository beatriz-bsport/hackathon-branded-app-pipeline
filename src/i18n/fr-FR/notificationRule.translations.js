const NOTIFICATION_EVENTS = require('@bsport/common/lib/master-data/notification-rule-events');

const {
  NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER,
  NOTIFICATION_MEMBERSHIP_CREATION_WEB,
  NOTIFICATION_BOOKING_PASS_CHECKOUT,
  NOTIFICATION_BOOKING_CREATED,
  NOTIFICATION_BOOKING_PLUS_PASS_STRIPE_CHECKOUT,
  NOTIFICATION_BOOKING_OPTION_CONVERTIBLE,
  NOTIFICATION_BOOKING_OPTION_NOT_CONVERTIBLE_ANYMORE,
  NOTIFICATION_BOOKING_OPTION_CREATED,
  NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_CONSUMER,
  NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_MANAGER,
  NOTIFICATION_OFFER_IN_BOOKING_MODIFIED,
  NOTIFICATION_BOOKING_NOT_REFUNDED,
  NOTIFICATION_BOOKING_REFUNDED,
  NOTIFICATION_MEMBERSHIP_CREATION_SAAS,
  NOTIFICATION_SUBSCRIPTION_CREATE,
  NOTIFICATION_SUBSCRIPTION_UPDATE_PAYMENT_METHOD,
  NOTIFICATION_SUBSCRIPTION_PAUSE,
  NOTIFICATION_SUBSCRIPTION_STOP,
  NOTIFICATION_SUBSCRIPTION_PAYMENT_RECEIVED,
  NOTIFICATION_BOOKING_BROADCAST,
  NOTIFICATION_PRIVATE_BOOKING_CANCEL_NOT_REFUNDED_COACH,
  NOTIFICATION_PRIVATE_BOOKING_CANCEL_NOT_REFUNDED_CONSUMER,
  NOTIFICATION_PRIVATE_BOOKING_CANCEL_REFUNDED_COACH,
  NOTIFICATION_PRIVATE_BOOKING_CANCEL_REFUNDED_CONSUMER,
  NOTIFICATION_PRIVATE_BOOKING_CREATE_COACH,
  NOTIFICATION_PRIVATE_BOOKING_CREATE_CONSUMER,
  NOTIFICATION_PRIVATE_BOOKING_UPDATETIME_COACH,
  NOTIFICATION_PRIVATE_BOOKING_UPDATETIME_CONSUMER,
} = NOTIFICATION_EVENTS;

exports.default = {
  ruleGroup: {
    member: 'Création de compte élève',
    offer: 'Séance',
    booking: 'Réservation',
    'waiting-list': "Liste d'attente",
    subscription: 'Abonnement',
    private_booking: 'Rendez-vous',
  },
  emailDesign: {
    placeholder: 'Généré par bsport',
    closePreview: 'Fermer',
  },
  tag: {
    Offer: {
      name: 'Séance',
      tags: {
        activity: 'Activité',
        coach: 'Professeur',
        date: 'Heure/Date séance',
        establishment: 'Lieu',
        establishment_practical_info: 'Accès à la salle',
        address: 'Adresse',
      },
    },
    BillingPlan: {
      name: 'Abonnement',
      tags: {
        subscription_name: "Nom de l'abonnement",
        subscription_recurrent_price: 'Montant mensuel prélevé',
        subscription_nb_months: 'Nombre de mois',
        subscription_flat_fee: 'Frais de dossier',
        subscription_payment_method: 'Méthode de paiement',
        subscription_nb_days_pause: 'Mise en Pause : nb de jours',
      },
    },
    User: {
      name: 'Elève',
      tags: {
        firstname: 'Prénom élève',
        lastname: 'Nom élève',
        unsubscribe_link: 'Lien de désinscription newsletter',
      },
    },
    Booking: {
      name: 'Réservation',
      tags: {
        activity: 'Activité',
        coach: 'Professeur',
        date: 'Heure/Date séance',
        establishment: 'Lieu',
        establishment_practical_info: 'Accès à la salle',
        address: 'Adresse',
        ics_calendar_link: 'Lien ics calendrier',
      },
    },
    PrivateConsumerPass: {
      name: 'Carte rendez-vous',
      tags: {
        pass_price: 'Prix carte RDV',
        pass_name: 'Nom carte RDV',
        pass_starting_date: 'Date de début carte RDV',
        pass_expiration: 'Date de fin RDV',
        pass_credit_left: 'Nombre de crédit restant',
      },
    },
    PrivateBooking: {
      name: 'Rendez-vous',
      tags: {
        activity: 'Activité',
        coach: 'Professeur (optionnel)',
        date: 'Heure/Date',
        address: 'Adresse',
        establishment_practical_info:
          "Information d'accès établissement (optionnel)",
      },
    },
    ConsumerPaymentPack: {
      name: 'Carte de cours',
      tags: {
        pass_price: 'Prix carte de cours',
        pass_name: 'Nom carte de cours',
        pass_starting_date: 'Date de début carte de cours',
        pass_expiration: 'Date de fin carte de cours',
        pass_credit_left: 'Nombre de crédit restant',
      },
    },
    BookingOption: {
      name: "Liste d'attente",
      tags: {
        activity: 'Activité',
        coach: 'Professeur',
        date: 'Heure/Date séance',
        establishment: 'Lieu',
        establishment_practical_info: 'Accès à la salle',
        address: 'Adresse',
        option_payment_url: 'Lien de réservation',
        option_expiration_date: "Date d'expiration place sur liste d'attente",
      },
    },
  },
  eventType: {
    [NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER]: 'Annulation séance',
    [NOTIFICATION_MEMBERSHIP_CREATION_WEB]: 'Inscription membre (élève)',
    [NOTIFICATION_BOOKING_PASS_CHECKOUT]: 'Réservation via carte de cours',
    [NOTIFICATION_BOOKING_CREATED]: 'Nouvelle réservation',
    [NOTIFICATION_BOOKING_PLUS_PASS_STRIPE_CHECKOUT]:
      'Réservation + achat carte de cours simultané',
    [NOTIFICATION_BOOKING_OPTION_CONVERTIBLE]:
      "Sortie de la liste d'attente : réservation possible",
    [NOTIFICATION_BOOKING_OPTION_NOT_CONVERTIBLE_ANYMORE]:
      "Liste d'attente pleine de nouveau",
    [NOTIFICATION_BOOKING_OPTION_CREATED]: "Inscription à la liste d'attente",
    [NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_CONSUMER]:
      "Désincription de la liste d'attente (élève)",
    [NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_MANAGER]:
      "Désinscription de la liste d'attente (manager)",
    [NOTIFICATION_OFFER_IN_BOOKING_MODIFIED]: 'Séance modifiée',
    [NOTIFICATION_BOOKING_NOT_REFUNDED]:
      'Réservation annulée : crédit non-remboursée',
    [NOTIFICATION_BOOKING_REFUNDED]: 'Réservation annulée : crédit remboursé',
    [NOTIFICATION_MEMBERSHIP_CREATION_SAAS]: 'Inscription membre (manager)',
    [NOTIFICATION_SUBSCRIPTION_CREATE]: 'Abonnement créé',
    [NOTIFICATION_SUBSCRIPTION_UPDATE_PAYMENT_METHOD]:
      'Changement de méthode de paiement',
    [NOTIFICATION_SUBSCRIPTION_PAUSE]: 'Abonnement mise en pause',
    [NOTIFICATION_SUBSCRIPTION_STOP]: 'Abonnement stoppé ou terminé',
    [NOTIFICATION_SUBSCRIPTION_PAYMENT_RECEIVED]: 'Paiement reçu',
    [NOTIFICATION_BOOKING_BROADCAST]: 'Rappel cours en ligne dans 15 min',
    [NOTIFICATION_PRIVATE_BOOKING_CREATE_CONSUMER]:
      'Nouveau rendez-vous (élève)',
    [NOTIFICATION_PRIVATE_BOOKING_UPDATETIME_CONSUMER]:
      'Horaire modifié (élève)',
    [NOTIFICATION_PRIVATE_BOOKING_CANCEL_NOT_REFUNDED_CONSUMER]:
      'Rendez-vous - hors-délai (élève)',
    [NOTIFICATION_PRIVATE_BOOKING_CANCEL_REFUNDED_CONSUMER]:
      'Rendez-vous annulé - remboursé (élève)',
    [NOTIFICATION_PRIVATE_BOOKING_CREATE_COACH]:
      'Nouveau rendez-vous (professeur)',
    [NOTIFICATION_PRIVATE_BOOKING_UPDATETIME_COACH]:
      'Horaire modifié (professeur)',
    [NOTIFICATION_PRIVATE_BOOKING_CANCEL_NOT_REFUNDED_COACH]:
      'Rendez-vous annulé - hors-délai (professeur)',
    [NOTIFICATION_PRIVATE_BOOKING_CANCEL_REFUNDED_COACH]:
      'Rendez-vous annulé - remboursé (professeur)',
  },
};

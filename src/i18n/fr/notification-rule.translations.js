import {
  NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER,
  NOTIFICATION_MEMBERSHIP_CREATION_WEB,
  NOTIFICATION_BOOKING_PASS_CHECKOUT,
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
} from '@bsport/common/lib/master-data/notification-rule-events';

export default {
  ruleGroup: {
    member: 'Création de compte élève',
    offer: 'Séance',
    booking: 'Réservation',
    waitingList: "Liste d'attente",
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
    User: {
      name: 'Elève',
      tags: {
        firstname: 'Prénom élève',
        lastname: 'Nom élève',
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
  },
  messages: {
    createOrUpdate: {
      success: 'Modifié avec succès',
      error: "Impossible d'enregistrer",
    },
  },
};

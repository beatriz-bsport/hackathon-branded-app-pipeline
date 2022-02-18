const NOTIFICATION_EVENTS = require('@bsport/common/lib/master-data/notification-rule-events');

const {
  NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER,
  NOTIFICATION_MEMBERSHIP_CREATION_WEB,
  NOTIFICATION_BOOKING_PASS_CHECKOUT,
  NOTIFICATION_BOOKING_CREATED,
  NOTIFICATION_BOOKING_PLUS_PASS_STRIPE_CHECKOUT,
  NOTIFICATION_BOOKING_OPTION_CONVERTIBLE,
  NOTIFICATION_BOOKING_OPTION_NOT_CONVERTIBLE_ANYMORE,
  NOTIFICATION_INVOICE_CREATE,
  NOTIFICATION_BOOKING_OPTION_KICKED,
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
  NOTIFICATION_SUBSCRIPTION_PAYMENT_DISPUTED,
  NOTIFICATION_SUBSCRIPTION_PASS_AUTO_DISABLED,
  NOTIFICATION_SUBSCRIPTION_PAYMENT_FAILED_NO_RETRY,
  NOTIFICATION_SUBSCRIPTION_PAYMENT_FAIL_WILL_RETRY,
  NOTIFICATION_RECURRENT_PRIVATE_BOOKING_NO_AVAILABILITY_COACH,
  NOTIFICATION_RECURRENT_PRIVATE_BOOKING_NO_AVAILABILITY_CONSUMER,
  NOTIFICATION_PAYMENT_INSTALMENT_PREPARED,
} = NOTIFICATION_EVENTS;

// should import that from common
const NOTIFICATION_OFFER_AUTO_DISCARD = 601;
const NOTIFICATION_CONSUMER_PAYMENT_PACK_PENALTY_BLOCK_CPP = 701;
const NOTIFICATION_CONSUMER_PAYMENT_PACK_PENALTY_ACCOUNT = 702;

exports.default = {
  pageTitle: 'Emails transactionnels',
  caption: {
    active: 'Activé',
    sendCopy: 'Recevoir une copie du mail',
    event: 'Événement',
    emailDesign: 'Mail à envoyer',
  },
  ruleGroup: {
    member: 'Création de compte élève',
    offer: 'Séance',
    booking: 'Réservation',
    'waiting-list': "Liste d'attente",
    subscription: 'Abonnement',
    private_booking: 'Rendez-vous',
    invoice: 'Facturation',
    marketing: 'Marketing',
    payment_pack: 'Cartes de cours',
    recurrent_private_booking: 'Rendez-vous récurrent',
  },
  emailDesign: {
    placeholder: 'Généré par bsport',
    closePreview: 'Fermer',
    birthdayPlaceholder: 'Choisir un mail',
  },
  marketingNotification: {
    birthday: "Courriel d'anniversaire",
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
        subscription_next_invoice_date: 'Date de la prochaine facturation',
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
        spot: 'Place',
      },
    },
    PrivateConsumerPass: {
      name: 'Carte rendez-vous',
      tags: {
        pass_price: 'Prix carte RDV',
        pass_name: 'Nom carte RDV',
        pass_starting_date: 'Date de début carte RDV',
        pass_expiration: 'Date de fin RDV',
        pass_credit_left: 'Nombre de crédits restants',
      },
    },
    PrivateBooking: {
      name: 'Rendez-vous',
      tags: {
        activity: 'Activité',
        coach: 'Professeur (optionnel)',
        date: 'Heure/Date',
        address: 'Adresse',
        establishment: 'Salle',
        establishment_practical_info:
          "Information d'accès à la salle (optionnel)",
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
        pass_credit_left: 'Nombre de crédits restants',
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
      "La place en liste d'attente, convertible, a expiré pour ce tour",
    [NOTIFICATION_INVOICE_CREATE]: 'Confirmation facture',
    [NOTIFICATION_BOOKING_OPTION_KICKED]:
      'Kick (non-validé dans les temps trop de fois)',
    [NOTIFICATION_BOOKING_OPTION_CREATED]: "Inscription à la liste d'attente",
    [NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_CONSUMER]:
      "Désinscription de la liste d'attente (élève)",
    [NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_MANAGER]:
      "Désinscription de la liste d'attente (manager)",
    [NOTIFICATION_OFFER_IN_BOOKING_MODIFIED]: 'Séance modifiée',
    [NOTIFICATION_BOOKING_NOT_REFUNDED]:
      'Réservation annulée : crédit non remboursé',
    [NOTIFICATION_BOOKING_REFUNDED]: 'Réservation annulée : crédit remboursé',
    [NOTIFICATION_MEMBERSHIP_CREATION_SAAS]: 'Inscription membre (manager)',
    [NOTIFICATION_SUBSCRIPTION_CREATE]: 'Abonnement créé',
    [NOTIFICATION_SUBSCRIPTION_UPDATE_PAYMENT_METHOD]:
      'Changement de méthode de paiement',
    [NOTIFICATION_SUBSCRIPTION_PAUSE]: 'Abonnement mis en pause',
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
    [NOTIFICATION_OFFER_AUTO_DISCARD]:
      'Trop peu de réservations N heures avant le début de la séance',
    [NOTIFICATION_CONSUMER_PAYMENT_PACK_PENALTY_BLOCK_CPP]:
      'Pénalité carte de cours : carte bloquée (élève)',
    [NOTIFICATION_CONSUMER_PAYMENT_PACK_PENALTY_ACCOUNT]:
      'Pénalité carte de cours : acompte créé (élève)',
    [NOTIFICATION_RECURRENT_PRIVATE_BOOKING_NO_AVAILABILITY_COACH]:
      'Rendez-vous récurrent annulé pour manque de disponibilité (professeur)',
    [NOTIFICATION_RECURRENT_PRIVATE_BOOKING_NO_AVAILABILITY_CONSUMER]:
      'Rendez-vous récurrent annulé pour manque de disponibilité (élève)',
    [NOTIFICATION_PAYMENT_INSTALMENT_PREPARED]:
      "Tentative d'encaissement d'un paiement échelonné",
    [NOTIFICATION_SUBSCRIPTION_PAYMENT_DISPUTED]:
      "Litige sur paiement d'une souscription",
    [NOTIFICATION_SUBSCRIPTION_PASS_AUTO_DISABLED]:
      'Carte de cours de la souscription automatiquement désactivée',
    [NOTIFICATION_SUBSCRIPTION_PAYMENT_FAILED_NO_RETRY]:
      "Paiement d'une souscription échoué",
    [NOTIFICATION_SUBSCRIPTION_PAYMENT_FAIL_WILL_RETRY]:
      "Paiement d'une souscription échoué, sera retenté",
  },
  franchise: {
    emptySelect:
      'Sélectionner un email transactionnel pour voir sur quel franchisé il est partagé et utilisé.',
    addConfiguration: 'Ajouter une configuration',
    emptyStateConfiguration:
      "Créer une configuration pour forcer l'utilisation de templates d’email à chacun de vos franchisés.",
    form: {
      title: 'Configuration',
      description:
        'Le template choisi sera utilisé pour l’email transactionnel “{{name}}“ pour l’ensemble des franchisés sélectionnés ici.',
      name: 'Nom',
      pickTemplate: 'Choisir un template',
      useFor: 'Utiliser pour ',
      parameters: 'Paramètres',
      activate: 'Activé',
      activateSubtitleActivate:
        'L’email transationnel est activé, il sera envoyé aux membres',
      activateSubtitleDeactivate:
        'L’email transationnel est désactivé, il ne sera pas envoyé aux membres',
      receiveCC: 'Recevoir une copie du mail',
      receiveCarbonCopySubtitle:
        'Vous recevrez une copie de chaque email envoyé',

      mailSelection: 'Choisir un template',
      cancel: 'Annuler',
      save: 'Enregister',

      error: {
        name: 'Veuillez remplir un nom',
        selectCompanies: 'Sélectionner au moins un franchisé',
        email_design: 'Sélectionner un template',
      },
    },
    card: {
      template: 'Template',
      parameters: 'Paramètres',
      companies: 'Franchisés',
      activated: 'Activé',
      deactivated: 'Désactivé',
      carbonCopy: 'Recevoir une copie du mail',
    },
    delete: {
      title: 'Suppression',
      content:
        "Êtes-vous sûr de vouloir supprimer cette configuration ? Les paramètres et templates d’email sélectionnés reprendront leurs valeurs d'origine.",
      delete: 'Supprimer',
    },
  },
  countElements: '{{nbr}} éléments',
  countEmail: '{{nbr}} emails transactionnels activés',
  countNotification: '{{nbr}} notifications push activés',
  configureNotif: 'Configurer',
  goBackToMenu: 'Précédent',
  franchiseOwned:
    'Votre franchiseur gère actuellement cet email transactionnel',
  preview: {
    title: 'Aperçu',
    emptyState: 'Pour voir les aperçus, cliquez sur une des catégories',
    emptyStateNotification:
      'Pour voir votre aperçu, configurez votre notification push',
    notification: 'Push',
    email: 'Email',
  },
  listItem: {
    transactionnalEmail: 'Email transactionnel',
    sendTransactionnalEmail: 'Envoyer un email transactionnel',
    copyCarbon: 'Recevoir une copie du mail',
    mailToSend: 'Mail à envoyer',
    transactionnalNotification: 'Notification push',
    sendTransactionnalNotification: 'Envoyer une notification push',
    modifyTransactionnalNotification: 'modifier la notification push',
    createTransactionnalNotification: 'configurer la notification push',
  },
};

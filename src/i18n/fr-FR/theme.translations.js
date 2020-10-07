exports.default = {
  pageTitles: {
    broadcast: 'Visioconférence',
    personalization: 'Personnalisation',
    theme: 'Général',
  },
  forms: {
    themePersonalization: {
      calendarPersonalizationTitle: 'Configuration du calendrier',
      consumerRegularizeDebt: 'Le client peut régulariser son acompte en ligne',
      acceptDoubleBooking: 'Accepter la double réservation',
      cancelledOffersCustomer:
        'Afficher les séances annulées sur le calendrier client',
      workshopsCustomer: 'Afficher les ateliers sur le calendrier client',
      calendar: {
        title:
          'Introduisez votre propre code CSS pour personnaliser votre calendrier',
        bookButton: {
          placeholder: 'Entrer le code CSS',
          label: 'Bouton "réserver"',
          helperText: 'Changer le style du bouton "réserver"',
        },
        columns: {
          placeholder: 'Entrer le code CSS',
          label: 'Colonnes',
          helperText: 'Changer le style des colonnes',
        },
        offerCard: {
          placeholder: 'Entrer le code CSS',

          label: 'Cartes de cours',
          helperText: 'Changer le style des cartes de cours',
        },
        police: {
          placeholder: 'Entrer le code CSS',

          label: 'Police',
          helperText: 'Changer le style de la police',
        },
      },
      default_attendance: {
        present: 'Membre présent',
        missing: 'Membre absent',
        title: "Statut par défaut d'une réservation faite par le client",
      },
      default_booking_ordering: {
        date: 'Trier par date de réservation la plus récente',
        firstname: 'Trier par ordre alphabétique des prénoms',
        lastname: 'Trier par ordre alphabétique des noms',
        title:
          "Choisir l'ordre de tri par défaut des réservations sur la page d'une activité",
      },
      names_label_info:
        "Modifier le label des champs Nom et Prénom dans les formulaires d'inscription",
      first_name_label: {
        placeholder: 'Label pour le prénom',
        label: 'Label pour le prénom',
        helperText: 'Entrez le label pour le prénom',
      },
      last_name_label: {
        placeholder: 'Label pour le nom',
        label: 'Label pour le nom',
        helperText: 'Entrez le label pour le nom',
      },
      offersFilling:
        'Afficher le remplissage des cours sur le calendrier client',
      basket_expiration_days: {
        label: "Expiration du panier d'achat",
        helperText:
          "Nombre de jours avant lequel le panier d'un client est automatiquement vidé",
        placeholder: 'Jours avant expiration',
        alert: "Remplissez les jours d'expiration du panier!",
      },
    },
    cover: {
      label: 'Logo',
      helperText: 'Privilégiez les png avec fond transparent',
    },
    primary_color: {
      label: 'Couleur principale',
      helperText: 'Priviligéiez une couleur, évitez le monochrome',
    },
    secondary_color: {
      label: 'Couleur secondaire',
      helperText: 'Couleur complémentaire du thème',
    },
    websiteURL: {
      label: 'URL website',
      helperText: 'Utilisée si le client clique sur votre logo notamment',
      placeholder: 'https://studio.com/',
    },
    scheduleURL: {
      label: 'URL planning',
      helperText: 'Lien par défaut de votre calendrier',
      placeholder: 'https://studio.com/calendar/',
    },
    facebookURL: {
      label: 'URL Facebook',
      helperText: 'Votre page Facebook',
      placeholder: 'https://facebook.com/mon-studio/',
    },
    ios_app_url: {
      label: "URL de l'application iOS",
      helperText: 'Votre application iOS',
      placeholder: 'https://apps.apple.com/fr/app/id1356621554',
    },
    android_app_url: {
      label: "URL de l'application Android",
      helperText: 'Votre application Android',
      placeholder: 'https://play.google.com/store/apps/details?id=com.bsport',
    },
    general_terms_and_conditions: {
      label: 'Conditions générales de vente',
      helperText: 'Doivent être acceptées pour tout paiement',
      placeholder:
        "J'atteste posséder un certificat médical et l'apporterai à mon studio",
    },
    general_terms_of_use: {
      label: "Conditions générales d'utilisation",
      helperText: 'Doivent être acceptées pour toute inscription',
      placeholder: "J'atteste avoir plus de 13 ans",
    },
    gtmId: {
      placeholder: 'GTM-XXXXXX',
      label: 'Google Tag ID',
    },
    instagramURL: {
      label: 'URL Instagram',
      helperText: 'Votre page Instagram',
      placeholder: 'https://instagram.com/mon-studio/',
    },
    submit: 'Sauvegarder',
  },
};

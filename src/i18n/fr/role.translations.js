const {
  OWNER_ROLE,
  STAFF_ROLE,
  REPORT_ROLE,
  RESTRICTED_STAFF_ROLE,
  CHECKIN_APP_ROLE,
  ADMIN_ROLE,
} = require('../../libs/role/role-types');

exports.default = {
  pageTitle: 'Staff',
  userRoles: 'Comptes Staff',
  permissions: 'Rôles disponibles',
  explainStaffDo:
    'Un accès staff permet de se connecter à https://backoffice.bsport.io via ordinateur ou mobile',
  explainStaffDoNot:
    "Un accès staff ne permet pas de se connecter à l'application mobile (professeur et élèves uniquement)",
  forms: {
    user: {
      create: {
        buttonLabel: 'Ajouter un accès',
        title: 'Création de compte staff',
        email: {
          label: 'Email',
        },
        firstName: {
          label: 'Prénom',
        },
        lastName: {
          label: 'Nom',
        },
        role: {
          label: 'Role',
        },
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
      delete: {
        title: 'Suppression compte staff',
        content: 'Êtes-vous sûr de vouloir supprimer ce compte ?',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
    },
  },
  roleDescription: {
    [CHECKIN_APP_ROLE]: {
      name: 'Checkin tablette',
      description:
        // eslint-disable-next-line
        "Compte pour application d'auto-checkin (contactez votre chargé de compte bsport)",
    },
    [RESTRICTED_STAFF_ROLE]: {
      name: 'Checkin restreint',
      description: 'Accès seulement au checkin.',
    },

    [ADMIN_ROLE]: {
      name: 'Admin',
      description:
        // eslint-disable-next-line
        'Admin, même accès que Owner mais peut être supprimé/créé',
    },

    [STAFF_ROLE]: {
      name: 'Checkin étendu',
      description:
        'Accès à la gestion de la séance (modification et annulation), aux membres, et au checkin.',
    },

    [OWNER_ROLE]: {
      description:
        'Accès admin, aucune restriction, peut créer des comptes staff',
      name: 'Owner',
    },
    [REPORT_ROLE]: {
      description:
        'Accès uniquements aux rapports, utile pour vos comptables par exemple',
      name: 'Rapports',
    },
  },
};

exports.default = {
  accountConfiguration: {
    bankAccount: {
      owner_address: 'Owner Address',
      address: 'Address',
      bank_details: 'Informations bancaires',
      general: 'General',
      fields: {
        iban: 'IBAN',
        bank_account_holder: 'Titulaire du compte',
      },
    },
    paymentMethodSuccess:
      "Le moyen de paiement indiqué est valide. Vous pourrez toujours le modifier dans les paramètres d'abonnement Bsport.",
    accountSuccess:
      'Votre compte Stripe a bien été créé. Vous pourrez modifier ces informations plus tard dans le backoffice dans les paramètres d’entreprise.',
    goToBackoffice:
      'Cliquez sur “C’est parti” pour être redirigé vers le backoffice.',
    bankAccountSuccess:
      'Votre IBAN est validé. Vous pourrez modifier ces informations plus tard dans le backoffice dans les paramètres d’entreprise.',
    welcomeTitle: 'Bienvenue sur Bsport',
    welcomeDescription:
      'Nous sommes heureux de vous accueillir sur votre nouvelle plateforme. Avant de commencer votre expérience, il nous manque quelques informations.',
    welcomeConfigure:
      'Configurez votre compte en seulement {{numberOfSteps}} étape !',
    welcomeConfigure_plural:
      'Configurez votre compte en seulement {{numberOfSteps}} étapes !',
    stripeStep: 'Configuration stripe',
    ibanStep: 'Renseignement de l’IBAN',
    cardStep: 'Moyen de paiement',
    finishStep: 'Terminé !',
    createStripe: 'Créez votre compte stripe',
    configureStripe:
      'Configurer votre compte stripe. Il est nécessaire pour que vos clients effectuent leurs achats et paiements en ligne.',
    companyName: 'Nom de l’entreprise',
    companyAdress: 'Adresse',
    configureStripeAction: 'Configurer Stripe',
    infoGoingBack:
      'Si vous quittez la page maintenant, vous pourrez reprendre au même endroit à votre retour.',
    stripeConfiguration: 'Configurer Stripe',
    stripeConfigurationExplain:
      'Vous allez être redirigé vers le formulaire de stripe. Une fois cette étape terminée vos informations seront enregistrées automatiquement sur Bsport.',
    redirecting: 'Nous vous redirigeons vers le formulaire de stripe...',
    companyStripeName: 'Compte stripe',
    managerIbanExplain:
      'Indiquez sur quel compte vous souhaitez recevoir par virements les montants payés en ligne via Bsport',
    paymentMethodTitle: 'Indiquez votre moyen de paiement',
    paymentMethodExplain:
      'Renseignez le moyen de paiement que vous souhaitez utiliser pour payer votre abonnement à Bsport',
    congrats: 'Félicitations !',
    finishExplain:
      'Votre configuration est terminée, vous pouvez maintenant utiliser Bsport.',
  },
  emailValidation: {
    explain:
      'Nous vous avons envoyé un email de validation, vous y êtes presque !',
    success:
      "Votre email a été validé, vous allez être redirigé d'ici quelques secondes.",
    sendAgain: 'Renvoyer un email de confirmation',
    hasSentAgain: 'Email envoyé',
    linkExpired: 'Votre lien de validation a expiré',
    goToLogin: 'Retour',
    disconnect: 'Changer de compte',
  },
  forms: {
    password: {
      label: 'Mot de passe',
    },
  },
  or: ' ou ',
  actions: {
    signin: 'Me connecter',
    signup: {
      noAccount: 'Pas encore de compte ?',
      register: "M'inscrire",
    },
    forgottenPassword: 'Mot de passe oublié ?',
  },
  tempPassword: {
    title: 'Mot de passe temporaire',
    close: 'Fermer',
    submit: 'Générer',
    explainRequest:
      'Demandez un mot de passe temporaire valable une semaine pour permettre -par exemple- à nos équipes de se connecter à votre compte pour une durée limitée. Votre mot de passe principal ne change pas.',
    explain:
      "Ce mot de passe est valide jusqu'à {{expirationDate }}. Votre mot de passe principal n'a pas changé.",
    copy: 'Copier le mot de passe dans le presse papier',
    copied: 'Mot de passe copié',
  },
  error: {
    authError: 'Email ou mot de passe erroné',
    invalidEmail: "Cet email n'existe pas dans notre base",
    invalidPassword: 'Mot de passe invalide',
  },
  doubleLogin: {
    explain:
      'Votre session a expirée. Vous vous êtes connecté à deux comptes différents simultanément, ou vous êtes déconnecté depuis un autre onglet / fenêtre.?',
    disconnect: 'Me reconnecter',
  },
  signin: {
    connection: 'Connexion',
    connect: 'Connectez-vous pour continuer.',
    selectYourCurrentEmail: 'Sélectionner votre adresse actuelle de connexion.',
  },
  signup: {
    title: 'Inscription',
  },
  contactUs:
    'Manager de studio, vous êtes intéressé par notre solution ?\nContactez-nous.',
  signupCompany: {
    welcome: {
      title: 'Bienvenue !',
      content:
        'bsport regroupe une communauté de passionnés dont le but est de simplifier vos outils informatiques et vous permettre de mieux comprendre votre communauté.',
      next: 'Continuer',
    },
    form: {
      title: 'Mes informations',
      name: {
        label: 'Nom de votre studio/club/société',
        placeholder: 'Yoga Shala',
        helperText: 'Ce nom sera visible par vos membres',
      },
      email: {
        label: 'Email',
        placeholder: 'me@bsport.io',
        errorExists: 'Cet email existe déjà, veuillez en choisir un autre.',
      },
      password1: {
        label: 'Mot de passe',
      },
      password2: {
        label: 'Confirmation',
        error: 'Les mots de passe ne correspondent pas',
      },
      country: {
        label: 'Pays',
      },
      timezone: {
        label: 'Fuseau horaire',
      },
      previous: 'Précédent',
      next: 'Confirmer',
    },
  },
  country: {
    FR: 'France',
    DE: 'Allemagne',
    GB: 'Royaume-Uni',
    AT: 'Autriche',
    IT: 'Italie',
    NL: 'Pays-Bas',
    IE: 'Irlande',
    BE: 'Belgique',
    ES: 'Espagne',
    CH: 'Suisse',
    MT: 'Malte',
    NO: 'Norvège',
    EE: 'Estonie',
    US: "États-Unis d'Amérique",
    SE: 'Sweden',
    FI: 'Finlande',
    DK: 'Danemark',
    LU: 'Luxembourg',
    CA: 'Canada',
    AE: 'Émirats Arabes Unis',
    CY: 'Chypre',
    SK: 'Slovaquie',
    AU: 'Australie',
    HK: 'Hong Kong',
    PL: 'Pologne',
    PT: 'Portugal',
    BR: 'Brésil',
    SG: 'Singapour',
    NZ: 'Nouvelle Zélande',
    LT: 'Lituanie',
    LV: 'Lettonie',
    MY: 'Malaysie',
    IN: 'India',
    GR: 'Grèce',
    CZ: 'République Tchèque',
    BG: 'Bulgarie',
    RO: 'Roumanie',
    SI: 'Slovénie',
    MX: 'Mexique',
  },
  language: {
    fr: 'français',
    en: 'anglais',
    de: 'allemand',
    it: 'italien',
    nl: 'néerlandais',
    es: 'espagnol',
    pt: 'Portuguais',
  },
};

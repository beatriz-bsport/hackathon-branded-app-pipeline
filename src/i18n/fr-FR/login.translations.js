exports.default = {
  forms: {
    password: {
      label: 'Mot de passe',
    },
  },
  or: ' ou ',
  actions: {
    signin: 'Me connecter',
    signup: 'Pas encore de compte ?',
    forgottenPassword: 'Mot de passe oublié',
  },
  tempPassword: {
    title: 'Mot de passe temporaire',
    close: 'Fermer',
    submit: 'Générer',
    explainRequest:
      'Demandez un mot de passe temporaire valable 2h pour permettre -par exemple- à nos équipes de se connecter à votre compte pour une durée limitée. Votre mot de passe principal ne change pas.',
    explain:
      "Ce mot de passe est valide jusqu'à {{expirationDate }}. Votre mot de passe principal n'a pas changé.",
  },
  error: {
    authError: 'Email ou mot de passe erroné',
    invalidEmail: "Cet email n'existe pas dans notre base",
    invalidPassword: 'Le mot de passe est invalide',
  },
  doubleLogin: {
    explain:
      'Votre session a expirée. Vous vous êtes connecté à deux comptes différents simultanément, ou vous êtes déconnecté depuis un autre onglet / fenêtre.?',
    disconnect: 'Me reconnecter',
  },
  signup: {
    title: 'Inscription',
  },
  contactUs:
    'Manager de studio, vous êtes intéressé par notre solution ? Contactez-nous.',
};

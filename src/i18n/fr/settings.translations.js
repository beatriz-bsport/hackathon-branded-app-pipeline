// @flow

export default {
  pageTitle: 'Paramètres',
  tab: {
    general: 'Général',
    notificationRule: 'Emails transactionnels',
    paymentRules: 'Règles de rémunération',
    company: 'Entreprise',
    invoice: 'Facturation',
    waitingList: "Liste d'attente",
    shop: 'Magasin',
    role: 'Staff',
    personalization: 'Personnalisation',
    webhook: 'Webhook',
    partnership: 'Partenariat',
    active_campaign: 'ActiveCampaign',
  },
  webhook: {
    cancel: 'annuler',
    submit: 'valider',
    createTitle: 'Formulaire Webhook',
    testSuccess: 'Url correcte',
    testError: "Veuillez vérifier l'url",
    add: 'Ajouter un webhook',
    test: 'Tester',
    event: 'Evènement',
    selectEvent: 'Sélectionner un évènement',
    url: 'URL',
    urlHelper: "Entrez l'url à laquelle sera envoyée la payload",
    urlPlaceHolder: 'http://wwww.google.com',
    payload: 'Payload',
    messages: {
      form: {
        success: 'Webhook enregistré',
        error: "Impossible d'enregistrer le webhook",
      },
    },
    modal: {
      delete: {
        title: 'Suppression du webhook',
        cancel: 'annuler',
        confirm: 'Confirmer',
        content:
          'Etes vous sûr de vouloir supprimer ce webhook, cette opération est définitive',
      },
    },
  },
  active_campaign: {
    submit: 'Confirmer',
    cancel: 'Annuler',
    account: {
      helpTitle: 'Où trouver les informations de mon compte ?',
      helpContent:
        "L'url et la clé d'authentification de votre compte ActiveCampaign sont accessibles dans les paramètres de votre compte, en cliquant sur l'onglet 'Développeur'.",
      title: "Informations d'accès à votre API ActiveCampaign",
      helper: 'Où trouver ces informations ?',
      dialogTitle: 'Informations de mon compte ActiveCampaign',
      token: "Clé d'authentification",
      error: 'Vos informations sont incorrectes',
    },
    webhooks: {
      helpTitle: 'Comment se déroule la synchronisation ?',
      helpContent:
        "Les actions ci dessous ont lieu dès que l'évènement associé se produit sur ActiveCampaign.",
      title: "Intégrer les informations d'ActiveCampaign sur bsport",
      CLIENT_WON:
        "Créer un compte client sur bsport lorsque le propect est passé en statut 'WON' sur un deal",
      CONTACT_TAG:
        "Créer un compte client sur bsport lorsque le propect est tagé en 'won' sur ActiveCampaign",
    },
    link: {
      helpTitle: 'Comment se déroule la synchronisation ?',
      helpContent:
        "Les membres dans la smartlist sont envoyés chaque nuit vers la liste ActiveCampaign, ils apparaissent dessus comme 'actifs'. Les membres sortis de la smartlist sont également enlevés de la liste ActiveCampaign, leur statut est alors 'non-confirmé'.",
      title: 'Envoi des informations depuis bsport',
      add: 'Ajouter un lien entre listes',
      dialogTitle: 'Modifier un lien de listes',
      smartListSelection: 'Choisir une smartlist',
      listActiveCampaignSelection: 'Choisir une liste ActiveCampaign',
      helperForm:
        "Choisissez une smartlist de bsport et liez la à l'une de vos listes sur ActiveCampaign",
      noList: 'LISTE INTROUVABLE',
      listItemText:
        'Envoyer les membres de la smartlist <1>{{smartlist}}</2> à la liste ActiveCampaign <3>{{list}}</4>',
    },
  },
};

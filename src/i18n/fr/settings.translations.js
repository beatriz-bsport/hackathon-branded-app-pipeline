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
};

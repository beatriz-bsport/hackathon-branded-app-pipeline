export default {
  member: {
    register: {
      name: 'Nouveau membre',
      description:
        "Est déclenché lorsqu'un nouveau membre pour le club est ajouté sur bsport",
    },
  },
  booking: {
    register: {
      name: 'Nouvelle réservation',
      description:
        "Est déclenché lorsqu'une nouvelle réservation est enregistrée",
    },
  },
  booking_option: {
    cancel: {
      name: "Annulation de place en liste d'attente",
      description:
        "Est déclenché lorque le membre ou un manager annule la place sur liste d'attente",
    },
  },
  noEvent: { description: "Description de l'évènement" },
};

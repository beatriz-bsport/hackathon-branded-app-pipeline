exports.default = {
  toolsMenu: {
    title: 'Boite à outils',

    sections: {
      edition: 'Édition',
      walls: 'Murs',
      place: 'Emplacement',
      elements: 'Éléments',
      custom: 'Personnalisation',
    },

    eraser: 'Gomme',
    undo: 'Précédent',
    redo: 'Suivant',
    rotation: 'Rotation',
    line: 'Trait',
    rect: 'Rectangle',
    spot: 'Place',
    teacher: 'Professeur',
    helperText: 'La taille du professeur doit être strictement positive',
    screen: 'Écran',
    door: 'Porte',
    pointer: 'Curseur',
    hand: 'Main',

    customStroke: 'Couleur des traits',
    customFill: 'Couleur de remplissage',

    customIconLabel: 'Icones des emplacements',
    customIconButton: 'Télécharger mes icones',
    showGrid: 'Afficher la grille',
    addSpotType: 'Ajouter un type de place',
  },
  spotImageDialog: {
    title: 'Personnaliser vos emplacements',
    helper:
      'Vous pouvez personnaliser la forme des emplacements en important vos propres images. Pour cela nous avons besoin de 2 icones différentes. Une pour indiquer que l’emplacement est disponible, une autre quand il est réservé. Assurez-vous qu’ils aient la même taille et merci de ne pas inclure de numéro sur vos icones.',
    freeImageLabel: 'Emplacement disponible',
    takenImageLabel: 'Emplacement réservé',
    imageUploadButton: 'Charger une image',
    free: 'Disponible',
    taken: 'Réservé',
    imageFormat: 'Format conseillé: .png, .jpg',
    actions: {
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
  },
  toolbar: {
    save: 'Enregistrer',
    titleLabel: 'Nom du plan',
    exit: 'Quitter',
    loadExistingBlueprint: 'Charger un plan existant',
  },
  spotSelectorDialog: {
    title: 'Sélectionnez une place',
    spot: 'Place {{count}}',
    book: 'Réserver la place {{prefix}}{{indexType}}',
    cancel: 'Annuler',
    submit: 'Confirmer',
    legend: 'Légende',
    takeSpotError:
      'La place que vous avez sélectionnée pour ce cours n’est plus disponible. Merci d’en sélectionner une nouvelle.',
  },
  roomBlueprintSelectorTitle: 'Choisir un plan',
  search: 'Chercher un plan pour le spot scheduling',
  searchHelper:
    "Aide: permet à vos élèves de réserver l'emplacement qu'ils souhaitent dans la salle. Champs non obligatoire",
  effectifError:
    "Le nombre de place doit être supérieur ou égal à l'effectif de la séance",
  saved: 'Plan de salle enregistré',
  errorLessSpotThanEffectif:
    "Sauvegarde impossible. Le plan de salle doit contenir plus de place que l'effectif de la séance auxquelle il est associé",
  errorAvailableOffersScheduled:
    'Sauvegarde impossible. Le plan de salle ne doit pas être utilisé dans des séances futures pour être édité.',
  saveError: 'Erreur',
  roomBlueprints: 'Plan de salle',
  placeCount: '{{count}} places',
  spotCreatorForm: {
    title: 'Plan de salle',
    subtitle: "Création d'un type de place",
    name: 'Nom',
    nameExplain: 'Nom du type de place',
    prefix: 'Préfixe',
    prefixExplain:
      'Le caractère indiqué ici apparaitra en préfixe des numéros de places',
    prefixError: "Le préfixe ne doit être qu'une seule lettre",
    customization: 'Personnalisation',
    predefined: 'Formes prédéfinies',
    personalized: 'Images personnalisées',
    circular: 'Rond',
    rectangle: 'Rectangle',
    triangle: 'Triangle',
    square: 'Carré',
    generalInfo: 'Informations générales',
    preview: 'Prévisualisation',
    personalizedExplain:
      'Vous pouvez personnaliser la forme des emplacements en important vos propres images. Pour cela nous avons besoin de 3 icones différentes. Une pour indiquer que l’emplacement est disponible, une autre quand il est réservé. Assurez vous qu’ils aient la même taille et merci de ne pas inclure de numéro sur vos icones.',
    free: 'Place disponible',
    freePersonalized: '{{name}} disponible',
    taken: 'Place réservée',
    takenPersonalized: '{{name}} réservé',
    selected: 'Place sélectionnée',
    selectedPersonalized: '{{name}} sélectionné',
    missImageFree: "Vous n'avez pas chargé l'image pour la place libre",
    missImageTaken: "Vous n'avez pas chargé l'image pour la place réservée",
    missImageSelected:
      "Vous n'avez pas chargé l'image pour la place selectionnée",
    saved: 'Emplacement enregistré',
    deleted: 'Emplacement supprimé',
    alertDefaultSpot:
      "En modifiant le spot par défaut, tous les spots par défaut présents sur l'ensemble des plans seront alors identiquement modifiés",
  },
  forms: {
    delete: {
      title: 'Suppression',
      content: {
        canDelete:
          'Êtes-vous sûr de vouloir supprimer cet emplacement ? Cette action est irréversible. Il sera supprimé et remplacé par l’emplacement par défaut sur ce plan et tous les autres sur lesquels il a été ajouté.',
      },
      actions: { cancel: 'Annuler', confirm: 'Confirmer' },
    },
  },
};

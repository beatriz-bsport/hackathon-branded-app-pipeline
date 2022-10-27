import React from 'react';
import { ProductCard, Props } from './ProductCard.component';

const GenericProductCardTemplate = (args: Props) => <ProductCard {...args} />;

export const GenericProductCard = GenericProductCardTemplate.bind({});

GenericProductCard.args = {
  headerLeftPrimary: 'Header left primary',
  headerRightPrimary: 'HRP',
  headerLeftSecondary: 'Header left secondary',
  headerRightSecondary: 'Header right secondary',
  activationLink: 'https://www.google.fr/',
  activationLinkLabel: 'Cliquer pour copier le lien vers google',
  buttons: [
    {
      onClick: () => {},
      label: 'Modifier',
    },
    {
      onClick: () => {},
      label: 'Autre action',
    },
    {
      onClick: () => {},
      label: 'Supprimer',
      redButton: true,
    },
  ],
  categories: {
    validity: 'Valide 1 mois à partir de la déclaration de mariage',
    paymentMethods: 'Carte, Compte interne (crédit)',
    credits: '100 patates',
    vod: 'Valable pour la VOD, et bien plus',
    accessibility: 'Paiement sur place pas autorisé, paye en ligne',
    compatibility: 'Compatible avec tout et rien',
    restrictions: [
      'Utilisations maximum par jour : 5',
      'Utilisations maximum par semaine : 10',
      'Utilisations maximum par mois : 20',
      'Nombre d’achats maximum : 2',
    ],
  },
  description: 'Ceci est une courte description de la carte',
};

export default {
  title: 'Components/Card',
  component: ProductCard,
  parameters: {
    docs: {
      page: null,
    },
  },
};

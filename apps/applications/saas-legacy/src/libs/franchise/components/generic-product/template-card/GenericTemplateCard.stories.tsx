import React from 'react';
import { Typography } from '@material-ui/core';
import { CheckCircleOutlineRounded } from '@material-ui/icons';
import GenericTemplateCard, { Props } from './GenericTemplateCard.component';
import { FranchiseCompanyListFactory } from '#src/libs/franchise/factories/FranchiseCompanyFactory';

const franchiseCompanyList = FranchiseCompanyListFactory(20);
const defaultArgs = {
  allCompanies: franchiseCompanyList,
  companiesInTemplate: franchiseCompanyList.filter((c) => c.id % 3 === 0),
  onUpdateTemplate: () => {},
  onDeleteTemplate: () => {},
  onCreateTemplateInstances: () => {},
  onDeleteTemplateInstance: () => {},
  deleteTemplateContent:
    'This is the content of the delete dialog that one can override easily',
};

const FranchisePaymentPackTemplateCard = (args: Props) => (
  <GenericTemplateCard {...args} />
);

export const PaymentPackTemplateCard = FranchisePaymentPackTemplateCard.bind(
  {},
);

PaymentPackTemplateCard.args = {
  ...defaultArgs,
  headerLeftPrimary: 'Carte de cours',
  headerLeftSecondary: 'Pourquoi ne pas y mettre la catégorie ?',
  headerRightPrimary: '10.00 €',
  headerRightSecondary: '10.00 € Hors Taxes',
  description: `Ceci est une super carte de cours d'une valeur de 10€ ! Oui, 10€ ! Vous avez bien lu !
    N'hésitez pas à l'offrir à votre maman pour la fête des Mères.`,
  categories: {
    validity: 'Valide 1 mois à partir de la date de facturation',
    credits: '1 crédit',
    vod: 'Valable pour la VOD',
    accessibility: 'Paiement sur place autorisé',
    compatibility: 'Compatible avec tout',
    restrictions: [
      'Utilisations maximum par jour : 5',
      'Utilisations maximum par semaine : 10',
      'Utilisations maximum par mois : 20',
      'Nombre d’achats maximum : 2',
    ],
  },
  deleteTemplateInstanceContents: [
    "Salut, tu t'appretes à supprimer du partage ce studio.",
    "Les utilisateurs ayant acheté cette carte ne pourront l'utiliser que dans le studio d'achat !",
    'Réfléchis-y à deux fois René.',
  ],
};

const FranchiseGiftcardTemplateCard = (args: Props) => (
  <GenericTemplateCard {...args} />
);

export const GiftcardTemplateCard = FranchiseGiftcardTemplateCard.bind({});

GiftcardTemplateCard.args = {
  ...defaultArgs,
  headerLeftPrimary: 'Carte cadeau',
  headerLeftSecondary: '',
  headerRightPrimary: '10.00 €',
  headerRightSecondary: '10.00 € Hors Taxes',
  description: `Ceci est une super carte de cours d'une valeur de 10€ ! Oui, 10€ ! Vous avez bien lu !
    N'hésitez pas à l'offrir à votre maman pour la fête des Mères.`,
  categories: {
    validity: 'Valide 1 mois à partir de la date de facturation',
    paymentMethods: 'Carte, Compte interne (crédit)',
  },
  deleteTemplateInstanceChildren: (
    <Typography>On peut directement mettre du code dedans</Typography>
  ),
};

const FranchiseGenericTemplateCard = (args: Props) => (
  <GenericTemplateCard {...args} />
);

export const FullTemplateCard = FranchiseGenericTemplateCard.bind({});

FullTemplateCard.args = {
  ...defaultArgs,
  headerLeftPrimary: (
    <Typography variant="h3">
      Ceci est mon titre défini dans un composant Typography
    </Typography>
  ),
  headerLeftSecondary: undefined,
  headerRightPrimary: (
    <div
      style={{
        color: '#f80',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <CheckCircleOutlineRounded />
      <Typography variant="h3">100 patates !</Typography>
    </div>
  ),
  headerRightSecondary: '10.00 € Hors Taxes',
  description: `Ceci est une super carte pour tout template card de la franchise, section Products ! Investissez.`,
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
  deleteTemplateInstanceContents: [
    "En désactivant ce studio du partage de la carte cadeau, tous les membres possédant cette carte et l'ayant reçue d'un membre qui a acheté la carte dans ce studio pourront toujours l'utiliser. En revanche ils ne pourront plus l'utiliser dans les autres studios.",
    "Enfin, les cartes ayant été achetées dans les autres studios ne seront plus utilisables dans le studio désactivé, quelle que soit la date d'achat.",
  ],
};

const FranchiseEmptyTemplateCard = (args: Props) => (
  <GenericTemplateCard {...args} />
);

export const EmptyTemplateCard = FranchiseEmptyTemplateCard.bind({});

EmptyTemplateCard.args = {
  ...defaultArgs,
  companiesWithInstance: [],
};

export default {
  title: 'Library/Franchise/GenericProduct/Template Card',
  component: GenericTemplateCard,
  parameters: {
    docs: {
      page: null,
    },
  },
};

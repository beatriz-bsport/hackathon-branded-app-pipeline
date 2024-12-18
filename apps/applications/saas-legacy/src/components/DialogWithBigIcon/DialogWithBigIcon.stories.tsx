import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DialogWithBigIcon from './DialogWithBigIcon.component';

import WarningIconRounded from '#src/components/icons/WarningIconRounded.component';

const actionData = {
  onClose: action('onClose'),
  onClick: action('onClick'),
};

export default {
  title: 'Components/Dialogs&Drawers/DialogWithBigIcon',
  component: DialogWithBigIcon,
  argTypes: {
    onClose: actionData.onClose,
  },
  args: {
    open: true,
    namespaces: 'quicksale',
  },
} as ComponentMeta<typeof DialogWithBigIcon>;

const Template: ComponentStory<typeof DialogWithBigIcon> = (args) => (
  <DialogWithBigIcon {...args} />
);

export const DefaultWithCrossWithoutButtons = Template.bind({});
DefaultWithCrossWithoutButtons.args = {
  withCross: true,
  title: 'Paniers en cours',
  subTexts: [
    [
      'Des factures sont en cours, veuillez les fermer avant de vous déconnecter',
    ],
  ],
  CustomIcon: WarningIconRounded,
  iconColor: '#FF9800',
};

export const DialogWithCrossWithButtons = Template.bind({});
DialogWithCrossWithButtons.args = {
  withCross: true,
  title: 'Suppression du panier en cours',
  subTexts: [['Êtes-vous sûr de vouloir supprimer le panier actuel ?']],
  icon: 'Delete',
  iconColor: '#F44336',
  buttons: [
    {
      title: 'Annuler',
      onClick: actionData.onClick,
      variant: 'text',
      fontColor: '#757575',
    },
    {
      title: 'Supprimer',
      onClick: actionData.onClick,
      variant: 'contained',
      fontColor: '#FFFFFF',
      backgroundColor: '#F44336',
    },
  ],
};

export const DialogWithoutCrossWithButtonsAndSubTextList = Template.bind({});
DialogWithoutCrossWithButtonsAndSubTextList.args = {
  withCross: false,
  title: 'Identification nécessaire',
  subTexts: [
    ["L'article que vous souhaitez ajouter est"],
    [
      'Réservé aux nouveaux membres',
      "Soumis à une limitation du nombre d'achat",
      'Réservé aux membres taggés avec certains tags',
    ],
    [
      'Sans identification du membre, les vérifications nécessaires ne peuvent être faites',
    ],
  ],
  icon: 'Person',
  buttons: [
    {
      title: 'Annuler',
      onClick: actionData.onClick,
      variant: 'text',
      fontColor: '#757575',
    },
    {
      title: 'Supprimer',
      onClick: actionData.onClick,
      variant: 'contained',
      fontColor: '#FFFFFF',
      backgroundColor: '#F44336',
    },
  ],
};

export const DialogWithCheckbox = Template.bind({});
DialogWithCheckbox.args = {
  isChecked: false,
  handleCheck: action('handleCheck'),
  checkBoxLabel: 'Click here to check/uncheck',
  title: 'A dialog with checkbox',
  subTexts: [['Here is a sbutext.']],
  icon: 'Person',
  buttons: [
    {
      title: 'Cancel',
      onClick: actionData.onClick,
      variant: 'text',
      fontColor: '#757575',
    },
    {
      title: 'Confirm',
      onClick: actionData.onClick,
      variant: 'contained',
      fontColor: '#FFFFFF',
      backgroundColor: '#F44336',
    },
  ],
};

// @ts-nocheck
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import InfoIcon from '@material-ui/icons/Info';
import PaymentIcon from '@material-ui/icons/Payment';
import PersonIcon from '@material-ui/icons/Person';
import FormSection from '.';
import times from 'lodash/times';
import { TextField } from '@material-ui/core';

export default {
  title: 'Components/Forms/FormSection',
  component: FormSection,
} as ComponentMeta<typeof FormSection>;

const FormSectionTemplate: ComponentStory<typeof FormSection> = (args) => (
  <FormSection {...args} />
);

export const FormSectionWithoutChildren = FormSectionTemplate.bind({});
FormSectionWithoutChildren.args = {
  sectionTitle: 'Informations générales',
  sectionIcon: InfoIcon,
};

export const FormSectionWithIconStyling = FormSectionTemplate.bind({});
FormSectionWithIconStyling.args = {
  children: <div>Une div enfant</div>,
  sectionTitle: 'Paiement',
  sectionIcon: PaymentIcon,
  sectionIconStyle: 'primary',
};

export const RegularFormSection = FormSectionTemplate.bind({});
RegularFormSection.args = {
  children: [
    <TextField label="Nom" placeholder="Entrez votre nom" required fullWidth />,
    <TextField
      label="Prénom"
      placeholder="Entrez votre prénom"
      required
      fullWidth
    />,
  ],
  sectionTitle: 'Informations personnelles',
  sectionIcon: PersonIcon,
  sectionIconStyle: 'secondary',
};

export const FormSectionWithManyFields = FormSectionTemplate.bind({});
FormSectionWithManyFields.args = {
  children: times(100, (index: number) => (
    <TextField
      key={index.toString()}
      label="Nom"
      placeholder="Entrez votre nom"
      required
      fullWidth
    />
  )),
  sectionTitle: 'Informations personnelles, beaucoup de fois',
  sectionIcon: PersonIcon,
};

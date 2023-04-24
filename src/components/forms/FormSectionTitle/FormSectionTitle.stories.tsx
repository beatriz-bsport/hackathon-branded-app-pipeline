// @ts-nocheck
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Tune';
import FormSectionTitle from '.';

export default {
  title: 'Components/Forms/FormSectionTitle',
  component: FormSectionTitle,
} as ComponentMeta<typeof FormSectionTitle>;

const FormSectionTitleTemplate: ComponentStory<typeof FormSectionTitle> = (
  args,
) => <FormSectionTitle {...args} />;

export const FormSectionTitleIconWithoutStyle = FormSectionTitleTemplate.bind(
  {},
);
FormSectionTitleIconWithoutStyle.args = {
  Icon: InfoIcon,
  title: 'Informations',
};

export const FormSectionTitleIconWithStyle = FormSectionTitleTemplate.bind({});
FormSectionTitleIconWithStyle.args = {
  Icon: SettingsIcon,
  title: 'Settings',
  iconStyle: 'primary',
};

export const FormSectionTitleWithVeryLongTitle = FormSectionTitleTemplate.bind(
  {},
);
FormSectionTitleWithVeryLongTitle.args = {
  Icon: InfoIcon,
  title:
    "This is a very long text, just to make sure that everything is going to be fine with such a text, because you wouldn't want your component to suddenly introduce a line break or any other unexpected behavior when the title starts to be a bit long, right? We might never see this in a form section title but let's test it anyway.",
  iconStyle: 'error',
};

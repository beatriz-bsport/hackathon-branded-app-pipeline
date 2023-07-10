import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';
// @ts-expect-error
import PrivatePassSelectorField from './PrivatePassSelectorField.component';
import { privatePassListFactory } from '../../../private-service/factory';

const basicChoices = privatePassListFactory(4);

export default {
  title: 'Library/PrivateBooking/Selector/PrivatePassSelectorField',
  component: PrivatePassSelectorField,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: { private_pass: null },
    },
  },
} as ComponentMeta<typeof PrivatePassSelectorField>;

const PrivatePassSelectorFieldTemplate: ComponentStory<
  typeof PrivatePassSelectorField
> = (args) => <PrivatePassSelectorField {...args} />;

export const BasicPrivatePassSelectorField =
  PrivatePassSelectorFieldTemplate.bind({});
BasicPrivatePassSelectorField.args = {
  fullWidth: true,
  required: false,
  choices: basicChoices,
  name: 'private_pass',
};

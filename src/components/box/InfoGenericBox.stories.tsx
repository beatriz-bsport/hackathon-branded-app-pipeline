// @ts-nocheck
import React from 'react';
import InfoGenericBox, { OwnProps } from './InfoGenericBox.component';
import faker from 'faker';
faker.locale = 'fr';

const CustomTemplate = (args: OwnProps) => <InfoGenericBox {...args} />;

export const Generic = CustomTemplate.bind({});

Generic.args = {
  content: `
  ${
    faker.hacker.phrase() +
    faker.hacker.phrase() +
    faker.hacker.phrase() +
    faker.hacker.phrase() +
    faker.hacker.phrase() +
    faker.hacker.phrase()
  }`,
  type: 'error',
  variant: 'contained',
  variantIcon: 'outlined',
  withCollapse: false,
};

export default {
  title: 'Components/Commons/InfoBox',
  component: InfoGenericBox,
  parameters: {
    docs: {
      page: null,
    },
  },
};

import React from 'react';
import InfoGenericBox, { OwnProps } from './InfoGenericBox.component';
import { fakerFR as faker } from '@faker-js/faker';

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

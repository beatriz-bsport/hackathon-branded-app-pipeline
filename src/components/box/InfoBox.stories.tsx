// @ts-nocheck
import React from 'react'
import InfoBox, { OwnProps } from './InfoBox.component';
import { faker } from '@faker-js/faker';
faker.locale = 'fr';

const CustomTemplate = (args: OwnProps) => (
    <InfoBox {...args} />
);

export const Contained = CustomTemplate.bind({});

Contained.args = {
  content:faker.hacker.phrase()
};

export const Outlined = CustomTemplate.bind({});

Outlined.args = {
  content: faker.hacker.phrase(),
  variant:'outlined',
};

export default {
    title: 'Components/Commons/InfoBox',
    component: InfoBox,
    parameters: {
        docs: {
            page: null
        }
    },
};

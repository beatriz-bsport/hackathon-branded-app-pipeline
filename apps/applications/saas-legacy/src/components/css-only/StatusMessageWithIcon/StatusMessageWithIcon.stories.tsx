import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';
import InfoIcon from '@material-ui/icons/Info';

import { StatusMessageWithIconForStorybook, Props } from '.';

const baseArgs = {
  title: faker.lorem.words(5),
  message: faker.lorem.sentences(2),
};

const StatusMessageWithIconTemplate = (args: Props) => (
  // @ts-expect-error
  <StatusMessageWithIconForStorybook {...args} />
);

export const StatusMessageLoading = StatusMessageWithIconTemplate.bind({});
StatusMessageLoading.args = {
  ...baseArgs,
  isLoading: true,
};

export const StatusMessageWithIcon = StatusMessageWithIconTemplate.bind({});
StatusMessageWithIcon.args = {
  ...baseArgs,
  icon: <InfoIcon style={{ fontSize: 40 }} />,
};

export const StatusMessageWithActions = StatusMessageWithIconTemplate.bind({});
StatusMessageWithActions.args = {
  ...baseArgs,
  actions: {
    cancel: {
      label: faker.lorem.word(),
      onClick: () => {},
    },
    confirm: {
      label: faker.lorem.word(),
      onClick: () => {},
    },
  },
};

export const StatusMessageWithIconAndActions =
  StatusMessageWithIconTemplate.bind({});
StatusMessageWithIconAndActions.args = {
  ...baseArgs,
  icon: <InfoIcon style={{ fontSize: 40 }} />,
  actions: {
    cancel: {
      label: faker.lorem.word(),
      onClick: () => {},
    },
    confirm: {
      label: faker.lorem.word(),
      onClick: () => {},
    },
  },
};

export default {
  title: 'Components/CssOnly/StatusMessageWithIcon',
  component: StatusMessageWithIconForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};

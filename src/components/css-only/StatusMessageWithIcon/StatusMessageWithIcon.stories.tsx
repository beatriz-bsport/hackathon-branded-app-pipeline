import React from 'react';

import { ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';
import InfoIcon from '@material-ui/icons/Info';

import Button from '#csscomponents/Button';
import StatusMessageWithIcon, {
  StatusMessageWithIconForStorybook,
  type Props,
} from '.';

import './styles-storybook.css';

const baseArgs = {
  title: faker.lorem.words(5),
  message: faker.lorem.sentences(2),
};

const StatusMessageWithIconTemplate = (args: Props) => (
  // @ts-expect-error
  <StatusMessageWithIconForStorybook {...args} />
);

const StatusMessageActions: React.FC = () => (
  <div className="bs-status-message-with-icon-storybook__actions-container">
    <Button
      classes={{
        root: 'bs-status-message-with-icon-storybook__actions__button-cancel__container',
        text: 'bs-status-message-with-icon-storybook__actions__button-cancel__text',
      }}
      onClick={() => {}}
    >
      {faker.lorem.word(8)}
    </Button>
    <Button
      classes={{
        root: 'bs-status-message-with-icon-storybook__actions__button-submit__container',
        text: 'bs-status-message-with-icon-storybook__actions__button-submit__text',
      }}
      onClick={() => {}}
    >
      {faker.lorem.word(10)}
    </Button>
  </div>
);

export const StatusMessageLoading = StatusMessageWithIconTemplate.bind({});
StatusMessageLoading.args = {
  ...baseArgs,
  isLoading: true,
};

export const StatusMessageAndIcon = StatusMessageWithIconTemplate.bind({});
StatusMessageAndIcon.args = {
  ...baseArgs,
  icon: <InfoIcon className="bs-status-message-with-icon-storybook__icon" />,
};

export const StatusMessageAndActions = StatusMessageWithIconTemplate.bind({});
StatusMessageAndActions.args = {
  ...baseArgs,
  actions: <StatusMessageActions />,
};

export const StatusMessageWithIconAndActions =
  StatusMessageWithIconTemplate.bind({});
StatusMessageWithIconAndActions.args = {
  ...baseArgs,
  icon: <InfoIcon className="bs-status-message-with-icon-storybook__icon" />,
  actions: <StatusMessageActions />,
};

export default {
  title: 'Components/CssOnly/StatusMessageWithIcon',
  component: StatusMessageWithIcon,
  decorators: [
    (Story) => (
      <div
        style={{
          // @ts-expect-error
          container: 'bsGenericPage / inline-size',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      page: null,
    },
  },
} as ComponentMeta<typeof StatusMessageWithIcon>;

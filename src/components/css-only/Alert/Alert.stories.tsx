import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import Button, { ButtonSize } from '#csscomponents/Fabrique/Button';

import { AlertForStorybook, type Props, AlertSeverity } from '.';

const AlertTemplate = (args: Props) => (
  // @ts-expect-error
  <AlertForStorybook
    actionElement={
      <Button size={ButtonSize.SMALL} onClick={() => {}}>
        {faker.lorem.word(6)}
      </Button>
    }
    {...args}
  >
    {faker.lorem.sentences(2)}
  </AlertForStorybook>
);

export const AlertSuccess = AlertTemplate.bind({});
AlertSuccess.args = {
  severity: AlertSeverity.SUCCESS,
};

export const AlertInfo = AlertTemplate.bind({});
AlertInfo.args = {
  severity: AlertSeverity.INFO,
};

export const AlertWarning = AlertTemplate.bind({});
AlertWarning.args = { severity: AlertSeverity.WARNING };

export const AlertError = AlertTemplate.bind({});
AlertError.args = { severity: AlertSeverity.ERROR };

export default {
  title: 'Components/CssOnly/Alert',
  component: AlertForStorybook,
  argTypes: {
    severity: {
      control: {
        type: 'select',
        options: [
          AlertSeverity.SUCCESS,
          AlertSeverity.INFO,
          AlertSeverity.WARNING,
          AlertSeverity.ERROR,
        ],
      },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};

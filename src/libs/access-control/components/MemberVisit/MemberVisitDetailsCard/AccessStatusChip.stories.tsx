import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AccessStatusChip, { Props } from './AccessStatusChip.component';
import { AccessStatus } from '#libs/access-control/constants';

export default {
  title: 'Libs/AccessControl/AccessStatusChip',
  component: AccessStatusChip,
  argTypes: {
    accessStatus: {
      control: 'select',
      options: [AccessStatus.GREEN, AccessStatus.ORANGE, AccessStatus.RED],
      description: 'The access status to display',
    },
    initialAccessStatus: {
      control: 'select',
      options: [
        undefined,
        AccessStatus.GREEN,
        AccessStatus.ORANGE,
        AccessStatus.RED,
      ],
      description:
        'The initial access status to display. \
        If different from the access status, the component will display both statuses recursively',
    },
  },
} as ComponentMeta<typeof AccessStatusChip>;

const AccessStatusChipTemplate: ComponentStory<typeof AccessStatusChip> = (
  args: Props,
) => <AccessStatusChip {...args} />;

export const Valid = AccessStatusChipTemplate.bind({});
Valid.args = {
  accessStatus: AccessStatus.GREEN,
};

export const Warning = AccessStatusChipTemplate.bind({});
Warning.args = {
  accessStatus: AccessStatus.ORANGE,
};

export const Error = AccessStatusChipTemplate.bind({});
Error.args = {
  accessStatus: AccessStatus.RED,
};

export const Recursive = AccessStatusChipTemplate.bind({});
Recursive.args = {
  accessStatus: AccessStatus.GREEN,
  initialAccessStatus: AccessStatus.RED,
};

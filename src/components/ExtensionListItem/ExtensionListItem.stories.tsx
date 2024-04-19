import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ExtensionListItem from '.';

const RECENT_DATE = moment().subtract(3, 'days').tz(moment.tz.guess()).format();

export default {
  title: 'Components/ExtensionListItem',
  component: ExtensionListItem,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    extension: {
      description:
        'The extension to display. Represents any kind of extension (mass/consumer).',
    },
    showBottomDivider: {
      description:
        'If true a divider will be shown at the bottom of the list item',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    onDelete: {
      description: 'The function fired once the delete button has been clicked',
    },
  },
} as ComponentMeta<typeof ExtensionListItem>;

const Template: ComponentStory<typeof ExtensionListItem> = (
  args: React.ComponentProps<typeof ExtensionListItem>,
) => <ExtensionListItem {...args} />;

const baseArgs = {
  // TODO: extension factory on all libs
  extension: {
    id: faker.number.int(1000),
    date_created: RECENT_DATE,
    nb_days: faker.number.int({ min: 1, max: 15 }),
    note: faker.lorem.paragraph(),
    payment_pack: faker.number.int(1000),
  },
  showBottomDivider: false,
  onDelete: () => {},
};

export const Idle = Template.bind({});
Idle.args = baseArgs;

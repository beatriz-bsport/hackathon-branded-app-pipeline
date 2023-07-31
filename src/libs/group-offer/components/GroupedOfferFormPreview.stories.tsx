import { ComponentStory, ComponentMeta } from '@storybook/react';
import moment from 'moment-timezone';
import React from 'react';

import metaActivityFactory from '../factories';
import GroupedOfferFormPreview, {
  OuterProps,
} from './GroupedOfferPreview.component';

export default {
  title: 'MetaActivity/Components/GroupedOfferFormPreview',
  component: GroupedOfferFormPreview,
  args: {},
} as ComponentMeta<typeof GroupedOfferFormPreview>;

const Template: ComponentStory<typeof GroupedOfferFormPreview> = (
  args: OuterProps,
) => <GroupedOfferFormPreview {...args} />;

export const Story = Template.bind({});
Story.args = {
  metaActivity: metaActivityFactory.MetaActivity.create(1),
  recurrenceRule: {
    recurrence_type: 'week',
    recurrence_interval: 1,
  },
  groups: [
    {
      company: 1,
      level: 1,
      allow_booking_after_start: true,
      available: true,
      recurrence_id: 'fdsfds',
      offers: Array(5)
        .fill(0)
        .map((_, i) => ({
          id: i,
          date_start: moment().add(i, 'day').format('YYYY-MM-DD'),
          timezone_name: 'Europe/Paris',
        })),
      name: 'Groupe 1 (n1)',
    },
    {
      company: 1,
      level: 1,
      allow_booking_after_start: true,
      available: true,
      recurrence_id: 'fdsfds',
      offers: Array(5)
        .fill(0)
        .map((_, i) => ({
          id: 4 + i,
          date_start: moment()
            .add(4 + i, 'day')
            .format('YYYY-MM-DD'),
          timezone_name: 'Europe/Paris',
        })),
      name: 'Groupe 1 (n2)',
    },
    {
      company: 1,
      level: 1,
      allow_booking_after_start: true,
      available: true,
      recurrence_id: 'fdsfds',
      offers: Array(5)
        .fill(0)
        .map((_, i) => ({
          id: 7 + i,
          date_start: moment()
            .add(7 + i, 'day')
            .format('YYYY-MM-DD'),
          timezone_name: 'Europe/Paris',
        })),
      name: 'Groupe 1 (n3)',
    },
    {
      company: 1,
      level: 1,
      allow_booking_after_start: true,
      available: true,
      recurrence_id: 'fdsfds',
      offers: Array(5)
        .fill(0)
        .map((_, i) => ({
          id: 14 + i,
          date_start: moment()
            .add(14 + i, 'day')
            .format('YYYY-MM-DD'),
          timezone_name: 'Europe/Paris',
        })),
      name: 'Groupe 1 (n4)',
    },
  ],
};

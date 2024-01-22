import React from 'react';

import { action } from '@storybook/addon-actions';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceGlobalMetricsProgressList from './CadenceGlobalMetricsProgressList.component';

const actionsData = {
  knowMore: action('onClickKnowMore'),
};

const Template: ComponentStory<typeof CadenceGlobalMetricsProgressList> = (
  args: React.ComponentProps<typeof CadenceGlobalMetricsProgressList>,
) => <CadenceGlobalMetricsProgressList {...args} />;

export const DefaultProgressList = Template.bind({});
DefaultProgressList.args = {
  emailCount: 75,
  smsCount: 35,
  notificationCount: 50,
  hasNotificationUpsell: true,
  isLoading: false,
};

export const DisabledUpsellProgressList = Template.bind({});
DisabledUpsellProgressList.args = {
  emailCount: 12,
  smsCount: 17,
  notificationCount: 9,
  hasNotificationUpsell: false,
  knowMoreOnNotifications: actionsData.knowMore,
  isLoading: false,
};

export const LoadingProgressList = Template.bind({});
LoadingProgressList.args = {
  isLoading: true,
};

export default {
  title: 'Components/Cadences/Metrics/CadenceProgressList',
  component: CadenceGlobalMetricsProgressList,
  backgrounds: {
    default: '#808080',
  },
  argTypes: {
    progressList: {
      description: 'The infos of the progress we want to display.',
    },
    customColor: {
      description: '(Optional) The color the progress bar will be displayed.',
    },
    isLoading: {
      control: 'boolean',
      description: '(Optional) Either the component is loading or not.',
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    backgrounds: {
      default: 'lightGrey',
      values: [
        { name: 'none', value: 'none' },
        { name: 'lightGrey', value: '#e6e6e6' },
        { name: 'grey', value: '#666666' },
        { name: 'black', value: '#000000' },
      ],
    },
    description: {
      component:
        'This component is a custom progress bar container for Audience workflow metrics data.',
    },
  },
} as ComponentMeta<typeof CadenceGlobalMetricsProgressList>;

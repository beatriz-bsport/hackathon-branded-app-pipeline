import React from 'react';

import { action } from '@storybook/addon-actions';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceGlobalMetricsProgressList, {
  MetricsProgressList,
} from './CadenceGlobalMetricsProgressList.component';

const actionsData = {
  onClick: action('onClick'),
};

const Template: ComponentStory<typeof MetricsProgressList> = (
  args: React.ComponentProps<typeof MetricsProgressList>,
) => <MetricsProgressList {...args} />;

export const DefaultProgressList = Template.bind({});

DefaultProgressList.args = {
  progressList: [
    { count: 75, label: 'Email' },
    { count: 35, label: 'SMS' },
    { count: 50, label: 'Push notification' },
  ],
  isLoading: false,
};

export const DisabledUpsellProgressList = Template.bind({});

DisabledUpsellProgressList.args = {
  progressList: [
    { count: 12, label: 'First' },
    { count: 17, label: 'Disabled upsell', disabled: true },
    {
      label: 'Soon available upsell',
      disabled: true,
      displayUpsellAvailableSoon: true,
    },
    {
      label: 'Know more upsell',
      disabled: true,
      count: 9,
      displayUpsellKnowMoreLink: true,
      upsellName: 'NAME',
      onClickKnowMore: actionsData.onClick,
    },
  ],
  isLoading: false,
};

export const LoadingProgressList = Template.bind({});

LoadingProgressList.args = {
  progressList: [
    { count: 12, label: 'First' },
    { count: 25, label: 'Second' },
    { count: 17, label: 'THIRD' },
  ],
  customColor: 'red',
  isLoading: true,
};

export default {
  title: 'Components/Cadences/Metrics/ProgressList',
  component: MetricsProgressList,
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
} as ComponentMeta<typeof MetricsProgressList>;

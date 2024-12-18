import React from 'react';

import { action } from '@storybook/addon-actions';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceGlobalMetricsProgressBar from './CadenceGlobalMetricsProgressBar.component';

const actionsData = {
  onClick: action('onClick'),
};

const Template: ComponentStory<typeof CadenceGlobalMetricsProgressBar> = (
  args: React.ComponentProps<typeof CadenceGlobalMetricsProgressBar>,
) => <CadenceGlobalMetricsProgressBar {...args} />;

export const DefaultColorProgressBar = Template.bind({});

DefaultColorProgressBar.args = {
  count: 42,
  label: 'Title',
  width: 25,
};

export const ProgressBar = Template.bind({});

ProgressBar.args = {
  count: 42,
  customColor: 'red',
  label: 'Title',
  width: 25,
};

export const DisabledProgressBar = Template.bind({});

DisabledProgressBar.args = {
  count: 42,
  width: 25,
  label: 'Title',
  disabled: true,
  displayUpsellKnowMoreLink: false,
  displayUpsellAvailableSoon: false,
  upsellName: 'UPSELL NAME',
  onClickKnowMore: actionsData.onClick,
};

export default {
  title: 'Components/Cadences/Metrics/ProgressBar',
  component: CadenceGlobalMetricsProgressBar,
  argTypes: {
    label: {
      description: 'The label given to the progress bar.',
    },
    customColor: {
      description: '(Optional) The color the progress bar will be displayed.',
    },
    count: {
      description: '(Optional) The number displayed by the progress bar.',
    },
    disabled: {
      description:
        '(Optional) A boolean used if we want to disable the progress bar.',
    },
    width: {
      description:
        '(Optional) A number that will be the width of the progress bar in %.',
    },
  },
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'This component is a custom progress bar container for Audience workflow metrics data.',
      },
    },
  },
} as ComponentMeta<typeof CadenceGlobalMetricsProgressBar>;

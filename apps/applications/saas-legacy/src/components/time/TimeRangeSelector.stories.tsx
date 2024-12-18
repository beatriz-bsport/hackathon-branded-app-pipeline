import React from 'react';

import TimeRangeSelector, { Props } from './TimeRangeSelector.component';

const TimeRangeSelectorTemplate = (args: Props) => (
  <TimeRangeSelector {...args} />
);

export const Default = TimeRangeSelectorTemplate.bind({});

Default.args = {
  originalTimeStart: '10:30',
  originalTimeEnd: '21:00',
};

export default {
  title: 'Component/TimeRangeSelector',
  component: TimeRangeSelector,
  parameters: {
    docs: {
      page: null,
    },
  },
};

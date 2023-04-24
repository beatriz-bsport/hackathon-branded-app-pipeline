// @ts-nocheck
import React from 'react';

import DateRangeSelector, { Props } from './DateRangeSelector.component';

const CustomTemplate = (args: Props) => <DateRangeSelector {...args} />;

export const Default = CustomTemplate.bind({});

Default.args = {
  date_start: 1652795271,
  date_end: 1652495271,
};

export default {
  title: 'Component/DateRangeSelector',
  component: DateRangeSelector,
  parameters: {
    docs: {
      page: null,
    },
  },
};

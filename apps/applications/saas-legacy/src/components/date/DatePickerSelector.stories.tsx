import React from 'react';

import DatePickerSelector, { Props } from './DatePickerSelector.component';

const CustomTemplate = (args: Props) => (
  <DatePickerSelector {...args} onSubmit={() => {}} />
);

export const Default = CustomTemplate.bind({});

Default.args = {
  date_start: 1652795271,
};

export default {
  title: 'Component/DatePickerSelector',
  component: DatePickerSelector,
  parameters: {
    docs: {
      page: null,
    },
  },
};

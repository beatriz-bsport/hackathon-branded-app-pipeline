import React from 'react';

// @ts-expect-error
import ReportFilterConfigForm, { Props } from './ReportFilterConfigForm.drawer';

const CustomTemplate = (args: Props) => <ReportFilterConfigForm {...args} />;

export const Default = CustomTemplate.bind({});

Default.args = {
  open: true,
  initial: null,
  columns: [
    { datatype: 'boolean', name: 'boolean' },
    { datatype: 'string', name: 'string' },
    { datatype: 'datetime', name: 'datetime' },
    { datatype: 'int', name: 'int' },
    { datatype: 'price', name: 'price' },
    { datatype: 'number', name: 'number' },
    { datatype: 'date', name: 'date' },
    { datatype: 'percent', name: 'percent' },
    { datatype: 'time', name: 'time' },
    { datatype: 'payment_method', name: 'payment_method' },
    { datatype: 'dow', name: 'dow' },
    { datatype: 'cts', name: 'cts' },
    { datatype: 'activity', name: 'activity' },
    { datatype: 'payment_pack', name: 'payment_pack' },
    { datatype: 'coach', name: 'coach' },
    { datatype: 'establishment', name: 'establishment' },
    { datatype: 'user', name: 'user' },
    { datatype: 'phone', name: 'phone' },
    { datatype: 'billing_group', name: 'billing_group' },
  ],
  onClose: () => {},
};

export default {
  title: 'Reporting/ReportFilterConfigForm',
  component: ReportFilterConfigForm,
  parameters: {
    docs: {
      page: null,
    },
  },
};

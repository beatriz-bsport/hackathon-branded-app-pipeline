import React from 'react';

import ReportFilterConfigSelector, {
  Props,
} from './ReportFilterConfigSelector.component';

const CustomTemplate = (args: Props) => (
  <ReportFilterConfigSelector {...args} />
);

export const Default = CustomTemplate.bind({});

Default.args = {
  reportFilterConfigs: [],
  selectedFilter: null,
  error: null,
  fetchReportFilterConfigsList: () => {},
  onCreateReportFilterConfigs: () => {},
  onEditReportFilterConfigs: () => {},
  onDeleteReportFilterConfigs: () => {},
  onSelect: () => {},
  columnsMetadata: [],
};

export default {
  title: 'Reporting/ReportFilterConfigSelector',
  component: ReportFilterConfigSelector,
  parameters: {
    docs: {
      page: null,
    },
  },
};

// @ts-nocheck
import React from 'react';

import DashboardChipRow, { Props } from './DashboardChipRow.component';
import { MEMBER_GRAPH_IDENTIFIER } from '../constants';

const CustomTemplate = (args: Props) => <DashboardChipRow {...args} />;

export const Default = CustomTemplate.bind({});

Default.args = {
  graph: {
    uuid: '3222402e-3940-46e6-8a69-6e2877f391a3',
    title: 'defaultTitleMember',
    dashboard_graph_identifier: MEMBER_GRAPH_IDENTIFIER,
    graph_family: 'temporal',
    filter_config: {
      groups: [
        {
          uuid: '2894972a-c4e8-4ac0-8b9c-4ed8e0954189',
          filters_data: [
            {
              uuid: '7d66c54c-1ce7-4d3e-b7c8-b88f36fcf0a3',
              value: [1626735600, 1658271600],
              datatype: 'date',
              comparator: 4,
              identifier: 'date_joined',
              time_period: 'year',
              sub_datatype: 0,
            },
          ],
          inner_operand: 1,
          display_has_single: true,
        },
        {
          uuid: '2894972a-c4e8-4ac0-8b9c-4ed8e0954189',
          filters_data: [
            {
              uuid: '7d66c54c-1ce7-4d3e-b7c8-b88f36fcf0a3',
              value: [1626735600, 1658271600],
              datatype: 'date',
              comparator: 4,
              identifier: 'date_joined',
              time_period: 'year',
              sub_datatype: 0,
            },
          ],
          inner_operand: 1,
          display_has_single: true,
        },
      ],
      group_operand: 1,
    },
    date_filter_config: {
      groups: [
        {
          uuid: '2894972a-c4e8-4ac0-8b9c-4ed8e0954189',
          filters_data: [
            {
              uuid: '7d66c54c-1ce7-4d3e-b7c8-b88f36fcf0a3',
              value: [1626735600, 1658271600],
              datatype: 'date',
              comparator: 4,
              identifier: 'date_joined',
              time_period: 'year',
              sub_datatype: 0,
            },
          ],
          inner_operand: 1,
          display_has_single: true,
        },
      ],
      group_operand: 1,
    },
    graph_params: {
      date: 'date_joined',
      date_value: 'pk',
      aggregation_function_name: 'count',
    },
    chart_component: 'bar',
  },
};

export default {
  title: 'Library/Dashboard/DashboardChipRow',
  component: DashboardChipRow,
  parameters: {
    docs: {
      page: null,
    },
  },
};

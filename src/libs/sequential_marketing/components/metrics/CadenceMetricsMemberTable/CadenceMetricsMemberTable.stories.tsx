import React from 'react';

import type { ComponentMeta, ComponentStory } from '@storybook/react';
import CadenceMetricsMemberTable from './CadenceMetricsMemberTable.component';

const CadenceMetricsMemberTableStorybook: ComponentStory<
  typeof CadenceMetricsMemberTable
> = (args) => {
  return (
    <div style={{ width: '600px' }}>
      <CadenceMetricsMemberTable {...args} />
    </div>
  );
};

export const AudienceWorkflowMetricsMemberTableDefault =
  CadenceMetricsMemberTableStorybook.bind({});

export default {
  title: 'CadenceMetricsMemberTable',
  component: CadenceMetricsMemberTable,
} as ComponentMeta<typeof CadenceMetricsMemberTable>;

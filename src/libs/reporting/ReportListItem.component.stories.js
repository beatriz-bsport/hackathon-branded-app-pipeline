import React from 'react';

import { action } from '@storybook/addon-actions';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportListItem from './ReportListItem.component';

storiesOf('Reporting/ReportListItem', module).add('default', () => {
  const report = FactoryBot.ReportConfiguration.createOne();
  return (
    <ReportListItem
      report={report}
      onEdit={action('onEdit')}
      onDetail={action('onDetail')}
      onDelete={action('onDelete')}
    />
  );
});

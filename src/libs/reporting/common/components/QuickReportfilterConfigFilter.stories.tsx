import React from 'react';
import { ComponentStory } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';
import { action } from '@storybook/addon-actions';

import QuickReportFilterConfigFilter from './QuickReportFilterConfigFilter.component';
import { generateNewGroup } from '#src/libs/datatype-filtering/utils';

const actionsData = {
  getDataByType: action('getDataByType'),
  onClose: action('onClose'),
};

const fakeMetaData = {
  identifier: 'last_name',
  name: 'last_name',
  datatype: 'user',
  summable: false,
  is_filterable: true,
  averageable: false,
};

export default {
  title: 'Reporting/ReportQuickFilter',
  component: QuickReportFilterConfigFilter,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        // @ts-expect-error
        config: { groups: [generateNewGroup(fakeMetaData, true)] },
      },
    },
  },
  argTypes: {
    getDataByType: actionsData.getDataByType,
    onClose: actionsData.onClose,
  },
  args: {
    isQuickFilterModalOpen: true,
    isQuickFilterConfigRowModalOpen: true,
    anchorEl: null,
    selectedColumn: fakeMetaData,
    columnsDataSelectedQuickFilter: [fakeMetaData],
  },
};

const QuickReportFilterConfigFilterRowStoryBook: ComponentStory<
  typeof QuickReportFilterConfigFilter
> = (args) => <QuickReportFilterConfigFilter {...args} />;

export const QuickReportFilterConfigFilterRow =
  QuickReportFilterConfigFilterRowStoryBook.bind({});

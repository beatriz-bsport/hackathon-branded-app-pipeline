import React from 'react';
import { ComponentStory } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';
import { action } from '@storybook/addon-actions';

import QuickReportFilterConfigColumnsMenu from './QuickReportFilterConfigColumnsMenu.component';

const actionsData = {
  setIsQuickFilterConfigColumnModalOpen: action(
    'setIsQuickFilterConfigColumnModalOpen',
  ),
  setIsQuickFilterModalOpen: action('setIsQuickFilterModalOpen'),
  handleQuickFilterModalClose: action('handleQuickFilterModalClose'),
  handleOpenModal: action('handleOpenModal'),
  setIsQuickFilterConfigRowModalOpen: action(
    'setIsQuickFilterConfigRowModalOpen',
  ),
  getDataByType: action('getDataByType'),
  setSelectedColumn: action('setSelectedColumn'),
};

const fakeMetaData = {
  identifier: 'last_name',
  datatype: 'user',
  summable: false,
  is_filterable: true,
  averageable: false,
};
const fakeMetaData2 = {
  identifier: 'contract_name',
  datatype: 'contract',
  summable: false,
  is_filterable: true,
  averageable: false,
};
const fakeMetaData3 = {
  identifier: 'product_names',
  datatype: 'string',
  summable: false,
  is_filterable: true,
  averageable: false,
};
const fakeMetaData4 = {
  identifier: 'plan_date_start',
  datatype: 'date',
  summable: false,
  is_filterable: true,
  averageable: false,
};

const fakeMetaDataList = [
  fakeMetaData,
  fakeMetaData2,
  fakeMetaData3,
  fakeMetaData4,
];

export default {
  title: 'Reporting/ReportQuickFilter',
  component: QuickReportFilterConfigColumnsMenu,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        config: { groups: [] },
      },
    },
  },
  argTypes: {
    setIsQuickFilterConfigColumnModalOpen:
      actionsData.setIsQuickFilterConfigColumnModalOpen,
    setIsQuickFilterModalOpen: actionsData.setIsQuickFilterModalOpen,
    handleQuickFilterModalClose: actionsData.handleQuickFilterModalClose,
    handleOpenModal: actionsData.handleOpenModal,
    setIsQuickFilterConfigRowModalOpen:
      actionsData.setIsQuickFilterConfigRowModalOpen,
    getDataByType: actionsData.getDataByType,
    setSelectedColumn: actionsData.setSelectedColumn,
  },
  args: {
    isQuickFilterConfigColumnModalOpen: true,
    isQuickFilterModalOpen: true,
    isQuickFilterConfigRowModalOpen: false,
    anchorEl: null,
    columns: fakeMetaDataList,
    selectedColumn: null,
    isFranchisor: false,
    columnsDataSelectedQuickFilter: null,
  },
};

const QuickReportFilterConfigColumnsMenuListStoryBook: ComponentStory<
  typeof QuickReportFilterConfigColumnsMenu
> = (args) => <QuickReportFilterConfigColumnsMenu {...args} />;

export const QuickReportFilterConfigColumnsMenuList =
  QuickReportFilterConfigColumnsMenuListStoryBook.bind({});

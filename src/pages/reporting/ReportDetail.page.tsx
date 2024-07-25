import React from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withDatatypeDynamicData, {
  withDatatypeDynamicDataProps,
} from '#src/libs/datatype-filtering/dynamic-data-hoc';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import { getResultsBySelectorId } from '#src/libs/fuzzy-search/selectors';

import {
  getReportCategoriesMetadata,
  getReportHeader,
  getReportFilterConfigs,
  getReportFilterConfigLoading,
} from '#src/libs/reporting/v2/selectors';

import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

import {
  fetchReportHeaders as fetchReportHeadersAction,
  fetchReportMetadata as fetchReportMetadataAction,
  fetchReportFilterConfigList as fetchReportFilterConfigListAction,
  editReportFilterConfig as editReportFilterConfigAction,
  createReportFilterConfig as createReportFilterConfigAction,
  updateReport as updateReportAction,
  createReport as createReportAction,
} from '#src/libs/reporting/v2/actions';

import ReportDetailPage from '#src/libs/reporting/v2/components/ReportDetailPage.component';

import type { RootState } from '#src/reducers';
import type { ReportConfiguration } from '#src/libs/reporting/common/types';

type RouterProps = { categoryName: ReportCategoryEnum; reportId: number };

type Props = RouterProps &
  ConnectedProps<typeof connector> &
  withDatatypeDynamicDataProps;

const ReportingDetail: React.FC<Props> = ({
  categoryName,
  createReport,
  createReportFilterConfig,
  dynamicDataHasBeenLoaded,
  editReportFilterConfig,
  fetchReportFilterConfigList,
  fetchReportHeaders,
  fetchReportMetadata,
  getReportSearchResults,
  handleGetDynamicDataForFilters,
  pushRouter,
  reportCategoriesMetadata,
  reportFilterConfigLoading,
  reportFilterConfigs,
  reportHeaders,
  reportId,
  resetDynamicDataHasBeenLoaded,
  updateReport,
}) => {
  React.useEffect(() => {
    resetDynamicDataHasBeenLoaded();
    fetchReportMetadata();
  }, [fetchReportMetadata, resetDynamicDataHasBeenLoaded]);

  React.useEffect(() => {
    fetchReportFilterConfigList({ report_id_in: [reportId] });
  }, [fetchReportFilterConfigList, reportId]);

  const reportCategoryMetadata = React.useMemo(
    () =>
      reportCategoriesMetadata.results.find(
        (reportCategory) => reportCategory.category === categoryName,
      ),
    [categoryName, reportCategoriesMetadata],
  );

  const handleGeneration = React.useCallback(() => {
    fetchReportHeaders(reportId, {
      // ARGS TO CHANGE WITH DATE SELECTORS IMPLEMENTATION
      date_start: '2024-07-12',
      date_end: '2024-07-19',
      time_window_start: '00:00',
      time_window_end: '23:59',
      time_period: 'custom',
    });
  }, [fetchReportHeaders, reportId]);

  if (reportFilterConfigLoading || reportCategoriesMetadata.loading) {
    return <LinearProgress />;
  }

  const report = getReportSearchResults.currentResults.find(
    (reportResult) => reportResult.id == reportId,
  ) as ReportConfiguration;

  return (
    <ReportDetailPage
      categoryName={categoryName}
      createReport={createReport}
      createReportFilterConfig={createReportFilterConfig}
      dynamicDataHasBeenLoaded={dynamicDataHasBeenLoaded}
      editReportFilterConfig={editReportFilterConfig}
      // TODO: add export action
      handleExport={() => {}}
      handleGeneration={handleGeneration}
      handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
      pushRouter={pushRouter}
      report={report}
      reportCategoriesMetadata={reportCategoriesMetadata}
      reportCategoryMetadata={reportCategoryMetadata}
      reportFilterConfigs={reportFilterConfigs}
      reportHeaders={reportHeaders.results}
      reportId={reportId}
      updateReport={updateReport}
    />
  );
};

const connector = connect(
  (state: RootState, { reportId }: { reportId: number }) => ({
    getReportSearchResults: getResultsBySelectorId(state, 'reportV2', 'default')
      .results,
    reportHeaders: getReportHeader(state),
    reportFilterConfigs: getReportFilterConfigs(state, reportId),
    reportFilterConfigLoading: getReportFilterConfigLoading(state),
    reportCategoriesMetadata: getReportCategoriesMetadata(state),
  }),
  {
    createReport: createReportAction,
    createReportFilterConfig: createReportFilterConfigAction,
    editReportFilterConfig: editReportFilterConfigAction,
    fetchReportFilterConfigList: fetchReportFilterConfigListAction,
    fetchReportHeaders: fetchReportHeadersAction,
    fetchReportMetadata: fetchReportMetadataAction,
    pushRouter: push,
    updateReport: updateReportAction,
  },
);

export default compose<Props, {}>(
  routerParamsToProps({
    categoryName: 'categoryName:string',
    reportId: 'reportId:number',
  }),
  connector,
  withDatatypeDynamicData,
)(React.memo(ReportingDetail));

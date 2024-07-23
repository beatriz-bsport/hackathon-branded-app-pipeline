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
  getReportFilterConfigs,
  getReportFilterConfigLoading,
} from '#src/libs/reporting/v2/selectors';

import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

import {
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
  fetchReportMetadata,
  getReportSearchResults,
  handleGetDynamicDataForFilters,
  pushRouter,
  reportCategoriesMetadata,
  reportFilterConfigLoading,
  reportFilterConfigs,
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
      handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
      pushRouter={pushRouter}
      report={report}
      reportCategoriesMetadata={reportCategoriesMetadata}
      reportCategoryMetadata={reportCategoryMetadata}
      reportFilterConfigs={reportFilterConfigs}
      reportId={reportId}
      updateReport={updateReport}
    />
  );
};

const connector = connect(
  (state: RootState, { reportId }: { reportId: number }) => ({
    getReportSearchResults: getResultsBySelectorId(state, 'reportV2', 'default')
      .results,
    reportFilterConfigs: getReportFilterConfigs(state, reportId),
    reportFilterConfigLoading: getReportFilterConfigLoading(state),
    reportCategoriesMetadata: getReportCategoriesMetadata(state),
  }),
  {
    createReport: createReportAction,
    createReportFilterConfig: createReportFilterConfigAction,
    editReportFilterConfig: editReportFilterConfigAction,
    fetchReportFilterConfigList: fetchReportFilterConfigListAction,
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

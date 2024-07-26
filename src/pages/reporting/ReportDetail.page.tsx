import React from 'react';
import { DateTime } from 'luxon';
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
  getReportGenerateredRows,
  getReportFilterConfigs,
  getReportFilterConfigLoading,
} from '#src/libs/reporting/v2/selectors';

import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

import {
  fetchSerializedReport as fetchSerializedReportAction,
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
import type {
  ReportConfiguration,
  ReportGenerationParams,
} from '#src/libs/reporting/common/types';
import { getObjectPermissions, getPermissions } from '#src/libs/role/selectors';

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
  fetchSerializedReport,
  getReportSearchResults,
  handleGetDynamicDataForFilters,
  objectLevelPermissions,
  pushRouter,
  reportCategoriesMetadata,
  reportFilterConfigLoading,
  reportFilterConfigs,
  reportGeneratedRows,
  reportHeaders,
  reportId,
  resetDynamicDataHasBeenLoaded,
  updateReport,
  userPermissions,
}) => {
  React.useEffect(() => {
    resetDynamicDataHasBeenLoaded();
    fetchReportMetadata();
  }, [fetchReportMetadata, resetDynamicDataHasBeenLoaded]);

  React.useEffect(() => {
    fetchReportFilterConfigList(
      { report_id_in: [reportId] },
      {
        onSuccess: (fetchedReportFilterConfigs) => {
          const fetchedAdvancedReportFilterConfigs =
            fetchedReportFilterConfigs.find(
              (reportFilterConfig) =>
                !reportFilterConfig.is_quick_report_filter,
            ) || null;
          // Fetching data based on Report dates values in database column
          fetchReportHeaders(reportId, {
            report_filter_config_id: fetchedAdvancedReportFilterConfigs?.id,
          });

          fetchSerializedReport(reportId, {
            page: 1,
            report_filter_config_id: fetchedAdvancedReportFilterConfigs?.id,
          });
        },
      },
    );
  }, [
    fetchReportFilterConfigList,
    reportId,
    fetchSerializedReport,
    fetchReportHeaders,
  ]);

  const reportCategoryMetadata = React.useMemo(
    () =>
      reportCategoriesMetadata.results.find(
        (reportCategory) => reportCategory.category === categoryName,
      ),
    [categoryName, reportCategoriesMetadata],
  );

  const advancedReportFilterConfig = React.useMemo(
    () =>
      reportFilterConfigs.find(
        (reportFilterConfig) => !reportFilterConfig.is_quick_report_filter,
      ) || null,
    [reportFilterConfigs],
  );

  const handleGeneration = React.useCallback(
    (values: ReportGenerationParams) => {
      // remove seconds as per product requirement
      const time_window_start = values.timeStart
        ? DateTime.fromISO(values.timeStart).toFormat('HH:mm')
        : null;
      const time_window_end = values.timeEnd
        ? DateTime.fromISO(values.timeEnd).toFormat('HH:mm')
        : null;

      const date_start = values.dateStart;
      const date_end = values.dateEnd;

      const sanitizedParams = {
        date_start,
        ...(reportCategoryMetadata?.date_type === 'range' && date_end
          ? { date_end }
          : {}),
        ...(time_window_start &&
        reportCategoryMetadata?.time_window_filtering_enabled
          ? { time_window_start }
          : {}),
        ...(time_window_end &&
        reportCategoryMetadata?.time_window_filtering_enabled
          ? { time_window_end }
          : {}),
        page: values.page || 1,
        ...(values.reportFilterConfigId || advancedReportFilterConfig
          ? {
              report_filter_config_id:
                values.reportFilterConfigId || advancedReportFilterConfig.id,
            }
          : {}),
      };

      fetchReportHeaders(reportId, sanitizedParams);
      fetchSerializedReport(reportId, sanitizedParams);
    },
    [
      fetchReportHeaders,
      fetchSerializedReport,
      reportId,
      reportCategoryMetadata,
      advancedReportFilterConfig,
    ],
  );

  const report = getReportSearchResults.currentResults.find(
    (reportResult) => reportResult.id == reportId,
  ) as ReportConfiguration;

  if (reportFilterConfigLoading || reportCategoriesMetadata.loading) {
    return <LinearProgress />;
  }

  return (
    <ReportDetailPage
      advancedReportFilterConfig={advancedReportFilterConfig}
      categoryName={categoryName}
      createReport={createReport}
      createReportFilterConfig={createReportFilterConfig}
      dynamicDataHasBeenLoaded={dynamicDataHasBeenLoaded}
      editReportFilterConfig={editReportFilterConfig}
      // TODO: add export action
      handleExport={() => {}}
      handleGeneration={handleGeneration}
      handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
      objectLevelPermissions={objectLevelPermissions}
      pushRouter={pushRouter}
      report={report}
      reportCategoriesMetadata={reportCategoriesMetadata}
      reportCategoryMetadata={reportCategoryMetadata}
      reportGeneratedRows={reportGeneratedRows}
      reportHeaders={reportHeaders.results}
      reportId={reportId}
      updateReport={updateReport}
      userPermissions={userPermissions}
    />
  );
};

const connector = connect(
  (state: RootState, { reportId }: { reportId: number }) => ({
    getReportSearchResults: getResultsBySelectorId(state, 'reportV2', 'default')
      .results,
    objectLevelPermissions: getObjectPermissions(state),
    reportCategoriesMetadata: getReportCategoriesMetadata(state),
    reportFilterConfigLoading: getReportFilterConfigLoading(state),
    reportFilterConfigs: getReportFilterConfigs(state, reportId),
    reportGeneratedRows: getReportGenerateredRows(state),
    reportHeaders: getReportHeader(state),
    userPermissions: getPermissions(state),
  }),
  {
    createReport: createReportAction,
    createReportFilterConfig: createReportFilterConfigAction,
    editReportFilterConfig: editReportFilterConfigAction,
    fetchReportFilterConfigList: fetchReportFilterConfigListAction,
    fetchReportHeaders: fetchReportHeadersAction,
    fetchReportMetadata: fetchReportMetadataAction,
    fetchSerializedReport: fetchSerializedReportAction,
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

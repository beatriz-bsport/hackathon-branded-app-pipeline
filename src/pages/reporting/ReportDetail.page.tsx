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
  getReportsV2,
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
  fetchDefaultReports as fetchDefaultReportsAction,
  deleteReport as deleteReportAction,
} from '#src/libs/reporting/v2/actions';

import ReportDetailPage from '#src/libs/reporting/v2/components/ReportDetailPage.component';
import ReportDetailNavigationDrawer from '#src/libs/reporting/v2/components/ReportDetailNavigationDrawer.component';

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
  deleteReport,
  defaultReports,
  dynamicDataHasBeenLoaded,
  editReportFilterConfig,
  fetchDefaultReports,
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
    fetchDefaultReports();
  }, [fetchReportMetadata, resetDynamicDataHasBeenLoaded, fetchDefaultReports]);

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

  const [isNavigationDrawerExpanded, setIsNavigationDrawerExpanded] =
    React.useState(true);

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

  const quickReportFilterConfig = React.useMemo(
    () =>
      reportFilterConfigs.find(
        (reportFilterConfig) => reportFilterConfig.is_quick_report_filter,
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

  const defaultCategoryReportId = defaultReports.find(
    (defaultReport) => defaultReport.category === categoryName,
  )?.id;

  const report = getReportSearchResults.currentResults.find(
    (reportResult) => reportResult.id == reportId,
  ) as ReportConfiguration;
  const metadataGroupedByGlobalCategory = React.useMemo(
    () =>
      Object.entries(
        Object.groupBy(
          reportCategoriesMetadata.results,
          ({ global_category }) => global_category,
        ),
      ).map(([globalCategory, reportCategories]) => ({
        title: globalCategory,
        categories: reportCategories.map((reportCategory) => ({
          ...reportCategory,
          reportId:
            defaultReports.find(
              (defaultReport) =>
                defaultReport.category === reportCategory.category,
            )?.id || null,
        })),
      })),
    [reportCategoriesMetadata.results, defaultReports],
  );

  if (reportCategoriesMetadata.loading) {
    return <LinearProgress />;
  }

  return (
    <>
      <ReportDetailNavigationDrawer
        categoryName={categoryName}
        isNavigationDrawerExpanded={isNavigationDrawerExpanded}
        items={metadataGroupedByGlobalCategory}
        pushRouter={pushRouter}
        setIsNavigationDrawerExpanded={setIsNavigationDrawerExpanded}
      />
      <ReportDetailPage
        advancedReportFilterConfig={advancedReportFilterConfig}
        categoryName={categoryName}
        createReport={createReport}
        createReportFilterConfig={createReportFilterConfig}
        defaultCategoryReportId={defaultCategoryReportId}
        deleteReport={deleteReport}
        dynamicDataHasBeenLoaded={dynamicDataHasBeenLoaded}
        editReportFilterConfig={editReportFilterConfig}
        // TODO: add export action
        handleExport={() => {}}
        handleGeneration={handleGeneration}
        handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
        isNavigationDrawerExpanded={isNavigationDrawerExpanded}
        objectLevelPermissions={objectLevelPermissions}
        pushRouter={pushRouter}
        quickReportFilterConfig={quickReportFilterConfig}
        report={report}
        reportCategoriesMetadata={reportCategoriesMetadata}
        reportCategoryMetadata={reportCategoryMetadata}
        reportFilterConfigLoading={reportFilterConfigLoading}
        reportGeneratedRows={reportGeneratedRows}
        reportHeaders={reportHeaders.results}
        reportId={reportId}
        updateReport={updateReport}
        userPermissions={userPermissions}
      />
    </>
  );
};

const connector = connect(
  (state: RootState, { reportId }: { reportId: number }) => ({
    getReportSearchResults: getResultsBySelectorId(state, 'reportV2', 'default')
      .results,
    objectLevelPermissions: getObjectPermissions(state),
    defaultReports: getReportsV2(state),
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
    deleteReport: deleteReportAction,
    editReportFilterConfig: editReportFilterConfigAction,
    fetchDefaultReports: fetchDefaultReportsAction,
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

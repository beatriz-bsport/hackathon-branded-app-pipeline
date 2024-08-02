import React from 'react';
import { DateTime } from 'luxon';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withDatatypeDynamicData, {
  withDatatypeDynamicDataProps,
} from '#src/libs/datatype-filtering/dynamic-data-hoc';
import { useTranslation } from 'react-i18next';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import { getResultsBySelectorId } from '#src/libs/fuzzy-search/selectors';

import {
  getReportCategoriesMetadata,
  getReportHeader,
  getReportGenerateredRows,
  getReportFilterConfigs,
  getReportFilterConfigLoading,
  getReportsV2,
  getReportExcelState,
} from '#src/libs/reporting/v2/selectors';
import { getCompanyUpsellData } from '#src/libs/company/selectors';

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
  exportExcelReport as exportExcelReportAction,
} from '#src/libs/reporting/v2/actions';

import ReportDetailPage from '#src/libs/reporting/v2/components/ReportDetailPage.component';
import ReportDetailNavigationDrawer from '#src/libs/reporting/v2/components/ReportDetailNavigationDrawer.component';

import type { RootState } from '#src/reducers';
import type {
  ReportConfiguration,
  ReportGenerationParams,
} from '#src/libs/reporting/common/types';

import { getObjectPermissions, getPermissions } from '#src/libs/role/selectors';
import { getReportObjectPermissionsBasedOnCategory } from '#src/libs/reporting/common/utils';
import { filter_reports_by_upsells } from '#src/libs/reporting/common/permissions';

type OwnProps = {
  isFranchisor?: boolean;
};

type RouterProps = { categoryName: ReportCategoryEnum; reportId: number };

type Props = RouterProps &
  ConnectedProps<typeof connector> &
  withDatatypeDynamicDataProps &
  RouterProps &
  OwnProps;

const ReportingDetail: React.FC<Props> = ({
  categoryName,
  createReport,
  createReportFilterConfig,
  deleteReport,
  defaultReports,
  dynamicDataHasBeenLoaded,
  editReportFilterConfig,
  exportExcelReport,
  excelExportLoading,
  fetchDefaultReports,
  fetchReportFilterConfigList,
  fetchReportHeaders,
  fetchReportMetadata,
  fetchSerializedReport,
  getReportSearchResults,
  handleGetDynamicDataForFilters,
  isFranchisor,
  objectLevelPermissions,
  pushRouter,
  reportCategoriesMetadata,
  reportFilterConfigLoading,
  reportFilterConfigs,
  reportGeneratedRows,
  reportHeaders,
  reportId,
  resetDynamicDataHasBeenLoaded,
  subscribedUpsells,
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
          // Fetching data based on Report dates values in database column if not franchisor
          {
            !isFranchisor &&
              fetchReportHeaders(reportId, {
                report_filter_config_id: fetchedAdvancedReportFilterConfigs?.id,
              });

            !isFranchisor &&
              fetchSerializedReport(reportId, {
                page: 1,
                report_filter_config_id: fetchedAdvancedReportFilterConfigs?.id,
              });
          }
        },
      },
    );
  }, [
    fetchReportFilterConfigList,
    reportId,
    fetchSerializedReport,
    fetchReportHeaders,
    isFranchisor,
  ]);

  const { t } = useTranslation('reporting');

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

  const handleExcelExportation = React.useCallback(
    (values: ReportGenerationParams) => () => {
      const backgroundDialog = {
        message: t('reporting:export.ready', {
          name: report.name,
        }),
        title: t('reporting:export.category', {
          category: t(`reporting:categories.${categoryName}`),
        }),
      };

      const params = {
        fileformat: 'xlsx',
        date_start: values.dateStart,
        date_end: values.dateEnd,
        time_window_start: values?.timeStart ?? '',
        time_window_end: values?.timeEnd ?? '',
        ...(advancedReportFilterConfig
          ? { report_filter_config_id: advancedReportFilterConfig.id }
          : {}),
      };

      exportExcelReport(reportId, params, {
        backgroundDialog,
      });
    },
    [
      exportExcelReport,
      advancedReportFilterConfig,
      t,
      reportId,
      report,
      categoryName,
    ],
  );

  const metadataGroupedByGlobalCategory = React.useMemo(
    () =>
      Object.entries(
        Object.groupBy(
          reportCategoriesMetadata.results,
          ({ global_category }) => global_category,
        ),
      ).reduce((acc, [globalCategory, reportCategories]) => {
        const categoriesWithPermissions = reportCategories.reduce(
          (categoryAcc, reportCategory) => {
            const { read: hasReadPermission } =
              getReportObjectPermissionsBasedOnCategory(
                objectLevelPermissions,
                reportCategory.category,
              );
            if (
              (hasReadPermission &&
                filter_reports_by_upsells(
                  reportCategory.category,
                  subscribedUpsells,
                )) ||
              isFranchisor
            ) {
              categoryAcc.push({
                ...reportCategory,
                reportId:
                  defaultReports.find(
                    (defaultReport) =>
                      defaultReport.category === reportCategory.category,
                  )?.id || null,
              });
            }
            return categoryAcc;
          },
          [],
        );

        if (categoriesWithPermissions.length > 0) {
          acc.push({
            title: globalCategory,
            categories: categoriesWithPermissions,
          });
        }
        return acc;
      }, []),
    [
      reportCategoriesMetadata.results,
      defaultReports,
      objectLevelPermissions,
      subscribedUpsells,
      isFranchisor,
    ],
  );

  if (reportCategoriesMetadata.loading) {
    return <LinearProgress />;
  }

  return (
    <>
      <ReportDetailNavigationDrawer
        categoryName={categoryName}
        isFranchisor={isFranchisor}
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
        excelExportLoading={excelExportLoading}
        handleExport={handleExcelExportation}
        handleGeneration={handleGeneration}
        handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
        isFranchisor={isFranchisor}
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
    excelExportLoading: getReportExcelState(state).loading,
    getReportSearchResults: getResultsBySelectorId(state, 'reportV2', 'default')
      .results,
    objectLevelPermissions: getObjectPermissions(state),
    defaultReports: getReportsV2(state),
    reportCategoriesMetadata: getReportCategoriesMetadata(state),
    reportFilterConfigLoading: getReportFilterConfigLoading(state),
    reportFilterConfigs: getReportFilterConfigs(state, reportId),
    reportGeneratedRows: getReportGenerateredRows(state),
    reportHeaders: getReportHeader(state),
    subscribedUpsells: getCompanyUpsellData(state),
    userPermissions: getPermissions(state),
  }),
  {
    createReport: createReportAction,
    createReportFilterConfig: createReportFilterConfigAction,
    deleteReport: deleteReportAction,
    editReportFilterConfig: editReportFilterConfigAction,
    exportExcelReport: exportExcelReportAction,
    fetchDefaultReports: fetchDefaultReportsAction,
    fetchReportFilterConfigList: fetchReportFilterConfigListAction,
    fetchReportHeaders: fetchReportHeadersAction,
    fetchReportMetadata: fetchReportMetadataAction,
    fetchSerializedReport: fetchSerializedReportAction,
    pushRouter: push,
    updateReport: updateReportAction,
  },
);

export default compose<Props, OwnProps>(
  routerParamsToProps({
    categoryName: 'categoryName:string',
    reportId: 'reportId:number',
  }),
  connector,
  withDatatypeDynamicData,
)(React.memo(ReportingDetail));

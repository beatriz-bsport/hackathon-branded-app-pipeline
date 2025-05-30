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

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';

import { getResultsById } from '#src/libs/fuzzy-search/selectors';

import {
  getInvalidFiltersV2,
  getReportCategoriesMetadata,
  getReportHeader,
  getReportGenerateredRows,
  getReportFilterConfigs,
  getReportFilterConfigLoading,
  getReportExcelState,
  getDefaultReportsV2,
} from '#src/libs/reporting/v2/selectors';
import { getCompanyUpsellData } from '#src/libs/company/selectors';
import { getLastVisitedReportV2 } from '#src/libs/user-preference/selectors';

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
  resetReportGenerationState as resetReportGenerationStateAction,
  getInvalidFilters as getInvalidFiltersAction,
} from '#src/libs/reporting/v2/actions';
import { setLastVisitedReportV2 as setLastVisitedReportV2Action } from '#src/libs/user-preference/actions';

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
import themeSelectors from '#src/libs/theme/selectors';
import { getFranchiseDisplayStopSubscriptionFromMemberSideForFranchisees } from '#src/libs/franchise/selectors';

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
  getInvalidFilters,
  getReportSearchResults,
  handleGetDynamicDataForFilters,
  invalidFilters,
  isFranchisor,
  lastVisitedReportV2,
  objectLevelPermissions,
  pushRouter,
  reportCategoriesMetadata,
  reportFilterConfigLoading,
  reportFilterConfigs,
  reportGeneratedRows,
  reportHeaders,
  reportId,
  resetDynamicDataHasBeenLoaded,
  resetReportGenerationState,
  subscribedUpsells,
  updateReport,
  userPermissions,
  setLastVisitedReportV2,
  displayNewWebshop,
  displayStopSubscriptionFromMemberSideForCompany,
  displayStopSubscriptionFromMemberSideForFranchisees,
}) => {
  React.useEffect(() => {
    resetDynamicDataHasBeenLoaded();
    fetchReportMetadata();
    fetchDefaultReports();
  }, [
    fetchReportMetadata,
    resetDynamicDataHasBeenLoaded,
    fetchDefaultReports,
    resetReportGenerationState,
  ]);

  React.useEffect(() => {
    setLastVisitedReportV2(categoryName, reportId);
    resetReportGenerationState();
    resetDynamicDataHasBeenLoaded();
  }, [
    reportId,
    categoryName,
    setLastVisitedReportV2,
    resetReportGenerationState,
    resetDynamicDataHasBeenLoaded,
  ]);

  React.useEffect(() => {
    fetchReportFilterConfigList({ report_id_in: [reportId] });
    getInvalidFilters(reportId);
  }, [fetchReportFilterConfigList, reportId, getInvalidFilters]);

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
    (values: ReportGenerationParams, withReportHeadersFetch = true) => {
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
        ...(values.reportFilterConfigId || advancedReportFilterConfig
          ? {
              report_filter_config_id:
                values.reportFilterConfigId || advancedReportFilterConfig.id,
            }
          : {}),
        ...(values.cursor ? { cursor: values.cursor } : {}),
      };

      withReportHeadersFetch && fetchReportHeaders(reportId, sanitizedParams);
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

  const report = getReportSearchResults?.[reportId] as ReportConfiguration;

  const displayStopSubscriptionFromMemberSide = isFranchisor
    ? displayStopSubscriptionFromMemberSideForFranchisees
    : displayStopSubscriptionFromMemberSideForCompany;

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
                  lastVisitedReportV2?.[reportCategory.category] ||
                  defaultReports.find(
                    (defaultReport) =>
                      defaultReport.category === reportCategory.category,
                  )?.id ||
                  null,
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
      lastVisitedReportV2,
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
        reportCategoriesDisabled={reportGeneratedRows.loading}
        setIsNavigationDrawerExpanded={setIsNavigationDrawerExpanded}
      />
      <ReportDetailPage
        advancedReportFilterConfig={advancedReportFilterConfig}
        categoryName={categoryName}
        createReport={createReport}
        createReportFilterConfig={createReportFilterConfig}
        defaultCategoryReportId={defaultCategoryReportId}
        deleteReport={deleteReport}
        displayNewWebshop={displayNewWebshop}
        displayStopSubscriptionFromMemberSide={
          displayStopSubscriptionFromMemberSide
        }
        dynamicDataHasBeenLoaded={dynamicDataHasBeenLoaded}
        editReportFilterConfig={editReportFilterConfig}
        excelExportLoading={excelExportLoading}
        getInvalidFilters={getInvalidFilters}
        handleExport={handleExcelExportation}
        handleGeneration={handleGeneration}
        handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
        invalidFilters={invalidFilters.results}
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
        reportHeaders={reportHeaders}
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
    getReportSearchResults: getResultsById(state, 'reportV2'),
    objectLevelPermissions: getObjectPermissions(state),
    defaultReports: getDefaultReportsV2(state),
    invalidFilters: getInvalidFiltersV2(state),
    reportCategoriesMetadata: getReportCategoriesMetadata(state),
    reportFilterConfigLoading: getReportFilterConfigLoading(state),
    reportFilterConfigs: getReportFilterConfigs(state, reportId),
    reportGeneratedRows: getReportGenerateredRows(state),
    reportHeaders: getReportHeader(state),
    subscribedUpsells: getCompanyUpsellData(state),
    userPermissions: getPermissions(state),
    lastVisitedReportV2: getLastVisitedReportV2(state),
    displayNewWebshop: themeSelectors.getTheme(state)?.display_new_webshop,
    displayStopSubscriptionFromMemberSideForCompany:
      !!themeSelectors?.getTheme(state)
        ?.display_stop_subscription_from_member_side,
    displayStopSubscriptionFromMemberSideForFranchisees:
      getFranchiseDisplayStopSubscriptionFromMemberSideForFranchisees(state),
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
    getInvalidFilters: getInvalidFiltersAction,
    pushRouter: push,
    updateReport: updateReportAction,
    setLastVisitedReportV2: setLastVisitedReportV2Action,
    resetReportGenerationState: resetReportGenerationStateAction,
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

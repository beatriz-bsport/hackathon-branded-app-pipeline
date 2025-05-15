import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { CallHistoryMethodAction } from 'connected-react-router';
import type { withDatatypeDynamicDataProps } from '#src/libs/datatype-filtering/dynamic-data-hoc';
import type { Theme } from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';

import ReportDetailHeader from '#src/libs/reporting/v2/components/ReportDetailHeader.component';
import ReportDetailDrawer from '#src/libs/reporting/v2/components/ReportDetailDrawer.component';
import ReportDetailCreateModal from '#src/libs/reporting/v2/components/ReportDetailCreateModal.component';
import ReportDetailContent from '#src/libs/reporting/v2/components/ReportDetailContent';
import ModalConfirm from '#src/components/ModalConfirm.component';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';

import { getReportObjectPermissionsBasedOnCategory } from '#src/libs/reporting/common/utils';

import type {
  ReportConfiguration,
  ReportFilterConfig,
  ReportHeader,
  ReportMetadataValue,
  SerializedReport,
  ReportFilterConfigCreateData,
  ReportFilterConfigConfig,
  ReportUpdateAPI,
  ReportGenerationParams,
  InvalidFiltersAPI,
} from '#src/libs/reporting/common/types';
import type { ErrorAndLoading } from '#src/libs/types';
import type { DynamicFilterDataType } from '#src/libs/datatype-filtering/types';
import type { OptionCallback } from '#src/state/types';
import type {
  ObjectLevelPermissions,
  RolePermission,
} from '#src/libs/role/types';

import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import {
  drawerSmallWidth,
  drawerWidth,
} from '#src/libs/reporting/common/constants';

type Props = {
  advancedReportFilterConfig: ReportFilterConfig | null;
  categoryName: ReportCategoryEnum;
  createReport: (
    data: Partial<Omit<ReportConfiguration, 'id'>>,
    options?: OptionCallback<ReportConfiguration>,
  ) => void;
  createReportFilterConfig: (
    data: ReportFilterConfigCreateData,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  defaultCategoryReportId: number;
  deleteReport: (reportId: number, options?: OptionCallback) => Promise<void>;
  dynamicDataHasBeenLoaded: Record<DynamicFilterDataType, boolean>;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Partial<ReportFilterConfig>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  excelExportLoading: boolean;
  getInvalidFilters: (
    reportId: number,
    options?: OptionCallback<InvalidFiltersAPI>,
  ) => void;
  handleExport: (values: ReportGenerationParams) => () => void;
  handleGeneration: (
    values: ReportGenerationParams,
    withReportHeadersFetch?: boolean,
  ) => void;
  invalidFilters: InvalidFiltersAPI;
  isFranchisor?: boolean;
  isNavigationDrawerExpanded: boolean;
  objectLevelPermissions: ObjectLevelPermissions;
  pushRouter: (path: string) => CallHistoryMethodAction<[string, unknown?]>;
  quickReportFilterConfig: ReportFilterConfig;
  report: ReportConfiguration;
  reportCategoriesMetadata: {
    results: ReportMetadataValue[];
  } & ErrorAndLoading;
  reportCategoryMetadata: ReportMetadataValue;
  reportFilterConfigLoading: boolean;
  reportGeneratedRows: SerializedReport & ErrorAndLoading;
  reportHeaders: { results: ReportHeader } & ErrorAndLoading;
  reportId: number;
  updateReport: (
    reportId: number,
    data: ReportUpdateAPI,
    options?: OptionCallback<ReportConfiguration>,
  ) => Promise<void>;
  userPermissions: RolePermission;
  displayNewWebshop?: boolean;
  displayStopSubscriptionFromMemberSide?: boolean;
} & Pick<withDatatypeDynamicDataProps, 'handleGetDynamicDataForFilters'>;

const ReportDetailPage: React.FC<Props> = ({
  advancedReportFilterConfig,
  categoryName,
  createReport,
  createReportFilterConfig,
  dynamicDataHasBeenLoaded,
  editReportFilterConfig,
  excelExportLoading,
  defaultCategoryReportId,
  deleteReport,
  handleExport,
  getInvalidFilters,
  handleGeneration,
  handleGetDynamicDataForFilters,
  invalidFilters,
  isFranchisor,
  isNavigationDrawerExpanded,
  objectLevelPermissions,
  pushRouter,
  quickReportFilterConfig,
  report,
  reportCategoriesMetadata,
  reportCategoryMetadata,
  reportFilterConfigLoading,
  reportGeneratedRows,
  reportHeaders,
  reportId,
  updateReport,
  userPermissions,
  displayNewWebshop,
  displayStopSubscriptionFromMemberSide,
}) => {
  const classes = useStyles({ isNavigationDrawerExpanded });
  const { t } = useTranslation('reporting');
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [hydratedLoading, setHydratedLoading] = React.useState(true);

  const { refreshOptions } = useObjectSearch();

  const handleDeleteModalState = React.useCallback(
    (bool: boolean) => () => {
      setIsDeleteModalOpen(bool);
    },
    [setIsDeleteModalOpen],
  );

  const handleEditDrawerState = React.useCallback(
    (bool: boolean) => () => {
      setIsEditDrawerOpen(bool);
    },
    [setIsEditDrawerOpen],
  );

  const handleAddModalState = React.useCallback(
    (bool: boolean) => () => {
      setIsAddModalOpen(bool);
    },
    [setIsAddModalOpen],
  );

  const editDrawerSubmit = React.useCallback(
    (data: {
      config: ReportFilterConfigConfig;
      report: { columns: string[]; name: string };
    }) => {
      updateReport(reportId, data.report, {
        onSuccess: () => {
          refreshOptions('reportV2', { category: categoryName }, 'default');
        },
      });
      if (advancedReportFilterConfig) {
        editReportFilterConfig(
          advancedReportFilterConfig?.id,
          { config: data.config },
          {
            onSuccess: (reportFilterConfigEdited) => {
              getInvalidFilters(reportId);
              setIsEditDrawerOpen(false);
              handleGeneration({
                reportFilterConfigId: reportFilterConfigEdited.id,
              });
            },
          },
        );
      } else {
        createReportFilterConfig(
          {
            config: data.config,
            is_quick_report_filter: false,
            report: reportId,
          },
          {
            onSuccess: (reportFilterConfigCreated) => {
              getInvalidFilters(reportId);
              setIsEditDrawerOpen(false);
              handleGeneration({
                reportFilterConfigId: reportFilterConfigCreated.id,
              });
            },
          },
        );
      }
    },
    [
      advancedReportFilterConfig,
      categoryName,
      createReportFilterConfig,
      editReportFilterConfig,
      getInvalidFilters,
      handleGeneration,
      refreshOptions,
      reportId,
      updateReport,
    ],
  );

  const handleCreateReport = React.useCallback(
    (name: string) => {
      createReport(
        {
          name: name,
          category: categoryName,
          columns:
            reportCategoryMetadata?.columns?.map(
              (columnMetadata) => columnMetadata.identifier,
            ) || [],
        },
        {
          onSuccess: (createdReport) => {
            pushRouter(createdReport.id.toString());
            setIsAddModalOpen(false);
          },
        },
      );
    },
    [createReport, categoryName, reportCategoryMetadata, pushRouter],
  );

  const handleDeleteReport = React.useCallback(() => {
    deleteReport(reportId, {
      onSuccess: () => {
        isFranchisor
          ? pushRouter(
              `/f/reporting/detail/${categoryName}/${defaultCategoryReportId}`,
            )
          : pushRouter(
              `/reporting/detail/${categoryName}/${defaultCategoryReportId}`,
            );
        setIsDeleteModalOpen(false);
      },
      onError: () => {
        setIsDeleteModalOpen(false);
      },
    });
  }, [
    pushRouter,
    reportId,
    deleteReport,
    defaultCategoryReportId,
    categoryName,
    isFranchisor,
  ]);

  const invalidAdvancedFilterItemsUUID = React.useMemo(
    () =>
      advancedReportFilterConfig
        ? invalidFilters?.[advancedReportFilterConfig.id] || []
        : [],
    [advancedReportFilterConfig, invalidFilters],
  );

  const invalidQuickFilterItemsUUID = React.useMemo(
    () =>
      quickReportFilterConfig
        ? invalidFilters?.[quickReportFilterConfig.id] || []
        : [],
    [quickReportFilterConfig, invalidFilters],
  );

  if (reportFilterConfigLoading) {
    return <LinearProgress />;
  }

  const { delete: hasDeletePermission } =
    getReportObjectPermissionsBasedOnCategory(
      objectLevelPermissions,
      categoryName,
    );

  return (
    <>
      <ReportDetailDrawer
        advancedReportFilterConfig={advancedReportFilterConfig}
        categoryName={categoryName}
        displayStopSubscriptionFromMemberSide={
          displayStopSubscriptionFromMemberSide
        }
        dynamicDataHasBeenLoaded={dynamicDataHasBeenLoaded}
        handleDrawerClosing={handleEditDrawerState(false)}
        handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
        invalidAdvancedFilterItemsUUID={invalidAdvancedFilterItemsUUID}
        isDrawerOpen={isEditDrawerOpen}
        isFranchisor={isFranchisor}
        onSubmit={editDrawerSubmit}
        report={report}
        reportCategoryMetadata={reportCategoryMetadata}
      />
      <ReportDetailCreateModal
        categoryName={categoryName}
        handleCancel={handleAddModalState(false)}
        onSubmit={handleCreateReport}
        open={isAddModalOpen}
      />
      <ModalConfirm
        handleCancel={handleDeleteModalState(false)}
        handleConfirm={handleDeleteReport}
        open={isDeleteModalOpen}
        options={{
          title: t('reportDeleteModal.title'),
          confirm: t('reportDeleteModal.confirm'),
          isDeletion: true,
        }}
      >
        {t('reportDeleteModal.content')}
      </ModalConfirm>
      <div className={classes.content}>
        <ReportDetailHeader
          advancedReportFilterConfig={advancedReportFilterConfig}
          categoryName={categoryName}
          deleteDisabled={!hasDeletePermission || reportGeneratedRows.loading}
          handleAddModalOpening={handleAddModalState(true)}
          handleDeleteModalOpening={handleDeleteModalState(true)}
          handleEditDrawerOpening={handleEditDrawerState(true)}
          invalidAdvancedFilterItemsCount={
            invalidAdvancedFilterItemsUUID?.length || 0
          }
          isCategoryDefault={report?.is_category_default}
          isSearchDisabled={reportGeneratedRows.loading}
          pushRouter={pushRouter}
          reportId={reportId}
          setHydratedLoading={setHydratedLoading}
          upsertActionsDisabled={
            reportCategoriesMetadata.loading || reportGeneratedRows.loading
          }
        />
        <ReportDetailContent
          categoryName={categoryName}
          displayNewWebshop={displayNewWebshop}
          displayStopSubscriptionFromMemberSide={
            displayStopSubscriptionFromMemberSide
          }
          dynamicDataHasBeenLoaded={dynamicDataHasBeenLoaded}
          editReportFilterConfig={editReportFilterConfig}
          excelExportLoading={excelExportLoading}
          handleExport={handleExport}
          handleGeneration={handleGeneration}
          handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
          hydratedLoading={hydratedLoading}
          invalidQuickFilterItemsUUID={invalidQuickFilterItemsUUID}
          isFranchisor={isFranchisor}
          loading={reportCategoriesMetadata.loading}
          objectLevelPermissions={objectLevelPermissions}
          pushRouter={pushRouter}
          quickReportFilterConfig={quickReportFilterConfig}
          report={report}
          reportCategoriesMetadata={reportCategoriesMetadata}
          reportCategoryMetadata={reportCategoryMetadata}
          reportGeneratedRows={reportGeneratedRows}
          reportHeaders={reportHeaders}
          userPermissions={userPermissions}
        />
      </div>
    </>
  );
};

const useStyles = makeStyles<Theme, { isNavigationDrawerExpanded: boolean }>(
  (theme) => ({
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      padding: theme.spacing(2),
      flex: '1 0 0',
      overflowX: 'auto',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(2),
      },
      [theme.breakpoints.between('md', 'xl')]: {
        paddingLeft: ({ isNavigationDrawerExpanded }) =>
          isNavigationDrawerExpanded
            ? `calc(${drawerWidth}px + ${theme.spacing(2)}px)`
            : `calc(${drawerSmallWidth}px + ${theme.spacing(2)}px)`,
      },
    },
  }),
);

export default React.memo(ReportDetailPage);

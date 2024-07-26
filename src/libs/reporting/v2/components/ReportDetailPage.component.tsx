import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { CallHistoryMethodAction } from 'connected-react-router';
import type { withDatatypeDynamicDataProps } from '#src/libs/datatype-filtering/dynamic-data-hoc';

import ReportDetailHeader from '#src/libs/reporting/v2/components/ReportDetailHeader.component';
import ReportDetailDrawer from '#src/libs/reporting/v2/components/ReportDetailDrawer.component';
import ReportDetailCreateModal from '#src/libs/reporting/v2/components/ReportDetailCreateModal.component';
import ReportDetailContent from '#src/libs/reporting/v2/components/ReportDetailContent';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

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
} from '#src/libs/reporting/common/types';
import type { ErrorAndLoading } from '#src/libs/types';
import type { DynamicFilterDataType } from '#src/libs/datatype-filtering/types';
import type { OptionCallback } from '#src/state/types';
import type {
  ObjectLevelPermissions,
  RolePermission,
} from '#src/libs/role/types';

import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';

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
  dynamicDataHasBeenLoaded: Record<DynamicFilterDataType, boolean>;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Partial<ReportFilterConfig>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  handleExport: () => void;
  handleGeneration: (values: ReportGenerationParams) => void;
  objectLevelPermissions: ObjectLevelPermissions;
  pushRouter: (path: string) => CallHistoryMethodAction<[string, unknown?]>;
  report: ReportConfiguration;
  reportCategoriesMetadata: {
    results: ReportMetadataValue[];
  } & ErrorAndLoading;
  reportCategoryMetadata: ReportMetadataValue;
  reportGeneratedRows: SerializedReport & ErrorAndLoading;
  reportHeaders: ReportHeader;
  reportId: number;
  updateReport: (
    reportId: number,
    data: ReportUpdateAPI,
    options?: OptionCallback<ReportConfiguration>,
  ) => Promise<void>;
  userPermissions: RolePermission;
} & Pick<withDatatypeDynamicDataProps, 'handleGetDynamicDataForFilters'>;

const ReportDetailPage: React.FC<Props> = ({
  advancedReportFilterConfig,
  categoryName,
  createReport,
  createReportFilterConfig,
  dynamicDataHasBeenLoaded,
  editReportFilterConfig,
  handleExport,
  handleGeneration,
  handleGetDynamicDataForFilters,
  objectLevelPermissions,
  pushRouter,
  report,
  reportCategoriesMetadata,
  reportCategoryMetadata,
  reportGeneratedRows,
  reportHeaders,
  reportId,
  updateReport,
  userPermissions,
}) => {
  const classes = useStyles();
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const { refreshOptions } = useObjectSearch();

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

  return (
    <>
      <ReportDetailDrawer
        advancedReportFilterConfig={advancedReportFilterConfig}
        dynamicDataHasBeenLoaded={dynamicDataHasBeenLoaded}
        handleDrawerClosing={handleEditDrawerState(false)}
        handleGetDynamicDataForFilters={handleGetDynamicDataForFilters}
        isDrawerOpen={isEditDrawerOpen}
        onSubmit={editDrawerSubmit}
        report={report}
        reportCategoryMetadata={reportCategoryMetadata}
      />
      <ReportDetailCreateModal
        handleCancel={handleAddModalState(false)}
        onSubmit={handleCreateReport}
        open={isAddModalOpen}
      />
      <div className={classes.content}>
        <ReportDetailHeader
          advancedReportFilterConfig={advancedReportFilterConfig}
          categoryName={categoryName}
          handleAddModalOpening={handleAddModalState(true)}
          handleEditDrawerOpening={handleEditDrawerState(true)}
          pushRouter={pushRouter}
          reportId={reportId}
          upsertActionsDisabled={reportCategoriesMetadata.loading}
        />
        <ReportDetailContent
          categoryName={categoryName}
          handleExport={handleExport}
          handleGeneration={handleGeneration}
          loading={reportCategoriesMetadata.loading || !report}
          objectLevelPermissions={objectLevelPermissions}
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

const useStyles = makeStyles((theme) => ({
  content: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
}));

export default React.memo(ReportDetailPage);

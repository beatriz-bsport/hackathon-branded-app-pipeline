import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { useTranslation, Trans } from 'react-i18next';
import ReportGenerationForm from './ReportGenerationForm.component';
import ReportTable from './ReportTable.component';
import ReportTableHeaders from './ReportTableHeaders.component';

import type {
  ReportConfiguration,
  ReportFilterConfig,
  ReportFilterConfigParams,
  ReportMetadata,
  SerializedRow,
} from '#libs/reporting/types';
import { DynamicFilterDataType } from '#libs/datatype-filtering/types';
import { getColumn, getReportObjectPermissions } from '#libs/reporting/utils';
import { OptionCallback } from '../../../state/types';
import { ObjectLevelPermissions, RolePermission } from '#libs/role/types';
import { handleGetDynamicDataForFiltersReturn } from '#libs/datatype-filtering/dynamic-data-hoc';

type Props = {
  resultLoading?: boolean;
  report: ReportConfiguration;
  reportStoreRows: SerializedRow[];
  metadata: ReportMetadata;
  handleGeneratePreviousPage: (data: any) => void;
  handleGenerateNextPage: (data: any) => void;
  handleGenerate: (data: any) => void;
  handleGenerateHeaders: (data: any) => void;
  reportHeaders: object;
  reportHeadersLoading: boolean;
  previousPage: number;
  nextPage: number;
  otherPages: Array<number>;
  pageSize: number;
  reportStoreRowsLoading: boolean;
  isFranchisor?: boolean;
  userPermissions: RolePermission;
  handleExcelExportation: () => void;
  showDialog: boolean;
  setShowDialog: (boolean: boolean) => void;
  disableContinue: boolean;
  setDisableContinue: (boolean: boolean) => void;
  handleGetDynamicDataForReport: (
    type: DynamicFilterDataType,
    valueId?: number,
  ) => handleGetDynamicDataForFiltersReturn;
  reportFilterConfigs: ReportFilterConfig[];
  createReportFilterConfig: (
    reportId: number,
    data: Omit<ReportFilterConfig, 'id'>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  editReportFilterConfig: (
    reportFilterConfigId: number,
    data: Omit<ReportFilterConfig, 'id'>,
    options?: OptionCallback<ReportFilterConfig>,
  ) => void;
  fetchReportFilterConfigList: (params: ReportFilterConfigParams) => void;
  deleteReportFilterConfig: (reporFilterId: number) => void;
  objectLevelPermissions: ObjectLevelPermissions;
};

const CATEGORIES_NEEDING_HELPER_TEXT = ['franchise_shared_pass'];

const useStyles = makeStyles((theme: Theme) => ({
  alertIcon: {
    alignItems: 'center',
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  infoLink: {
    color: 'inherit',
    textDecorationLine: 'underline',
    '&:link, &:visited, &:hover, &:active, &:focus': {
      color: 'inherit',
      textDecorationLine: 'underline',
    },
  },
}));

const ReportGeneration: React.FC<Props> = ({
  report,
  reportStoreRows,
  resultLoading = true,
  handleGenerate,
  handleGeneratePreviousPage,
  handleGenerateNextPage,
  handleGenerateHeaders,
  reportHeaders,
  reportHeadersLoading,
  metadata,
  previousPage,
  nextPage,
  otherPages,
  pageSize,
  reportStoreRowsLoading,
  isFranchisor,
  handleExcelExportation,
  showDialog,
  setShowDialog,
  disableContinue,
  setDisableContinue,
  handleGetDynamicDataForReport,
  reportFilterConfigs,
  createReportFilterConfig,
  editReportFilterConfig,
  fetchReportFilterConfigList,
  deleteReportFilterConfig,
  // @ts-expect-error
  allowedFranchisees,
  userPermissions,
  objectLevelPermissions,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  if (!report || metadata.loading) {
    return <LinearProgress />;
  }

  const columnsMetadata =
    report?.columns?.map((c) => getColumn(metadata, report, c)) ?? [];

  const reportMetadata = metadata?.results?.find(
    (r) => r.category === report.category,
  );

  const { edit: hasEditPermission, read: hasReadPermission } =
    getReportObjectPermissions(objectLevelPermissions, report);

  return (
    <div>
      {isFranchisor && (
        <Alert
          classes={{ root: classes.alertIcon }}
          className={classes.alert}
          severity="warning"
        >
          {t('franchiseWarning.part1')} <br />
          {t('franchiseWarning.part2')}
        </Alert>
      )}
      {CATEGORIES_NEEDING_HELPER_TEXT.includes(report?.category) && (
        <Alert
          classes={{ root: classes.alertIcon }}
          className={classes.alert}
          severity="info"
        >
          {t(`helperText.${report.category}`)}
        </Alert>
      )}
      {report.date_start && (
        <ReportGenerationForm
          // @ts-expect-error
          allowedFranchisees={allowedFranchisees}
          columnsMetadata={columnsMetadata}
          createReportFilterConfig={createReportFilterConfig}
          deleteReportFilterConfig={deleteReportFilterConfig}
          disableContinue={disableContinue}
          editReportFilterConfig={editReportFilterConfig}
          fetchReportFilterConfigList={fetchReportFilterConfigList}
          handleExcelExportation={handleExcelExportation}
          handleGetDynamicDataForReport={handleGetDynamicDataForReport}
          isDisabled={!hasEditPermission || !hasReadPermission}
          isFranchisor={isFranchisor}
          isSubmitting_={reportStoreRowsLoading}
          onSubmit={handleGenerate}
          reportConfiguration={report}
          reportFilterConfigs={reportFilterConfigs}
          resultLoading={resultLoading}
          setDisableContinue={setDisableContinue}
          setShowDialog={setShowDialog}
          showDialog={showDialog}
          timeWindowFilteringEnabled={
            // @ts-expect-error
            !!reportMetadata?.time_window_filtering_enabled
          }
        />
      )}

      {hasReadPermission ? (
        <>
          <ReportTableHeaders
            handleGenerateHeaders={handleGenerateHeaders}
            // @ts-expect-error
            reportCategory={report.category}
            reportHeaders={reportHeaders}
            reportHeadersLoading={reportHeadersLoading}
          />
          {report.category === 'invoices' && (
            <Alert
              classes={{ root: classes.alertIcon }}
              className={classes.alert}
              severity="info"
            >
              <Trans
                components={[
                  <a
                    className={classes.infoLink}
                    href={t('reporting:helperText.invoicesAccrualMethodLink')}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    .
                  </a>,
                ]}
                i18nKey="reporting:helperText.invoicesAccrualMethod"
                t={t}
                values={{
                  purchasedGiftcardReport: t(
                    'reporting:categories.consumer_giftcard',
                  ),
                }}
              />
            </Alert>
          )}
          {reportStoreRowsLoading || resultLoading ? <LinearProgress /> : null}
          {/* @ts-expect-error */}
          {!report.loading && !!reportStoreRows && (
            <Paper>
              <ReportTable
                handleGenerateNextPage={handleGenerateNextPage}
                handleGeneratePreviousPage={handleGeneratePreviousPage}
                // @ts-expect-error
                loading={resultLoading}
                metadata={metadata}
                nextPage={nextPage}
                objectLevelPermissions={objectLevelPermissions}
                otherPages={otherPages}
                pageSize={pageSize}
                previousPage={previousPage}
                report={report}
                reportStoreRowsLoading={reportStoreRowsLoading}
                result={reportStoreRows}
                userPermissions={userPermissions}
              />
            </Paper>
          )}
          {reportStoreRowsLoading && report && <LinearProgress />}
        </>
      ) : (
        <Typography align="center" variant="h5">
          {t('readPermissionDenied')}
        </Typography>
      )}
    </div>
  );
};

export default React.memo(ReportGeneration);

// @ts-nocheck
import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';
import ReportGenerationForm from './ReportGenerationForm.component';
import ReportTable from './ReportTable.component';
import ReportTableHeaders from './ReportTableHeaders.component';

import {
  ReportConfiguration,
  ReportFilterConfig,
  ReportFilterConfigParams,
  ReportMetadata,
  SerializedRow,
} from '../types';
import { DynamicFilterDataType } from '#libs/datatype-filtering/types';
import { getColumn } from '../utils';
import { OptionCallback } from '../../../state/types';
import { RolePermission } from '#libs/role/types';

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
  handleGetDynamicDataForReport: (type: DynamicFilterDataType) => any[];
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
};

const CATEGORIES_NEEDING_HELPER_TEXT = ['franchise_shared_pass'];

const useStyles = makeStyles((theme: Theme) => ({
  alertIcon: {
    alignItems: 'center',
  },
  alert: {
    marginBottom: theme.spacing(2),
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
  allowedFranchisees,
  userPermissions,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  if (!report || metadata.loading) {
    return <LinearProgress />;
  }

  const columnsMetadata =
    report?.columns?.map((c) => getColumn(metadata, report, c)) ?? [];

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
          allowedFranchisees={allowedFranchisees}
          columnsMetadata={columnsMetadata}
          createReportFilterConfig={createReportFilterConfig}
          deleteReportFilterConfig={deleteReportFilterConfig}
          disableContinue={disableContinue}
          editReportFilterConfig={editReportFilterConfig}
          fetchReportFilterConfigList={fetchReportFilterConfigList}
          handleExcelExportation={handleExcelExportation}
          handleGetDynamicDataForReport={handleGetDynamicDataForReport}
          isFranchisor={isFranchisor}
          isSubmitting_={reportStoreRowsLoading}
          onSubmit={handleGenerate}
          reportConfiguration={report}
          reportFilterConfigs={reportFilterConfigs}
          resultLoading={resultLoading}
          setDisableContinue={setDisableContinue}
          setShowDialog={setShowDialog}
          showDialog={showDialog}
        />
      )}
      <ReportTableHeaders
        handleGenerateHeaders={handleGenerateHeaders}
        reportHeaders={reportHeaders}
        reportHeadersLoading={reportHeadersLoading}
      />
      {reportStoreRowsLoading || resultLoading ? <LinearProgress /> : null}
      {!report.loading && !!reportStoreRows && (
        <Paper>
          <ReportTable
            handleGenerateNextPage={handleGenerateNextPage}
            handleGeneratePreviousPage={handleGeneratePreviousPage}
            loading={resultLoading}
            metadata={metadata}
            nextPage={nextPage}
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
    </div>
  );
};

export default ReportGeneration;

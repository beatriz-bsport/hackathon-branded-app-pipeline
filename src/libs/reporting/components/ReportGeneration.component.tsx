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
  ReportExtractResult,
  ReportFilterConfig,
  ReportFilterConfigParams,
  ReportMetadata,
} from '../types';
import { DynamicFilterDataType } from '#libs/datatype-filtering/types';
import { getColumn } from '../utils';
import { OptionCallback } from '../../../state/types';

type Props = {
  resultLoading?: boolean;
  report: ReportConfiguration;
  result: ReportExtractResult;
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
  result,
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
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  if (!report || metadata.loading) {
    return <LinearProgress />;
  }

  const columnsMetadata =
    report.columns?.map((c) => getColumn(metadata, report, c)) ?? [];

  return (
    <div>
      {isFranchisor && (
        <Alert
          severity="warning"
          classes={{ root: classes.alertIcon }}
          className={classes.alert}
        >
          {t('franchiseWarning.part1')} <br />
          {t('franchiseWarning.part2')}
        </Alert>
      )}
      {CATEGORIES_NEEDING_HELPER_TEXT.includes(report?.category) && (
        <Alert
          severity="info"
          classes={{ root: classes.alertIcon }}
          className={classes.alert}
        >
          {t(`helperText.${report.category}`)}
        </Alert>
      )}
      {report.date_start && (
        <ReportGenerationForm
          reportConfiguration={report}
          onSubmit={handleGenerate}
          columnsMetadata={columnsMetadata}
          handleExcelExportation={handleExcelExportation}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          disableContinue={disableContinue}
          setDisableContinue={setDisableContinue}
          resultLoading={resultLoading}
          isSubmitting_={reportStoreRowsLoading}
          handleGetDynamicDataForReport={handleGetDynamicDataForReport}
          reportFilterConfigs={reportFilterConfigs}
          createReportFilterConfig={createReportFilterConfig}
          editReportFilterConfig={editReportFilterConfig}
          fetchReportFilterConfigList={fetchReportFilterConfigList}
          deleteReportFilterConfig={deleteReportFilterConfig}
          isFranchisor={isFranchisor}
          allowedFranchisees={allowedFranchisees}
        />
      )}
      <ReportTableHeaders
        handleGenerateHeaders={handleGenerateHeaders}
        reportHeaders={reportHeaders}
        reportHeadersLoading={reportHeadersLoading}
      />
      {reportStoreRowsLoading || resultLoading ? <LinearProgress /> : null}
      {!report.loading ? (
        <Paper>
          <ReportTable
            report={report}
            result={result}
            loading={resultLoading}
            metadata={metadata}
            previousPage={previousPage}
            nextPage={nextPage}
            otherPages={otherPages}
            handleGeneratePreviousPage={handleGeneratePreviousPage}
            handleGenerateNextPage={handleGenerateNextPage}
            pageSize={pageSize}
            reportStoreRowsLoading={reportStoreRowsLoading}
          />
        </Paper>
      ) : null}
      {reportStoreRowsLoading && result ? <LinearProgress /> : null}
    </div>
  );
};

export default ReportGeneration;

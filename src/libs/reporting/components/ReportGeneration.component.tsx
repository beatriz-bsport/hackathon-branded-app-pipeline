import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

import ReportGenerationForm from './ReportGenerationForm.component';
import ReportTable from './ReportTable.component';
import ReportTableHeaders from './ReportTableHeaders.component';

import {
  DynamicFilterDataType,
  ReportConfiguration,
  ReportExtractResult,
  ReportFilterConfig,
  ReportFilterConfigParams,
  ReportMetadata,
} from '../types';
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
}) => {
  if (!report || metadata.loading) {
    return <LinearProgress />;
  }

  const columnsMetadata =
    report.columns?.map((c) => getColumn(metadata, report, c)) ?? [];

  return (
    <div>
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

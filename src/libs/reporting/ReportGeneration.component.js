// @flow

import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

import ReportGenerationForm from './ReportGenerationForm.component';
import ReportTable from './ReportTable.component';
import ReportTableHeaders from './ReportTableHeaders.component';

import type {
  ReportConfiguration,
  ReportExtractResult,
  ReportMetadata,
} from './types';

type Props = {
  resultLoading?: boolean,
  report: ReportConfiguration,
  result: ReportExtractResult,
  metadata: ReportMetadata,
  handleGeneratePreviousPage: (data: any) => void,
  handleGenerateNextPage: (data: any) => void,
  handleGenerate: (data: any) => void,
  handleGenerateHeaders: (any: data) => void,
  reportHeaders: object,
  reportHeadersLoading: boolean,
  previousPage: number,
  nextPage: number,
  otherPages: Array<number>,
  pageSize: number,
  reportStoreRowsLoading: boolean,
  handleGenerate: () => void,
  handleExcelExportation: () => void,
  showDialog: boolean,
  setShowDialog: () => void,
  setShowDialog: (boolean: boolean) => void,
  disableContinue: boolean,
  setDisableContinue: (boolean: boolean) => void,
};

export default function ReportGeneration(props: Props) {
  const {
    report,
    result,
    resultLoading,
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
    handleExcelExportation,
    showDialog,
    setShowDialog,
    disableContinue,
    setDisableContinue,
  } = props;

  if (!report || metadata.loading) {
    return <LinearProgress />;
  }

  return (
    <div>
      {report.date_start && (
        <ReportGenerationForm
          reportConfiguration={report}
          onSubmit={handleGenerate}
          metadata={metadata}
          handleExcelExportation={handleExcelExportation}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          disableContinue={disableContinue}
          setDisableContinue={setDisableContinue}
          resultLoading={resultLoading}
          isSubmitting_={reportStoreRowsLoading}
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
}

ReportGeneration.defaultProps = {
  resultLoading: true,
};

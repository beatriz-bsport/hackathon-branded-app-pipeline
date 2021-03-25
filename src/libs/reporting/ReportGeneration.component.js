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
  handleGeneratePreviousPage: (*) => void,
  handleGenerateNextPage: (*) => void,
  handleGenerate: (*) => void,
  handleGenerateHeaders: (*) => void,
  reportHeaders: object,
  reportHeadersLoading: boolean,
  exportLink?: string,
  previousPage: number,
  nextPage: number,
  otherPages: Array<number>,
  pageSize: number,
  reportStoreRowsLoading: boolean,
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
    exportLink,
    metadata,
    previousPage,
    nextPage,
    otherPages,
    pageSize,
    reportStoreRowsLoading,
  } = props;

  if (!report || metadata.loading) {
    return <LinearProgress />;
  }
  return (
    <div>
      {!report || metadata.loading ? (
        <LinearProgress />
      ) : (
        <ReportGenerationForm
          reportConfiguration={report}
          onSubmit={handleGenerate}
          exportLink={exportLink}
          metadata={metadata}
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
  resultLoading: false,
  exportLink: null,
};

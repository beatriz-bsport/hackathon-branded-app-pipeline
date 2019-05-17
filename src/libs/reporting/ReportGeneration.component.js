// @flow

import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

import ReportGenerationForm from './ReportGenerationForm.component';
import ReportTable from './ReportTable.component';

import type { ReportConfiguration, ReportExtractResult } from './types';

type Props = {
  resultLoading?: boolean,
  report: ReportConfiguration,
  result: ReportExtractResult,
  metadata: ReportMetadata,
  handleGenerate: (*) => void,
  exportLink?: string,
  dateRange: *,
};

export default function ReportGeneration(props: Props) {
  const {
    report,
    result,
    resultLoading,
    handleGenerate,
    exportLink,
    metadata,
    dateRange,
  } = props;

  if (!report || report.loading || metadata.loading) {
    return <LinearProgress />;
  }

  return (
    <div>
      <ReportGenerationForm
        initial={dateRange}
        reportConfiguration={report}
        onSubmit={handleGenerate}
        exportLink={exportLink}
        metadata={metadata}
      />
      {resultLoading ? <LinearProgress /> : null}
      <Paper>
        <ReportTable
          report={report}
          result={result}
          loading={resultLoading}
          metadata={metadata}
        />
      </Paper>
    </div>
  );
}

ReportGeneration.defaultProps = {
  resultLoading: true,
  exportLink: null,
};

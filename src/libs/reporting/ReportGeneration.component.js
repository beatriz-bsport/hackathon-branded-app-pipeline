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
  handleGenerate: (*) => void,
  exportLink?: string,
};

export default function ReportGeneration(props: Props) {
  const { report, result, resultLoading, handleGenerate, exportLink } = props;

  if (!report || report.loading) {
    return <LinearProgress />;
  }

  return (
    <div>
      <ReportGenerationForm
        reportConfiguration={report}
        onSubmit={handleGenerate}
        exportLink={exportLink}
      />
      {resultLoading ? <LinearProgress /> : null}
      <Paper>
        <ReportTable report={report} result={result} loading={resultLoading} />
      </Paper>
    </div>
  );
}

ReportGeneration.defaultProps = {
  resultLoading: true,
  exportLink: null,
};

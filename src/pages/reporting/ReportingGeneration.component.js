// @flow

import React from 'react';

import { compose, withProps, withState } from 'recompose';

import { connect } from 'react-redux';

import { API_URI } from '../../http';
import { asQueryParams } from '../../resources/core';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import ReportGeneration from '../../libs/reporting/ReportGeneration.component';

import { reports, reportResult } from '../../resources/reporting';

import type {
  ReportConfiguration,
  ReportExtractResult,
} from '../../libs/reporting/types';

type Props = {
  report: ReportConfiguration,
  result: ReportExtractResult,
  exportLink: string,
};

export class ReportingGeneration extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchReports();
  }

  render() {
    const { report, result, handleGenerate, exportLink } = this.props;
    return (
      <ReportGeneration
        report={report}
        resultLoading={report.loading || result.loading}
        result={result.value}
        handleGenerate={handleGenerate}
        exportLink={exportLink}
      />
    );
  }
}

export default compose(
  routerParamsToProps({ reportId: 'id:number' }),
  connect(
    (state, { id }) => ({
      report: reports.selectors.get(state, id),
      result: reportResult.selectors.get(state),
    }),
    {
      fetchReports: reports.effects.fetchAll,
      fetchExtractResult: reportResult.effects.generate,
    },
  ),
  withState('exportLink', 'setExportLink', null),
  withProps(({ id, fetchExtractResult, result, setExportLink }) => ({
    handleGenerate({ dateStart, dateEnd }) {
      fetchExtractResult(id, dateStart, dateEnd);
      const params = asQueryParams({ dateStart, dateEnd });
      const exportLink =
        result &&
        `${API_URI}/reporting/reports/${id}/export/?fileformat=csv&${params}`;
      setExportLink(exportLink);
    },
  })),
)(ReportingGeneration);

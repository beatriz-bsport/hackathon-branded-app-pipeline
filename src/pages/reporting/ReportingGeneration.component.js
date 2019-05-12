// @flow

import moment from 'moment';
import React from 'react';

import { compose, withProps, withState } from 'recompose';

import { connect } from 'react-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withDrawer from '../../hocs/with-drawer.hoc';

import ReportGeneration from '../../libs/reporting/ReportGeneration.component';

import {
  reports,
  reportResult,
  reportMetadata,
  urls,
} from '../../resources/reporting';

import type {
  ReportConfiguration,
  ReportExtractResult,
  ReportMetadata,
} from '../../libs/reporting/types';

type Props = {
  report: ReportConfiguration,
  result: ReportExtractResult,
  metadata: ReportMetadata,
  exportLink: string,
  fetchReports: () => void,
  fetchReportMetadata: () => void,
  handleGenerate: () => void,
  dateRange: *,
};

export class ReportingGeneration extends React.Component<Props> {
  state = { loading: true };

  componentWillMount() {
    const { dateRange } = this.props;
    this.props.fetchReports();
    this.props.fetchReportMetadata();
    this.props.handleGenerate(dateRange);
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    const {
      report,
      result,
      handleGenerate,
      exportLink,
      metadata,
      dateRange,
    } = this.props;

    return (
      <ReportGeneration
        dateRange={dateRange}
        report={report}
        metadata={metadata}
        resultLoading={report.loading || result.loading || this.state.loading}
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
      metadata: reportMetadata.selectors.get(state),
    }),
    {
      fetchReportMetadata: reportMetadata.effects.get,
      fetchReports: reports.effects.fetchAll,
      fetchExtractResult: reportResult.effects.generate,
    },
  ),
  withState('dateRange', 'setDateRange', {
    dateStart: moment().subtract(7, 'days'),
    dateEnd: moment(),
  }),
  withState('exportLink', 'setExportLink', null),
  withProps(
    ({ id, fetchExtractResult, result, setExportLink, setDateRange }) => ({
      handleGenerate({ dateStart, dateEnd }, options) {
        setDateRange({ dateStart, dateEnd });
        fetchExtractResult(id, { dateStart, dateEnd }, options);
        const params = { fileformat: 'xlsx', dateStart, dateEnd };
        const exportLink = result && urls.export(id, params);
        setExportLink(exportLink);
      },
    }),
  ),
  withDrawer(({ report }) => (report && report.name) || ''),
)(ReportingGeneration);

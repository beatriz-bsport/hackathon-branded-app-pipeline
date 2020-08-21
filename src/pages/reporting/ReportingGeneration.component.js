// @flow

import moment from 'moment';
import React from 'react';

import { compose, withProps, withState } from 'recompose';

import { connect } from 'react-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

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
};

export class ReportingGeneration extends React.Component<Props> {
  state = { loading: true };

  componentWillMount() {
    this.props.fetchReports();
    this.props.fetchReportMetadata();
  }

  componentDidMount() {
    this.setState({ loading: false });
    this.props.fetchReports();
    this.props.fetchReportMetadata();
    if (this.props.report.date_start) {
      const dateStart = moment(this.props.report.date_start);
      const dateEnd = moment(this.props.report.date_end);
      this.props.handleGenerate({ dateStart, dateEnd });
    }
  }

  componentDidUpdate(prevProps) {
    if (!!this.props.report.date_start && !prevProps.report.date_start) {
      const dateStart = moment(this.props.report.date_start);
      const dateEnd = moment(this.props.report.date_end);
      this.props.handleGenerate({ dateStart, dateEnd });
      this.props.fetchReports();
      this.props.fetchReportMetadata();
    }
  }

  render() {
    const { report, result, handleGenerate, exportLink, metadata } = this.props;

    return (
      <div>
        <ReportGeneration
          report={report}
          metadata={metadata}
          resultLoading={report.loading || result.loading || this.state.loading}
          result={result.value}
          handleGenerate={handleGenerate}
          exportLink={exportLink}
        />
      </div>
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
  withState('exportLink', 'setExportLink', null),
  withProps(({ id, fetchExtractResult, result, setExportLink, report }) => ({
    handleGenerate({ dateStart, dateEnd }, options) {
      fetchExtractResult(
        id,
        report.date_type === 'range'
          ? {
              dateStart: dateStart.format('YYYY-MM-DD'),
              dateEnd: dateEnd.clone().format('YYYY-MM-DD'),
            }
          : {
              dateStart: dateStart.format('YYYY-MM-DD'),
            },
        options,
      );
      const params = {
        fileformat: 'xlsx',
        dateStart: dateStart.format('YYYY-MM-DD'),
        dateEnd: dateEnd.clone().format('YYYY-MM-DD'),
      };
      const exportLink = result && urls.export(id, params);
      setExportLink(exportLink);
    },
  })),
  withTitle(({ report }) => (report && report.name) || ''),
)(ReportingGeneration);

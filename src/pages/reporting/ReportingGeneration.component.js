// @flow

import moment from 'moment-timezone';
import React from 'react';

import { compose, withState, withHandlers } from 'recompose';

import { connect } from 'react-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import ReportGeneration from '../../libs/reporting/ReportGeneration.component';

import { reports, reportMetadata, urls } from '../../resources/reporting';

import {
  fetchReportGeneration,
  fetchReportHeaders,
} from '../../libs/reporting/actions';

import type {
  ReportConfiguration,
  ReportMetadata,
} from '../../libs/reporting/types';
import {
  getReportRows,
  getReportRowsLoading,
  getNextPage,
  getPreviousPage,
  getOtherPages,
  getReportHeaders,
  getReportHeadersLoading,
} from '../../libs/reporting/selectors';

type Props = {
  loading: boolean,
  report: ReportConfiguration,
  metadata: ReportMetadata,
  exportLink: string,
  fetchReports: () => void,
  fetchReportMetadata: () => void,
  handleGenerate: (*) => void,
  handleGeneratePreviousPage: (*) => void,
  handleGenerateNextPage: (*) => void,
  reportStoreRows: Array<object>,
  reportStoreRowsLoading: boolean,
  previousPage: number,
  nextPage: number,
  otherPages: Array<number>,
  pageSize: number,
  handleGenerateHeaders: (*) => void,
  reportHeadersLoading: boolean,
  reportHeaders: object,
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
      this.props.handleGenerateHeaders();
    }
  }

  componentDidUpdate(prevProps) {
    if (!!this.props.report.date_start && !prevProps.report.date_start) {
      const dateStart = moment(this.props.report.date_start);
      const dateEnd = moment(this.props.report.date_end);
      this.props.handleGenerate({ dateStart, dateEnd });
      this.props.fetchReports();
      this.props.fetchReportMetadata();
      this.props.handleGenerateHeaders();
    }
  }

  render() {
    const {
      report,
      handleGenerate,
      handleGeneratePreviousPage,
      handleGenerateNextPage,
      handleGenerateHeaders,
      reportHeaders,
      reportHeadersLoading,
      exportLink,
      metadata,
      reportStoreRows,
      reportStoreRowsLoading,
      previousPage,
      nextPage,
      otherPages,
      pageSize,
    } = this.props;
    return (
      <div>
        <ReportGeneration
          report={report}
          metadata={metadata}
          resultLoading={
            report.loading || reportStoreRowsLoading || this.state.loading
          }
          result={reportStoreRows}
          handleGenerate={handleGenerate}
          handleGeneratePreviousPage={handleGeneratePreviousPage}
          handleGenerateNextPage={handleGenerateNextPage}
          exportLink={exportLink}
          previousPage={previousPage}
          nextPage={nextPage}
          otherPages={otherPages}
          pageSize={pageSize}
          reportStoreRowsLoading={reportStoreRowsLoading}
          handleGenerateHeaders={handleGenerateHeaders}
          reportHeaders={reportHeaders}
          reportHeadersLoading={reportHeadersLoading}
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
      metadata: reportMetadata.selectors.get(state),
      reportStoreRows: getReportRows(state, id),
      reportStoreRowsLoading: getReportRowsLoading(state),
      nextPage: getNextPage(state, id),
      previousPage: getPreviousPage(state, id),
      otherPages: getOtherPages(state, id),
      pageSize: state.reports.page_size,
      reportHeaders: getReportHeaders(state, id),
      reportHeadersLoading: getReportHeadersLoading(state),
    }),
    {
      fetchReportMetadata: reportMetadata.effects.get,
      fetchReports: reports.effects.fetchAll,
      fetchExtractResult: fetchReportGeneration,
      fecthRelatedHeaders: fetchReportHeaders,
    },
  ),
  withState('exportLink', 'setExportLink', null),
  withHandlers({
    handleGenerate: ({
      id,
      fetchExtractResult,
      setExportLink,
      report,
      pageSize,
    }) => ({ dateStart, dateEnd, page }, options) => {
      fetchExtractResult(
        id,
        report.date_type === 'range'
          ? {
              date_start: dateStart.format('YYYY-MM-DD'),
              date_end: dateEnd.clone().format('YYYY-MM-DD'),
              page_size: pageSize,
              page: page || 1,
            }
          : {
              date_start: dateStart.format('YYYY-MM-DD'),
              page_size: pageSize,
              page: page || 1,
            },
        options,
      );
      const params = {
        fileformat: 'xlsx',
        dateStart: dateStart.format('YYYY-MM-DD'),
        dateEnd: dateEnd.clone().format('YYYY-MM-DD'),
      };
      const exportLink = report && urls.export(id, params);
      setExportLink(exportLink);
    },
  }),
  withHandlers({
    handleGenerateHeaders: ({ id, fecthRelatedHeaders }) => (options) => {
      fecthRelatedHeaders(id, options);
    },
  }),
  withHandlers({
    handleGeneratePreviousPage: ({ handleGenerate, report, previousPage }) => (
      { dateStart, dateEnd },
      options,
    ) => {
      handleGenerate(
        {
          dateStart: dateStart || moment(report.date_start),
          dateEnd: dateEnd || moment(report.date_end),
          page: previousPage,
        },
        options,
      );
    },
  }),
  withHandlers({
    handleGenerateNextPage: ({ handleGenerate, report, nextPage }) => (
      { dateStart, dateEnd },
      options,
    ) => {
      handleGenerate(
        {
          dateStart: dateStart || moment(report.date_start),
          dateEnd: dateEnd || moment(report.date_end),
          page: nextPage,
        },
        options,
      );
    },
  }),
  withTitle(({ report }) => (report && report.name) || ''),
)(ReportingGeneration);

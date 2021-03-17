// @flow

import moment from 'moment-timezone';
import React from 'react';

import { compose, withProps, withState } from 'recompose';

import { connect } from 'react-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import ReportGeneration from '../../libs/reporting/ReportGeneration.component';

import { reports, reportMetadata, urls } from '../../resources/reporting';

import { fetchReportGeneration } from '../../libs/reporting/actions';

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
} from '../../libs/reporting/selectors';

type Props = {
  report: ReportConfiguration,
  metadata: ReportMetadata,
  exportLink: string,
  fetchReports: () => void,
  fetchReportMetadata: () => void,
  handleGenerate: (*) => void,
  handleGeneratePreviousPage: () => void,
  handleGenerateNextPage: () => void,
  reportStoreRows: Array<object>,
  reportStoreRowsLoading: boolean,
  previousPage: number,
  nextPage: number,
  otherPages: Array,
  pageSize: number,
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
    const {
      report,
      handleGenerate,
      handleGeneratePreviousPage,
      handleGenerateNextPage,
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
      reportStoreRows: getReportRows(state),
      reportStoreRowsLoading: getReportRowsLoading(state),
      nextPage: getNextPage(state),
      previousPage: getPreviousPage(state),
      otherPages: getOtherPages(state),
      pageSize: state.reports.page_size,
    }),
    {
      fetchReportMetadata: reportMetadata.effects.get,
      fetchReports: reports.effects.fetchAll,
      fetchExtractResult: fetchReportGeneration,
    },
  ),
  withState('exportLink', 'setExportLink', null),
  withProps(
    ({
      id,
      fetchExtractResult,
      reportStoreRows,
      setExportLink,
      report,
      pageSize,
    }) => ({
      handleGenerate({ dateStart, dateEnd, page }, options) {
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
        const exportLink = reportStoreRows && urls.export(id, params);
        setExportLink(exportLink);
      },
    }),
  ),
  withProps(({ report, previousPage, nextPage, handleGenerate }) => ({
    handleGeneratePreviousPage({ dateStart, dateEnd }, options) {
      handleGenerate(
        {
          dateStart: dateStart || moment(report.date_start),
          dateEnd: dateEnd || moment(report.date_end),
          page: previousPage,
        },
        options,
      );
    },
    handleGenerateNextPage({ dateStart, dateEnd }, options) {
      handleGenerate(
        {
          dateStart: dateStart || moment(report.date_start),
          dateEnd: dateEnd || moment(report.date_end),
          page: nextPage,
        },
        options,
      );
    },
  })),
  withTitle(({ report }) => (report && report.name) || ''),
)(ReportingGeneration);

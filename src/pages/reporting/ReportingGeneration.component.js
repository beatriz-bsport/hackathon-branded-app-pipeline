// @flow

import moment from 'moment-timezone';
import React from 'react';

import { compose, withState, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import ReportGeneration from '../../libs/reporting/ReportGeneration.component';

import { reports, reportMetadata } from '../../resources/reporting';

import {
  fetchReportGeneration,
  fetchReportHeaders,
  exportExcelReport,
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
  handleGenerate: () => void,
  handleExcelExportation: () => void,
  showDialog: boolean,
  setShowDialog: (boolean: boolean) => void,
  disableContinue: boolean,
  setDisableContinue: (boolean: boolean) => void,
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
      this.handleGenerate({ dateStart, dateEnd });
    }
  }

  componentDidUpdate(prevProps) {
    if (!!this.props.report.date_start && !prevProps.report.date_start) {
      const dateStart = moment(this.props.report.date_start);
      const dateEnd = moment(this.props.report.date_end);
      this.handleGenerate({ dateStart, dateEnd });
      this.props.fetchReports();
      this.props.fetchReportMetadata();
    }
  }

  handleGenerate = (params) => {
    this.props.handleGenerate(params, {
      onSuccess: () =>
        this.props.handleGenerateHeaders({
          date_start: moment(params.dateStart).format('YYYY-MM-DD'),
          date_end: moment(params.dateEnd).format('YYYY-MM-DD'),
        }),
    });
  };

  render() {
    const {
      report,
      handleGeneratePreviousPage,
      handleGenerateNextPage,
      reportHeaders,
      reportHeadersLoading,
      metadata,
      reportStoreRows,
      reportStoreRowsLoading,
      previousPage,
      nextPage,
      otherPages,
      pageSize,
      handleExcelExportation,
      showDialog,
      setShowDialog,
      disableContinue,
      setDisableContinue,
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
          handleGenerate={this.handleGenerate}
          handleGeneratePreviousPage={handleGeneratePreviousPage}
          handleGenerateNextPage={handleGenerateNextPage}
          handleExcelExportation={handleExcelExportation}
          previousPage={previousPage}
          nextPage={nextPage}
          otherPages={otherPages}
          pageSize={pageSize}
          reportStoreRowsLoading={reportStoreRowsLoading}
          reportHeaders={reportHeaders}
          reportHeadersLoading={reportHeadersLoading}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          setDisableContinue={setDisableContinue}
          disableContinue={disableContinue}
        />
      </div>
    );
  }
}

export default compose(
  withTranslation(),
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
      fetchExcelReport: exportExcelReport,
    },
  ),
  withState('showDialog', 'setShowDialog', false),
  withState('disableContinue', 'setDisableContinue', true),
  withHandlers({
    handleGenerate: ({ id, fetchExtractResult, report, pageSize }) => (
      { dateStart, dateEnd, page },
      options,
    ) => {
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
  withHandlers({
    handleExcelExportation: ({
      id,
      t,
      report,
      fetchExcelReport,
      setShowDialog,
      setDisableContinue,
    }) => (values) => {
      setShowDialog(true);
      const backgroundDialog = {
        message: t('reporting:export.ready', { name: report.name }),
        title: t('reporting:export.category', { category: report.category }),
      };
      const params = {
        fileformat: 'xlsx',
        date_start: values.dateStart.format('YYYY-MM-DD'),
        date_end: values.dateEnd.format('YYYY-MM-DD'),
      };
      setTimeout(() => setDisableContinue(false), 5000);
      fetchExcelReport(id, params, {
        backgroundDialog,
        closeInitialDialog: () => setShowDialog(false),
      });
    },
  }),
  withTitle(({ report }) => (report && report.name) || ''),
)(ReportingGeneration);

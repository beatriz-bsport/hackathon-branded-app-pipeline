import moment from 'moment-timezone';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import ReportGeneration from '../../libs/reporting/ReportGeneration.component';

import {
  fetchReportGeneration,
  fetchReportHeaders,
  exportExcelReport,
  fetchReportMetadata as fetchReportMetadataAction,
  fetchReports as fetchReportsAction,
} from '../../libs/reporting/actions';

import { ReportConfiguration } from '../../libs/reporting/types';

import {
  getReportRows,
  getReportRowsLoading,
  getNextPage,
  getPreviousPage,
  getOtherPages,
  getReportHeaders,
  getReportHeadersLoading,
  getReportMetadata,
  getReports,
  getReport,
} from '../../libs/reporting/selectors';
import { RootState } from '../../reducers';

type OwnProps = {
  id: number;
};

type State = {
  showDialog: boolean;
  disableContinue: boolean;
};

type Props = OwnProps & ConnectedProps<typeof connector> & WithTranslation;

export class ReportingGeneration extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showDialog: false,
      disableContinue: true,
    };
  }

  componentWillMount() {
    this.props.fetchReports();
    this.props.fetchReportMetadata();
  }

  componentDidMount() {
    this.props.fetchReports();
    this.props.fetchReportMetadata();
    if (this.props.report.date_start) {
      const dateStart = moment(this.props.report.date_start);
      const dateEnd = moment(this.props.report.date_end);
      this.handleGenerate({ dateStart, dateEnd });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!!this.props.report.date_start && !prevProps.report.date_start) {
      const dateStart = moment(this.props.report.date_start);
      const dateEnd = moment(this.props.report.date_end);
      this.handleGenerate({ dateStart, dateEnd });
      this.props.fetchReports();
      this.props.fetchReportMetadata();
    }
  }

  setShowDialog = (showDialog: boolean) => {
    this.setState({ showDialog });
  };

  setDisableContinue = (disableContinue: boolean) => {
    this.setState({ disableContinue });
  };

  handleGenerate = (values: {
    dateStart: moment.Moment;
    dateEnd: moment.Moment;
    page?: number;
  }) => {
    this.handleGenerateHeaders({
      dateStart: values.dateStart.format('YYYY-MM-DD'),
      dateEnd: values.dateEnd.format('YYYY-MM-DD'),
    });
    this.props.fetchExtractResult(
      this.props.id,
      this.props.report?.date_type === 'range'
        ? {
            date_start: values.dateStart.format('YYYY-MM-DD'),
            date_end: values.dateEnd.format('YYYY-MM-DD'),
            page_size: this.props.pageSize,
            page: values.page || 1,
          }
        : {
            date_start: values.dateStart.format('YYYY-MM-DD'),
            page_size: this.props.pageSize,
            page: values.page || 1,
          },
    );
  };

  handleGenerateHeaders = (params?: { dateStart: string; dateEnd: string }) => {
    this.props.fecthRelatedHeaders(this.props.id, params);
  };

  handleGeneratePreviousPage = (values: {
    dateStart: moment.Moment;
    dateEnd: moment.Moment;
  }) => {
    this.handleGenerate({
      dateStart: values.dateStart || moment(this.props.report.date_start),
      dateEnd: values.dateEnd || moment(this.props.report.date_end),
      page: this.props.previousPage,
    });
  };

  handleGenerateNextPage = (values: {
    dateStart: moment.Moment;
    dateEnd: moment.Moment;
  }) => {
    this.handleGenerate({
      dateStart: values.dateStart || moment(this.props.report.date_start),
      dateEnd: values.dateEnd || moment(this.props.report.date_end),
      page: this.props.nextPage,
    });
  };

  handleExcelExportation = (values: {
    dateStart: moment.Moment;
    dateEnd: moment.Moment;
  }) => {
    this.setState({
      showDialog: false,
    });
    const backgroundDialog = {
      message: this.props.t('reporting:export.ready', {
        name: this.props.report.name,
      }),
      title: this.props.t('reporting:export.category', {
        category: this.props.t(
          `reporting:categories.${this.props.report.category}`,
        ),
      }),
    };
    const params = {
      fileformat: 'xlsx',
      date_start: values.dateStart.format('YYYY-MM-DD'),
      date_end: values.dateEnd.format('YYYY-MM-DD'),
    };

    setTimeout(() => {
      this.setState({
        disableContinue: false,
      });
    }, 5000);

    this.props.fetchExcelReport(this.props.id, params, {
      backgroundDialog,
      closeInitialDialog: () => {
        this.setState({
          showDialog: false,
        });
      },
    });
  };

  render() {
    const {
      report,
      reportHeaders,
      reportHeadersLoading,
      metadata,
      resultLoading,
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
            resultLoading || reportStoreRowsLoading || metadata.loading
          }
          result={reportStoreRows}
          handleGenerate={this.handleGenerate}
          handleGeneratePreviousPage={this.handleGeneratePreviousPage}
          handleGenerateNextPage={this.handleGenerateNextPage}
          handleExcelExportation={this.handleExcelExportation}
          previousPage={previousPage}
          nextPage={nextPage}
          otherPages={otherPages}
          pageSize={pageSize}
          reportStoreRowsLoading={reportStoreRowsLoading}
          reportHeaders={reportHeaders}
          reportHeadersLoading={reportHeadersLoading}
          showDialog={this.state.showDialog}
          setShowDialog={this.setShowDialog}
          setDisableContinue={this.setDisableContinue}
          disableContinue={this.state.disableContinue}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, props: { id: number }) => ({
    resultLoading: getReports(state).loading,
    report: getReport(state, props.id),
    metadata: getReportMetadata(state),
    pageSize: state.reports.page_size,
    reportStoreRows: getReportRows(state, props.id),
    reportStoreRowsLoading: getReportRowsLoading(state),
    nextPage: getNextPage(state, props.id),
    previousPage: getPreviousPage(state, props.id),
    otherPages: getOtherPages(state, props.id),
    reportHeaders: getReportHeaders(state, props.id),
    reportHeadersLoading: getReportHeadersLoading(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    fetchExtractResult: fetchReportGeneration,
    fecthRelatedHeaders: fetchReportHeaders,
    fetchExcelReport: exportExcelReport,
  },
);

export default compose(
  withTranslation(),
  routerParamsToProps({ reportId: 'id:number' }),
  connector,
  withTitle(
    (value: { report: ReportConfiguration }) => value?.report?.name ?? '',
  ),
)(ReportingGeneration);

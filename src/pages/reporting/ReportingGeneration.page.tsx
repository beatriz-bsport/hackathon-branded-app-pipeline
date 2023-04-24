// @ts-nocheck
import moment from 'moment-timezone';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import ReportGeneration from '#libs/reporting/components/ReportGeneration.component';

import {
  fetchReportGeneration,
  fetchReportHeaders,
  exportExcelReport,
  fetchReportMetadata as fetchReportMetadataAction,
  fetchReports as fetchReportsAction,
  createReportFilterConfig as createReportFilterConfigAction,
  editReportFilterConfig as editReportFilterConfigAction,
  fetchReportFilterConfigList as fetchReportFilterConfigListAction,
  deleteReportFilterConfig as deleteReportFilterConfigAction,
} from '#libs/reporting/actions';

import { ReportConfiguration } from '#libs/reporting/types';
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
  getReportFilterConfigList,
} from '#libs/reporting/selectors';

import withDatatypeDynamicData, {
  withDatatypeDynamicDataProps,
} from '#libs/datatype-filtering/dynamic-data-hoc';

import { RootState } from '../../reducers';

type OwnProps = {
  id: number;
  isFranchisor?: boolean;
};

type State = {
  showDialog: boolean;
  disableContinue: boolean;
  dateStart: string;
  dateEnd: string;
  reportFilterConfigId: number | null;
  timePeriod: string;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithTranslation &
  withDatatypeDynamicDataProps;

export class ReportingGeneration extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showDialog: false,
      disableContinue: true,
      dateStart: moment(props.report.date_start).unix(),
      dateEnd: moment(props.report.date_end).unix(),
      reportFilterConfigId: props.report.report_filter_config_id,
      timePeriod: props.report.time_period,
    };
  }

  componentDidMount() {
    this.props.resetDynamicDataHasBeenLoaded();
    this.props.fetchReports();
    this.props.fetchReportMetadata();
    this.props.fetchReportFilterConfigList({
      report_id_in: [this.props.id],
      page_size: null,
    });
    if (!this.props.isFranchisor && this.props.report.date_start) {
      this.handleGenerate({
        dateStart: this.props.report.date_start,
        dateEnd: this.props.report.date_end,
        reportFilterConfigId: this.props.report.report_filter_config_id,
        timePeriod: this.props.report.time_period,
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !this.props.isFranchisor &&
      !!this.props.report.date_start &&
      !prevProps.report.date_start
    ) {
      this.handleGenerate({
        dateStart: this.props.report.date_start,
        dateEnd: this.props.report.date_end,
        reportFilterConfigId: this.props.report.report_filter_config_id,
        timePeriod: this.props.report.time_period || 'custom',
      });
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
    dateStart: string;
    dateEnd: string;
    reportFilterConfigId: number;
    timePeriod: string;
    page?: number;
  }) => {
    const date_start = moment(values.dateStart).format('YYYY-MM-DD');
    const date_end = moment(values.dateEnd).format('YYYY-MM-DD');
    this.setState({
      dateStart: date_start,
      dateEnd: date_end,
      reportFilterConfigId: values.reportFilterConfigId,
      timePeriod: values.timePeriod,
    });

    this.handleGenerateHeaders({
      date_start,
      date_end,
      report_filter_config_id: values.reportFilterConfigId,
      time_period: values.timePeriod || 'custom',
    });
    this.props.fetchExtractResult(
      this.props.id,
      this.props.report?.date_type === 'range'
        ? {
            date_start,
            date_end,
            page_size: this.props.pageSize,
            page: values.page || 1,
            report_filter_config_id: values.reportFilterConfigId,
            time_period: values.timePeriod || 'custom',
          }
        : {
            date_start,
            page_size: this.props.pageSize,
            page: values.page || 1,
            report_filter_config_id: values.reportFilterConfigId,
            time_period: values.timePeriod || 'custom',
          },
    );
  };

  handleGenerateHeaders = (params?: {
    date_start: string;
    date_end: string;
    report_filter_config_id: number | null;
    time_period: string;
  }) => {
    this.props.fecthRelatedHeaders(this.props.id, params);
  };

  handleGeneratePreviousPage = () => {
    this.handleGenerate({
      dateStart: this.state.dateStart || this.props.report.date_start,
      dateEnd: this.state.dateEnd || this.props.report.date_end,
      reportFilterConfigId:
        this.state.reportFilterConfigId ||
        this.props.report.report_filter_config_id,
      timePeriod: this.state.timePeriod || this.props.report.time_period,
      page: this.props.previousPage,
    });
  };

  handleGenerateNextPage = () => {
    this.handleGenerate({
      dateStart: this.state.dateStart || this.props.report.date_start,
      dateEnd: this.state.dateEnd || this.props.report.date_end,
      reportFilterConfigId:
        this.state.reportFilterConfigId ||
        this.props.report.report_filter_config_id,
      timePeriod: this.state.timePeriod || this.props.report.time_period,
      page: this.props.nextPage,
    });
  };

  handleExcelExportation = (values: {
    dateStart: number;
    dateEnd: number;
    reportFilterConfigId: number;
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
      date_start: moment.unix(values.dateStart).format('YYYY-MM-DD'),
      date_end: moment.unix(values.dateEnd).format('YYYY-MM-DD'),
      report_filter_config_id: values.reportFilterConfigId,
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
          handleGetDynamicDataForReport={
            this.props.handleGetDynamicDataForFilters
          }
          reportFilterConfigs={this.props.reportFilterConfigs}
          createReportFilterConfig={this.props.createReportFilterConfig}
          editReportFilterConfig={this.props.editReportFilterConfig}
          fetchReportFilterConfigList={this.props.fetchReportFilterConfigList}
          deleteReportFilterConfig={this.props.deleteReportFilterConfig}
          isFranchisor={this.props.isFranchisor}
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
    reportFilterConfigs: getReportFilterConfigList(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    fetchExtractResult: fetchReportGeneration,
    fecthRelatedHeaders: fetchReportHeaders,
    fetchExcelReport: exportExcelReport,
    createReportFilterConfig: createReportFilterConfigAction,
    editReportFilterConfig: editReportFilterConfigAction,
    fetchReportFilterConfigList: fetchReportFilterConfigListAction,
    deleteReportFilterConfig: deleteReportFilterConfigAction,
  },
);

export default compose<any, OwnProps>(
  withTranslation(),
  routerParamsToProps({ reportId: 'id:number' }),
  connector,
  withDatatypeDynamicData,
  withTitle(
    (value: { report: ReportConfiguration }) => value?.report?.name ?? '',
  ),
)(ReportingGeneration);

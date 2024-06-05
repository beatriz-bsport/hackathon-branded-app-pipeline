import { DateTime } from 'luxon';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';


import ReportGeneration from '#libs/reporting/components/ReportGeneration.component';

import {
  fetchSerializedReport,
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
import { fetchCompanyRoles as fetchCompanyRolesAction } from '#libs/role/actions';
import { getObjectPermissions, getPermissions } from '#libs/role/selectors';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
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
  timeStart?: string;
  timeEnd?: string;
  timeWindowPeriod?: string;
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
      dateStart: props.report.date_start || DateTime.now().toISODate(),
      dateEnd: props.report.date_end || DateTime.now().toISODate(),
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
        timeStart: this.props.report.time_window_start,
        timeEnd: this.props.report.time_window_end,
        timeWindowPeriod: 'custom',
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
        timeStart: this.props.report.time_window_start,
        timeEnd: this.props.report.time_window_end,
        timeWindowPeriod: 'custom',
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
    timeStart: string;
    timeEnd: string;
    dateStart: string;
    dateEnd: string;
    reportFilterConfigId: number;
    timePeriod: string;
    page?: number;
    timeWindowPeriod?: string;
  }) => {
    // remove seconds as per product requirement
    const time_window_start = DateTime.fromISO(values.timeStart).toFormat(
      'HH:mm',
    );
    const time_window_end = DateTime.fromISO(values.timeEnd).toFormat('HH:mm');

    const date_start = values.dateStart;
    const date_end = values.dateEnd;

    this.setState({
      dateStart: date_start,
      dateEnd: date_end,
      reportFilterConfigId: values.reportFilterConfigId,
      timePeriod: values.timePeriod,
      timeEnd: time_window_end,
      timeStart: time_window_start,
      timeWindowPeriod: values.timeWindowPeriod,
    });

    this.handleGenerateHeaders({
      date_start,
      date_end,
      // @ts-expect-error
      time_window_start,
      time_window_end,
      report_filter_config_id: values.reportFilterConfigId,
      time_period: values.timePeriod || 'custom',
    });
    this.props.fetchExtractResult(
      this.props.id,
      this.props.report?.date_type === 'range'
        ? {
            date_start,
            date_end,
            // @ts-expect-error
            time_window_start,
            time_window_end,
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
      timeStart: this.state.timeStart || this.props.report.time_start,
      timeEnd: this.state.timeEnd || this.props.report.time_end,
      timeWindowPeriod:
        this.state.timeWindowPeriod || this.props.report.time_window_period,
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
      timeStart: this.state.timeStart || this.props.report.time_start,
      timeEnd: this.state.timeEnd || this.props.report.time_end,
      timeWindowPeriod:
        this.state.timeWindowPeriod || this.props.report.time_window_period,
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
    dateStart: string;
    dateEnd: string;
    timeStart?: string;
    timeEnd?: string;
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
      date_start: values.dateStart,
      date_end: values.dateEnd,
      time_window_start: values?.timeStart ?? '',
      time_window_end: values?.timeEnd ?? '',
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
      reportsLoading,
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
          createReportFilterConfig={this.props.createReportFilterConfig}
          deleteReportFilterConfig={this.props.deleteReportFilterConfig}
          disableContinue={this.state.disableContinue}
          editReportFilterConfig={this.props.editReportFilterConfig}
          fetchReportFilterConfigList={this.props.fetchReportFilterConfigList}
          // @ts-expect-error
          handleExcelExportation={this.handleExcelExportation}
          handleGenerate={this.handleGenerate}
          handleGenerateNextPage={this.handleGenerateNextPage}
          handleGeneratePreviousPage={this.handleGeneratePreviousPage}
          // @ts-expect-error
          handleGetDynamicDataForReport={
            this.props.handleGetDynamicDataForFilters
          }
          isFranchisor={this.props.isFranchisor}
          // @ts-expect-error
          metadata={metadata}
          nextPage={nextPage}
          objectLevelPermissions={this.props.objectLevelPermissions}
          otherPages={otherPages}
          pageSize={pageSize}
          previousPage={previousPage}
          report={report}
          reportFilterConfigs={this.props.reportFilterConfigs}
          reportHeaders={reportHeaders}
          reportHeadersLoading={reportHeadersLoading}
          reportStoreRows={reportStoreRows}
          reportStoreRowsLoading={reportStoreRowsLoading}
          resultLoading={
            reportsLoading || reportStoreRowsLoading || metadata.loading
          }
          setDisableContinue={this.setDisableContinue}
          setShowDialog={this.setShowDialog}
          showDialog={this.state.showDialog}
          userPermissions={this.props.userPermissions}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, props: { id: number }) => ({
    reportsLoading: getReports(state).loading,
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
    userPermissions: getPermissions(state),
    objectLevelPermissions: getObjectPermissions(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    fetchExtractResult: fetchSerializedReport,
    fecthRelatedHeaders: fetchReportHeaders,
    fetchExcelReport: exportExcelReport,
    createReportFilterConfig: createReportFilterConfigAction,
    editReportFilterConfig: editReportFilterConfigAction,
    fetchReportFilterConfigList: fetchReportFilterConfigListAction,
    deleteReportFilterConfig: deleteReportFilterConfigAction,
    fetchCompanyRoles: fetchCompanyRolesAction,
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

import moment from 'moment-timezone';
import React, { Component } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

import ReportGeneration from '../../libs/reporting/components/ReportGeneration.component';

import {
  fetchReportGeneration,
  fetchReportHeaders,
  exportExcelReport,
  fetchReportMetadata as fetchReportMetadataAction,
  fetchReports as fetchReportsAction,
  setDynamicDataHasBeenLoaded as setDynamicDataHasBeenLoadedAction,
  resetDynamicDataHasBeenLoaded as resetDynamicDataHasBeenLoadedAction,
  createReportFilterConfig as createReportFilterConfigAction,
  editReportFilterConfig as editReportFilterConfigAction,
  fetchReportFilterConfigList as fetchReportFilterConfigListAction,
  deleteReportFilterConfig as deleteReportFilterConfigAction,
} from '../../libs/reporting/actions';

import {
  DynamicFilterDataType,
  ReportConfiguration,
} from '../../libs/reporting/types';

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
  getDynamicDataLoading,
  getDynamicDataHasBeenLoaded,
  getReportFilterConfigList,
} from '../../libs/reporting/selectors';
import { RootState } from '../../reducers';
import { fetchAllActivities as fetchAllActivitiesAction } from '#libs/meta-activity/actions';
import { refreshFilteredMembers as refreshFilteredMembersAction } from '#libs/member/actions';
import { fetchAllPaymentPacks as fetchAllPaymentPacksAction } from '#libs/payment-packs/actions';
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishments as fetchEstablishmentsAction,
} from '#libs/establishment/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#libs/associated-coach/actions';
import {
  fetchAllPrivateServices as fetchAllPrivateServicesAction,
  fetchAllPrivateSlots as fetchAllPrivateSlotsAction,
  fetchPrivatePassList as fetchPrivatePassListAction,
} from '#libs/private-service/actions';
import { fetchGiftcardList as fetchGiftcardListAction } from '#libs/giftcard/actions';
import { fetchCoupons as fetchCouponsAction } from '#libs/coupon/actions';
import { fetchVideoList as fetchVideoListAction } from '#libs/video/actions';
import { fetchContractList as fetchContractListAction } from '#libs/subscription/actions';
import { getPageMetaActivities } from '#libs/meta-activity/selectors';
import { getAll as getAllPaymentPack } from '#libs/payment-packs/selectors';
import { getAllCoaches } from '#libs/associated-coach/selectors';
import {
  getAllEstablishments,
  getEstablishmentBillingroup,
} from '#libs/establishment/selectors';
import { getAllMembers } from '#libs/member/selectors';
import { getPrivatePassListBase } from '#libs/private-service/selectors/private-pass';
import { _getPrivateServices as getPrivateServices } from '#libs/private-service/selectors/private-service';
import { fetchAllSubShop as fetchAllSubShopAction } from '#libs/shop/actions/subshop';
import { getAllPrivateSlots } from '#libs/private-service/selectors/private-slot';
import { getAllGiftcardList } from '#libs/giftcard/selectors';
import { getAllCoupons } from '#libs/coupon/selectors';
import { getVideoList } from '#libs/video/selectors';
import { getAvailableContractList } from '#libs/subscription/selectors';
import { getTheme } from '#libs/theme/selectors';
import { getSubShopsByCompany } from '#libs/shop/selectors';

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

type Props = OwnProps & ConnectedProps<typeof connector> & WithTranslation;

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
    if (this.props.report.date_start) {
      this.handleGenerate({
        dateStart: this.props.report.date_start,
        dateEnd: this.props.report.date_end,
        reportFilterConfigId: this.props.report.report_filter_config_id,
        timePeriod: this.props.report.time_period,
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!!this.props.report.date_start && !prevProps.report.date_start) {
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

  handleGetDynamicDataForReport = (type: DynamicFilterDataType) => {
    if (
      !this.props.dynamicDataLoading[type] &&
      !this.props.dynamicDataHasBeenLoaded[type]
    ) {
      switch (type) {
        case 'activity':
          this.props.fetchAllActivities(
            {},
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('activity');
              },
            },
          );
          break;
        case 'payment_pack':
          this.props.fetchAllPaymentPacks({
            onSuccess: () => {
              this.props.setDynamicDataHasBeenLoaded('payment_pack');
            },
          });
          break;
        case 'coach':
          this.props.fetchAssociatedCoachesList(
            {},
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('coach');
              },
            },
          );
          break;
        case 'billing_establishment':
        case 'establishment':
          this.props.fetchEstablishments(
            {},
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('establishment');
                this.props.setDynamicDataHasBeenLoaded('billing_establishment');
              },
            },
          );
          break;

        case 'billing_group':
          this.props.fetchAllEstablishmentBillingGroup({
            onSuccess: () => {
              this.props.setDynamicDataHasBeenLoaded('billing_group');
            },
          });
          break;
        case 'private_service':
          this.props.fetchAllPrivateServices(
            { page_size: null },
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('private_service');
              },
            },
          );
          break;
        case 'private_slot':
          this.props.fetchAllPrivateSlots(
            { page_size: null, company: this.props.companyId },
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('private_slot');
              },
            },
          );
          break;

        case 'private_pass':
          this.props.fetchPrivatePassList(
            { page_size: null },
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('private_pass');
              },
            },
          );
          break;
        case 'giftcard':
          this.props.fetchGiftcardList(
            { page_size: null },
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('giftcard');
              },
            },
          );
          break;
        case 'coupon':
          this.props.fetchCoupons(
            { page_size: null },
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('coupon');
              },
            },
          );
          break;
        case 'video':
          this.props.fetchVideoList({ page_size: null }, 1, {
            onSuccess: () => {
              this.props.setDynamicDataHasBeenLoaded('video');
            },
          });
          break;

        case 'contract':
          this.props.fetchContractList(
            { page_size: null },
            {
              onSuccess: () => {
                this.props.setDynamicDataHasBeenLoaded('contract');
              },
            },
          );
          break;
        case 'subshop':
          this.props.fetchAllSubShop(this.props.companyId, {
            onSuccess: () => {
              this.props.setDynamicDataHasBeenLoaded('subshop');
            },
          });
          break;
        default:
      }
    }

    if (
      this.props.dynamicDataLoading[type] &&
      !this.props.dynamicDataHasBeenLoaded[type]
    ) {
      return null;
    }

    switch (type) {
      case 'activity':
        return this.props.metaActivities.map((m) => ({
          label: m.name,
          value: m.id,
        }));
      case 'payment_pack':
        return this.props.paymentPacks.map((p) => ({
          label: p.name,
          value: p.id,
        }));
      case 'coach':
        return this.props.coaches.map((c) => ({
          label: c.name,
          value: c.id,
        }));
      case 'billing_establishment':
        return this.props.establishments.map((e) => ({
          label: e.location.address,
          value: e.id,
        }));
      case 'establishment':
        return this.props.establishments.map((e) => ({
          label: e.title,
          value: e.id,
        }));
      case 'private_service':
        return this.props.privateServices.map((ps) => ({
          label: ps.name,
          value: ps.id,
        }));
      case 'private_slot':
        return this.props.privateSlots.map((ps) => ({
          label: ps.name,
          value: ps.id,
        }));
      case 'private_pass':
        return this.props.privatePasses
          .filter((pp) => pp.credits > 0)
          .map((pp) => ({
            label: pp.name,
            value: pp.id,
          }));
      case 'giftcard':
        return this.props.giftCards.map((gc) => ({
          label: gc.name,
          value: gc.id,
        }));
      case 'coupon':
        return this.props.coupons.map((c) => ({
          label: c.name,
          value: c.id,
        }));
      case 'video':
        return this.props.videos.map((v) => ({
          label: v.name,
          value: v.id,
        }));
      case 'billing_group':
        return this.props.billingGroups.map((bg) => ({
          label: bg.name,
          value: bg.id,
        }));
      case 'contract':
        return this.props.contracts.map((contract) => ({
          label: contract.name,
          value: contract.id,
        }));
      case 'subshop':
        return (
          this.props.subshops?.map((subshop) => ({
            label: subshop.name,
            value: subshop.id,
          })) ?? []
        );
      default:
        return [];
    }
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
          handleGetDynamicDataForReport={this.handleGetDynamicDataForReport}
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
    companyId: getTheme(state).company,
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
    dynamicDataLoading: getDynamicDataLoading(state),
    dynamicDataHasBeenLoaded: getDynamicDataHasBeenLoaded(state),
    metaActivities: getPageMetaActivities(state),
    paymentPacks: getAllPaymentPack(state),
    coaches: getAllCoaches(state),
    establishments: getAllEstablishments(state),
    users: getAllMembers(state),
    privatePasses: getPrivatePassListBase(state),
    privateServices: getPrivateServices(state),
    privateSlots: getAllPrivateSlots(state),
    giftCards: getAllGiftcardList(state),
    coupons: getAllCoupons(state),
    billingGroups: getEstablishmentBillingroup(state),
    videos: getVideoList(state),
    reportFilterConfigs: getReportFilterConfigList(state),
    contracts: getAvailableContractList(state),
    subshops: getSubShopsByCompany(state, getTheme(state).company),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    fetchExtractResult: fetchReportGeneration,
    fecthRelatedHeaders: fetchReportHeaders,
    fetchExcelReport: exportExcelReport,
    setDynamicDataHasBeenLoaded: setDynamicDataHasBeenLoadedAction,
    resetDynamicDataHasBeenLoaded: resetDynamicDataHasBeenLoadedAction,
    fetchAllActivities: fetchAllActivitiesAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    fetchEstablishments: fetchEstablishmentsAction,
    refreshFilteredMembers: refreshFilteredMembersAction,
    fetchAllPaymentPacks: fetchAllPaymentPacksAction,
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
    fetchAllPrivateServices: fetchAllPrivateServicesAction,
    fetchAllPrivateSlots: fetchAllPrivateSlotsAction,
    fetchPrivatePassList: fetchPrivatePassListAction,
    fetchGiftcardList: fetchGiftcardListAction,
    fetchCoupons: fetchCouponsAction,
    fetchVideoList: fetchVideoListAction,
    createReportFilterConfig: createReportFilterConfigAction,
    editReportFilterConfig: editReportFilterConfigAction,
    fetchReportFilterConfigList: fetchReportFilterConfigListAction,
    deleteReportFilterConfig: deleteReportFilterConfigAction,
    fetchContractList: fetchContractListAction,
    fetchAllSubShop: fetchAllSubShopAction,
  },
);

export default compose<any, OwnProps>(
  withTranslation(),
  routerParamsToProps({ reportId: 'id:number' }),
  connector,
  withTitle(
    (value: { report: ReportConfiguration }) => value?.report?.name ?? '',
  ),
)(ReportingGeneration);

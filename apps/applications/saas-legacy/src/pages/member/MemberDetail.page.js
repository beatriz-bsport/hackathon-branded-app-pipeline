// @flow
import React from 'react';
import Immutable from 'seamless-immutable';
import { Theme } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { v4 as uuid4 } from 'uuid';
import { compose, withHandlers, withState } from 'recompose';
import { fetchProgram as fetchProgramAction } from '#src/libs/performance-tracking/actions';
import { getProgramList } from '#src/libs/performance-tracking/selector';
import { fetchStripeReaders } from '#src/libs/terminal/actions';
import { getStripeReaders } from '#src/libs/terminal/selectors';
import type { StripeReader } from '#src/libs/terminal/types';
import MemberActions from '#src/libs/member/components/ManagerMemberActions.components';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#src/libs/payment/utils';
import CommunicationDrawer from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import { CONTEXT_MEMBER } from '#src/libs/communication-v2/constants';
import { getUnreadAnswersCount as getUnreadAnswersCountAction } from '#src/libs/communication-v2/actions';
import type { CommunicationContext } from '#src/libs/communication-v2/types';
import {
  BackgroundDialogDisplayMode,
  BackgroundDialogActionMode,
} from '#src/libs/background-dialog/types';
import withQueryParams from '#src/hocs/with-query-params.hoc';
import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { fetchManagerFiltersSettings } from '../../libs/dashboard/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import {
  getMember,
  getMemberDetail,
  getMemberArchiveStatus,
} from '../../libs/member/selectors';
import { getObjectPermissions } from '../../libs/role/selectors';
import {
  fetchCountObjects as fetchCountObjectsAction,
  archiveMember,
  unArchiveMember,
  interrogateMemberStatus,
  fetchMember,
} from '../../libs/member/actions';
import withTitle from '../../hocs/with-title.hoc';
import { withFeatureFlags } from '../../utils/feature-flag/withFeatureFlags';

import { getAvailableContractListWithPaymentPack } from '../../libs/subscription/selectors';
import SubscriptionContractRegister from '../../libs/subscription/components/SubscriptionContractRegister.component';
import asyncComponent from '../../AsyncComponent';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import InvoiceInfoDialog from '../../libs/invoice/components/InvoiceInfoDialog.component';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import { fetchNumberVideoPurchase } from '../../libs/video/actions';
import { checkInvoiceInfoActions } from '../../libs/invoice/actions';
import { fetchCompanyUserRoles as fetchCompanyUserRolesAction } from '../../libs/role/actions';
import {
  fetchContractList as fetchContractListAction,
  registerContractBackground as registerContractBackgroundAction,
} from '../../libs/subscription/actions';
import {
  displayBackgroundDialog as displayBackgroundDialogAction,
  deletebackgroundDialog as deletebackgroundDialogAction,
} from '../../libs/background-dialog/actions';

import type { Contract } from '../../libs/subscription/types';
import type { Member } from '../../libs/member/types';
import { getSignUpFormConfigurationDict } from '../../libs/sign-up-form/selectors';
import { fetchMemberCustomFormFilled } from '../../libs/custom-form/actions';
import {
  getMemberCustomFormFilled,
  excludeDraftCustomFormFilled,
} from '../../libs/custom-form/selectors';
import {
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup as fetchEstablishmentBillingGroupAction,
} from '../../libs/establishment/actions';
import {
  getEnabledEstablishmentBillingGroups,
  getStaffEstablishmentBillingGroupSelector,
} from '../../libs/establishment/selectors';
import type { CustomFormFilled } from '../../libs/custom-form/types';
import type { EstablishmentBillingGroup } from '../../libs/establishment/types';
import type { OptionCallback } from '../../state/types';
import MemberArchiveDialog from '../../libs/member/components/MemberArchiveDialog.component';
import { withMemberBannerHOC } from '../../hocs/banner.hoc';
import { ObjectLevelPermissions } from '../../libs/role/types';
import { hasObjectLevelPermission } from '../../libs/role/permission-utils/utils';

import Config from '../../config';

import { getStripeRegion, getCompanyCountry } from '../../libs/theme/selectors';

const MemberDetailInfo = asyncComponent(() =>
  import('./MemberDetailInfo.page'),
);
const MemberDetailPass = asyncComponent(() =>
  import('./MemberDetailPass.page'),
);
const MemberDetailRelation = asyncComponent(() =>
  import('./MemberDetailRelation.page'),
);
const MemberDetailBooking = asyncComponent(() =>
  import('./MemberDetailBooking.page'),
);
const MemberDetailVod = asyncComponent(() => import('./MemberDetailVod.page'));
const MemberDetailPayment = asyncComponent(() =>
  import('./MemberDetailPayment.page'),
);
const MemberDetailPrivateBooking = asyncComponent(() =>
  import('./MemberDetailPrivateBooking.page'),
);
const MemberDetailPrivateConsumerPass = asyncComponent(() =>
  import('./MemberDetailPrivateConsumerPass.page'),
);
const MemberDetailContact = asyncComponent(() =>
  import('./MemberDetailContact.page'),
);
const MemberDetailBasket = asyncComponent(() =>
  import('./MemberDetailBasket.page'),
);

const MemberCustomForm = asyncComponent(() =>
  import('./MemberCustomForm.page'),
);

const MemberDetailGiftcard = asyncComponent(() =>
  import('./MemberDetailGiftcard.page'),
);

const MemberDetailProgram = asyncComponent(() =>
  import('../performance-tracking/MemberProgramList.page'),
);

type Props = {
  theme: Theme,
  tab: string,
  id: number,
  member?: Member,
  pushToTab: (memberId: number, tab: string) => void,
  billMember: (id: number) => void,
  pushRouter: (path: string) => void,
  openContractDialog: () => void,
  contractList: Array<Contract>,
  contractLoading: boolean,
  contractToBill?: Contract,
  contractDialogOpen: boolean,
  closeContractDialog: () => void,
  setContractToBill: (Contract) => void,
  subscribeMember: (id: number) => void,
  invoiceInfo: any,
  resetInvoiceInfo: () => void,
  goToInvoice: (uuid: string) => void,

  requestSetupIntentSecret: () => void,
  fetchPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  fetchCountObjects: (id: number) => void,
  infosOfMember: dict,
  fetchFiltersSettings: () => void,
  fetchNumberVideoPurchase: () => void,
  videoPurchasedCount: number,
  managerFormConfig: SignUpFormConfigDict,
  customFormFilledList: Array<CustomFormFilled>,
  fetchMemberCustomFormFilled: (memberId: number) => void,
  fetchEstablishments: () => void,
  fetchEstablishmentBillingGroup: () => void,
  fetchMember: (id: number) => void,
  setOpenArchiveDialog: (b: boolean) => void,
  interrogateMemberStatus: (id: number, options?: OptionCallback) => void,
  archiveMember: (id: number, options?: OptionCallback) => void,
  unArchiveMember: (id: number, options?: OptionCallback) => void,
  openArchiveDialog: boolean,
  memberToArchive: Member,
  memberArchiveStatus: Array<number>,
  memberArchiveLoading: boolean,
  fetchProgram: (params: any) => void,
  programList: Array<PerformanceTrackingProgram>,
  fetchStripeReaders: () => void,
  fetchCompanyUserRoles: () => void,
  stripeReaders: StripeReader[],
  companyId: number,
  registerContractBackground: (
    id: string,
    data: any,
    options: OptionCallback,
  ) => void,
  queryParams: { openChat?: string },
  setQueryParams: (queryName: string) => (queryValue: string) => void,
  numberOfUnreadAnswers: number,
  getUnreadAnswersCountAction: (params: CommunicationContext) => void,
  pageHeight: number,
  objectLevelPermissions: ObjectLevelPermissions,
  establishmentBillingGroups?: EstablishmentBillingGroup,
  staffDefaultEstablishmentBillingGroup: EstablishmentBillingGroup | null,
  checkoutFlowModalEnabled?: boolean,
  pathname?: string,
  showRevampedSidebar?: boolean,
};

const getTabsData = (
  bookings: number,
  vod: number,
  pass: number,
  payment: number,
  relation: number,
  private_booking: number,
  private_consumer_pass: number,
  form: number,
  performance_tracking: number,
  is_member_pos: boolean,
  objectLevelPermissions: ObjectLevelPermissions,
) => {
  const tabsData = !is_member_pos
    ? [
        { label: 'tab.member.info', value: 'info' },
        {
          label: 'tab.member.bookings',
          value: 'bookings',
          count: bookings,
        },
        {
          label: 'tab.member.vod',
          value: 'vod',
          count: vod,
        },
        {
          label: 'tab.member.paymentPack',
          value: 'pass',
          count: pass,
        },
        ...(hasObjectLevelPermission(
          objectLevelPermissions,
          'billing.allowed_actions.readInvoices',
        )
          ? [
              {
                label: 'tab.member.payment',
                value: 'payment',
                count: payment,
              },
            ]
          : []),
        { label: 'tab.member.contact', value: 'contact' },
        {
          label: 'tab.member.relation',
          value: 'relation',
          count: relation,
        },
        {
          label: 'tab.member.privateBooking',
          value: 'private-booking',
          count: private_booking,
        },
        { label: 'tab.member.giftcard', value: 'giftcard' },
        {
          label: 'tab.member.privateConsumerPass',
          value: 'private-consumer-pass',
          count: private_consumer_pass,
        },
        ...(hasObjectLevelPermission(
          objectLevelPermissions,
          'member.allowed_actions.readInfo',
        )
          ? [
              {
                label: 'tab.member.form',
                value: 'form',
                count: form,
              },
            ]
          : []),
        { label: 'tab.member.basket', value: 'basket' },
      ]
    : [
        { label: 'tab.member.info', value: 'info' },
        {
          label: 'tab.member.payment',
          value: 'payment',
          count: payment,
        },
        { label: 'tab.member.giftcard', value: 'giftcard' },
        { label: 'tab.member.basket', value: 'basket' },
      ];
  if (performance_tracking) {
    const newTab = {
      label: 'tab.member.programs',
      value: 'performance-tracking',
    };
    tabsData.splice(3, 0, newTab);
    return tabsData;
  }
  return Immutable(tabsData);
};

export class MemberDetail extends React.Component<Props> {
  componentDidMount() {
    const params = {
      context_identifier: CONTEXT_MEMBER,
      context_object_id: this.props.id,
    };
    this.props.fetchStripeReaders();
    if (Number.isInteger(this.props.id)) {
      // @debt(3, 2, 2): Replace with /role/me to avoid fetching all roles.
      this.props.fetchCompanyUserRoles();
      this.props.fetchPaymentMethodList();
      this.props.fetchCountObjects(this.props.id);
      this.props.fetchFiltersSettings();
      this.props.fetchNumberVideoPurchase({ member_id: this.props.id });
      this.props.fetchMemberCustomFormFilled(this.props.id);
      this.props.fetchEstablishments();
      if (this.props.theme.enable_multi_localization) {
        this.props.fetchEstablishmentBillingGroup({
          params: {
            company: this.props.companyId,
          },
        });
      }
      this.props.fetchMember(this.props.id);

      this.props.fetchProgram({
        is_disabled: false,
      });
    }
    this.props.getUnreadAnswersCountAction(params);
  }

  componentDidUpdate(prevProps: OwnAndConnectedProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      const params = {
        context_identifier: CONTEXT_MEMBER,
        context_object_id: this.props.id,
      };
      this.props.getUnreadAnswersCountAction(params);
    }
  }

  archiveMember = () => {
    this.props.archiveMember(this.props.id, {
      onSuccess: () => {
        this.props.setOpenArchiveDialog(false);
        this.props.fetchMember(this.props.id);
      },
    });
  };

  unArchiveMember = () => {
    this.props.unArchiveMember(this.props.id, {
      onSuccess: () => this.props.fetchMember(this.props.id),
    });
  };

  interrogateMemberStatus = () => {
    this.props.setOpenArchiveDialog(true);
    this.props.interrogateMemberStatus(this.props.id, {
      onError: () => {
        this.props.setOpenArchiveDialog(false);
      },
    });
  };

  handleSubscribeMember = () => this.props.subscribeMember(this.props.id);

  handleOnContractRegisterSuccess = () => {
    this.props.closeContractDialog();
    this.props.pushToTab(this.props.id, 'payment');
  };

  handleBillMember = () => {
    if (
      this.props.checkoutFlowModalEnabled &&
      this.props.showRevampedSidebar &&
      this.props.pathname
    ) {
      const existingSearch =
        (typeof window !== 'undefined' && window.location.search) || '';
      const params = new URLSearchParams(existingSearch);
      params.set('cfOpen', '');
      params.set('cfTrigger', 'member_profile_page');
      params.set('memberId', this.props.id);
      this.props.pushRouter(`${this.props.pathname}?${params.toString()}`);
    } else {
      this.props.billMember(this.props.id);
    }
  };

  handleGoToInvoice = () => this.props.goToInvoice(this.props.invoiceInfo.uuid);

  handleMemberArchiveDialogClose = () => {
    this.props.setOpenArchiveDialog(false);
  };

  handleOnChange = (newTab: string) => {
    this.props.pushToTab(this.props.id, newTab);
    this.props.fetchCountObjects(this.props.id);
  };

  handleOpenCommunicationDrawer = () => {
    this.props.setQueryParams('openChat')('true');
  };

  handleCloseCommunicationDrawer = () => {
    this.props.setQueryParams('openChat')('null');
  };

  render() {
    const stripeRegion = getStripeRegion();
    const companyCountry = getCompanyCountry();

    const { tab, member, queryParams, pageHeight, numberOfUnreadAnswers } =
      this.props;

    const isOpenChat = queryParams.openChat === 'true';

    const tabsData = getTabsData(
      this.props.infosOfMember?.nb_reservations,
      this.props.videoPurchasedCount,
      this.props.infosOfMember?.nb_consumer_payment_pack,
      this.props.infosOfMember?.nb_invoices,
      this.props.infosOfMember?.nb_relations,
      this.props.infosOfMember?.nb_private_bookings,
      this.props.infosOfMember?.nb_private_consumer_pass,
      this.props.customFormFilledList?.length,
      this.props.programList?.length,
      this.props.member?.is_pos,
      this.props.objectLevelPermissions,
    );

    return (
      <ContentWithAppBar
        onChange={this.handleOnChange}
        pageHeight={pageHeight}
        tab={tab}
        tabsData={tabsData}
      >
        <Helmet>
          <title>{member ? member.name : ''}</title>
        </Helmet>
        <Switch>
          <Route
            exact
            component={MemberDetailBooking}
            path="/member/:id/bookings/:bookingId/"
          />
          <Route
            exact
            component={MemberDetailBooking}
            path="/member/:id/bookings"
          />
          <Route
            exact
            component={MemberDetailVod}
            path="/member/:id/vod/:vodId/"
          />
          <Route
            component={MemberDetailProgram}
            path="/member/:id/performance-tracking/:memberProgramId/"
          />
          <Route
            component={MemberDetailProgram}
            path="/member/:id/performance-tracking/"
          />
          <Route exact component={MemberDetailVod} path="/member/:id/vod" />
          <Route
            exact
            component={MemberDetailPass}
            path="/member/:id/pass/:consumerPassId"
          />
          <Route exact component={MemberDetailPass} path="/member/:id/pass" />
          <Route
            exact
            component={MemberDetailRelation}
            path="/member/:id/relation/:relation"
          />
          <Route component={MemberDetailRelation} path="/member/:id/relation" />
          <Route
            exact
            component={MemberDetailPayment}
            path="/member/:id/payment"
          />
          <Route exact component={MemberDetailInfo} path="/member/:id/info" />
          <Route
            exact
            component={MemberDetailPrivateBooking}
            path="/member/:id/private-booking/:privateBookingId"
          />
          <Route
            exact
            component={MemberDetailPrivateBooking}
            path="/member/:id/private-booking"
          />
          <Route
            exact
            component={MemberDetailPrivateConsumerPass}
            path="/member/:id/private-consumer-pass/:privateConsumerPassId"
          />
          <Route
            exact
            component={MemberDetailPrivateConsumerPass}
            path="/member/:id/private-consumer-pass"
          />
          <Route
            exact
            component={MemberDetailContact}
            path="/member/:id/contact"
          />
          <Route
            component={MemberDetailBasket}
            path="/member/:id/basket/:selectedBasketId"
          />
          <Route
            component={MemberDetailGiftcard}
            path="/member/:id/giftcard/:selectedConsumerGiftcardId"
          />
          <Route
            component={MemberDetailGiftcard}
            path="/member/:id/giftcard/"
          />
          <Route
            exact
            component={MemberDetailBasket}
            path="/member/:id/basket"
          />
          <Route exact component={MemberCustomForm} path="/member/:id/form" />
        </Switch>
        {member && !member.is_pos && (
          <MemberActions
            billMember={this.handleBillMember}
            interrogateMemberStatus={this.interrogateMemberStatus}
            member={this.props.member}
            numberOfUnreadAnswers={numberOfUnreadAnswers}
            openCommunicationDrawer={this.handleOpenCommunicationDrawer}
            subscribeMember={this.props.openContractDialog}
            unArchiveMember={this.unArchiveMember}
          />
        )}
        {!!this.props.invoiceInfo && (
          <InvoiceInfoDialog
            goToInvoice={this.handleGoToInvoice}
            invoiceInfo={this.props.invoiceInfo}
            onClose={this.props.resetInvoiceInfo}
          />
        )}
        {!!stripeRegion && !!companyCountry && (
          <SubscriptionContractRegister
            cardBillingDetailsMandatory={
              this.props.theme.force_billing_details_on_cards
            }
            companyId={this.props.companyId}
            contract={this.props.contractToBill}
            contractList={this.props.contractList}
            contractLoading={this.props.contractLoading}
            defaultBillingGroup={
              this.props.staffDefaultEstablishmentBillingGroup
            }
            enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
              {
                currency: this.props.theme.currency,
                companyCountry,
                withCredit: true,
                withTerminal: true,
                stripeRegion,
              },
            )}
            enableMultiLocalization={this.props.theme.enable_multi_localization}
            establishmentBillingGroups={this.props.establishmentBillingGroups}
            generalTermsAndConditions={
              this.props.theme.general_terms_and_conditions
            }
            goToCustomSubscriptionForm={this.handleSubscribeMember}
            initialMember={this.props.member}
            managerFormConfig={this.props.managerFormConfig?.poll_fields}
            member={this.props.member}
            onChangeContract={this.props.setContractToBill}
            onClose={this.props.closeContractDialog}
            onlinePaymentEnabled={this.props.theme.online_payment_enabled}
            onSuccess={this.handleOnContractRegisterSuccess}
            open={this.props.contractDialogOpen}
            refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
            registerContractBackground={this.props.registerContractBackground}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            stripeReaders={this.props.stripeReaders || []}
            waiver={this.props.theme.waiver}
          />
        )}
        <MemberArchiveDialog
          archiveMemberStatus={this.props.memberArchiveStatus}
          loading={this.props.memberArchiveLoading}
          member={this.props.memberToArchive}
          onClose={this.handleMemberArchiveDialogClose}
          onConfirm={this.archiveMember}
          open={this.props.openArchiveDialog}
        />
      </ContentWithAppBar>
    );
  }
}

export default compose(
  withTranslation(['member', 'subscription']),
  routerParamsToProps({ tab: 'tab', id: 'id:number' }),
  connect(
    (state, { id }) => ({
      programList: getProgramList(state),
      theme: state.theme.theme,
      companyId: state.theme.theme.company,
      member: getMember(state, id),
      infosOfMember: state.member.count.data,
      contractLoading: state.subscription.contract.loading,
      contractList: getAvailableContractListWithPaymentPack(state),
      invoiceInfo: state.invoice.invoiceInfo.data,
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      videoPurchasedCount: state.video.purchase.purchaseByMember,
      managerFormConfig: getSignUpFormConfigurationDict(state),
      customFormFilledList: excludeDraftCustomFormFilled(
        getMemberCustomFormFilled,
      )(state, id),
      memberArchiveStatus: getMemberArchiveStatus(state, id),
      memberArchiveLoading: state.member.archive.loading,
      memberToArchive: getMemberDetail(state, id),
      stripeReaders: getStripeReaders(state),
      numberOfUnreadAnswers: state.communicationV2.unreadAnswers.count,
      objectLevelPermissions: getObjectPermissions(state),
      establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
      staffDefaultEstablishmentBillingGroup:
        getStaffEstablishmentBillingGroupSelector(state),
      pathname:
        state.router?.location?.pathname ??
        (typeof window !== 'undefined' ? window.location.pathname : ''),
      showRevampedSidebar:
        !!state.auth.has_enabled_revamped_backoffice &&
        !!state.theme.theme?.revamped_backoffice_enabled,
    }),
    {
      billMember: (id) => pushRouter(`/invoice/bill-member/${id}/`),
      pushRouter,
      pushToTab: (id, tab) => pushRouter(`/member/${id}/${tab}`),
      fetchContractList: fetchContractListAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      subscribeMember: (id) => pushRouter(`/subscription/add/${id}`),
      goToInvoice: (uuid) => pushRouter(`/invoice/${uuid}`),
      resetInvoiceInfo: checkInvoiceInfoActions.reset,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      fetchCountObjects: (memberId: number) =>
        fetchCountObjectsAction(memberId),
      fetchManagerFilters: fetchManagerFiltersSettings,
      fetchNumberVideoPurchase,
      fetchMemberCustomFormFilled,
      fetchEstablishments,
      fetchEstablishmentBillingGroup: fetchEstablishmentBillingGroupAction,
      archiveMember,
      unArchiveMember,
      interrogateMemberStatus,
      fetchMember,
      fetchProgram: fetchProgramAction,
      fetchStripeReaders,
      registerContractBackground: registerContractBackgroundAction,
      displayBackgroundDialog: displayBackgroundDialogAction,
      deletebackgroundDialog: deletebackgroundDialogAction,
      getUnreadAnswersCountAction,
      fetchCompanyUserRoles: fetchCompanyUserRolesAction,
    },
  ),
  withHandlers({
    requestSetupIntentSecret:
      ({ id }) =>
      () =>
        requestSetupIntentSecretAPI(id),

    fetchContractList: (props) => () => {
      props.fetchContractList(
        {},
        {
          onSuccess: (contractList) =>
            props.fetchPaymentPackBulk(contractList.map((c) => c.payment_pack)),
        },
      );
    },
  }),
  withState('contractDialogOpen', 'setContractDialogOpen', false),
  withState('contractToBill', 'setContractToBill', null),
  withState('openArchiveDialog', 'setOpenArchiveDialog', false),
  withHandlers({
    closeContractDialog:
      ({ setContractDialogOpen, setContractToBill }) =>
      () => {
        setContractDialogOpen(false);
        setContractToBill(null);
      },
    openContractDialog:
      ({ setContractDialogOpen, fetchContractList, setContractToBill }) =>
      () => {
        fetchContractList();
        setContractDialogOpen(true);
        setContractToBill(null);
      },
    fetchPaymentMethodList:
      ({ id, fetchPaymentMethodList }) =>
      () =>
        fetchPaymentMethodList({ member: id }),
  }),
  withHandlers({
    fetchFiltersSettings:
      ({ fetchManagerFilters }) =>
      () => {
        fetchManagerFilters();
      },
    registerContractBackground:
      ({
        registerContractBackground,
        displayBackgroundDialog,
        deletebackgroundDialog,
        closeContractDialog,
        t,
      }) =>
      (id: number, data: any, options: OptionCallback) => {
        const uuid = uuid4();
        registerContractBackground(id, data, {
          onError: options?.onError,
          onSuccess: () => {
            closeContractDialog(false);
            if (options?.onSuccess) options.onSuccess();
            displayBackgroundDialog(
              uuid,
              t('subscription:register.dialog.info'),
              '',
              undefined,
              BackgroundDialogActionMode.REDIRECT,
              BackgroundDialogDisplayMode.INFORMATION,
            );
          },
          onBackgroundError: () => {
            deletebackgroundDialog(uuid);
          },
          onBackgroundSuccess: (responseData) => {
            deletebackgroundDialog(uuid);
            displayBackgroundDialog(
              uuid4(),
              t('subscription:register.dialog.success', {
                name: responseData?.billing_plan?.name || '',
              }),
              '',
              responseData?.billing_plan?.id
                ? `/subscription/${responseData.billing_plan.id}`
                : undefined,
              BackgroundDialogActionMode.REDIRECT,
              BackgroundDialogDisplayMode.SUCCESS,
            );
            if (options?.onSuccess) options.onSuccess(responseData);
          },
        });
      },
  }),
  withPageHeightHOC(),
  withQueryParams([['openChat'], 'queryParams', 'setQueryParams']),
  withTitle(({ member }) => (member ? member.name : '')),
  withMemberBannerHOC(({ member }) => member),
)(withFeatureFlags(MemberDetail));

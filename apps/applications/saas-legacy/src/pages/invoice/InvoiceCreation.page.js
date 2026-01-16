// @flow

import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';

import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items.js';
import { DateTime } from 'luxon';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  createOrUpdateInvoice,
  fetchInvoiceConfiguration as fetchInvoiceConfigurationAction,
} from '#src/libs/invoice/actions';
import { fetchShopItemAsManager as fetchShopItems } from '../../libs/shop/actions/shopitem';
import { fetchPaymentPackList as fetchPaymentPackListAction } from '../../libs/payment-packs/actions';
import { fetchMember } from '../../libs/member/actions';

import type { Member } from '../../libs/member/types';
import { getMember } from '../../libs/member/selectors';
import withTitle from '../../hocs/with-title.hoc';
import withQueryParams from '../../hocs/with-query-params.hoc';

import { getBuyableItem } from '../../libs/invoice/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import {
  fetchGiftcardList,
  fetchGiftcardBackgroundImageList,
} from '../../libs/giftcard/actions';
import { fetchAllEstablishmentBillingGroup } from '../../libs/establishment/actions';
import {
  getAvailableEstablishmentList,
  getEnabledEstablishmentBillingGroups,
  getStaffEstablishmentBillingGroupSelector,
} from '../../libs/establishment/selectors';
import { fetchCompanyUserRoles } from '../../libs/role/actions';
import themeSelectors from '../../libs/theme/selectors';
import {
  getGiftcardBackgroundImageList,
  getGiftcardListEnabled,
} from '../../libs/giftcard/selectors';
import type { InvoiceConfigurationSerializer } from '#src/libs/invoice/types';
import InvoiceFormV2 from '../../libs/invoice/components/InvoiceFormV2.component';
import InvoiceDateDialog from '../../libs/invoice/dialog/InvoiceDateDialog.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { withMemberBannerHOC } from '../../hocs/banner.hoc';
import { EstablishmentBillingGroup } from '../../libs/establishment/types';
import { Theme as CompanyThemeType } from '../../libs/theme/types';
import {
  FeatureFlagProps,
  withFeatureFlags,
} from '#src/utils/feature-flag/withFeatureFlags';

type Props = {
  member?: Member,
  memberId: number,
  fetchMember: (id: number) => void,

  goToInvoiceList: () => void,
  createInvoice: () => void,
  goToMemberPage: (id: number) => void,
  goToSubscription: (id: number) => void,

  fetchShopItems: () => void,
  fetchPaymentPackList: (params: any) => void,
  fetchPrivatePassList: () => void,
  fetchGiftcardList: () => void,
  fetchPaymentComboList: () => void,
  fetchAllEstablishmentBillingGroup: (params: { company: number }) => void,
  fetchCompanyUserRoles: () => void,
  fetchInvoiceConfiguration: () => void,
  fetchGiftcardBackgroundImageList: () => void,
  initialItems: { withPrivatePass?: string, withCredit?: string },

  loading: boolean,
  availableBuyableItems: { [buyable_item_identifier: number]: Array<any> },
  establishmentBillingGroups: EstablishmentBillingGroup[],
  establishmentLoading: boolean,
  companyTheme: CompanyThemeType,
  staffDefaultEstablishmentBillingGroup?: EstablishmentBillingGroup | null,
  giftcardBackgroundImageList: Array<GiftcardBackgroundImage>,
  invoiceConfiguration: InvoiceConfigurationSerializer,
  isInvoiceConfigurationLoading: boolean,
} & FeatureFlagProps;

type State = {
  dateDialogOpen: boolean,
  invoiceData?: any,
};

export class InvoiceCreation extends Component<Props, State> {
  state = {
    dateDialogOpen: false,
    invoiceData: null,
  };

  componentDidMount() {
    this.props.fetchMember(this.props.memberId);
    this.props.fetchShopItems();
    this.props.fetchPaymentPackList({
      disabled: false,
      page_size: 7000,
      ...(this.props.shouldDisplayNewSubscriptionContracts && {
        from_subscription: false,
      }),
    });
    this.props.fetchPrivatePassList({
      ...(this.props.shouldDisplayNewSubscriptionContracts && {
        from_subscription: false,
      }),
    });
    this.props.fetchPaymentComboList();
    this.props.fetchInvoiceConfiguration();
    if (this.props.companyTheme.enable_multi_localization) {
      this.props.fetchAllEstablishmentBillingGroup({
        params: { company: this.props.companyTheme.company },
      });
      this.props.fetchCompanyUserRoles();
    }
    this.props.fetchGiftcardList();
    this.props.fetchGiftcardBackgroundImageList(
      this.props.companyTheme.company,
    );
  }

  prepareCreate = (invoiceData: any) => {
    this.setState({
      dateDialogOpen: true,
      invoiceData,
    });
  };

  createInvoiceAtDate = (date: string, options: OptionCallback) => {
    this.props.createInvoice(
      {
        ...this.state.invoiceData,
        member: this.props.memberId,
        date,
        is_v2: true,
      },
      {
        onSuccess: () => {
          if (options && options.onSuccess) {
            options.onSuccess();
          }
          this.setState({ dateDialogOpen: false, invoiceData: null });
        },
        onError: () => {
          this.setState({ invoiceData: null, dateDialogOpen: false });
          if (options && options.onError) {
            options.onError();
          }
        },
      },
    );
  };

  render() {
    const { member, goToInvoiceList, loading, goToMemberPage, memberId } =
      this.props;

    if (
      !member ||
      loading ||
      this.props.isInvoiceConfigurationLoading ||
      (this.props.initialItems &&
        this.props.initialItems.withPrivatePass &&
        !this.props.availableBuyableItems[BUYABLE_ITEM_PRIVATE_PASS].find(
          (bi) =>
            bi.id === parseInt(this.props.initialItems.withPrivatePass, 10) &&
            !bi.is_unpaid_private_booking_integration,
        ))
    ) {
      return <LinearProgress />;
    }
    return (
      <div>
        <InvoiceFormV2
          availableBuyableItems={this.props.availableBuyableItems}
          defaultEstablishmentBillingGroup={
            this.props.companyTheme.enable_multi_localization
              ? this.props.staffDefaultEstablishmentBillingGroup
              : null
          }
          displayNewWebshop={!!this.props.companyTheme?.display_new_webshop}
          enableMultiLocalization={
            this.props.companyTheme.enable_multi_localization
          }
          establishmentBillingGroups={this.props.establishmentBillingGroups}
          establishmentLoading={this.props.establishmentLoading}
          giftcardBackgroundImageList={this.props.giftcardBackgroundImageList}
          goToMemberPage={() => goToMemberPage(memberId)}
          goToSubscription={this.props.goToSubscription}
          ImageCarouselChangeable={false}
          initialItems={this.props.initialItems}
          isCustomDiscountReasonRequired={
            this.props.invoiceConfiguration?.is_custom_discount_reason_required
          }
          member={member}
          onCancel={goToInvoiceList}
          onSubmit={this.prepareCreate}
        />
        <InvoiceDateDialog
          onClose={() =>
            this.setState({ dateDialogOpen: false, invoiceData: null })
          }
          onSubmit={this.createInvoiceAtDate}
          open={this.state.dateDialogOpen}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  title: {
    paddingBottom: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
  routerParamsToProps({
    memberId: 'memberId:number',
  }),
  connect(
    (state, { memberId }) => ({
      loading: state.member.loading,
      member: getMember(state, memberId),
      availableBuyableItems: getBuyableItem(state),
      establishmentBillingGroups: getEnabledEstablishmentBillingGroups(state),
      establishments: getAvailableEstablishmentList(state),
      establishmentLoading:
        state.establishment.loading ||
        state.establishment.establishmentBillingGroup.loading,
      companyTheme: themeSelectors.getTheme(state),
      giftcardList: getGiftcardListEnabled(state),
      giftcardBackgroundImageList: getGiftcardBackgroundImageList(state),
      invoiceConfiguration: state.invoice.configuration.result,
      isInvoiceConfigurationLoading: state.invoice.configuration.loading,
      staffDefaultEstablishmentBillingGroup:
        getStaffEstablishmentBillingGroupSelector(state),
    }),
    {
      fetchShopItems,
      fetchPaymentPackList: fetchPaymentPackListAction,
      fetchPrivatePassList,
      fetchPaymentComboList,
      fetchGiftcardBackgroundImageList,
      goToInvoiceList: () => pushRouter('/invoice'),
      createInvoice: createOrUpdateInvoice,

      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      goToSubscription: (id) => pushRouter(`/subscription/${id}/`),
      fetchMember,
      goToInvoice: (uuid) => pushRouter(`/invoice/${uuid}/`),
      fetchGiftcardList,
      fetchAllEstablishmentBillingGroup,
      fetchCompanyUserRoles,
      fetchInvoiceConfiguration: fetchInvoiceConfigurationAction,
    },
  ),
  withHandlers({
    createInvoice:
      ({ createInvoice, goToInvoice }) =>
      (invoiceData, options) => {
        createInvoice(invoiceData, {
          onSuccess: (invoice) => {
            if (options && options.onSuccess) {
              options.onSuccess(invoice);
            }
            // TODO goto payment page
            goToInvoice(invoice.uuid);
          },
          onError: options && options.onError,
        });
      },
  }),
  withQueryParams([['withCredit', 'withPrivatePass'], 'initialItems']),
  withTitle(
    ({ t, member }: { t: TFunction, member: Member }) =>
      `${t('titles:invoice.invoiceCreate')} - ${DateTime.now().toLocaleString(
        DateTime.DATE_SHORT,
      )} - ${member ? member.name : ' '}`,
  ),
  withMemberBannerHOC(({ member }) => member),
  withFeatureFlags,
)(InvoiceCreation);

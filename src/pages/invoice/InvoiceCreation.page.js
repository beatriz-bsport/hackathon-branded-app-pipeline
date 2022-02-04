// @flow

import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';

import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../utils/datetime';
import { createOrUpdateInvoice } from '../../libs/invoice/actions';
import { fetchShopItemAsManager as fetchShopItems } from '../../libs/shop/actions/shopitem';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { fetchMember } from '../../libs/member/actions';

import type { Member } from '../../libs/member/types';
import { getMember } from '../../libs/member/selectors';
import type { InvoiceDataFront } from '../../components/form/types';
import withTitle from '../../hocs/with-title.hoc';
import withQueryParams from '../../hocs/with-query-params.hoc';

import { getBuyableItem } from '../../libs/invoice/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import {
  fetchGiftcardList,
  fetchGiftcardBackgroundImageList,
} from '../../libs/giftcard/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentBillingGroup,
} from '../../libs/establishment/actions';
import {
  getEstablishmentBillingroup,
  withEstablishment,
  getAvailableEstablishmentList,
} from '../../libs/establishment/selectors';
import themeSelectors from '../../libs/theme/selectors';
import {
  getGiftcardBackgroundImageList,
  getGiftcardListEnabled,
} from '../../libs/giftcard/selectors';

import InvoiceFormV2 from '../../libs/invoice/components/InvoiceFormV2.component';
import InvoiceDateDialog from '../../libs/invoice/dialog/InvoiceDateDialog.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { withMemberBannerHOC } from '../../hocs/banner.hoc';
import { Establishment } from '../../libs/establishment/types';
import { Theme as CompanyThemeType } from '../../libs/theme/types';

type Props = {
  member: ?Member,
  memberId: number,
  fetchMember: (id: number) => void,

  goToInvoiceList: () => void,
  createInvoice: () => void,
  goToMemberPage: (id: number) => void,
  goToSubscription: (id: number) => void,

  fetchShopItems: () => void,
  fetchAllPaymentPacks: () => void,
  fetchPrivatePassList: () => void,
  fetchGiftcardList: () => void,
  fetchPaymentComboList: () => void,
  fetchEstablishments: () => void,
  fetchGiftcardBackgroundImageList: () => void,
  initialItems: { withPrivatePass: ?string, withCredit: ?string },

  loading: boolean,
  availableBuyableItems: { [buyable_item_identifier: number]: Array<any> },
  establishments: Array<Establishment>,
  establishmentLoading: boolean,
  companyTheme: CompanyThemeType,
  giftcardBackgroundImageList: Array<GiftcardBackgroundImage>,
};

type State = {
  dateDialogOpen: boolean,
  invoiceData: ?InvoiceDataFront,
};

export class InvoiceCreation extends Component<Props, State> {
  state = {
    dateDialogOpen: false,
    invoiceData: null,
  };

  componentDidMount() {
    this.props.fetchMember(this.props.memberId);
    this.props.fetchShopItems();
    this.props.fetchAllPaymentPacks();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
    this.props.fetchEstablishments();
    this.props.fetchGiftcardList();
    this.props.fetchGiftcardBackgroundImageList(
      this.props.companyTheme.company,
    );
  }

  prepareCreate = (invoiceData: InvoiceDataFront) => {
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
          member={member}
          onSubmit={this.prepareCreate}
          onCancel={goToInvoiceList}
          initialItems={this.props.initialItems}
          availableBuyableItems={this.props.availableBuyableItems}
          goToSubscription={this.props.goToSubscription}
          goToMemberPage={() => goToMemberPage(memberId)}
          establishments={this.props.establishments}
          establishmentLoading={this.props.establishmentLoading}
          enableMultiLocalization={
            this.props.companyTheme.enable_multi_localization
          }
          giftcardBackgroundImageList={this.props.giftcardBackgroundImageList}
          ImageCarouselChangeable={false}
        />
        <InvoiceDateDialog
          open={this.state.dateDialogOpen}
          onClose={() =>
            this.setState({ dateDialogOpen: false, invoiceData: null })
          }
          onSubmit={this.createInvoiceAtDate}
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
      establishmentBillingGroups: withEstablishment(
        getEstablishmentBillingroup,
      )(state),
      establishments: getAvailableEstablishmentList(state),
      establishmentLoading:
        state.establishment.loading ||
        state.establishment.establishmentBillingGroup.loading,
      companyTheme: themeSelectors.getTheme(state),
      giftcardList: getGiftcardListEnabled(state),
      giftcardBackgroundImageList: getGiftcardBackgroundImageList(state),
    }),
    {
      fetchShopItems,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      fetchPaymentComboList,
      fetchGiftcardBackgroundImageList,
      goToInvoiceList: () => pushRouter('/invoice'),
      createInvoice: createOrUpdateInvoice,

      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      goToSubscription: (id) => pushRouter(`/subscription/${id}/`),
      fetchMember,
      goToInvoice: (uuid) => pushRouter(`/invoice/${uuid}/`),

      fetchEstablishments,
      fetchGiftcardList,
      fetchAllEstablishmentBillingGroup,
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
      `${t('titles:invoice.invoiceCreate')} - ${formatAsDate(Moment())} - ${
        member ? member.name : ' '
      }`,
  ),
  withMemberBannerHOC(({ member }) => member),
)(InvoiceCreation);

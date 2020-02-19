// @flow
import React, { Component } from 'react';

import { compose, withProps } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';

// marketplace
// -----------------------------
import { getAllEstablishments } from '../../libs/establishment/selectors';

import { getMetaActivities } from '../../libs/meta-activity/selectors';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions/common';
import MarketplacePassList from '../../libs/marketplace/components/MarketplacePassList.component';
import MarketplacePrivatePassList from '../../libs/marketplace/components/MarketplacePrivatePassList.component';
import MarketplacePaymentComboList from '../../libs/marketplace/components/MarketplacePaymentComboList.component';

import { getMarketplacePaymentPacks } from '../../libs/payment-packs/selectors';
// checkout
// -----------------------------
import { addItemToBasket } from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';

// private-service
// -----------------------------
import { fetchPrivatePassAsConsumerList } from '../../libs/private-service/actions';
import { getPrivatePassAsConsumer } from '../../libs/private-service/selectors/private-pass';

// payment-combo
// -----------------------------
import { getPaymentComboListAvailableOnline } from '../../libs/payment-combo/selectors';
import type { PaymentCombo } from '../../libs/payment-combo/types';
import { fetchMarketplacePacks } from '../../libs/payment-packs/actions';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  companyId: number,
  loading: boolean,
  authenticated: boolean,

  paymentPacks: Array<PaymentPack>,
  privatePassList: Array<PrivatePass>,
  paymentComboList: Array<PaymentCombo>,

  fetchPaymentPacks: (params: any) => void,
  fetchPrivatePassAsConsumerList: (companyId: number) => void,

  requestSignUp: () => void,
  toogleCurrentBasketOpen: (boolean) => void,
  currentBasket: Basket,

  pushPrivatePassCheckout: (packId: number, basketId: string) => void,
  pushPackCheckout: (packId: number, basketId: string) => void,
  pushComboCheckout: (comboId: number, basketId: string) => void,

  metaActivities: Array<any>,
  establishments: Array<any>,
};

export class MarketPlacePassPage extends Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.props.fetchPaymentPacks({
      company: this.props.companyId,
      manager_only: false,
      disabled: false,
      as_consumer: true,
      page_size: 300,
    });
    this.props.fetchPrivatePassAsConsumerList(this.props.companyId);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.authenticated !== this.props.authenticated) {
      this.fetchData();
    }
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    return (
      <Grid container direction="row" justify="space-evenly">
        {this.props.paymentComboList.length ? (
          <Grid item xs={12}>
            <MarketplacePaymentComboList
              paymentComboList={this.props.paymentComboList}
              onAddBasket={(comboId) => {
                if (!this.props.authenticated) {
                  this.props.requestSignUp();
                } else {
                  this.props.pushComboCheckout(
                    comboId,
                    this.props.currentBasket.id,
                  );
                  this.props.toogleCurrentBasketOpen(true);
                }
              }}
            />
          </Grid>
        ) : null}
        <Grid item xs={11} md={5}>
          <MarketplacePassList
            paymentPacks={this.props.paymentPacks}
            pushPackCheckout={(packId) => {
              if (!this.props.authenticated) {
                this.props.requestSignUp();
              } else {
                this.props.pushPackCheckout(
                  packId,
                  this.props.currentBasket.id,
                );
                this.props.toogleCurrentBasketOpen(true);
              }
            }}
            metaActivities={this.props.metaActivities}
            establishments={this.props.establishments}
          />
        </Grid>
        {this.props.privatePassList.length ? (
          <Grid item xs={11} md={5}>
            <MarketplacePrivatePassList
              privatePassList={this.props.privatePassList}
              onAddBasket={(packId) => {
                if (!this.props.authenticated) {
                  this.props.requestSignUp();
                } else {
                  this.props.pushPrivatePassCheckout(
                    packId,
                    this.props.currentBasket.id,
                  );
                  this.props.toogleCurrentBasketOpen(true);
                }
              }}
            />
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
    margin: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      paymentPacks: getMarketplacePaymentPacks(state),
      currentBasket: getCurrentBasket(state),
      authenticated: state.auth.authenticated,
      metaActivities: getMetaActivities(state),
      establishments: getAllEstablishments(state),
      privatePassList: getPrivatePassAsConsumer(state),
      paymentComboList: getPaymentComboListAvailableOnline(state),
      loading: state.paymentPack.loading,
      establishmentLoading: state.establishment.bulkRetrieve.loading,
      activityLoading: state.metaActivity.loading,
    }),
    {
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchPaymentPacks: fetchMarketplacePacks,
      fetchPrivatePassAsConsumerList,
      pushPrivatePassCheckout: (packId, basketId) =>
        addItemToBasket(basketId, {
          buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
          quantity: 1,
          buyable_item_id: packId,
          extra_data: {},
        }),
      pushPackCheckout: (packId, basketId) =>
        addItemToBasket(basketId, {
          buyable_item_identifier: BUYABLE_ITEM_PASS,
          quantity: 1,
          buyable_item_id: packId,
          extra_data: {},
        }),
      pushComboCheckout: (comboId, basketId) =>
        addItemToBasket(basketId, {
          buyable_item_identifier: BUYABLE_ITEM_COMBO_ITEM,
          quantity: 1,
          buyable_item_id: comboId,
          extra_data: {},
        }),
    },
  ),
  withProps(
    ({ fetchPaymentPacks, fetchEstablishmentBulk, fetchMetaActivityBulk }) => ({
      fetchPaymentPacks: (params) =>
        fetchPaymentPacks(params, {
          onSuccess: (packList) => {
            fetchEstablishmentBulk(
              [...packList.map((pp) => pp.establishments)].flat(2),
            );
            fetchMetaActivityBulk(
              [...packList.map((pp) => pp.metaActivities)].flat(2),
            );
          },
        }),
    }),
  ),
  withNamespaces(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplacePass'),
  ),
)(MarketPlacePassPage);

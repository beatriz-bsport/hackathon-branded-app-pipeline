// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';
import MarketplacePassList from '../../libs/marketplace/components/MarketplacePassList.component';
import MarketplacePrivatePassList from '../../libs/marketplace/components/MarketplacePrivatePassList.component';
import {
  getPaymentPacks,
  isMarketplaceLoading,
} from '../../libs/marketplace/selectors';
import { addItemToBasket } from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import { fetchPaymentPacksAction } from '../../libs/marketplace/actions';

import withTitle from '../../hocs/with-title.hoc';

type Props = {
  companyId: number,
  loading: boolean,
  paymentPacks: Array<PaymentPack>,
  privatePassList: Array<PrivatePass>,
  authenticated: boolean,

  requestSignUp: () => void,
  fetchPaymentPacks: (companyId: number) => void,
  fetchPrivatePassList: (companyId: number) => void,
  pushPrivatePassCheckout: (packId: number, basketId: string) => void,
  pushPackCheckout: (packId: number, basketId: string) => void,
  toogleCurrentBasketOpen: (boolean) => void,
  currentBasket: Basket,
};

export class MarketPlacePassPage extends Component<Props> {
  async componentDidMount() {
    this.props.fetchPaymentPacks(this.props.companyId);
    this.props.fetchPrivatePassList(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.authenticated !== this.props.authenticated) {
      this.props.fetchPaymentPacks(this.props.companyId);
    }
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    return (
      <Grid container direction="row" justify="space-evenly">
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
      paymentPacks: getPaymentPacks(state),
      currentBasket: getCurrentBasket(state),
      authenticated: state.auth.authenticated,
      privatePassList: getPrivatePassAvailable(state),
      loading:
        state.marketplacev2.paymentPack.loading || isMarketplaceLoading(state),
    }),
    {
      fetchPaymentPacks: fetchPaymentPacksAction,
      fetchPrivatePassList,
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
    },
  ),
  withNamespaces(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplacePass'),
  ),
)(MarketPlacePassPage);

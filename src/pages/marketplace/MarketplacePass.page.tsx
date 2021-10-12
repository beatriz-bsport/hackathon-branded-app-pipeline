import React, { Component } from 'react';

import { compose, withProps } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core';

import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { withRouter } from 'react-router';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';

// marketplace
// -----------------------------
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import MarketplacePassList from '../../libs/marketplace/components/MarketplacePassList.component';
import MarketplacePrivatePassList from '../../libs/marketplace/components/MarketplacePrivatePassList.component';
import MarketplacePaymentComboList from '../../libs/marketplace/components/MarketplacePaymentComboList.component';

import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  excludePaymentPackTagged,
  getPaymentPackCategoryWithPaymentPacks,
  getPaymentPackUnCategoryWithPaymentPacks,
  withMetaActivities,
  withEstablishments,
} from '../../libs/payment-packs/selectors';
// checkout
// -----------------------------
import { addItemToBasket } from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';

// private-service
// -----------------------------
import { fetchPrivatePassAsConsumerList } from '../../libs/private-service/actions';
import { getPrivatePassAsConsumer } from '../../libs/private-service/selectors/private-pass';

// payment-combo
// -----------------------------
import { getPaymentComboListAvailableOnline } from '../../libs/payment-combo/selectors';
import {
  fetchMarketplacePacks,
  fetchAllPaymentPackCategory,
} from '../../libs/payment-packs/actions';
import withTitle from '../../hocs/with-title.hoc';
import { RootState } from '../../reducers';

import { fetchMemberTagList } from '../../libs/tag/actions';
import { getMemberTagsIdsList } from '../../libs/tag/selectors';
import type { Tag } from '../../libs/tag/types';

type OwnProps = {
  params?: {
    hidePaymentPack?: string;
    hidePrivatePass?: string;
    hidePaymentCombo?: string;
  };
  companyId: number;
  requestSignUp: () => void;
  toogleCurrentBasketOpen: (open: boolean) => void;
  addComboToCart?: (id: number) => void;
  addPaymentPackToCart?: (id: number) => void;
  addPrivatePassToCart?: (id: number) => void;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

export class MarketPlacePassPage extends Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.props.fetchPaymentComboList({
      company: this.props.companyId,
      manager_only: false,
    });
    this.props.fetchPaymentPacks({
      company: this.props.companyId,
      manager_only: false,
      disabled: false,
      as_consumer: true,
      page_size: 300,
    });
    this.props.fetchPrivatePassAsConsumerList(this.props.companyId);
    this.props.fetchAllPaymentPackCategory(this.props.companyId);
    this.props.fetchMemberTagList(this.props.companyId);
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.authenticated !== this.props.authenticated) {
      this.fetchData();
    }
  }

  addComboToCart = (comboId: number) => {
    if (this.props.addComboToCart) {
      this.props.addComboToCart(comboId);
      return;
    }

    if (!this.props.authenticated) {
      this.props.requestSignUp();
    } else {
      this.props.pushComboCheckout(comboId, this.props.currentBasket.id);
      this.props.toogleCurrentBasketOpen(true);
    }
  };

  addPaymentPackToCart = (packId: number) => {
    if (this.props.addPaymentPackToCart) {
      this.props.addPaymentPackToCart(packId);
      return;
    }

    if (!this.props.authenticated) {
      this.props.requestSignUp();
    } else {
      this.props.pushPackCheckout(packId, this.props.currentBasket.id);
      this.props.toogleCurrentBasketOpen(true);
    }
  };

  addPrivatePassToCart = (packId: number) => {
    if (this.props.addPrivatePassToCart) {
      this.props.addPrivatePassToCart(packId);
      return;
    }

    if (!this.props.authenticated) {
      this.props.requestSignUp();
    } else {
      this.props.pushPrivatePassCheckout(packId, this.props.currentBasket.id);
      this.props.toogleCurrentBasketOpen(true);
    }
  };

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    const hidePaymentPack = this.props?.params?.hidePaymentPack === 'true';
    const hidePrivatePass = this.props?.params?.hidePrivatePass === 'true';
    const hidePaymentCombo = this.props?.params?.hidePaymentCombo === 'true';
    return (
      <Grid container direction="row" justify="space-evenly">
        {this.props.paymentComboList.length && !hidePaymentCombo ? (
          <Grid item xs={12}>
            <MarketplacePaymentComboList
              paymentComboList={this.props.paymentComboList}
              onAddBasket={this.addComboToCart}
            />
          </Grid>
        ) : null}
        {!hidePaymentPack && (
          <Grid item xs={11} md={5}>
            <MarketplacePassList
              pushPackCheckout={this.addPaymentPackToCart}
              paymentPackUnCategorized={this.props.paymentPackUnCategorized}
              paymentPackByCategory={this.props.paymentPackByCategory}
            />
          </Grid>
        )}

        {this.props.privatePassList.length && !hidePrivatePass ? (
          <Grid item xs={11} md={5}>
            <MarketplacePrivatePassList
              privatePassList={this.props.privatePassList}
              onAddBasket={this.addPrivatePassToCart}
            />
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

const styles = (theme: Theme) => ({
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
    margin: theme.spacing(2),
  },
});

const mapMemberInfoStateToProps = (
  // Have to do this separation here for widget purpose

  state: RootState,
  {
    memberTagList,
    authenticated,
  }: { memberTagList: Array<Tag>; authenticated: boolean },
) => ({
  memberTagList: memberTagList || getMemberTagsIdsList(state),
  authenticated: authenticated || state.auth.authenticated,
});
const mapStateToProps = (
  state: RootState,
  {
    memberTagList,
    authenticated,
  }: { memberTagList: Array<Tag>; authenticated: boolean },
) => ({
  currentBasket: getCurrentBasket(state),
  privatePassList: getPrivatePassAsConsumer(state),
  paymentComboList: getPaymentComboListAvailableOnline(state),
  loading: state.paymentPack.loading,
  establishmentLoading: state.establishment.bulkRetrieve.loading,
  activityLoading: state.metaActivity.loading,
  paymentPackUnCategorized: getPaymentPackUnCategoryWithPaymentPacks(
    withEstablishments(withMetaActivities(excludePaymentPackTagged)),
  )(state, { memberTagList, authenticated }),
  paymentPackByCategory: getPaymentPackCategoryWithPaymentPacks(
    withEstablishments(withMetaActivities(excludePaymentPackTagged)),
  )(state, { memberTagList, authenticated }),
});

const mapDispatchToProps = {
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchPaymentPacks: fetchMarketplacePacks,
  fetchAllPaymentPackCategory,
  fetchPrivatePassAsConsumerList,
  pushPrivatePassCheckout: (packId: number, basketId: number) =>
    addItemToBasket(basketId, {
      buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
      quantity: 1,
      buyable_item_id: packId,
      extra_data: {},
    }),
  pushPackCheckout: (packId: number, basketId: number) =>
    addItemToBasket(basketId, {
      buyable_item_identifier: BUYABLE_ITEM_PASS,
      quantity: 1,
      buyable_item_id: packId,
      extra_data: {},
    }),
  pushComboCheckout: (comboId: number, basketId: number) =>
    addItemToBasket(basketId, {
      buyable_item_identifier: BUYABLE_ITEM_COMBO_ITEM,
      quantity: 1,
      buyable_item_id: comboId,
      extra_data: {},
    }),
  fetchPaymentComboList,
  fetchMemberTagList,
};

export const MarketplacePassBase = compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  connect(mapMemberInfoStateToProps),
  connect(mapStateToProps, mapDispatchToProps),
  withProps(
    ({ fetchPaymentPacks, fetchEstablishmentBulk, fetchMetaActivityBulk }) => ({
      fetchPaymentPacks: (params: any) =>
        fetchPaymentPacks(params, {
          onSuccess: (packList) => {
            fetchEstablishmentBulk(
              [...packList.map((pp) => pp.establishments)].flat(2),
            );
            fetchMetaActivityBulk(
              packList.map((pp) => pp.metaActivities).flat(2),
            );
          },
        }),
    }),
  ),
  withTranslation(),
)(MarketPlacePassPage);

export default compose<any, OwnProps>(
  withRouter,
  routerParamsToProps({ companyId: 'companyId:number' }),
  withQueryParams([
    ['hidePaymentPack', 'hidePrivatePass', 'hidePaymentCombo'],
    'params',
  ]),
  withTranslation(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplacePass'),
  ),
)(MarketplacePassBase);

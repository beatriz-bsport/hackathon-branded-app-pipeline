import React from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { BUYABLE_ITEM_GIFTCARD } from '@bsport/common/lib/master-data/buyable-items.js';
import LinearProgress from '@material-ui/core/LinearProgress';

import {
  getGiftcard,
  getGiftcardBackgroundImageList,
} from '#src/libs/giftcard/selectors';
import {
  retrieveGiftcard,
  fetchGiftcardBackgroundImageList,
} from '#src/libs/giftcard/actions';
import ConsumerGiftcardFormWithPreview from '#src/libs/giftcard/components/ConsumerGiftcardFormWithPreview.component';
import themeSelectors from '#src/libs/theme/selectors';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import {
  addItemToBasket,
  fetchCurrentBasket,
} from '#src/libs/checkout/actions';
import type { ConsumerGiftcardAPI, Giftcard } from '#src/libs/giftcard/types';

import { getCurrentBasket } from '#src/libs/checkout/selectors';
import { getCheckoutUrl } from '#src/libs/marketplace/routing-utils';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import ConsumerAppBarContainer from '../ConsumerAppBar.container';
import { RootState } from '../../../reducers';
import analyticsUtils from '#src/components/analytics/analytics';

type OwnProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: number;
  id: number;
  giftcardBackgroundImageList: Array<String>;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

export class GiftcardCheckout extends React.Component<Props> {
  componentDidMount() {
    this.props.retrieveGiftcard(this.props.id, {
      onSuccess: (giftcard: Giftcard) => {
        this.props.fetchCompanyTheme(giftcard.company);
        this.props.fetchCurrentBasket(giftcard.company);
        this.props.fetchGiftcardBackgroundImageList(giftcard.company);
      },
    });
  }

  addItemToBasket = (data: ConsumerGiftcardAPI) => {
    this.props.addItemToBasket(
      this.props.currentBasket.id,
      {
        buyable_item_identifier: BUYABLE_ITEM_GIFTCARD,
        quantity: 1,
        buyable_item_id: this.props.id,
        extra_data: { customization_dict: data },
      },
      {
        onSuccess: (basket) => {
          const addedItem = basket.checkout_items.find(
            (checkoutItem) => checkoutItem.buyable_item_id === this.props.id,
          );
          analyticsUtils.addItemToCart(addedItem);
          this.props.goToBasket(this.props.giftcard.company);
        },
      },
    );
  };

  render() {
    if (!this.props.theme || !this.props.giftcard) return <LinearProgress />;
    const { classes } = this.props;
    return (
      <ConsumerAppBarContainer>
        <div className={classes.container}>
          <ConsumerGiftcardFormWithPreview
            // @ts-expect-error
            companyCover={this.props.theme.cover}
            giftcard={this.props.giftcard}
            giftcardBackgroundImageList={this.props.giftcardBackgroundImageList}
            isManager={false}
            onSubmit={this.addItemToBasket}
            variant="consumer"
          />
        </div>
      </ConsumerAppBarContainer>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
  });

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    currentBasket: getCurrentBasket(state),
    giftcard: getGiftcard(state, id),
    theme: themeSelectors.getTheme(state),
    giftcardBackgroundImageList: getGiftcardBackgroundImageList(state),
  }),
  {
    retrieveGiftcard,
    fetchGiftcardBackgroundImageList,
    fetchCompanyTheme,
    addItemToBasket,
    fetchCurrentBasket,
    goToBasket: (companyId: number) => push(getCheckoutUrl(companyId)),
  },
);

export default compose(
  withTranslation(),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connector,
)(GiftcardCheckout);

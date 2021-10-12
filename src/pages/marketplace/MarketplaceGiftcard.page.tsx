import React, { Component } from 'react';

import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { getGiftcardListActive } from '../../libs/giftcard/selectors';
import { fetchGiftcardList } from '../../libs/giftcard/actions';
import MarketplaceGiftcardItem from '../../libs/giftcard/components/GiftcardMarketplace.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';

import { RootState } from '../../reducers';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(3),
    },
  });

type OwnProps = {
  title: string;
  companyId: number;
  goToGiftcardCheckout: (id: number, companyId: number) => void;
};
type State = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class MarketplaceGiftcardList extends Component<Props, State> {
  componentDidMount() {
    this.props.fetchGiftcardList({
      manager_only: false,
      company: this.props.companyId,
    });
  }

  onClickGiftcard = (id: number) => {
    this.props.goToGiftcardCheckout(id, this.props.companyId);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Grid container spacing={4}>
          {this.props.giftcardList.map((giftcard) => (
            <Grid key={giftcard.id} item xs={12} sm={6} md={4} lg={3}>
              <MarketplaceGiftcardItem
                onClick={this.onClickGiftcard}
                giftcard={giftcard}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    giftcardList: getGiftcardListActive(state),
    currentBasket: getCurrentBasket(state),
  }),
  {
    fetchGiftcardList,
  },
);

const marketplaceConnector = connect(null, {
  goToGiftcardCheckout: (id: number, companyId: number) =>
    push(`/checkout/${companyId}/giftcard/${id}`),
});

export const MarketplaceGiftcardBase = compose(
  withStyles(styles),
  withTranslation(['giftcard']),
  connector,
)(MarketplaceGiftcardList);

export default compose(marketplaceConnector)(MarketplaceGiftcardBase);

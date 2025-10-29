import React, { Component } from 'react';

import { push } from 'connected-react-router';
import { withRouter } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { TFunction } from 'i18next';
import { withTranslation, WithTranslation } from 'react-i18next';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';
import withTitle from '../../hocs/with-title.hoc';
import { getGiftcardListActive } from '../../libs/giftcard/selectors';
import { fetchGiftcardList } from '../../libs/giftcard/actions';
import MarketplaceGiftcardItem from '../../libs/giftcard/components/GiftcardMarketplace.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';

import type { RootState } from '../../reducers';
import type { Giftcard } from '#src/libs/giftcard/types';
import type { CompanyTheme } from '#src/libs/theme/types';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(3),
    },
  });

type OwnProps = {
  companyId: number;
  goToGiftcardCheckout: (id: number, companyId: number) => void;
  store?: any; // required when the component is rendered as a widget
  theme?: CompanyTheme;
  params?: {
    giftcards?: number[] | string;
  };
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class MarketplaceGiftcardList extends Component<Props> {
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
    const { classes, giftcardList, params } = this.props;

    let filteredGiftcards: Array<Giftcard> = [...giftcardList];
    if (params?.giftcards?.length) {
      let selectedGiftcards: number[] = [];
      if (typeof params.giftcards === 'string') {
        selectedGiftcards = params.giftcards
          .split(',')
          .map((id: string) => Number(id));
      } else {
        selectedGiftcards = params.giftcards;
      }
      filteredGiftcards = giftcardList?.filter((gc: Giftcard) =>
        selectedGiftcards.includes(gc.id),
      );
    }

    return (
      <div className={clsx('bs-marketplace-giftcard-page', classes.container)}>
        <Grid
          container
          className="bs-marketplace-giftcard__container"
          spacing={4}
        >
          {filteredGiftcards.map((giftcard) => (
            <Grid
              key={giftcard.id}
              item
              className="bs-marketplace-giftcard__item"
              lg={3}
              md={4}
              sm={6}
              xs={12}
            >
              <MarketplaceGiftcardItem
                giftcard={giftcard}
                onClick={this.onClickGiftcard}
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

export const MarketplaceGiftcardBase = compose<Props, OwnProps>(
  marketplaceCssHoc(),
  withStyles(styles),
  connector,
  withTranslation(['giftcard']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceGiftcard'),
  ),
)(MarketplaceGiftcardList);

export default compose(
  withRouter,
  marketplaceConnector,
  withQueryParams([['giftcards'], 'params']),
)(MarketplaceGiftcardBase);

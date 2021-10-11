// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { BUYABLE_ITEM_GIFTCARD } from '@bsport/common/lib/master-data/buyable-items';
import { RootState } from '../../../reducers';

import { getGiftcard } from '../../../libs/giftcard/selectors';
import { retrieveGiftcard } from '../../../libs/giftcard/actions';
import ConsumerGiftcardFormWithPreview from '../../../libs/giftcard/components/ConsumerGiftcardFormWithPreview.component';
import themeSelectors from '../../../libs/theme/selectors';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { fetchCompanyTheme } from '../../../libs/theme/actions';
import {
  addItemToBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';

import { getCurrentBasket } from '../../../libs/checkout/selectors';

type OwnProps = {
  companyId: number;
  id: number;
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles &
  WithTranslation;

export class GiftcardCheckout extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchCurrentBasket(this.props.companyId);
    this.props.retrieveGiftcard(this.props.id);
  }

  addItemToBasket = (data: any) => {
    this.props.addItemToBasket(
      this.props.currentBasket.id,
      {
        buyable_item_identifier: BUYABLE_ITEM_GIFTCARD,
        quantity: 1,
        buyable_item_id: this.props.id,
        extra_data: { customization_dict: data },
      },
      {
        onSuccess: () => this.props.goToBasket(this.props.companyId),
      },
    );
  };

  render() {
    if (!this.props.theme || !this.props.giftcard) return null;
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <ConsumerGiftcardFormWithPreview
          giftcard={this.props.giftcard}
          companyCover={this.props.theme.cover}
          variant="consumer"
          onSubmit={this.addItemToBasket}
        />
      </div>
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
  }),
  {
    retrieveGiftcard,
    fetchCompanyTheme,
    addItemToBasket,
    fetchCurrentBasket,
    goToBasket: (companyId: number) => push(`/checkout/${companyId}/`),
  },
);

export default compose(
  withTranslation(),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number', companyId: 'companyId:number' }),
  connector,
)(GiftcardCheckout);

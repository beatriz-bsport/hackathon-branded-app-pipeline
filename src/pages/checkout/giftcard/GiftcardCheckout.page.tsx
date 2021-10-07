import React from 'react';

import { push } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { BUYABLE_ITEM_GIFTCARD } from '@bsport/common/lib/master-data/buyable-items';
import { getGiftcard } from '../../../libs/giftcard/selectors';
import { retrieveGiftcard } from '../../../libs/giftcard/actions';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import {
  fetchCurrentBasket,
  addItemToBasket,
} from '../../../libs/checkout/actions';
import { getCurrentBasket } from '../../../libs/checkout/selectors';

import { RootState } from '../../../reducers';
import ConsumerGiftcardFormWithPreviewComponent from '../../../libs/giftcard/components/ConsumerGiftcardFormWithPreview.component';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(3),
      width: '100%',
    },
  });

type OwnProps = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class GiftcardCheckout extends React.Component<Props> {
  componentDidMount() {
    this.props.retrieveGiftcard(this.props.id);
  }

  onSubmit = (e, ...args) => {
    e.preventDefault();
    console.log(e);
  };

  render() {
    if (!this.props.giftcard) {
      return null;
    }
    return (
      <div className={this.props.classes.container}>
        <ConsumerGiftcardFormWithPreviewComponent
          giftcard={this.props.giftcard}
          onSubmit={this.onSubmit}
          variant="consumer"
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, { id }) => ({
    giftcard: getGiftcard(state, id),
    currentBasket: getCurrentBasket(state),
  }),
  {
    retrieveGiftcard,
    fetchCurrentBasket,
    goToGiftcardCheckout: (id: number, companyId: number) =>
      push(`/checkout/${companyId}/giftcard/${id}`),
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['giftcard']),
  routerParamsToProps({ id: 'id:number' }),
  connector,
)(GiftcardCheckout);

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ButtonBase, CircularProgress, Typography } from '@material-ui/core';
import { Theme, withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import BasketConsumer from '../../libs/checkout/components/BasketConsumer.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';

type OwnProps = {
  companyId: number;
  companyName: string;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class BasketPage extends React.PureComponent<Props> {
  componentDidMount() {
    if (this.props.auth.authenticated) {
      this.props.fetchCurrentBasket(this.props.companyId);
    }
  }

  onClickCheckout = () => {
    this.props.push(`/checkout/${this.props.companyId}?&context=widget`);
  };

  onItemExpire = () => {
    this.props.fetchCurrentBasket(this.props.companyId);
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.container}>
        {!this.props.basket && this.props.loading ? (
          <CircularProgress />
        ) : (
          <div className={classes.basketContainer}>
            <div className={classes.basketListItemsContainer}>
              <BasketConsumer
                basket={this.props.basket}
                withPrice
                loading={this.props.loading}
                fullWidth
                onRemoveCheckoutItem={(data: any) =>
                  this.props.removeItemFromBasket(this.props.basket.id, data)
                }
                onAddCheckoutItem={(data: any) =>
                  this.props.addItemToBasket(this.props.basket.id, data)
                }
                onItemExpire={this.onItemExpire}
              />
            </div>

            <ButtonBase
              className={`${classes.buttonContainer} ${
                this.props.basket &&
                this.props.basket.checkout_items.length === 0
                  ? classes.buttonDisabled
                  : ''
              }`}
              onClick={() => this.onClickCheckout()}
            >
              <Typography variant="h6">
                {t('checkout:myBasket.actions.checkoutBasket')}
              </Typography>
            </ButtonBase>
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  basketListItemsContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flex: 1,
    'overflow-y': 'scroll',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  buttonDisabled: {
    backgroundColor: '#D2D2D2',
    color: '#9EA2A9',
  },
});

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  basket: getCurrentBasket(state),
  loading: state.checkout.basket.current.loading,
});

const mapDispatchToProps = {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
  push,
};

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  // @ts-ignore
  withStyles(styles),
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
)(BasketPage);

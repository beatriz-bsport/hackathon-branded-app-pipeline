// @flow
import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { replace as replaceAction, goBack } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import InfoIcon from '@material-ui/icons/Info';
import type { TFunction } from 'react-i18next';
import themeSelectors from '../../../libs/theme/selectors';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import type { Theme } from '../../../libs/theme/types';
import { getTheme } from '../../../theme';
import { buildUrlParams } from '../../../http';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { getCurrentBasket } from '../../../libs/checkout/selectors';
import Analytics from '../../../components/analytics/Analytics.component';
import { fetchPrivatePassRetrieve } from '../../../libs/private-service/actions';
import { OptionCallback } from '../../../state/types';

type Props = {
  theme: Theme,
  privatePassId: number,
  goBack: () => void,
  fetchCurrentBasket: (companyId: number, options?: OptionCallback) => void,
  addItemToBasket: (basketId: number, data: any, option: *) => void,
  goToCheckout: (companyId: number) => void,
  fetchPrivatePassRetrieve: (packId, options?: OptionCallback) => void,
  classes: Object,
  t: TFunction,
};

type State = {
  error: ?boolean,
};

export class PaymentPrivatePassPage extends Component<Props, State> {
  state = {
    error: false,
  };

  componentDidMount() {
    this.props.fetchPrivatePassRetrieve(this.props.privatePassId, {
      onSuccess: (privatePass) => {
        Analytics.addPrivatePassToCart(privatePass);
        this.props.fetchCurrentBasket(privatePass.company, {
          onSuccess: (basket) => {
            this.props.addItemToBasket(
              basket.id,
              {
                buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
                quantity: 1,
                buyable_item_id: privatePass.id,
              },
              {
                onError: () => this.setState({ error: true }),
                onSuccess: () => this.props.goToCheckout(privatePass.company),
              },
            );
          },
        });
      },
    });
  }

  goToPassMarketplace = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      window.location.href = this.props.theme.scheduleURL;
    } else {
      this.props.goBack();
    }
  };

  render() {
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <div className={this.props.classes.container}>
          {this.state.error ? (
            <div className={this.props.classes.errorContainer}>
              <InfoIcon className={this.props.classes.errorIcon} />
              <Typography>
                {this.props.t('checkout:autoAdd.privatePass.error')}
              </Typography>
              <Button
                color="secondary"
                variant="contained"
                className={this.props.classes.button}
                onClick={this.goToPassMarketplace}
              >
                {this.props.t('payment:goBack')}
              </Button>
            </div>
          ) : (
            <CircularProgress />
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing(4),
    width: '100vw',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  errorIcon: {
    height: 64,
    width: 64,
    marginBottom: theme.spacing(2),
  },
  button: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
});

export default compose(
  withTranslation(['checkout', 'payment']),
  withStyles(styles),
  routerParamsToProps({ id: 'privatePassId:number' }),
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
      basket: getCurrentBasket(state),
    }),
    {
      addItemToBasket,
      removeItemFromBasket,
      fetchCurrentBasket,
      fetchPrivatePassRetrieve,
      replace: replaceAction,
      goBack,
    },
  ),
  withQueryParams([
    ['context', 'onValidation'],
    'queryParams',
    'setQueryParams',
  ]),
  withHandlers({
    goToCheckout:
      ({ replace, queryParams }) =>
      (companyId) =>
        replace(
          `/checkout/${companyId}${buildUrlParams({
            ...(queryParams?.context ? { context: queryParams.context } : {}),
            ...(queryParams?.onValidation
              ? { onValidation: queryParams.onValidation }
              : {}),
          })}`,
        ),
  }),
)(PaymentPrivatePassPage);

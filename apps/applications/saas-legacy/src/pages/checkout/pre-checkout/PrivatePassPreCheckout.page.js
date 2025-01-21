// @flow
import React, { Component } from 'react';

import { withTranslation, TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { push, replace as replaceAction, goBack } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items.js';
import InfoIcon from '@material-ui/icons/Info';
import { getCheckoutUrl } from '#src/libs/marketplace/routing-utils';
import themeSelectors from '../../../libs/theme/selectors';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import { parseQueryString } from '../../../http';
import { Theme } from '../../../libs/theme/types';
import { getTheme } from '../../../theme';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';
import { urlToMarketplace } from '../../../libs/marketplace/utils';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { getCurrentBasket } from '../../../libs/checkout/selectors';
import { fetchPrivatePassRetrieve } from '../../../libs/private-service/actions';
import { OptionCallback } from '../../../state/types';
import analyticsUtils from '../../../components/analytics/analytics';

type Props = {
  theme: Theme,
  privatePassId: number,
  goBack: () => void,
  push: (string) => void,
  fetchCurrentBasket: (companyId: number, options?: OptionCallback) => void,
  addItemToBasket: (basketId: number, data: any, option: *) => void,
  goToCheckout: (companyId: number) => void,
  fetchPrivatePassRetrieve: (packId, options?: OptionCallback) => void,
  classes: Object,
  location: Object,
  t: TFunction,
};

type State = {
  error?: boolean,
};

export class PaymentPrivatePassPage extends Component<Props, State> {
  state = {
    error: false,
  };

  componentDidMount() {
    this.props.fetchPrivatePassRetrieve(this.props.privatePassId, {
      onSuccess: (privatePass) => {
        analyticsUtils.addItemToCart(privatePass);
        this.props.fetchCurrentBasket(privatePass.company, {
          onSuccess: (basket) => {
            const { force } = parseQueryString(this.props.location.search);
            this.props.addItemToBasket(
              basket.id,
              {
                buyable_item_identifier: BUYABLE_ITEM_PRIVATE_PASS,
                quantity: 1,
                buyable_item_id: privatePass.id,
                extra_data: { force },
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
      let url = this.props.theme.scheduleURL;
      if (!url.startsWith('https://')) {
        url = this.props.theme.scheduleURL.replace(/^http/, 'https');
        if (!url.match(/^https/)) url = `https://${url}`;
      }
      window.location.href = url;
    } else if (this.props.theme) {
      this.props.push(
        urlToMarketplace(
          this.props.theme.company_name,
          this.props.theme.company,
        ),
      );
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
                className={this.props.classes.button}
                color="secondary"
                onClick={this.goToPassMarketplace}
                variant="contained"
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
      push,
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
          getCheckoutUrl(companyId, {
            ...(queryParams?.context ? { context: queryParams.context } : {}),
            ...(queryParams?.onValidation
              ? { onValidation: queryParams.onValidation }
              : {}),
          }),
        ),
  }),
)(PaymentPrivatePassPage);

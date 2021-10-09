// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { push, replace as replaceAction, goBack } from 'connected-react-router';
import { BUYABLE_ITEM_COMBO_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import InfoIcon from '@material-ui/icons/Info';
import type { TFunction } from 'react-i18next';
import withQueryParams from '../../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { parseQueryString, buildUrlParams } from '../../../http';
import themeSelectors from '../../../libs/theme/selectors';
import { getTheme } from '../../../theme';
import {
  addItemToBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';

import { fetchPaymentCombo } from '../../../libs/payment-combo/actions';
import Analytics from '../../../components/analytics/Analytics.component';

type Props = {
  theme: Theme,
  location: Location,

  push: (string) => void,
  goBack: () => void,

  id: number,
  fetchPaymentCombo: (number, OptionCallback) => void,

  fetchCurrentBasket: (companyId: number) => void,
  addItemToBasket: (basketId: number, data: any, option: *) => void,
  goToCheckout: (companyId: number) => void,

  classes: Object,
  t: TFunction,
};

type State = {
  error: ?Error,
};

export class PaymentComboPreCheckout extends React.Component<Props, State> {
  state = {
    error: null,
  };

  componentDidMount() {
    this.props.fetchPaymentCombo(this.props.id, {
      onSuccess: (paymentCombo) => {
        this.props.fetchCurrentBasket(paymentCombo.company, {
          onSuccess: (basket) => {
            const { nextOffer } = parseQueryString(this.props.location.search);
            Analytics.addPackToCart(paymentCombo);
            this.props.addItemToBasket(
              basket.id,
              {
                buyable_item_identifier: BUYABLE_ITEM_COMBO_ITEM,
                quantity: 1,
                buyable_item_id: this.props.id,
                extra_data: { offer_next: nextOffer },
              },
              {
                onError: (error) => this.setState({ error }),
                onSuccess: () => this.props.goToCheckout(paymentCombo.company),
              },
            );
          },
        });
      },
    });
  }

  goToPassMarketplace = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      this.props.push(this.props.theme.scheduleURL);
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
                {this.props.t('checkout:autoAdd.paymentCombo.locked')}
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
  routerParamsToProps({ id: 'id:number' }),
  withQueryParams([['context'], 'queryParams', 'setQueryParams']),
  connect(
    (state) => ({
      loading: state.checkout.basket.current.loading,
      theme: themeSelectors.getTheme(state),
    }),
    {
      addItemToBasket,
      fetchCurrentBasket,
      fetchPaymentCombo,
      goBack,
      replace: replaceAction,
      push,
    },
  ),
  withHandlers({
    goToCheckout: ({ replace, queryParams }) => (companyId) =>
      replace(
        `/checkout/${companyId}${buildUrlParams(
          ...(queryParams?.context ? { context: queryParams.context } : {}),
          ...(queryParams?.onValidation
            ? { onValidation: queryParams.onValidation }
            : {}),
        )}`,
      ),
  }),
)(PaymentComboPreCheckout);

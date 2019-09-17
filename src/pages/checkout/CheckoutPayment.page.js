// @flow

import React from 'react';
import { compose, withProps } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { replace, push, goBack } from 'react-router-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { getTheme } from '../../theme';
import {
  addItemToBasket,
  attachCoupon,
  removeItemFromBasket,
  fetchCurrentBasket,
  patchCurrentBasket,
  attachPayment as attachPaymentAction,
} from '../../libs/checkout/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import CheckoutFlow from '../../libs/checkout/components/CheckoutFlow.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';
import type { Theme } from '../../libs/theme/types';

import themeSelectors from '../../libs/theme/selectors';
import { fetchCompanyTheme } from '../../libs/theme/actions';

type Props = {
  basket: ?Basket,
  loading: boolean,
  processing: boolean,
  companyId: number,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
  submitPayment: (data: *) => void,
  fetchCompanyTheme: (companyId: number) => void,
  onBasketFinalized: () => void,
  push: (string) => void,
  goBack: () => void,
  theme: ?Theme,
  classes: Object,
  fetchCurrentBasket: (companyId: number) => void,
  patchCurrentBasket: (data: any) => void,
  attachCoupon: (
    code: string,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,
};

export class CheckoutPayment extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchCurrentBasket(this.props.companyId);
    this.props.fetchCompanyTheme(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.companyId !== this.props.companyId && this.props.companyId) {
      this.props.fetchCurrentBasket(this.props.companyId);
    }
  }

  render() {
    if (this.props.basket && this.props.basket.is_finalized) {
      this.props.onBasketFinalized();
    }
    if (this.props.loading || !this.props.basket) {
      return (
        <div className={this.props.classes.container}>
          <CircularProgress />
        </div>
      );
    }
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <div className={this.props.classes.container}>
          <Paper className={this.props.classes.paper}>
            <CheckoutFlow
              basket={this.props.basket}
              loading={this.props.loading}
              processing={this.props.processing}
              submitPayment={this.props.submitPayment}
              addItemToBasket={this.props.addItemToBasket}
              removeItemFromBasket={this.props.removeItemFromBasket}
              termsAndConditions={this.props.theme.general_terms_and_conditions}
              attachCoupon={this.props.attachCoupon}
              backToCalendar={() => {
                if (this.props.theme && this.props.theme.scheduleURL) {
                  return this.props.push(this.props.theme);
                }
                return this.props.goBack();
              }}
              patchBasket={(data, options) =>
                this.props.patchCurrentBasket(data, options)
              }
            />
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    overflow: 'auto',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 4,
  },
  paper: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect(
    (state) => ({
      basket: getCurrentBasket(state),
      loading: state.checkout.basket.current.loading,
      processing: state.checkout.basket.current.updating,
      theme: themeSelectors.getTheme(state),
    }),
    {
      addItemToBasket,
      removeItemFromBasket,
      goBack,
      push,
      fetchCurrentBasket,
      patchCurrentBasket,
      attachPayment: attachPaymentAction,
      attachCoupon,
      fetchCompanyTheme,
      onBasketFinalized: () => replace('/customer'),
    },
  ),
  withProps(({ attachPayment }) => ({
    submitPayment: attachPayment,
  })),
)(CheckoutPayment);

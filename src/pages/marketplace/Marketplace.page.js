// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import AppBarMUI from '@material-ui/core/AppBar';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { replace, push as pushRouter } from 'react-router-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import CheckoutDialog from '../../libs/order/components/CheckoutDialog.component';
import ConsumerLogin from '../../components/consumer/login/ConsumerLogin.component';
import type { DeliveryData } from '../../libs/order/types';
import AppBar from './AppBar.component';
import SignUpForm from '../../components/form/SignUpForm.component';

import {
  removeProductFromOrder as removeProductFromOrderAction,
  updateCurrentOrder as updateOrderAction,
  getOrCreateCurrentOrder,
  resetOrders as resetOrdersAction,
} from '../../libs/order/actions';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MarketplacePassPage from './MarketplacePass.page';
import MarketplaceShopPage from './MarketplaceShop.page';
import MarketplaceCalendarPage from './MarketplaceCalendar.page';

import {
  consumer as consumerActions,
  auth as authActions,
  marketplace as marketplaceActions,
} from '../../actions';

type Props = {
  companyName: string,
  companyId: number,
  company: MarketPlaceCompany,
  companyLoading: boolean,
  fetchCompany: (companyId: number) => void,
  fetchCurrentOrder: (companyId: number) => void,
  fetchProfile: () => void,
  doEmailLogin: ({ email: string, password: string }, () => void) => void,
  goToTab: (companyName: string, companyId: number, tab: string) => void,
  tab: string,
  replace: (path: string) => void,
  goToUserSpace: () => void,

  auth: *,
  consumerProfile: *,

  t: TFunction,
  classes: Object,
  fullScreen: boolean,

  currentOrder: ?Order,
  currentOrderLoading: boolean,

  removeProduct: (productId: number) => void,

  updateOrder: (orderId: string, deliveryData: DeliveryData) => void,
  resetOrders: () => void,
  goToPayment: (companyId: number) => void,
  disconnect: () => void,
  signup: (data: *, callback: () => void) => void,
};

type State = {
  signupDialogOpen: boolean,
  currentOrderOpen: boolean,
  loginDialogOpen: boolean,
};

const TAB_CALENDAR = 'calendar';
const TAB_PASS = 'pass';
const TAB_SHOP = 'shop';
const DEFAULT_TAB = TAB_CALENDAR;

export class MarketPlace extends Component<Props, State> {
  state = {
    currentOrderOpen: false,
    signupDialogOpen: false,
    loginDialogOpen: false,
  };

  componentWillMount() {
    this.props.resetOrders();
  }

  fetchData = () => {
    this.props.fetchCompany(this.props.companyId);
    if (this.props.auth.authenticated) {
      this.props.fetchCurrentOrder(this.props.companyId);
      this.props.fetchProfile();
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.companyId !== prevProps.companyId) {
      this.fetchData();
    }
  }

  handleTabChange = (event: SyntheticEvent<HTMLElement>, value: string) => {
    this.props.goToTab(this.props.company.name, this.props.company.id, value);
  };

  renderContent = () => {
    if (!this.props.companyId) {
      return null;
    }
    switch (this.props.tab || DEFAULT_TAB) {
      case TAB_PASS:
        return <MarketplacePassPage companyId={this.props.companyId} />;
      case TAB_SHOP:
        return (
          <MarketplaceShopPage
            requestSignUp={() => this.toogleLogin(true)}
            companyId={this.props.companyId}
            currentOrder={this.props.currentOrder}
            currentOrderLoading={this.props.currentOrderLoading}
            toogleCurrentOrderOpen={this.toogleCurrentOrderOpen}
          />
        );
      case TAB_CALENDAR:
      default: {
        return <MarketplaceCalendarPage companyId={this.props.companyId} />;
      }
    }
  };

  toogleCurrentOrderOpen = (currentOrderOpen: boolean) =>
    this.setState({ currentOrderOpen });

  signup = (data: *, callback: () => void) => {
    const data_ = { ...data, membership: this.props.company.id };
    this.props.signup(data_, callback);
  };

  toogleSignUp = (value: boolean) => {
    this.setState({ signupDialogOpen: value });
  };

  toogleLogin = (value: boolean) => {
    this.setState({ loginDialogOpen: value });
  };

  closeSignup = () => this.setState({ signupDialogOpen: false });

  doEmailLogin = ({ email, password }) => {
    this.props.doEmailLogin({ email, password }, () => {
      this.props.fetchProfile();
      this.props.fetchCurrentOrder(this.props.companyId);
    });
  };

  render() {
    const { companyLoading, classes, t, company, currentOrder } = this.props;
    if (!company) {
      if (!companyLoading) {
        this.props.fetchCompany(this.props.companyId);
      }
      return (
        <Grid container item alignItems="center" justify="center">
          <LinearProgress />
        </Grid>
      );
    }

    if (decodeURI(this.props.companyName) !== this.props.company.name) {
      this.props.replace(
        `/m/${this.props.company.name}/${this.props.companyId}/${this.props
          .tab || ''}`,
      );
    }
    return (
      <div className={classes.container}>
        <AppBar
          title={company.name}
          auth={this.props.auth}
          goToUserSpace={this.props.goToUserSpace}
          currentOrder={currentOrder}
          company={this.props.company}
          openCurrentOrder={() => this.toogleCurrentOrderOpen(true)}
          requestSignUp={() => this.toogleSignUp(true)}
          requestLogin={() => this.toogleLogin(true)}
          disconnect={() => {
            this.props.disconnect();
            this.props.resetOrders();
          }}
        />
        <AppBarMUI position="relative" color="default">
          <Tabs
            value={this.props.tab || DEFAULT_TAB}
            onChange={this.handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value={TAB_CALENDAR} label={t('marketplace.calendar')} />
            <Tab value={TAB_PASS} label={t('marketplace.pass')} />
            <Tab value={TAB_SHOP} label={t('marketplace.shop.tabName')} />
          </Tabs>
        </AppBarMUI>
        <div className={classes.content}>{this.renderContent()}</div>
        <Dialog
          open={this.state.currentOrderOpen}
          fullScreen={this.props.fullScreen}
        >
          <CheckoutDialog
            order={currentOrder}
            onCancel={() => this.toogleCurrentOrderOpen(false)}
            loading={this.props.currentOrderLoading}
            onSubmit={(deliveryData: DeliveryData) => {
              this.props.updateOrder(this.props.currentOrder.id, deliveryData);
              this.props.goToPayment(this.props.companyId);
            }}
            onRemoveProduct={(p) =>
              this.props.removeProduct(
                { ...p, quantity: 1 },
                this.props.currentOrder.id,
              )
            }
            consumerProfile={this.props.consumerProfile}
          />
        </Dialog>
        <Dialog
          open={this.state.loginDialogOpen && !this.props.auth.authenticated}
          onClose={() => this.toogleLogin(false)}
        >
          <DialogContent>
            <ConsumerLogin
              doEmailLogin={this.doEmailLogin}
              error={this.props.auth.error}
              loading={this.props.auth.loading}
              requestSignUp={() => this.toogleSignUp(true)}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.signupDialogOpen && !this.props.auth.authenticated}
          onClose={this.closeSignup}
        >
          <DialogTitle>{t('form.signUpTitle')}</DialogTitle>
          <DialogContent>
            <SignUpForm
              loading={this.props.auth.loading}
              onComplete={(data: *) =>
                this.signup(data, () => {
                  this.props.fetchProfile();
                  this.props.fetchCurrentOrder(this.props.companyId);
                })
              }
              onCancel={this.closeSignup}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  },
  content: {
    overflowY: 'auto',
    position: 'relative',
    paddingBottom: theme.spacing.unit * 4,
  },
  title: {
    marginBottom: theme.spacing.unit * 6,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  withMobileDialog(),
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
    tab: 'tab',
  }),
  connect(
    (state) => ({
      auth: state.auth,
      company: state.marketplace.company,
      companyLoading: state.marketplace.companyLoading,
      currentOrder: state.order.order.current.data,
      currentOrderLoading: state.order.order.current.loading,
      consumerProfile: state.consumer.profile,
    }),
    {
      fetchCompany: marketplaceActions.fetchCompany,
      signup: (data: *, callback: () => void) =>
        authActions.signup(data, { onDone: callback }),
      doEmailLogin: ({ email, password }, callback) =>
        authActions.requestLogin(email, password, { onDone: callback }),
      disconnect: authActions.disconnect,
      resetOrders: resetOrdersAction,
      fetchCurrentOrder: getOrCreateCurrentOrder,
      removeProduct: removeProductFromOrderAction,
      fetchProfile: consumerActions.fetchProfile,
      updateOrder: updateOrderAction,
      replace,
      goToUserSpace: () => pushRouter('/'),
      goToPayment: (companyId) =>
        pushRouter(`/customer/payment/order/${companyId}/`),
      goToTab: (companyName: string, companyId: number, tab: string) =>
        pushRouter(`/m/${companyName}/${companyId}/${tab}/`),
    },
  ),
)(MarketPlace);

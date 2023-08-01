// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import asyncComponent from '../../AsyncComponent';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme } from '../../theme';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { Theme } from '../../libs/theme/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

const BridgeWidget = asyncComponent(() => import('./BridgeWidget.page'));
const Basket = asyncComponent(() => import('./Basket.page'));
const ProfileWidgetPage = asyncComponent(() => import('./Profile.page'));
const ConsumerSubscription = asyncComponent(
  () => import('./ConsumerSubscription.page'),
);
const BookingsAndPrivateBookings = asyncComponent(
  () => import('./BookingsAndPrivateBookings.page'),
);

interface Props {
  theme: Theme;
  fetchCompanyTheme: (number) => void;
}

class WidgetRouter extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme(this.props.companyId);
  }

  render() {
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Switch>
          <Route
            component={BridgeWidget}
            path="/widget/:companyName/:companyId/bridge"
          />
          <Route
            component={Basket}
            path="/widget/:companyName/:companyId/basket"
          />
          <Route
            component={BookingsAndPrivateBookings}
            path="/widget/:companyName/:companyId/bookings/"
          />
          <Route
            component={ProfileWidgetPage}
            path="/widget/:companyName/:companyId/profile/"
          />
          <Route
            component={ConsumerSubscription}
            path="/widget/:companyName/:companyId/subscription/"
          />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchCompanyTheme,
    },
  ),
)(WidgetRouter);

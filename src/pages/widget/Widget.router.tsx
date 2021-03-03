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
            path="/widget/:companyName/:companyId/bridge"
            component={BridgeWidget}
          />
          <Route
            path="/widget/:companyName/:companyId/basket"
            component={Basket}
          />
          <Route
            path="/widget/:companyName/:companyId/bookings/"
            component={BookingsAndPrivateBookings}
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

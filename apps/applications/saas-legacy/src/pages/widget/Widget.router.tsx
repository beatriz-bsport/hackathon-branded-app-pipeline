import React from 'react';
import { Route, Switch } from 'react-router';

import {
  MuiThemeProvider,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import { connect, ConnectedComponent, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
import themeSelectors from '../../libs/theme/selectors';
// @ts-expect-error
import { getTheme } from '../../theme';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import ConsumerProfileReworked from '#src/pages/consumer/ConsumerProfileReworked.page';
import ConsumerBookingReworked from '#src/pages/consumer/ConsumerBookingReworked.page';
import ConsumerSubscriptionReworked from '#src/pages/consumer/ConsumerSubscriptionReworked.page';
import { getMembership } from '#src/libs/membership/selectors';
import { RootState } from '#src/reducers';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';
//@ts-expect-error
import BasketPage from '#src/pages/checkout/basket/Basket.page';
import { fetchMembershipByCompany as fetchMembershipByCompanyAction } from '#src/libs/membership/actions';

const BridgeWidget = asyncComponent(() => import('./BridgeWidget.page'));

type RouterProps = {
  companyId: number;
};

type Props = RouterProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles>;

class WidgetRouter extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme(this.props.companyId);
    if (!this.props.membership) {
      this.props.fetchMembershipByCompany(this.props.companyId);
    }
  }

  attachConsumerProps =
    (
      MyComponent:
        | React.ComponentClass<Record<string, any>, Record<string, any>>
        | ConnectedComponent<any, Record<string, any>>,
    ) =>
    (props: Record<string, any>) =>
      (
        <div className={this.props.classes.consumerSpaceContainer}>
          <MyComponent
            companyId={this.props.companyId}
            {...props}
            membership={this.props.membership}
            queryParams={{ consumerspacecontext: ConsumerSpaceContextEnum.FAB }}
          />
        </div>
      );

  render() {
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Switch>
          <Route
            component={BridgeWidget}
            path="/widget/:companyName/:companyId/bridge"
          />
          <Route
            component={BasketPage}
            path="/widget/:companyName/:companyId/basket"
          />
          <Route
            component={this.attachConsumerProps(ConsumerBookingReworked)}
            path="/widget/:companyName/:companyId/bookings/"
          />
          <Route
            component={this.attachConsumerProps(ConsumerProfileReworked)}
            path="/widget/:companyName/:companyId/profile/"
          />
          <Route
            component={this.attachConsumerProps(ConsumerSubscriptionReworked)}
            path="/widget/:companyName/:companyId/subscription/"
          />
        </Switch>
      </MuiThemeProvider>
    );
  }
}

const connector = connect(
  (state: RootState, props: RouterProps) => ({
    theme: themeSelectors.getTheme(state),
    membership: getMembership(state, props.companyId),
  }),
  {
    fetchCompanyTheme,
    fetchMembershipByCompany: fetchMembershipByCompanyAction,
  },
);

const styles = () => ({
  consumerSpaceContainer: {
    display: 'flex',
    flex: 1,
  },
});

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    // @ts-expect-error
    companyName: 'companyName',
  }),
  withStyles(styles),
  connector,
)(WidgetRouter);

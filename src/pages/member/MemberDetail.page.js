// @flow
import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Fab from '@material-ui/core/Fab';
import AppBar from '@material-ui/core/AppBar';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import PaymentIcon from '@material-ui/icons/Payment';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import memberSelectors from '../../libs/member/selectors';
import withTitle from '../../hocs/with-title.hoc';

import asyncComponent from '../../AsyncComponent';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

const MemberDetailInfo = asyncComponent(() =>
  import('./MemberDetailInfo.page'),
);
const MemberDetailPass = asyncComponent(() =>
  import('./MemberDetailPass.page'),
);
const MemberDetailRelation = asyncComponent(() =>
  import('./MemberDetailRelation.page'),
);
const MemberDetailBooking = asyncComponent(() =>
  import('./MemberDetailBooking.page'),
);
const MemberDetailPayment = asyncComponent(() =>
  import('./MemberDetailPayment.page'),
);
const MemberDetailPrivateBooking = asyncComponent(() =>
  import('./MemberDetailPrivateBooking.page'),
);
const MemberDetailPrivateConsumerPass = asyncComponent(() =>
  import('./MemberDetailPrivateConsumerPass.page'),
);

type Props = {
  t: TFunction,
  classes: Object,
  tab: string,
  id: number,
  member: ?Member,
  pushToTab: (memberId: number, tab: string) => void,
  billMember: (id: number) => void,
  subscribeMember: (id: number) => void,
};

const MemberActions = (props: {
  t: TFunction,
  classes: Object,
  billMember: (id: number) => void,
  subscribeMember: (id: number) => void,
}) => (
  <div className={props.classes.bottomButtonContainer}>
    <Fab
      color="primary"
      variant="extended"
      className={props.classes.bottomButton}
      onClick={props.billMember}
    >
      <EuroSymbolIcon className={props.classes.leftIcon} />
      {props.t('payment.toBill')}
    </Fab>
    <Fab
      color="secondary"
      className={props.classes.bottomButton}
      variant="extended"
      onClick={props.subscribeMember}
    >
      <PaymentIcon className={props.classes.leftIcon} />
      {props.t('payment.toSubscribe')}
    </Fab>
  </div>
);

export function MemberDetail(props: Props) {
  const { t, classes, pushToTab, billMember, subscribeMember, tab, id } = props;
  return (
    <div className={classes.container}>
      <Helmet>
        <title>{props.member ? props.member.name : 'Member'}</title>
      </Helmet>
      <AppBar position="static" color="default">
        <Tabs
          scrollButtons="off"
          variant="scrollable"
          value={tab}
          onChange={(e, newTab) => {
            pushToTab(id, newTab);
          }}
        >
          <Tab label={t('member.menu.info')} value="info" />
          <Tab label={t('member.menu.bookings')} value="bookings" />
          <Tab label={t('member.menu.paymentPack')} value="pass" />
          <Tab label={t('member.menu.payment')} value="payment" />
          <Tab label={t('member.menu.relation')} value="relation" />
          <Tab
            label={t('member.menu.privateBooking')}
            value="private-booking"
          />
          <Tab
            label={t('member.menu.privateConsumerPass')}
            value="private-consumer-pass"
          />
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        <Switch>
          <Route
            exact
            path="/member/:id/bookings/:bookingId/"
            component={MemberDetailBooking}
          />
          <Route
            exact
            path="/member/:id/bookings"
            component={MemberDetailBooking}
          />
          <Route
            exact
            path="/member/:id/pass/:consumerPassId"
            component={MemberDetailPass}
          />
          <Route exact path="/member/:id/pass" component={MemberDetailPass} />
          <Route
            exact
            path="/member/:id/relation/:relation"
            component={MemberDetailRelation}
          />
          <Route path="/member/:id/relation" component={MemberDetailRelation} />
          <Route
            exact
            path="/member/:id/payment"
            component={MemberDetailPayment}
          />
          <Route exact path="/member/:id/info" component={MemberDetailInfo} />
          <Route
            exact
            path="/member/:id/private-booking/:privateBookingId"
            component={MemberDetailPrivateBooking}
          />
          <Route
            exact
            path="/member/:id/private-booking"
            component={MemberDetailPrivateBooking}
          />
          <Route
            exact
            path="/member/:id/private-consumer-pass/:privateConsumerPassId"
            component={MemberDetailPrivateConsumerPass}
          />
          <Route
            exact
            path="/member/:id/private-consumer-pass"
            component={MemberDetailPrivateConsumerPass}
          />
        </Switch>
      </div>
      <MemberActions
        t={t}
        classes={classes}
        billMember={() => billMember(id)}
        subscribeMember={() => subscribeMember(id)}
      />
    </div>
  );
}

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing.unit * 4,
    marginTop: -theme.spacing.unit * 3,
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: -theme.spacing.unit * 3,
      width: 'auto',
      marginRight: -theme.spacing.unit * 3,
      marginTop: -theme.spacing.unit * 2,
    },
  },
  content: {
    marginBottom: theme.spacing.unit * 8,
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 8,
    },
    marginTop: theme.spacing.unit * 2,
  },
  bottomButtonContainer: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  bottomButton: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  routerParamsToProps({ tab: 'tab', id: 'id:number' }),
  connect(
    (state, { id }) => ({
      member: memberSelectors.get(state, id),
    }),
    (dispatch) => ({
      billMember(id) {
        dispatch(pushRouter(`/invoice/add/member/${id}`));
      },
      subscribeMember(id) {
        dispatch(pushRouter(`/subscription/add/${id}`));
      },
      pushToTab(id, tab) {
        dispatch(pushRouter(`/member/${id}/${tab}`));
      },
    }),
  ),
  withTitle(({ member }) => (member ? member.name : '')),
)(MemberDetail);

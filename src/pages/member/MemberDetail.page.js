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
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withHandlers, withState } from 'recompose';

import {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';

import memberSelectors from '../../libs/member/selectors';
import withTitle from '../../hocs/with-title.hoc';

import { getAvailableContractListWithPaymentPack } from '../../libs/subscription/selectors';
import SubscriptionContractRegister from '../../libs/subscription/components/SubscriptionContractRegister.component';

import asyncComponent from '../../AsyncComponent';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchAllPaymentPacks,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
} from '../../libs/payment-packs/actions';
import { fetchContractList as fetchContractListAction } from '../../libs/subscription/actions';

import type { Contract } from '../../libs/subscription/types';
import type { Member } from '../../libs/member/types';

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
const MemberDetailContact = asyncComponent(() =>
  import('./MemberDetailContact.page'),
);

type Props = {
  t: TFunction,
  classes: Object,
  tab: string,
  id: number,
  member: ?Member,
  pushToTab: (memberId: number, tab: string) => void,
  billMember: (id: number) => void,
  fetchAllPaymentPacks: () => void,

  openContractDialog: () => void,
  contractList: Array<Contract>,
  contractLoading: boolean,
  contractToBill: ?Contract,
  contractDialogOpen: boolean,
  closeContractDialog: () => void,
  setContractToBill: (Contract) => void,
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
      {props.t('paymentAction.toBill')}
    </Fab>
    <Fab
      color="secondary"
      className={props.classes.bottomButton}
      variant="extended"
      onClick={props.subscribeMember}
    >
      <PaymentIcon className={props.classes.leftIcon} />
      {props.t('paymentAction.toSubscribe')}
    </Fab>
  </div>
);

export class MemberDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllPaymentPacks();
  }

  render() {
    const { t, classes, pushToTab, billMember, tab, id, member } = this.props;
    return (
      <div className={classes.container}>
        <Helmet>
          <title>{member ? member.name : ''}</title>
        </Helmet>
        <AppBar position="static" color="default">
          <Tabs
            variant="scrollable"
            value={tab}
            onChange={(e, newTab) => {
              pushToTab(id, newTab);
            }}
          >
            <Tab label={t('menu.info')} value="info" />
            <Tab label={t('menu.bookings')} value="bookings" />
            <Tab label={t('menu.paymentPack')} value="pass" />
            <Tab label={t('menu.payment')} value="payment" />
            <Tab label={t('menu.contact')} value="contact" />
            <Tab label={t('menu.relation')} value="relation" />
            <Tab label={t('menu.privateBooking')} value="private-booking" />
            <Tab
              label={t('menu.privateConsumerPass')}
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
            <Route
              path="/member/:id/relation"
              component={MemberDetailRelation}
            />
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
            <Route
              exact
              path="/member/:id/contact"
              component={MemberDetailContact}
            />
          </Switch>
        </div>
        <MemberActions
          t={t}
          classes={classes}
          billMember={() => billMember(id)}
          subscribeMember={this.props.openContractDialog}
        />
        <SubscriptionContractRegister
          initialMember={this.props.member}
          contract={this.props.contractToBill}
          contractList={this.props.contractList}
          contractLoading={this.props.contractLoading}
          onChangeContract={this.props.setContractToBill}
          goToCustomSubscriptionForm={() =>
            this.props.subscribeMember(this.props.id)
          }
          member={this.props.member}
          open={this.props.contractDialogOpen}
          onClose={this.props.closeContractDialog}
          onSuccess={() => {
            this.props.closeContractDialog();
            this.props.pushToTab(id, 'payment');
          }}
          enabledPaymentMethods={[
            BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
            BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
            BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
          ]}
        />
      </div>
    );
  }
}
/*
            <Route
              exact
              path="/member/:id/contact"
              component={MemberDetailContact}
  />
*/

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(4),
    marginTop: -theme.spacing(3),
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      marginLeft: -theme.spacing(3),
      width: 'auto',
      marginRight: -theme.spacing(3),
      marginTop: -theme.spacing(2),
    },
  },
  content: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(8),
    },
    marginTop: theme.spacing(2),
  },
  bottomButtonContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  bottomButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['member']),
  routerParamsToProps({ tab: 'tab', id: 'id:number' }),
  connect(
    (state, { id }) => ({
      member: memberSelectors.get(state, id),
      contractLoading: state.subscription.contract.loading,
      contractList: getAvailableContractListWithPaymentPack(state),
    }),
    {
      fetchAllPaymentPacks,
      billMember: (id) => pushRouter(`/invoice/add/member/${id}`),
      pushToTab: (id, tab) => pushRouter(`/member/${id}/${tab}`),
      fetchContractList: fetchContractListAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      subscribeMember: (id) => pushRouter(`/subscription/add/${id}`),
    },
  ),
  withHandlers({
    fetchContractList: (props) => () => {
      props.fetchContractList(
        {},
        {
          onSuccess: (contractList) =>
            props.fetchPaymentPackBulk(contractList.map((c) => c.payment_pack)),
        },
      );
    },
  }),
  withState('contractDialogOpen', 'setContractDialogOpen', false),
  withState('contractToBill', 'setContractToBill', null),
  withHandlers({
    closeContractDialog: ({
      setContractDialogOpen,
      setContractToBill,
    }) => () => {
      setContractDialogOpen(false);
      setContractToBill(null);
    },
    openContractDialog: ({
      setContractDialogOpen,
      fetchContractList,
      setContractToBill,
    }) => () => {
      fetchContractList();
      setContractDialogOpen(true);
      setContractToBill(null);
    },
  }),
  withTitle(({ member }) => (member ? member.name : '')),
)(MemberDetail);

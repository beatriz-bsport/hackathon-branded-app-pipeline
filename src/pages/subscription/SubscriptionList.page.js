// @flow

import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { PENDING as PLANNED_INVOICE_PENDING } from '@bsport/common/lib/master-data/planned-invoice-status';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import withTitle from '../../hocs/with-title.hoc';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import EventPanel from '../../libs/event/components/EventPanel.component';
import PlannedInvoiceList from '../../libs/subscription/components/PlannedInvoiceList.component';
import { COMPANY_EVENTS } from '../../libs/subscription/components/event.utils';

import {
  getSubscriptionList,
  getSubscriptionEventList,
  getSubscriptionEventState,
  getPlannedInvoiceList,
} from '../../libs/subscription/selectors';
import {
  fetchSubscriptionList as fetchSubscriptionListAction,
  fetchSubscriptionBulk as fetchSubscriptionBulkAction,
  fetchSubscriptionEventList as fetchSubscriptionEventListAction,
  fetchPlannedInvoiceList as fetchPlannedInvoiceListAction,
} from '../../libs/subscription/actions';

type Props = {
  goToSubscription: (id: number) => void,
  fetchSubscriptionList: (page: number) => void,
  subscriptionList: Array<Subscription>,
  subscriptionLoading: boolean,
  subscriptionCount: number,

  eventLoading: boolean,
  eventPage: number,
  eventList: Array<EventSubscription>,
  fetchSubscriptionEventList: ({ page: number, page_size: number }) => void,

  plannedInvoiceCount: number,
  plannedInvoicePage: number,
  plannedInvoiceLoading: boolean,
  plannedInvoiceList: Array<PlannedInvoice>,
  fetchPlannedInvoicePage: (page: number, page_size: number) => void,

  t: TFunction,
  classes: Object,
};

const PLANNED_INVOICE_PAGE_SIZE = 10;

export class SubscriptionList extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.classes.container}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={6}>
            <div className={this.props.classes.divider} />
            <PlannedInvoiceList
              count={this.props.plannedInvoiceCount}
              title={this.props.t('plannedInvoice.list.titleNext')}
              page={this.props.plannedInvoicePage}
              loading={this.props.plannedInvoiceLoading}
              plannedInvoiceList={this.props.plannedInvoiceList}
              fetchPlannedInvoicePage={this.props.fetchPlannedInvoicePage}
              onClick={this.props.goToSubscription}
              itemPerPage={PLANNED_INVOICE_PAGE_SIZE}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <div className={this.props.classes.divider} />
            <Paper>
              <EventPanel
                loading={this.props.eventLoading}
                eventList={this.props.eventList}
                page={this.props.eventPage}
                eventSpec={COMPANY_EVENTS}
                fetchEventList={this.props.fetchSubscriptionEventList}
                onEventClick={this.props.goToSubscription}
              />
            </Paper>
          </Grid>
        </Grid>
        <Typography className={this.props.classes.sectionTitle} variant="h4">
          {this.props.t('subscription.list.title')}
        </Typography>
        <Divider className={this.props.classes.divider} />
        <SubscriptionTable
          goToSubscription={this.props.goToSubscription}
          subscriptionList={this.props.subscriptionList}
          loading={this.props.subscriptionLoading}
          count={this.props.subscriptionCount}
          onPageChange={this.props.fetchSubscriptionList}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: '20vh',
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['subscription']),
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:subscription.subscriptions'),
  ),
  connect(
    (state) => ({
      subscriptionList: getSubscriptionList(state),
      subscriptionCount: state.subscription.list.count,
      subscriptionLoading: state.subscription.list.loading,
      eventList: getSubscriptionEventList(state),
      eventPage: getSubscriptionEventState(state).page,
      eventLoading: getSubscriptionEventState(state).loading,
      plannedInvoiceCount: state.subscription.plannedInvoice.count,
      plannedInvoiceLoading: state.subscription.plannedInvoice.loading,
      plannedInvoiceList: getPlannedInvoiceList(state),
      plannedInvoicePage: state.subscription.plannedInvoice.page,
    }),
    {
      fetchSubscriptionList: fetchSubscriptionListAction,
      fetchSubscriptionBulk: fetchSubscriptionBulkAction,
      fetchSubscriptionEventList: fetchSubscriptionEventListAction,
      goToSubscription: (id) => pushRouter(`/subscription/${id}`),
      fetchPlannedInvoiceList: fetchPlannedInvoiceListAction,
    },
  ),
  withHandlers({
    fetchSubscriptionList: ({ fetchSubscriptionList }) => (
      page: number,
      params: any = {},
    ) => {
      fetchSubscriptionList({
        page,
        page_size: 10,
        ...params,
      });
    },
  }),
  withHandlers({
    fetchPlannedInvoicePage: ({ fetchPlannedInvoiceList }) => (
      page,
      page_size,
    ) => {
      fetchPlannedInvoiceList(
        page,
        {
          status: PLANNED_INVOICE_PENDING.id,
          billing_plan__active: true,
          date__gte: moment().format('YYYY-MM-DD'),
        },
        page_size,
      );
    },
    fetchSubscriptionEventList: ({
      fetchSubscriptionEventList,
      fetchSubscriptionBulk,
    }) => (params) => {
      fetchSubscriptionEventList(params, {
        onSuccess: (eventList) =>
          fetchSubscriptionBulk(eventList.map((e) => e.data.billing_plan)),
      });
    },
  }),
)(SubscriptionList);

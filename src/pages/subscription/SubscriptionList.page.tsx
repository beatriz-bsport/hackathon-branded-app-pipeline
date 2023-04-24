// @ts-nocheck
// @flow

import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment-timezone';
import { PENDING as PLANNED_INVOICE_PENDING } from '@bsport/common/lib/master-data/planned-invoice-status';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import withTitle from '../../hocs/with-title.hoc';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import EventPanel from '../../libs/event/components/EventPanel.component';
import PlannedInvoiceList from '../../libs/subscription/components/PlannedInvoiceList.component';
import { COMPANY_EVENTS } from '#libs/subscription/event.utils';
import {
  PlannedInvoice,
  Subscription,
  SubscriptionQueryParams,
} from '../../libs/subscription/types';

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
import { MaterialStyleType } from '../../utils/types';
import { SubscriptionEvent } from '#libs/event/types';
import { RootState } from '../../reducers';

type OwnProps = {
  goToSubscription: (id: number) => void;
  fetchSubscriptionList: (params: SubscriptionQueryParams) => void;
  subscriptionList: Array<Subscription>;
  subscriptionLoading: boolean;
  subscriptionCount: number;

  eventLoading: boolean;
  eventPage: number;
  eventList: Array<SubscriptionEvent>;
  fetchSubscriptionEventList: ({
    page,
    page_size,
    member,
  }: SubscriptionQueryParams) => void;

  plannedInvoiceCount: number;
  plannedInvoicePage: number;
  plannedInvoiceLoading: boolean;
  plannedInvoiceList: Array<PlannedInvoice>;
  fetchPlannedInvoicePage: (page: number, page_size: number) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

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
        <Typography className={this.props.classes.sectionTitle} variant="h5">
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

const styles = (theme: Theme) => ({
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
  withTitle(({ t }) => t('navigation:backofficeMenu.subscription')),
  connect(
    (state: RootState) => ({
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
      goToSubscription: (id: number) => pushRouter(`/subscription/${id}`),
      fetchPlannedInvoiceList: fetchPlannedInvoiceListAction,
    },
  ),
  withHandlers({
    fetchSubscriptionList:
      ({ fetchSubscriptionList }) =>
      (params: SubscriptionQueryParams) => {
        fetchSubscriptionList({
          page: 1,
          page_size: 10,
          ...params,
        });
      },
  }),
  withHandlers({
    fetchPlannedInvoicePage:
      ({ fetchPlannedInvoiceList }) =>
      (page: number, page_size: number) => {
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
    fetchSubscriptionEventList:
      ({ fetchSubscriptionEventList, fetchSubscriptionBulk }) =>
      (params: SubscriptionQueryParams) => {
        fetchSubscriptionEventList(params, {
          onSuccess: (eventList: Array<SubscriptionEvent>) =>
            fetchSubscriptionBulk(eventList.map((e) => e.data.billing_plan)),
        });
      },
  }),
)(SubscriptionList);

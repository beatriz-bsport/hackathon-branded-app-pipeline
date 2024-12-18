import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import { Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { PENDING as PLANNED_INVOICE_PENDING } from '@bsport/common/lib/master-data/planned-invoice-status';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { DateTime } from 'luxon';
import { COMPANY_EVENTS } from '#src/libs/subscription/event.utils';
import { SubscriptionEvent } from '#src/libs/event/types';
import withTitle from '../../hocs/with-title.hoc';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import EventPanel from '../../libs/event/components/EventPanel.component';
// @ts-expect-error
import PlannedInvoiceList from '../../libs/subscription/components/PlannedInvoiceList.component';
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
import { RootState } from '#src/reducers';

type OwnProps = {
  goToSubscription: (id: number) => void;
  fetchSubscriptionList: (params: SubscriptionQueryParams) => void;
  subscriptionList: Array<Subscription>;
  subscriptionLoading: boolean;
  subscriptionCount: number;
  companyId: number;
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
  onEventClick = (event: SubscriptionEvent) => {
    this.props.goToSubscription(event.subscription?.id);
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <Grid container spacing={1}>
          <Grid item lg={6} xs={12}>
            <div className={this.props.classes.divider} />
            <PlannedInvoiceList
              count={this.props.plannedInvoiceCount}
              fetchPlannedInvoicePage={this.props.fetchPlannedInvoicePage}
              itemPerPage={PLANNED_INVOICE_PAGE_SIZE}
              loading={this.props.plannedInvoiceLoading}
              onClick={this.props.goToSubscription}
              page={this.props.plannedInvoicePage}
              plannedInvoiceList={this.props.plannedInvoiceList}
              title={this.props.t('plannedInvoice.list.titleNext')}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <div className={this.props.classes.divider} />
            <Paper>
              <EventPanel
                eventList={this.props.eventList}
                eventSpec={COMPANY_EVENTS}
                fetchEventList={this.props.fetchSubscriptionEventList}
                loading={this.props.eventLoading}
                onEventClick={this.onEventClick}
                page={this.props.eventPage}
              />
            </Paper>
          </Grid>
        </Grid>
        <Typography className={this.props.classes.sectionTitle} variant="h5">
          {this.props.t('subscription.list.title')}
        </Typography>
        <Divider className={this.props.classes.divider} />
        {/* @ts-expect-error */}
        <SubscriptionTable
          companyId={this.props.companyId}
          count={this.props.subscriptionCount}
          goToSubscription={this.props.goToSubscription}
          loading={this.props.subscriptionLoading}
          onPageChange={this.props.fetchSubscriptionList}
          subscriptionList={this.props.subscriptionList}
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
      // @ts-expect-error
      subscriptionCount: state.subscription.list.count,
      subscriptionLoading: state.subscription.list.loading,
      eventList: getSubscriptionEventList(state),
      // @ts-expect-error
      eventPage: getSubscriptionEventState(state).page,
      // @ts-expect-error
      eventLoading: getSubscriptionEventState(state).loading,
      // @ts-expect-error
      plannedInvoiceCount: state.subscription.plannedInvoice.count,
      plannedInvoiceLoading: state.subscription.plannedInvoice.loading,
      plannedInvoiceList: getPlannedInvoiceList(state),
      plannedInvoicePage: state.subscription.plannedInvoice.page,
      companyId: state.theme.theme.company,
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
            date__gte: DateTime.now().toISODate(),
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

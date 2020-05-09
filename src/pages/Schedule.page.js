// @flow
import React from 'react';

import { compose, withState, withHandlers } from 'recompose';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import { getPrivateBookingListFiltered } from '../libs/private-service/selectors/private-booking';
import { fetchAllOffers as fetchAllOffersAction } from '../libs/offer/actions';
import withTitle from '../hocs/with-title.hoc';
import { getAllPageEstablishments } from '../libs/establishment/selectors';
import { fetchEstablishments } from '../libs/establishment/actions';
import { getActiveCoaches } from '../libs/associated-coach/selectors';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../libs/meta-activity/actions';
import { getOfferAsEventList, withMetaActivity } from '../libs/offer/selectors';
import { fetchAssociatedCoachesList } from '../libs/associated-coach/actions';

import PrivateCalendarWithControls from '../libs/private-service/components/PrivateCalendarWithControls.component';

import {
  fetchPrivateBookings as fetchPrivateBookingsAction,
  resetPrivateBookings,
} from '../libs/private-service/actions';

type Props = {
  classes: Object,
  privateBookingList: Array<PrivateBooking>,
  offerList: Array<Offer>,

  resetPrivateBookings: () => void,

  goToMember: (id: number) => void,
  handleDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,
  periodFilter: { start: string, end: string },

  fetchPrivateBookingList: () => void,
  fetchOfferList: () => void,
  fetchEstablishments: () => void,
  fetchAssociatedCoachesList: (params: any) => void,
  resourcesByDatatype: Array<ResourceDataGroup>,
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing(1) },
});

export class CoachPrivateCalendar extends React.Component<Props> {
  componentDidMount() {
    this.props.resetPrivateBookings();
    this.props.fetchEstablishments();
    this.props.fetchAssociatedCoachesList({ disabled: false });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end
    ) {
      this.props.fetchPrivateBookingList();
      this.props.fetchOfferList();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <PrivateCalendarWithControls
          availabilitySlots={[]}
          resourcesByDatatype={this.props.resourcesByDatatype}
          privateBookings={this.props.privateBookingList}
          disableAvailabilitySlotDisplay
          goToMember={this.props.goToMember}
          onDateChange={this.props.handleDateChange}
          offerList={this.props.offerList}
          refreshOffers={this.props.fetchOfferList}
          refreshPrivateBookings={this.props.fetchPrivateBookingList}
          showOfferListToogle
          showPrivateBookingToogle
        />
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withNamespaces(['privateService']),
  withTitle(({ t }) => t('translation:navigation.schedule')),
  withState('periodFilter', 'setPeriodFilter', {
    start: moment()
      .startOf('week')
      .format('YYYY-MM-DD'),
    end: moment()
      .endOf('week')
      .format('YYYY-MM-DD'),
  }),
  connect(
    (state, { periodFilter }) => ({
      resourcesByDatatype: [
        {
          datatype: 'establishment',
          items: getAllPageEstablishments(state),
        },
        {
          datatype: 'coach',
          items: getActiveCoaches(state).map((c) => ({
            title: c.name,
            id: c.id,
          })),
        },
      ],
      privateBookingList: getPrivateBookingListFiltered(
        state,
        null,
        periodFilter,
      ),
      offerList: withMetaActivity(getOfferAsEventList)(
        state,
        null,
        periodFilter,
      ),
    }),
    {
      fetchPrivateBookings: fetchPrivateBookingsAction,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchAllOffers: fetchAllOffersAction,
      resetPrivateBookings,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    },
  ),
  withHandlers({
    fetchOfferList: ({
      fetchAllOffers,
      fetchMetaActivityBulk,
      periodFilter,
    }) => () => {
      fetchAllOffers(
        {
          min_date: periodFilter.start,
          max_date: periodFilter.end,
        },
        {
          onSuccess: (offers) =>
            fetchMetaActivityBulk(offers.map((o) => o.meta_activity)),
        },
      );
    },
    handleDateChange: ({ setPeriodFilter }) => ({
      date_start,
      date_end,
    }: {
      date_start: string,
      date_end: string,
    }) => {
      setPeriodFilter({ start: date_start, end: date_end });
    },
    fetchPrivateBookingList: ({ fetchPrivateBookings, periodFilter }) => () => {
      fetchPrivateBookings({
        date_start__gte: periodFilter.start,
        date_start__lte: periodFilter.end,
        page_size: null,
      });
    },
  }),
)(CoachPrivateCalendar);

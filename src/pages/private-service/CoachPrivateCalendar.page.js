// @flow
import React from 'react';

import { compose, withState, withHandlers } from 'recompose';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import { getPrivateBookingListFiltered } from '../../libs/private-service/selectors/private-booking';
import { fetchAllOffers } from '../../libs/offer/actions';
import withTitle from '../../hocs/with-title.hoc';
import { fetchMetaActivityBulk } from '../../libs/meta-activity/actions';
import {
  getOfferAsEventList,
  withMetaActivity,
} from '../../libs/offer/selectors';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import PrivateCalendarWithControls from '../../libs/private-service/components/PrivateCalendarWithControls.component';

import {
  fetchPrivateBookings,
  resetPrivateBookings,
  fetchAvailabilitySlots,
} from '../../libs/private-service/actions';

type Props = {
  classes: Object,
  availabilitySlots: Array<AvailabilitySlot>,
};

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing.unit },
});

export class CoachPrivateCalendar extends React.Component<Props> {
  select = (eventSlotSelected) => {
    this.setState({
      eventSlotSelected,
    });
  };

  fetchAvailabilitySlots = () =>
    this.props.fetchAvailabilitySlots({
      date_start__lte: this.props.periodFilter.end,
      date_start__gte: this.props.periodFilter.start,
    });

  componentDidMount() {
    this.props.resetPrivateBookings();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.periodFilter.start !== this.props.periodFilter.start ||
      prevProps.periodFilter.end !== this.props.periodFilter.end
    ) {
      this.fetchAvailabilitySlots();
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
          privateBookings={this.props.privateBookingList}
          availabilitySlotUpdating={this.props.availabilitySlotUpdating}
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
      fetchPrivateBookings,
      fetchAvailabilitySlots,
      fetchAllOffers,
      resetPrivateBookings,
      fetchMetaActivityBulk,
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

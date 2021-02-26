// @flow

import React, { PureComponent } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import memoize from 'memoize-one';
import withWidth from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Moment } from '../../../i18n';

import Calendar from '../../../components/offer/Calendar.component';
import MarketplaceTimetable from './MarketplaceTimetable.component';
import MarketplaceWeekTimetable from './MarketplaceWeekTimeTable.component';
import MarketplaceFilterComponent from './MarketplaceFilter.component';

const LoadingIndicator = () => (
  <div
    style={{
      padding: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </div>
);

type Props = {
  classes: { [string]: string },
  onSelectDate: () => void,
  selectedDate: *,
  offers: *[],
  loading: boolean,
  dayOffers: *[],
  onClickOffer: () => void,
  coaches: *[],
  establishments: *[],
  metaActivities: Array<MetaActivity>,
  setFilters: (any) => void,
  filters: *,
  toogleFiltersOpen: () => void,
  filtersOpen: boolean,
  forceDayDisplayOnly: ?boolean,
  compactMode: ?boolean,
  width: string,
  onClickBook: (offer: Offer) => void,
  onClickBookOption: (offerId: number) => void,
  showOfferFilling: boolean,
  hideCoach: boolean,
  activityLoading: boolean,
  coachLoading: boolean,
  establishmentLoading: boolean,
  showOfferGender?: boolean,
};
const getEventsFrom = memoize((offers) => {
  const events = {};
  offers.forEach((o) => {
    const midnight = Moment(o.date_start).startOf('day');
    if (!events[midnight]) {
      events[midnight] = [];
    }
    events[midnight].push(o);
  });
  return events;
});

export class MarketplaceCalendar extends PureComponent<Props> {
  render() {
    const {
      classes,
      onSelectDate,
      selectedDate,
      offers,
      dayOffers,
      coaches,
      establishments,
      metaActivities,
      loading,
      setFilters,
      filters,
      forceDayDisplayOnly,
      compactMode,
      width,
    } = this.props;

    // compact calendar
    const isCompact =
      (compactMode != null && compactMode === true) ||
      (compactMode == null && ['xs', 'sm'].includes(width));

    // large calendar
    const isLarge =
      (compactMode != null && compactMode === false) ||
      (compactMode == null && !['xs', 'sm'].includes(width));

    const events = getEventsFrom(offers);

    if (forceDayDisplayOnly) {
      if (loading) {
        return <LoadingIndicator />;
      }

      return (
        <MarketplaceTimetable
          offers={dayOffers}
          date={selectedDate}
          onClickOffer={this.props.onClickOffer}
          onClickBook={this.props.onClickBook}
          onClickBookOption={this.props.onClickBookOption}
        />
      );
    }

    const searchBar = (
      <MarketplaceFilterComponent
        coaches={coaches}
        establishments={establishments}
        metaActivities={metaActivities}
        filters={filters}
        setFilters={setFilters}
        variant="activity"
      />
    );

    return (
      <div className={classes.container}>
        <Calendar
          forceMonthDisplay={false}
          clickableDate={isCompact}
          hideDateBar={isLarge}
          showDayName={isCompact}
          hideSwitchViewButton
          searchBar={searchBar}
          searchBarOpen={this.props.filtersOpen}
          toogleSearchBar={this.props.toogleFiltersOpen}
          onDateClick={onSelectDate}
          date={selectedDate}
          events={events}
        />
        {
          // eslint-disable-next-line
        loading ? (
            <LoadingIndicator />
          ) : isCompact && !isLarge ? (
            <MarketplaceTimetable
              showOfferFilling={this.props.showOfferFilling}
              showOfferGender={this.props.showOfferGender}
              hideCoach={this.props.hideCoach}
              offers={this.props.offers}
              date={selectedDate}
              onClickOffer={this.props.onClickOffer}
              onClickBook={this.props.onClickBook}
              onClickBookOption={this.props.onClickBookOption}
              onSelectDate={onSelectDate}
              coachLoading={this.props.coachLoading}
              establishmentLoading={this.props.establishmentLoading}
              activityLoading={this.props.activityLoading}
            />
          ) : (
            <MarketplaceWeekTimetable
              offers={this.props.offers}
              showOfferFilling={this.props.showOfferFilling}
              showOfferGender={this.props.showOfferGender}
              hideCoach={this.props.hideCoach}
              date={selectedDate}
              onClickOffer={this.props.onClickOffer}
              onClickBook={this.props.onClickBook}
              onClickBookOption={this.props.onClickBookOption}
              coachLoading={this.props.coachLoading}
              establishmentLoading={this.props.establishmentLoading}
              activityLoading={this.props.activityLoading}
            />
          )
        }
      </div>
    );
  }
}

const styles = () => ({
  container: {
    width: '100%',
  },
});

export default withStyles(styles)(withWidth()(MarketplaceCalendar));

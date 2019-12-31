// @flow

import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import memoize from 'memoize-one';
import withWidth from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Moment } from '../../../i18n';

import Calendar from '../../../components/offer/Calendar.component';
import MarketplaceTimetable from './MarketplaceTimetable.component';
import CoachSelector from '../../associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import MetaActivitySelector from '../../meta-activity/components/MetaActivitySelector.component';
import LevelSelector from '../../category/components/LevelSelector.component';
import MarketplaceWeekTimetable from './MarketplaceWeekTimeTable.component';
import { DATE_FORMAT } from '../../../datetime';

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
  weekOffers: *[],
  onClickOffer: () => void,
  coaches: *[],
  establishments: *[],
  metaActivities: Array<MetaActivity>,
  setFilters: (*) => void,
  filters: *,
  toogleFiltersOpen: () => void,
  filtersOpen: boolean,
  forceDayDisplayOnly: ?boolean,
  compactMode: ?boolean,
  width: string,
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
  showOfferFilling: boolean,
  activityLoading: boolean,
  coachLoading: boolean,
  establishmentLoading: boolean,
};

export class MarketplaceCalendar extends Component<Props> {
  renderTimetable(isCompact: boolean, isLarge: boolean) {
    const {
      dayOffers,
      selectedDate,
      onClickOffer,
      onClickBook,
      onClickBookOption,
      weekOffers,
      onSelectDate,
      showOfferFilling,
    } = this.props;

    return isCompact && !isLarge ? (
      <MarketplaceTimetable
        showOfferFilling={showOfferFilling}
        offers={dayOffers}
        weekOffers={weekOffers}
        date={selectedDate}
        onClickOffer={onClickOffer}
        onClickBook={onClickBook}
        onClickBookOption={onClickBookOption}
        onSelectDate={onSelectDate}
        coachLoading={this.props.coachLoading}
        establishmentLoading={this.props.establishmentLoading}
        activityLoading={this.props.activityLoading}
      />
    ) : (
      <MarketplaceWeekTimetable
        showOfferFilling={showOfferFilling}
        weekOffers={weekOffers}
        date={selectedDate}
        onClickOffer={onClickOffer}
        onClickBook={onClickBook}
        onClickBookOption={onClickBookOption}
        coachLoading={this.props.coachLoading}
        establishmentLoading={this.props.establishmentLoading}
        activityLoading={this.props.activityLoading}
      />
    );
  }

  getEventsFrom = memoize((offers) => {
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

    const events = this.getEventsFrom(offers);

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
      <Grid container>
        <Grid item xs={12} md={6} className={classes.selector}>
          <CoachSelector
            coaches={coaches}
            selectedCoaches={filters.coaches}
            selectOption={(ev) =>
              setFilters({
                ...filters,
                coaches: ev.map((e) => e.value),
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.selector}>
          <LevelSelector
            selectedLevels={filters.levels}
            selectOption={(ev) =>
              setFilters({
                ...filters,
                levels: ev.map((e) => e.value),
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.selector}>
          <EstablishmentSelector
            isMulti
            establishments={establishments}
            selectedEstablishments={filters.establishments}
            selectOption={(ev) => {
              setFilters({
                ...filters,
                establishments: ev.map((e) => e.value),
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.selector}>
          <MetaActivitySelector
            metaActivities={metaActivities.filter(
              (ma) => ma.customer_enabled && !ma.is_workshop,
            )}
            selectedMetaActivities={filters.metaActivities}
            selectOption={(ev) =>
              setFilters({
                ...filters,
                metaActivities: ev.map((e) => e.value),
              })
            }
          />
        </Grid>
      </Grid>
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
          date={selectedDate.format(DATE_FORMAT)}
          events={events}
        />
        {loading ? (
          <LoadingIndicator />
        ) : (
          this.renderTimetable(isCompact, isLarge)
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    width: '100%',
  },
  selector: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
});

export default withStyles(styles)(withWidth()(MarketplaceCalendar));

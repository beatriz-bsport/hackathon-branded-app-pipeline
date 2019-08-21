// @flow

import React, { Fragment } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { compose } from 'recompose';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Moment } from '../../../i18n';

import Calendar from '../../../components/offer/Calendar.component';
import MarketplaceTimetable from './MarketplaceTimetable.component';
import CoachSelector from '../../associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import MetaActivitySelector from '../../meta-activity/components/MetaActivitySelector.component';
import LevelSelector from '../../category/components/LevelSelector.component';
import MarketplaceWeekTimetable from './MarketplaceWeekTimeTable.component';

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
  onClickBook: (offerId: number) => void,
  onClickBookOption: (offerId: number) => void,
};

export function MarketplaceCalendar(props: Props) {
  const {
    classes,
    onSelectDate,
    selectedDate,
    offers,
    dayOffers,
    weekOffers,
    coaches,
    establishments,
    metaActivities,
    loading,
    setFilters,
    filters,
  } = props;
  const events = {};
  offers.forEach((o) => {
    const midnight = Moment(o.date_start).startOf('day');
    if (!events[midnight]) {
      events[midnight] = [];
    }
    events[midnight].push(o);
  });

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
    <Fragment>
      <Hidden mdUp>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          justify="flex-start"
        >
          <Grid item xs={12} md={6}>
            <Calendar
              forceMonthDisplay={false}
              hideSwitchViewButton
              searchBar={searchBar}
              searchBarOpen={props.filtersOpen}
              toogleSearchBar={props.toogleFiltersOpen}
              onDateClick={onSelectDate}
              loading={loading}
              date={selectedDate}
              events={events}
            />
          </Grid>
          <div className={classes.divider} />
          <Grid item xs={12} md={6}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <MarketplaceTimetable
                offers={dayOffers}
                date={selectedDate}
                onClickOffer={props.onClickOffer}
                onClickBook={props.onClickBook}
                onClickBookOption={props.onClickBookOption}
              />
            )}
          </Grid>
        </Grid>
      </Hidden>
      <Hidden smDown>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          justify="flex-start"
        >
          <Grid item xs={12}>
            <Calendar
              clickableDate={false}
              showDayName={false}
              hideDateBar
              hideSwitchViewButton
              searchBar={searchBar}
              searchBarOpen={props.filtersOpen}
              toogleSearchBar={props.toogleFiltersOpen}
              onDateClick={onSelectDate}
              date={selectedDate}
              events={events}
            />
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="stretch">
          <Grid item xs={12}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <MarketplaceWeekTimetable
                weekOffers={weekOffers}
                date={selectedDate}
                onClickOffer={props.onClickOffer}
                onClickBook={props.onClickBook}
                onClickBookOption={props.onClickBookOption}
              />
            )}
          </Grid>
        </Grid>
      </Hidden>
    </Fragment>
  );
}

const styles = (theme) => ({
  selector: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  divider: {
    marginBottom: theme.spacing.unit,
  },
});

export default compose(withStyles(styles))(MarketplaceCalendar);

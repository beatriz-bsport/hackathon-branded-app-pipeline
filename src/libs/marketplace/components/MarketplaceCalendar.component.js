// @flow

import React from 'react';

import { withStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import { compose } from 'recompose';

import { Moment } from '../../../i18n';

import Calendar from '../../../components/offer/Calendar.component';
import MarketplaceTimetable from './MarketplaceTimetable.component';
import CoachSelector from '../../associated-coach/components/CoachSelector.component';
import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';
import MetaActivitySelector from '../../meta-activity/components/MetaActivitySelector.component';
import LevelSelector from '../../category/components/LevelSelector.component';

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
          metaActivities={metaActivities.filter((ma) => ma.customer_enabled)}
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
    <Grid container direction="row" alignItems="stretch">
      <Grid item xs={12} md={6}>
        <Calendar
          forceMonthDisplay
          searchBar={searchBar}
          searchBarOpen={props.filtersOpen}
          toogleSearchBar={props.toogleFiltersOpen}
          onDateClick={onSelectDate}
          loading={loading}
          date={selectedDate}
          events={events}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <div className={classes.rightPanel}>
          {loading ? (
            <LinearProgress />
          ) : (
            <MarketplaceTimetable
              offers={dayOffers}
              date={selectedDate}
              onClickOffer={props.onClickOffer}
              onClickBook={props.onClickBook}
              onClickBookOption={props.onClickBookOption}
            />
          )}
        </div>
      </Grid>
    </Grid>
  );
}

const styles = (theme) => ({
  rightPanel: {
    borderLeft: '1px solid #F0F0F0',
    height: '100%',
  },
  selector: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
});

export default compose(withStyles(styles))(MarketplaceCalendar);

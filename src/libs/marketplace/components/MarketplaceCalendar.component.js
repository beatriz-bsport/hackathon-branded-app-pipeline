// @flow

import React, { PureComponent } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import memoize from 'memoize-one';

import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { Moment } from '../../../i18n';

import Calendar from '../../../components/offer/Calendar.component';
import MarketplaceTimetable from './MarketplaceTimetable.component';
import MarketplaceWeekTimetable from './MarketplaceWeekTimeTable.component';
import MarketplaceFilterComponent from './MarketplaceFilter.component';
import type { EstablishmentGroup } from '../../establishment/types';

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
  selectedDate: any,
  offers: *[],
  loading: boolean,
  onClickOffer: () => void,
  coaches: *[],
  establishments: *[],
  metaActivities: Array<MetaActivity>,
  setFilters: (any) => void,
  filters: any,
  toggleFiltersOpen: () => void,
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
  establishmentGroupList: Array<EstablishmentGroup>,
  showMultiLocalization: boolean,
  nextAvailableOffer: Offer,
  goToFirstAvailableSession: () => void,
  bookedOffers?: number[],
  t: TFunction,
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
      coaches,
      establishments,
      metaActivities,
      loading,
      setFilters,
      filters,
      forceDayDisplayOnly,
      compactMode,
      width,
      nextAvailableOffer,
    } = this.props;

    const noOfferDisplayed = !loading && this.props.offers?.length === 0;
    // compact calendar
    const isCompact =
      (compactMode != null && compactMode === true) ||
      (compactMode == null && ['xs', 'sm', 'md'].includes(width));

    // large calendar
    const isLarge =
      (compactMode != null && compactMode === false) ||
      (compactMode == null && !['xs', 'sm', 'md'].includes(width));

    const events = getEventsFrom(offers);

    if (forceDayDisplayOnly) {
      if (loading) {
        return <LoadingIndicator />;
      }
      const today = Moment();
      const dayOffers = offers.filter((o) => {
        return Moment(o.date_start).isSame(today, 'day');
      });

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
        hideCoach={this.props.hideCoach}
        metaActivities={metaActivities}
        filters={filters}
        setFilters={setFilters}
        variant="activity"
        establishmentGroupList={this.props.establishmentGroupList}
        showMultiLocalization={this.props.showMultiLocalization}
      />
    );

    return (
      <div className={classes.wrapper}>
        <Calendar
          forceMonthDisplay={false}
          clickableDate={isCompact}
          hideDateBar={isLarge}
          showDayName={isCompact}
          hideSwitchViewButton
          searchBar={searchBar}
          searchBarOpen={this.props.filtersOpen}
          toggleSearchBar={this.props.toggleFiltersOpen}
          onDateClick={onSelectDate}
          date={selectedDate}
          events={events}
          establishmentGroupList={this.props.establishmentGroupList}
          setFilters={setFilters}
        />
        {
          // eslint-disable-next-line
          loading && <LoadingIndicator />
        }
        {!loading && (
          <div>
            {noOfferDisplayed &&
              Object.keys(filters).length > 0 &&
              nextAvailableOffer &&
              Moment(nextAvailableOffer.date_start).isBefore(
                Moment(selectedDate),
              ) && (
                <div className={classes.helperText}>
                  <ButtonBase onClick={this.props.goToFirstAvailableSession}>
                    <Typography color="primary">
                      {this.props.t('slotSearcher.previousOffer', {
                        date: Moment(nextAvailableOffer.date_start).format('L'),
                        hour: Moment(nextAvailableOffer.date_start).format(
                          'LT',
                        ),
                      })}
                    </Typography>
                  </ButtonBase>
                </div>
              )}
            {isCompact && !isLarge ? (
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
                bookedOffers={this.props.bookedOffers}
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
                bookedOffers={this.props.bookedOffers}
              />
            )}
            {noOfferDisplayed && (
              <div className={classes.container}>
                {!nextAvailableOffer && (
                  <div className={classes.emptyStateWrapper}>
                    <div className={classes.emptyState}>
                      <WarningIcon className={classes.warning} />
                      <Typography>
                        {this.props.t('slotSearcher.emptyState')}
                      </Typography>
                    </div>
                  </div>
                )}
                {nextAvailableOffer && (
                  <div className={classes.emptyStateWrapper}>
                    <div className={classes.emptyState}>
                      <EventAvailableIcon
                        color="primary"
                        className={classes.icon}
                      />
                      <ButtonBase
                        onClick={this.props.goToFirstAvailableSession}
                      >
                        <Typography className={classes.link}>
                          {this.props.t('slotSearcher.nextOffer', {
                            date: Moment(nextAvailableOffer.date_start).format(
                              'L',
                            ),
                            hour: Moment(nextAvailableOffer.date_start).format(
                              'LT',
                            ),
                          })}
                        </Typography>
                      </ButtonBase>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  wrapper: {
    width: '100%',
  },
  container: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  helperText: {
    marginBotttom: theme.spacing(2),
  },
  link: {
    color: theme.palette.primary.main,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  emptyStateWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    borderRadius: 4,
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: 'white',
    borderRadius: 5,
  },
  warning: {
    fill: theme.palette.warning.main,
    marginRight: theme.spacing(2),
  },
});

export default withStyles(styles)(
  withWidth()(withTranslation('privateService')(MarketplaceCalendar)),
);

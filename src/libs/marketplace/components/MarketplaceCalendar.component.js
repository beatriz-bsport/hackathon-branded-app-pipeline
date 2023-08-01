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
import { formatAsTime } from '../../../utils/datetime';

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
  onClickBookOption: (offer: Offer) => void,
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
  activeCustomLevels: Level[],
  locale: string,
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
      locale,
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
          activityLoading={this.props.activityLoading}
          bookedOffers={this.props.bookedOffers}
          coachLoading={this.props.coachLoading}
          date={selectedDate}
          establishmentLoading={this.props.establishmentLoading}
          hideCoach={this.props.hideCoach}
          locale={locale}
          offers={dayOffers}
          onClickBook={this.props.onClickBook}
          onClickBookOption={this.props.onClickBookOption}
          onClickOffer={this.props.onClickOffer}
          showOfferFilling={this.props.showOfferFilling}
          showOfferGender={this.props.showOfferGender}
        />
      );
    }

    const searchBar = (
      <MarketplaceFilterComponent
        coaches={coaches}
        customLevels={this.props.activeCustomLevels}
        establishmentGroupList={this.props.establishmentGroupList}
        establishments={establishments}
        filters={filters}
        hideCoach={this.props.hideCoach}
        metaActivities={metaActivities}
        setFilters={setFilters}
        showMultiLocalization={this.props.showMultiLocalization}
        variant="activity"
      />
    );

    return (
      <div className={classes.wrapper}>
        <Calendar
          hideSwitchViewButton
          clickableDate={isCompact}
          date={selectedDate}
          establishmentGroupList={this.props.establishmentGroupList}
          events={events}
          forceMonthDisplay={false}
          hideDateBar={isLarge}
          onDateChange={onSelectDate}
          searchBar={searchBar}
          searchBarOpen={this.props.filtersOpen}
          setFilters={setFilters}
          showDayName={isCompact}
          toggleSearchBar={this.props.toggleFiltersOpen}
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
                        hour: formatAsTime(nextAvailableOffer.date_start),
                      })}
                    </Typography>
                  </ButtonBase>
                </div>
              )}
            {isCompact && !isLarge ? (
              <MarketplaceTimetable
                activityLoading={this.props.activityLoading}
                bookedOffers={this.props.bookedOffers}
                coachLoading={this.props.coachLoading}
                date={selectedDate}
                establishmentLoading={this.props.establishmentLoading}
                hideCoach={this.props.hideCoach}
                locale={locale}
                offers={this.props.offers}
                onClickBook={this.props.onClickBook}
                onClickBookOption={this.props.onClickBookOption}
                onClickOffer={this.props.onClickOffer}
                onSelectDate={onSelectDate}
                showOfferFilling={this.props.showOfferFilling}
                showOfferGender={this.props.showOfferGender}
              />
            ) : (
              <MarketplaceWeekTimetable
                activityLoading={this.props.activityLoading}
                bookedOffers={this.props.bookedOffers}
                coachLoading={this.props.coachLoading}
                date={selectedDate}
                establishmentLoading={this.props.establishmentLoading}
                hideCoach={this.props.hideCoach}
                locale={locale}
                offers={this.props.offers}
                onClickBook={this.props.onClickBook}
                onClickBookOption={this.props.onClickBookOption}
                onClickOffer={this.props.onClickOffer}
                showOfferFilling={this.props.showOfferFilling}
                showOfferGender={this.props.showOfferGender}
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
                        className={classes.icon}
                        color="primary"
                      />
                      <ButtonBase
                        onClick={this.props.goToFirstAvailableSession}
                      >
                        <Typography className={classes.link}>
                          {this.props.t('slotSearcher.nextOffer', {
                            date: Moment(nextAvailableOffer.date_start).format(
                              'L',
                            ),
                            hour: formatAsTime(nextAvailableOffer.date_start),
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

// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import TodayIcon from '@material-ui/icons/Today';
import CircularProgress from '@material-ui/core/CircularProgress';
import RefreshIcon from '@material-ui/icons/Refresh';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation, TFunction } from 'react-i18next';
import { DateTime } from 'luxon';

import { analyticsClientB2B } from '../../components/analytics/mixpanel';
import {
  trackPreviousSessionClickedEvent,
  trackNextSessionClickedEvent,
} from '../../events/booking/trackers';

import { compose } from 'recompose';
import { REVAMPED_CALENDAR_URL } from '#src/revamp';

const getDateDictionnary = (offer) => {
  const date = offer
    ? DateTime.fromISO(offer.date_start).setZone(offer.timezone_name)
    : DateTime.now();
  return { year: date.year, month: date.month, day: date.day };
};

type Props = {
  t: TFunction,
  classes: Object,
  goToOffer: (offerId: number) => void,
  bookingLoading: boolean,
  offer?: Offer,
  offerId: number,
  loading: boolean,
  offerLoading: boolean,
  goToCalendar: ({ year: number, month: number, day: number }) => void,
  refresh: () => void,
  offerMetaActivity: MetaActivity,
  revampedBackofficeEnabled: boolean,
};

export const OfferNavigationHeader = (props: Props) => {
  const goToOfferTrackingParams = {
    session_type: props.offerMetaActivity?.is_workshop
      ? 'workshop'
      : 'group-activity',
    is_grouped_session: !!props.offer?.group,
    meta_activity_id: props.offer?.meta_activity_id,
    offer_id: props.offer?.id,
  };

  const goToPreviousOffer = () => {
    try {
      analyticsClientB2B.track(
        trackPreviousSessionClickedEvent(goToOfferTrackingParams),
      );
    } catch (error) {
      console.error('Failed to track previous session clicked event:', {
        error,
        offerId: props.offer?.id,
      });
    }
    props.goToOffer(props.offer.previous_offer);
  };

  const goToNextOffer = () => {
    try {
      analyticsClientB2B.track(
        trackNextSessionClickedEvent(goToOfferTrackingParams),
      );
    } catch (error) {
      console.error('Failed to track next session clicked event:', {
        error,
        offerId: props.offer?.id,
      });
    }
    props.goToOffer(props.offer.next_offer);
  };

  const navigateToCalendar = () => {
    if (props.revampedBackofficeEnabled) {
      // No better way to navigate to the revamp for now
      window.location.assign(REVAMPED_CALENDAR_URL);
      return;
    }
    const dateDictionary = getDateDictionnary(props.offer);
    props.goToCalendar(dateDictionary);
  };
  return (
    <Paper className={props.classes.headerContainer}>
      <div className={props.classes.titleBanner}>
        <Button
          disabled={
            !props.offer ||
            props.offer.id !== props.offerId ||
            !props.offer.previous_offer
          }
          onClick={goToPreviousOffer}
        >
          <ChevronLeftIcon className={props.classes.leftIcon} />
          <Hidden xsDown>{props.t('translation:offer.previousOffer')}</Hidden>
        </Button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Button onClick={navigateToCalendar}>
            <TodayIcon className={props.classes.leftIcon} />
            {props.offer && !props.offerLoading && props.offer.date_start
              ? DateTime.fromISO(props.offer.date_start)
                  .setZone(props.offer.timezone_name || 'Europe/Paris')
                  .toFormat('DDDD t')
              : ''}
          </Button>
          {props.bookingLoading ? (
            <CircularProgress size={16} />
          ) : (
            <IconButton onClick={props.refresh}>
              <RefreshIcon />
            </IconButton>
          )}
        </div>
        <Button
          disabled={
            !props.offer ||
            props.offer.id !== props.offerId ||
            !props.offer.next_offer
          }
          onClick={goToNextOffer}
        >
          <Hidden xsDown>{props.t('translation:offer.nextOffer')}</Hidden>
          <ChevronRightIcon className={props.classes.rightIcon} />
        </Button>
      </div>
      {props.loading ? <LinearProgress /> : null}
    </Paper>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLight: theme.spacing(1),
  },
  headerContainer: {
    marginTop: theme.spacing(-2),
  },
  titleBanner: {
    paddingTop: theme.spacing(1) / 2,
    paddingBottom: theme.spacing(1) / 2,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['offer', 'translation']),
  React.memo,
)(OfferNavigationHeader);

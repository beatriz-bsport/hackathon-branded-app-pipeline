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
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { compose } from 'recompose';
import moment from 'moment-timezone';

const getDateDictionnary = (offer) => {
  const date = offer
    ? moment(offer.date_start).tz(offer.timezone_name)
    : moment();
  return { year: date.year(), month: date.month() + 1, day: date.date() };
};

type Props = {
  t: TFunction,
  classes: Object,
  goToOffer: (offerId: number) => void,
  bookingLoading: boolean,
  offer: ?Offer,
  offerId: number,
  loading: boolean,
  offerLoading: boolean,
  goToCalendar: ({ year: number, month: number, day: number }) => void,
  refresh: () => void,
};

export const OfferNavigationHeader = (props: Props) => (
  <Paper className={props.classes.headerContainer}>
    <div className={props.classes.titleBanner}>
      <Button
        onClick={() => props.goToOffer(props.offer.previous_offer)}
        disabled={!props.offer || props.offer.id !== props.offerId}
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
        <Button
          onClick={() => props.goToCalendar(getDateDictionnary(props.offer))}
        >
          <TodayIcon className={props.classes.leftIcon} />
          {props.offer && !props.offerLoading && props.offer.date_start
            ? moment(props.offer.date_start)
                .tz(props.offer.timezone_name || 'Europe/Paris')
                .format('LLLL')
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
        onClick={() => props.goToOffer(props.offer.next_offer)}
        disabled={!props.offer || props.offer.id !== props.offerId}
      >
        <Hidden xsDown>{props.t('translation:offer.nextOffer')}</Hidden>
        <ChevronRightIcon className={props.classes.rightIcon} />
      </Button>
    </div>
    {props.loading ? <LinearProgress /> : null}
  </Paper>
);

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLight: theme.spacing(1),
  },
  headerContainer: {
    marginTop: -theme.spacing(2),
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
)(OfferNavigationHeader);

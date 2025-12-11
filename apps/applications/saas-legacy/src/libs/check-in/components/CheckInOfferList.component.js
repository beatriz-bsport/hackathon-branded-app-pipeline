// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert/Alert';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import Immutable from 'seamless-immutable';
import { components } from 'react-select';
import { DateTime } from 'luxon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LockIcon from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';

import { minsToHrMins } from '#src/libs/theme/utils';
import Countdown from '../../../components/Countdown.component';
import OfferItemBase from '../../offer/components/OfferListItem.component';

import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';

import { trackTabletCheckInSessionClickedEvent } from '#src/events/booking/trackers.ts';
import { analyticsClientB2B } from '#src/components/analytics/mixpanel';

const OFFERS_REFRESH_DURATION = 1000 * 60;

type Props = {
  classes: any,
  offers: any[],
  t: TFunction,
  offersLoading: boolean,
  onOfferSelected: (offerId: number) => void,
  refreshData: () => void,
  offerFilters: OfferFilter,
  establishments: Array<Establishment>,
  isCheckInFilterLocked: boolean,
  setFilters: (OfferFilter) => null,
  setOpen: () => null,
  onOpenAuthenticationDialog: () => void,
  onLockCheckInFilter: () => void,
  minutesToConvert: number,
};

const offerListItemStyle = () => {
  return {
    CountdownWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    offerStatus: {
      display: 'flex',
      justifyContent: 'center',
    },
  };
};

const DropdownIndicator: React.FC<
  ReturnType<typeof components.DropdownIndicator>,
> = React.memo((props) => (
  <components.DropdownIndicator {...props}>
    {/* eslint-disable-next-line react/prop-types */}
    {props.selectProps.isDisabled ? (
      <LockIcon fontSize="small" />
    ) : (
      <ExpandMoreIcon fontSize="small" />
    )}
  </components.DropdownIndicator>
));

const CheckInOfferListItem = withTranslation(['selfCheckIn'])(
  withStyles(offerListItemStyle)((props) => {
    // dates : start, end and datetime
    const datetime = DateTime.now();
    const dateStart = DateTime.fromISO(props.offer.date_start);
    const dateEnd = dateStart.plus({
      minute: props.offer.duration_minute,
    });

    const onSelectOffer = (offerId) => {
      try {
        analyticsClientB2B.track(
          trackTabletCheckInSessionClickedEvent({
            nb_attendants: props.offer.nb_attendant,
            nb_bookings: props.offer.nb_bookings,
            nb_non_attendants: props.offer.nb_non_attendant,
            offer_id: props.offer.id,
          }),
        );
      } catch (error) {
        console.error('Error tracking tablet check-in session clicked event', {
          error,
          offerId: props.offer.id,
        });
      }
      props.onClick(offerId);
    };

    // boolean : if the activity has started yet or is in progress
    const notStartedYet = datetime < DateTime.fromISO(props.offer.date_start);

    const inProgress = dateStart <= datetime && datetime <= dateEnd;

    // Color  and time Status
    const color = inProgress ? 'primary' : 'secondary';
    const notInProgress = notStartedYet ? 'startIn' : 'hasEnded';
    const timeState = inProgress ? 'inProgress' : notInProgress;

    // time To show in the interface
    const timeToShowInProgress = Math.floor(
      datetime.diff(dateStart, 'seconds').as('seconds'),
    );
    const timeToShowNotStartedYet = Math.floor(
      dateStart.diff(datetime, 'seconds').as('seconds'),
    );
    const timeToShowFinished = Math.floor(
      datetime.diff(dateEnd, 'seconds').as('seconds'),
    );
    const timeToShowNotInProgress = notStartedYet
      ? timeToShowNotStartedYet
      : timeToShowFinished;
    const timeToShow = inProgress
      ? timeToShowInProgress
      : timeToShowNotInProgress;

    return (
      <OfferItemBase
        offer={props.offer}
        onClick={onSelectOffer}
        rightAction={
          <React.Fragment>
            <div className={props.classes.offerStatus}>
              <Typography
                color={notStartedYet || inProgress ? 'textSecondary' : 'error'}
                variant="button"
              >
                {props.t(`offerStatus.${timeState}`)}
              </Typography>
            </div>
            <div className={props.classes.CountdownWrapper}>
              <Countdown
                color={color}
                currentTime={props.currentTime}
                timeToShow={timeToShow}
              />
            </div>
          </React.Fragment>
        }
      />
    );
  }),
);

export class CheckInOfferList extends Component<Props, State> {
  refreshInterval: any;

  countdownInterval: any;

  componentDidMount() {
    this.refreshInterval = setInterval(() => {
      this.props.refreshData();
    }, OFFERS_REFRESH_DURATION);

    this.props.setOpen(true);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
    clearInterval(this.countdownInterval);
  }

  getOffersToDisplay = () => {
    const { hours, minutes } = minsToHrMins(this.props.minutesToConvert);
    return this.props.offers.filter(
      (o) =>
        DateTime.fromISO(o.date_start) >
        DateTime.now().minus({ hours, minutes }),
    );
  };

  render() {
    const { classes, offersLoading, offers, t, onOpenAuthenticationDialog } =
      this.props;

    if (offersLoading && !(this.props.offers ?? []).length) {
      return <LinearProgress />;
    }

    const establishmentList = this.props.establishments;
    const offersToDisplay = this.getOffersToDisplay();

    return (
      <div className={classes.rootContainer}>
        <div className={classes.header}>
          <div className={classes.headerFiltersContainer}>
            <div
              aria-hidden="true"
              className={classes.establishmentSelector}
              onClick={
                this.props.isCheckInFilterLocked && onOpenAuthenticationDialog
              }
              role="button"
            >
              <EstablishmentSelector
                disabled={this.props.isCheckInFilterLocked}
                establishments={Immutable(establishmentList)}
                selectComponents={{
                  DropdownIndicator,
                }}
                selectedEstablishments={this.props.offerFilters.establishments}
                selectOption={(ev) => {
                  this.props.setFilters({
                    ...this.props.offerFilters,
                    establishments: ev.map((e) => e.value),
                  });
                }}
              />
            </div>
            {!this.props.isCheckInFilterLocked && (
              <Button
                color="primary"
                onClick={this.props.onLockCheckInFilter}
                variant="outlined"
              >
                {t('common:save')}
              </Button>
            )}
          </div>
          <Fab
            aria-label="refresh"
            color="primary"
            disabled={offersLoading}
            onClick={this.props.refreshData}
          >
            <RefreshIcon />
          </Fab>
        </div>
        <Divider />
        {offersLoading ? <LinearProgress /> : null}
        {offers && offers.length ? (
          <Paper>
            <List disablePadding>
              {offersToDisplay.map((offer) => (
                <CheckInOfferListItem
                  key={offer.id}
                  classes={this.props.classes}
                  offer={offer}
                  onClick={this.props.onOfferSelected}
                />
              ))}
            </List>
          </Paper>
        ) : (
          <div className={classes.empty}>
            <Alert severity="info"> {t('offerList.emptyList')}</Alert>
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  establishmentSelector: {
    width: '30%',
  },
  rootContainer: { width: '100%' },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  empty: {
    marginTop: theme.spacing(6),
    padding: theme.spacing(1),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerFiltersContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing(1),
  },
});

export default withTranslation(['selfCheckIn'])(
  withStyles(styles)(CheckInOfferList),
);

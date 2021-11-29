// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import Immutable from 'seamless-immutable';
import Moment from 'moment-timezone';

import Countdown from '../../../components/Countdown.component';
import OfferItemBase from '../../offer/components/OfferListItem.component';

import EstablishmentSelector from '../../establishment/components/EstablishmentSelector.component';

const OFFERS_REFRESH_DURATION = 1000 * 60 * 10;

type Props = {
  classes: any,
  offers: *[],
  t: TFunction,
  offersLoading: boolean,
  onOfferSelected: (offerId: number) => void,
  refreshData: () => void,
  offerFilters: OfferFilter,
  establishments: Array<Establishment>,
  setFilters: (OfferFilter) => null,
  setOpen: () => null,
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

const OfferListItem = withTranslation(['selfCheckIn'])(
  withStyles(offerListItemStyle)((props) => {
    // dates : start, end and moment
    const momentDate = Moment();
    const dateStart = Moment(props.offer.date_start);
    const dateEnd = Moment(props.offer.date_start).add(
      props.offer.duration_minute,
      'minutes',
    );

    // boolean : if the activity has started yet or is in progress
    const notStartedYet = !!momentDate.isBefore(Moment(props.offer.date_start));
    const inProgress = !!momentDate.isBetween(
      Moment(props.offer.date_start),
      Moment(props.offer.date_start).add(
        props.offer.duration_minute,
        'minutes',
      ),
    );

    // Color  and time Status
    const color = inProgress ? 'primary' : 'secondary';
    const notInProgress = notStartedYet ? 'startIn' : 'hasEnded';
    const timeState = inProgress ? 'inProgress' : notInProgress;

    // time To show in the interface
    const timeToShowInProgress = momentDate.diff(dateStart, 'seconds');
    const timeToShowNotStartedYet = dateStart.diff(momentDate, 'seconds');
    const timeToShowFinished = momentDate.diff(dateEnd, 'seconds');
    const timeToShowNotInProgress = notStartedYet
      ? timeToShowNotStartedYet
      : timeToShowFinished;
    const timeToShow = inProgress
      ? timeToShowInProgress
      : timeToShowNotInProgress;

    return (
      <OfferItemBase
        offer={props.offer}
        onClick={props.onClick}
        rightAction={
          <React.Fragment>
            <div className={props.classes.offerStatus}>
              <Typography
                variant="button"
                color={notStartedYet || inProgress ? 'textSecondary' : 'error'}
              >
                {props.t(`offerStatus.${timeState}`)}
              </Typography>
            </div>
            <div className={props.classes.CountdownWrapper}>
              <Countdown
                timeToShow={timeToShow}
                currentTime={props.currentTime}
                color={color}
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

  render() {
    const { classes, offersLoading, offers, t } = this.props;

    if (offersLoading && !(this.props.offers || []).length) {
      return <LinearProgress />;
    }

    const establishmentList = this.props.establishments;

    return (
      <div className={classes.rootContainer}>
        <div className={classes.header}>
          <div className={classes.establishmentSelector}>
            <EstablishmentSelector
              establishments={Immutable(establishmentList)}
              selectedEstablishments={this.props.offerFilters.establishments}
              selectOption={(ev) => {
                this.props.setFilters({
                  ...this.props.offerFilters,
                  establishments: ev.map((e) => e.value),
                });
              }}
            />
          </div>
          <Fab
            aria-label="refresh"
            color="primary"
            onClick={this.props.refreshData}
            disabled={offersLoading}
          >
            <RefreshIcon />
          </Fab>
        </div>
        <Divider />
        {offersLoading ? <LinearProgress /> : null}
        {offers && offers.length ? (
          <Paper>
            <List disablePadding>
              {offers
                .filter((o) =>
                  Moment(o.date_start)
                    .add('minutes', o.duration_minute)
                    .isAfter(Moment()),
                )
                .map((offer) => (
                  <OfferListItem
                    offer={offer}
                    key={offer.id}
                    classes={this.props.classes}
                    onClick={this.props.onOfferSelected}
                  />
                ))}
              {offers
                .filter((o) =>
                  Moment(o.date_start)
                    .add('minutes', o.duration_minute)
                    .isBefore(Moment()),
                )
                .map((offer) => (
                  <OfferListItem
                    offer={offer}
                    key={offer.id}
                    classes={this.props.classes}
                    onClick={this.props.onOfferSelected}
                  />
                ))}
            </List>
          </Paper>
        ) : (
          <div className={classes.empty}>
            <InfoIcon className={classes.leftIcon} />
            <Typography variant="h6" component="p" color="textSecondary" inline>
              {t('offerList.emptyList')}
            </Typography>
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
});

export default withTranslation(['selfCheckIn'])(
  withStyles(styles)(CheckInOfferList),
);

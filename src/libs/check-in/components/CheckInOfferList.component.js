// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';

import Moment from 'moment-timezone';

import Countdown from '../../../components/Countdown.component';
import OfferItemBase from '../../offer/components/OfferListItem.component';

const OFFERS_REFRESH_DURATION = 1000 * 60 * 10;
const COUNTDOWN_REFRECH_DURATION = 1000;

type Props = {
  classes: any,
  offers: *[],
  t: TFunction,
  offersLoading: boolean,
  onOfferSelected: (offerId: number) => void,
  refreshData: () => void,
};

type State = {
  currentTime: Moment,
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

const OfferListItem = withNamespaces(['selfCheckIn'])(
  withStyles(offerListItemStyle)((props) => {
    const momentDate = Moment();
    const inProgress = !!momentDate.isBetween(
      Moment(props.offer.date_start),
      Moment(props.offer.date_start).add(
        props.offer.duration_minute,
        'minutes',
      ),
    );
    const timeTillDate = inProgress
      ? Moment(props.offer.date_start)
          .add(props.offer.duration_minute, 'minutes')
          .format()
      : Moment(props.offer.date_start).format();
    const color = inProgress ? 'primary' : 'secondary';
    return (
      <OfferItemBase
        offer={props.offer}
        onClick={props.onClick}
        rightAction={
          <React.Fragment>
            <div className={props.classes.offerStatus}>
              <Typography variant="button" color="textSecondary">
                {props.t(
                  `offerStatus.${inProgress ? 'inProgress' : 'startIn'}`,
                )}
              </Typography>
            </div>
            <div className={props.classes.CountdownWrapper}>
              <Countdown
                timeTillDate={timeTillDate}
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

  state = {
    currentTime: Moment().format(),
  };

  componentDidMount() {
    this.refreshInterval = setInterval(() => {
      this.props.refreshData();
    }, OFFERS_REFRESH_DURATION);

    this.countdownInterval = setInterval(() => {
      this.setState({ currentTime: Moment().format() });
    }, COUNTDOWN_REFRECH_DURATION);
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

    const { currentTime } = this.state;
    return (
      <div className={classes.rootContainer}>
        <div className={classes.header}>
          <div />
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
                    currentTime={currentTime}
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

export default withNamespaces(['selfCheckIn'])(
  withStyles(styles)(CheckInOfferList),
);

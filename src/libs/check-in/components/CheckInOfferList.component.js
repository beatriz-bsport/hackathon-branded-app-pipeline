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

import { Moment } from '../../../i18n';

import Countdown from '../../../components/Countdown.component';
import OfferItemBase from '../../offer/components/OfferListItem.component';
import type { Establishment } from '../../../api/types';
import EstablishmentInput from '../../../components/input/EstablishmentInput.component';

const OFFERS_REFRESH_DURATION = 1000 * 60 * 10;
const COUNTDOWN_REFRECH_DURATION = 1000;

type Props = {
  classes: any,
  offers: *[],
  establishments: Array<Establishment>,
  t: TFunction,
  offersLoading: boolean,
  onOfferSelected: (offerId: number) => void,
  refreshData: () => void,
};

type State = {
  establishment: ?number,
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
      Moment(props.offer.date_end),
    );
    const timeTillDate = inProgress
      ? props.offer.date_end
      : props.offer.date_start;
    const color = inProgress ? 'primary' : 'initial';
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
                timeFormat="YYYY-MM-DDTHH:mm:ssZ"
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
    currentTime: Moment(),
    establishment: null,
  };

  componentDidMount() {
    this.refreshInterval = setInterval(() => {
      this.props.refreshData();
    }, OFFERS_REFRESH_DURATION);

    this.countdownInterval = setInterval(() => {
      this.setState({ currentTime: Moment() });
    }, COUNTDOWN_REFRECH_DURATION);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
    clearInterval(this.countdownInterval);
  }

  onEstablishmentChange = (id: number) => {
    this.setState({ establishment: id });
  };

  render() {
    const { classes, offersLoading, establishments, t } = this.props;

    if (offersLoading && !(this.props.offers || []).length) {
      return <LinearProgress />;
    }

    const { currentTime, establishment } = this.state;
    const offers = this.props.offers.filter(
      (o) =>
        !establishment ||
        (o.establishment_override || o.etablissement).id === establishment,
    );
    return (
      <div className={classes.rootContainer}>
        <div className={classes.header}>
          <EstablishmentInput
            label={t('filter.establishment')}
            onChange={this.onEstablishmentChange}
            establishments={establishments}
            variant="outlined"
            value={this.state.establishment}
          />
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
              {offers.map((offer) => (
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
    marginRight: theme.spacing.unit,
  },
  empty: {
    marginTop: theme.spacing.unit * 6,
    padding: theme.spacing.unit,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default withNamespaces(['selfCheckIn'])(
  withStyles(styles)(CheckInOfferList),
);

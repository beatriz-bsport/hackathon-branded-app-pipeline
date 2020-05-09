// @flow

import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import type { TFunction } from 'react-i18next';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';

import { formatAsTime } from '../../../datetime';
import Level from '../../../components/category/Level.component';
import Countdown from '../../../components/Countdown.component';
import { Moment } from '../../../i18n';

const COUNTDOWN_REFRESH_DURATION = 1000;
type Props = {
  t: TFunction,
  offer: Object,
  classes: Object,
};

type State = {
  currentTime: Moment,
};

class CheckInOfferSummary extends Component<Props, State> {
  interval: any;

  state = {
    currentTime: Moment(),
  };

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState({ currentTime: Moment() }),
      COUNTDOWN_REFRESH_DURATION,
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { classes, offer, t } = this.props;
    const { currentTime } = this.state;
    const momentDate = Moment();
    const inProgress = !!momentDate.isBetween(
      Moment(offer.date_start),
      Moment(offer.date_end),
    );
    const timeTillDate = inProgress ? offer.date_end : offer.date_start;
    const color = inProgress ? 'primary' : 'inherit';
    const coach = offer.coach_override || offer.coach;

    return (
      <div className={classes.root}>
        <div className={classes.item}>
          <Typography variant="button" color="textSecondary" align="center">
            {t(
              `selfCheckIn:offerStatus.${
                inProgress ? 'inProgress' : 'startIn'
              }`,
            )}
          </Typography>
          <Countdown
            timeFormat="YYYY-MM-DDTHH:mm:ssZ"
            timeTillDate={timeTillDate}
            currentTime={currentTime}
            color={color}
          />
        </div>
        <div className={classes.item}>
          <div className={classes.row}>
            <AccessTimeIcon className={classes.leftIcon} />
            <Typography variant="body2">
              {`${formatAsTime(offer.date_start)} - ${formatAsTime(
                offer.date_end,
              )}`}
            </Typography>
          </div>
        </div>

        <div className={classes.item}>
          <Avatar className={classes.coachAvatar} src={coach.photo} />
        </div>
        <div className={classes.item}>
          <Typography
            variant="h5"
            align="center"
            className={classes.textUppercase}
          >
            {coach ? coach.name : ''}
          </Typography>
        </div>

        <div className={classes.item}>
          <Typography align="center" variant="h4">
            {(offer && offer.name) || ''}
          </Typography>
        </div>
        <div className={classes.item}>
          <Level
            variant="body1"
            align="center"
            levelId={offer && offer.level_id ? offer.level_id || null : null}
          />
        </div>

        <div className={classes.item} />
        <div className={classes.item}>
          <Typography variant="body2" align="center">
            {offer
              ? (offer.establishment_override || offer.etablissement).title
              : ''}
          </Typography>
          <div className={classes.row}>
            <PlaceIcon className={classes.leftIcon} />
            <Typography variant="body1" color="textSecondary" align="center">
              {offer
                ? (offer.establishment_override || offer.etablissement).location
                    .address
                : ''}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

const style = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
    height: '100%',
  },
  item: {
    margin: theme.spacing(1),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
    verticalAlign: 'text-bottom',
  },
  backButtonContainer: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  coachAvatar: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
});

export default withNamespaces([])(withStyles(style)(CheckInOfferSummary));

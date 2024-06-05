// @flow

import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { DateTime } from 'luxon';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';

import Level from '#src/libs/level/components/Level.component';
import { formatISOStringAsTime } from '../../../utils/datetime';

type Props = {
  offer: Object,
  classes: Object,
};

class CheckInOfferSummaryPanel extends Component<Props> {
  interval: any;

  render() {
    const { classes, offer } = this.props;
    const date_end = DateTime.fromISO(offer.date_start)
      .plus({
        minute: offer.duration_minute,
      })
      .toISO();
    const coach = offer.coach_override || offer.coach;

    return (
      <div className={classes.root}>
        <div className={classes.item}>
          <div className={classes.row}>
            <AccessTimeIcon className={classes.leftIcon} />
            <Typography variant="body2">
              {`${formatISOStringAsTime(
                offer.date_start,
              )} - ${formatISOStringAsTime(date_end)}`}
            </Typography>
          </div>
        </div>

        <div className={classes.item}>
          <Avatar className={classes.coachAvatar} src={coach.photo} />
        </div>
        <div className={classes.item}>
          <Typography
            align="center"
            className={classes.textUppercase}
            variant="h5"
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
            align="center"
            customLevel={offer.customLevel}
            variant="body1"
          />
        </div>

        <div className={classes.item} />
        <div className={classes.item}>
          <Typography align="center" variant="body2">
            {offer?.etablissement?.title ?? '-'}
          </Typography>
          <div className={classes.row}>
            <PlaceIcon className={classes.leftIcon} />
            <Typography align="center" color="textSecondary" variant="body1">
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

export default withStyles(style)(CheckInOfferSummaryPanel);

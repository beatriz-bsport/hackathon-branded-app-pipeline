import React, { Component } from 'react';
import { DateTime } from 'luxon';

import {
  withStyles,
  Typography,
  Avatar,
  Theme,
  createStyles,
  WithStyles,
} from '@material-ui/core';

import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';

import Level from '#src/libs/level/components/Level.component';
import { formatISOStringAsTime } from '#src/utils/datetime';

import type { OfferREST } from '#src/libs/offer/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Level as LevelType } from '#src/libs/level/types';

type Props = {
  offer: OfferREST;
  establishment: Establishment;
  coach: Coach;
  customLevel: LevelType;
} & WithStyles<typeof styles>;

class CheckInOfferSummaryPanel extends Component<Props> {
  interval: any;

  render() {
    const { classes, offer, establishment, coach, customLevel } = this.props;
    const date_end = DateTime.fromISO(offer?.date_start)
      .plus({
        minute: offer?.duration_minute,
      })
      .toISO();

    if (!offer || !establishment || !coach || !customLevel) {
      return null;
    }

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
            isChip
            align="center"
            customLevel={customLevel}
            variant="body1"
          />
        </div>

        <div className={classes.item} />
        <div className={classes.item}>
          <Typography align="center" variant="body2">
            {establishment?.title ?? '-'}
          </Typography>
          <div className={classes.row}>
            <PlaceIcon className={classes.leftIcon} />
            <Typography align="center" color="textSecondary" variant="body1">
              {offer ? establishment?.location.address : ''}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
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

export default withStyles(styles)(CheckInOfferSummaryPanel);

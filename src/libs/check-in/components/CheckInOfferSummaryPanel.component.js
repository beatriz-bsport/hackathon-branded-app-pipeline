// @flow

import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';

import Level from '../../../components/category/Level.component';

type Props = {
  offer: Object,
  classes: Object,
};

class CheckInOfferSummary extends Component<Props> {
  interval: any;

  render() {
    const { classes, offer } = this.props;
    const date_end = moment(offer.date_start).add(
      offer.duration_minute,
      'minutes',
    );
    const coach = offer.coach_override || offer.coach;

    return (
      <div className={classes.root}>
        <div className={classes.item}>
          <div className={classes.row}>
            <AccessTimeIcon className={classes.leftIcon} />
            <Typography variant="body2">
              {`${moment(offer.date_start).format('LT')} - ${moment(
                date_end,
              ).format('LT')}`}
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

export default withStyles(style)(CheckInOfferSummary);

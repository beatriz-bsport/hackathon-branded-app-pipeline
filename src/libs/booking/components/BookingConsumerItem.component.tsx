import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, pure } from 'recompose';
import moment from 'moment-timezone';
import { WithTranslation, withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import VideoCamIcon from '@material-ui/icons/Videocam';
import Divider from '@material-ui/core/Divider';

import NearMeIcon from '@material-ui/icons/NearMe';
import PersonIcon from '@material-ui/icons/Person';
import TodayIcon from '@material-ui/icons/Today';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AdjustIcon from '@material-ui/icons/Adjust';
import VisibilityIcon from '@material-ui/icons/Visibility';

import RedButton from '../../../components/button/RedButton.component';
import { Booking } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import { Offer } from '../../offer/types';
import { Coach } from '../../associated-coach/types';
import { Establishment } from '../../establishment/types';
import { MetaActivity } from '../../meta-activity/types';

type OwnProps = {
  booking: Booking<Offer<Coach, Establishment, MetaActivity>>;
  goToCalendar: (bookings: Booking<any>) => void;
  goToBroadcast: (bookings: number) => void;
  onDiscard: (booking: Booking<any>) => void;
  onClickBlueprintPreview?: (
    booking: Booking<Offer<Coach, Establishment, MetaActivity>>,
  ) => void;
  variant?: string;
  hideCoach: boolean;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const BookingConsumerItem = (props: Props) => {
  const { booking, classes, t } = props;
  const { offer } = booking;
  if (!offer) return null;
  const { meta_activity, coach, establishment } = offer;
  const dateStart = moment(offer.date_start);
  if (establishment && meta_activity && !offer.meta_activity.is_broadcast) {
    dateStart.tz(establishment.tzname);
  }
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h5">
          {meta_activity ? meta_activity.name : ' - '}
        </Typography>
        <Avatar
          className={classes.largeAvatar}
          src={meta_activity ? meta_activity.cover_main : null}
        />
      </div>
      <Divider />
      <ListItem dense className={classes.translucentPaper}>
        <ListItemIcon>
          <AccessTimeIcon />
        </ListItemIcon>
        <ListItemText
          primary={offer ? dateStart.format('LL') : ' - '}
          secondary={offer ? dateStart.format('LT') : ' - '}
        />
      </ListItem>

      {typeof props.booking.spot_id === 'number' && (
        <ListItem dense className={classes.translucentPaper}>
          <ListItemIcon>
            <AdjustIcon />
          </ListItemIcon>

          <div className={classes.spotContainer}>
            <Typography>
              {t('booking.spotNumber', { count: props.booking.spot_id })}
            </Typography>

            {props.onClickBlueprintPreview && (
              <Button
                onClick={() => props.onClickBlueprintPreview(props.booking)}
              >
                <div className={classes.previewSpot}>
                  <VisibilityIcon color="inherit" />
                </div>
              </Button>
            )}
          </div>
        </ListItem>
      )}

      <ListItem dense className={classes.translucentPaper}>
        <ListItemIcon>
          <NearMeIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            establishment && establishment.location
              ? establishment.location.address
              : ' - '
          }
          secondary={establishment ? establishment.title : ''}
        />
      </ListItem>

      {!props.hideCoach && (
        <ListItem dense className={classes.translucentPaper}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={coach ? coach.name : ' - '} />
        </ListItem>
      )}
      <Divider />
      <div className={classes.footer}>
        {props.variant !== 'after_checkout' &&
        props.goToBroadcast &&
        meta_activity &&
        meta_activity.is_broadcast ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.goToBroadcast(props.booking.id)}
          >
            <VideoCamIcon className={classes.leftIcon} />
            {t('booking.accessLive')}
          </Button>
        ) : null}
        {props.goToCalendar ? (
          <Button
            onClick={() => props.goToCalendar(props.booking)}
            variant={
              props.variant === 'after_checkout' ? 'contained' : 'outlined'
            }
            color="primary"
            style={props.variant === 'after_checkout' ? { width: '100%' } : {}}
          >
            <TodayIcon className={classes.leftIcon} />
            {props.variant === 'after_checkout'
              ? t('booking.bookAgain')
              : t('booking.showCalendar')}
          </Button>
        ) : null}
        {(offer && moment(offer.date_start).isBefore(moment())) ||
        !props.onDiscard ? null : (
          <RedButton onClick={() => props.onDiscard(props.booking)}>
            {t('booking.discard')}
          </RedButton>
        )}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  largeAvatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    marginBottom: theme.spacing(-4),
  },
  translucentPaper: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  header: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  spotContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewSpot: {
    color: '#AAA',
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
  pure,
)(BookingConsumerItem);

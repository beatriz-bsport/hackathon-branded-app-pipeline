// @flow
import React from 'react';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import { WithTranslation, useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

import NearMeIcon from '@material-ui/icons/NearMe';
import TodayIcon from '@material-ui/icons/Today';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import { makeStyles } from '@material-ui/styles';
import WidgetUtils from '../../../widget/WidgetUtils';

import RedButton from '../../../../components/button/RedButton.component';
import type { PrivateBooking } from '#libs/private-service/types';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {
  private_booking: PrivateBooking;
  goToCalendar: () => void;
  onDiscard: (private_booking: PrivateBooking) => void;
  timezone: string;
};

type Props = OwnProps & WithTranslation & MaterialStyleType<typeof useStyles>;
export const PrivateBookingConsumerItem = (props: Props) => {
  const { private_booking } = props;
  const { t } = useTranslation('consumerSpace');
  const classes = useStyles();
  return (
    <div>
      <div className={classes.header}>
        <Typography variant="h5">{private_booking.name}</Typography>
      </div>
      <div className={classes.subtitle}>
        <Typography variant="subtitle2">{private_booking.subtitle}</Typography>
      </div>
      <Divider />
      <ListItem dense className={classes.translucentPaper}>
        <ListItemIcon>
          <AccessTimeIcon />
        </ListItemIcon>
        <ListItemText
          primary={moment(private_booking.date_start)
            .tz(props.timezone)
            .format('LL')}
          secondary={moment(private_booking.date_start)
            .tz(props.timezone)
            .format('LT')}
        />
        {private_booking?.is_unpaid && (
          <Typography color="error">
            {t('booking.isUnpaid').toUpperCase()}
          </Typography>
        )}
      </ListItem>
      {private_booking.address ? (
        <ListItem dense className={classes.translucentPaper}>
          <ListItemIcon>
            <NearMeIcon />
          </ListItemIcon>
          <ListItemText primary={private_booking.address} />
        </ListItem>
      ) : null}

      <Divider />
      <div className={classes.footer}>
        {props.goToCalendar && !WidgetUtils.isWidget() && (
          <Button
            onClick={props.goToCalendar}
            variant="outlined"
            color="primary"
          >
            <TodayIcon className={classes.leftIcon} />
            {t('booking.showCalendar')}
          </Button>
        )}

        <RedButton onClick={() => props.onDiscard(private_booking)}>
          {t('booking.discard')}
        </RedButton>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  largeAvatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    marginBottom: theme.spacing(-4),
  },
  translucentPaper: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  subtitle: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  header: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default compose<any, OwnProps>()(PrivateBookingConsumerItem);

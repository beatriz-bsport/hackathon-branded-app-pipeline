import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import BlockIcon from '@material-ui/icons/Block';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import clx from 'classnames';

import moment from 'moment-timezone';

import {
  OFFER_WAITING_LIST_STATUS_FULL,
  OFFER_WAITING_LIST_STATUS_OPEN,
} from '@bsport/common/lib/master-data/waiting-list-status';
import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_TOO_SOON,
  OFFER_BOOKABLE_STATUS_TOO_LATE,
  OFFER_BOOKABLE_STATUS_LOCKED,
} from '@bsport/common/lib/master-data/bookable-status';
import { formatMinutes } from '../../../utils/datetime';

const OfferStatus = ({ offerStatus }) => {
  let statusColor = 'green';

  let statusText = '';

  let StatusIcon = () => <div />;
  const { t } = useTranslation(['booking']);

  if (
    [
      OFFER_BOOKABLE_STATUS_TOO_SOON,
      OFFER_BOOKABLE_STATUS_TOO_LATE,
      OFFER_BOOKABLE_STATUS_LOCKED,
    ].includes(offerStatus.bookable_status)
  ) {
    statusColor = 'red';
    statusText = t(
      `offer.offerStatus.bookable_status.${offerStatus.bookable_status}`,
    );
    StatusIcon = BlockIcon;
  } else if (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_BOOKABLE) {
    return null;
  } else if (offerStatus.bookable_status === OFFER_BOOKABLE_STATUS_FULL) {
    StatusIcon = HourglassEmptyIcon;
    statusText = t(
      `offer.offerStatus.waiting_list_status.${offerStatus.waiting_list_status}`,
    );
    if (offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_FULL) {
      statusColor = 'red';
    }
    if (offerStatus.waiting_list_status === OFFER_WAITING_LIST_STATUS_OPEN) {
      statusColor = 'green';
    }
  }
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        border: `1px solid ${statusColor}`,
        borderRadius: 4,
        margin: 6,
      }}
    >
      <StatusIcon
        fontSize="small"
        style={{ color: statusColor, marginRight: 4 }}
      />
      <Typography style={{ color: statusColor }} variant="caption">
        {statusText}
      </Typography>
    </div>
  );
};

export const OfferBookableItem = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['datetime', 'booking']);

  const { offer } = props;

  const establishmentTitle =
    (offer && offer.establishment && offer.establishment.title) || '';

  const coach = (offer && offer.coach_override) || offer.coach;
  const coachName = (coach && coach.name) || '';

  const onClick =
    !props.disabled && (() => props.onAdd && props.onAdd(props.offer));

  return (
    <>
      <ButtonBase
        disableRipple={!onClick || props.onRemove}
        onClick={!props.onRemove && onClick}
        className={clx([
          classes.container,
          props.disabled ? classes.disableContainer : null,
        ])}
      >
        {props.disabled && <div className={classes.disableOverlay} />}
        <div className={classes.time}>
          <Typography variant="h6">
            {moment(props.offer.date_start)
              .tz(props.offer.timezone_name)
              .format('LT')}
          </Typography>
          <Typography color="textSecondary">
            {formatMinutes(props.offer.duration_minute, t)}
          </Typography>
        </div>
        <div className={classes.generalInfo}>
          <Typography>
            {`${moment(props.offer.date_start)
              .tz(props.offer.timezone_name)
              .format('LL')}, ${moment(props.offer.date_start)
              .tz(props.offer.timezone_name)
              .format('dddd')}`}
          </Typography>
          <Typography variant="body2" align="left">
            <strong>{coachName}</strong>
          </Typography>
          <Typography variant="caption" align="left">
            {establishmentTitle}
          </Typography>
          <div className={classes.rightPanel}>
            {props.onRemove ? (
              <IconButton
                onClick={() => props.onRemove(props.offer)}
                className={classes.deleteButton}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : (
              <div />
            )}
            {!!props.offerStatus && (
              <OfferStatus offerStatus={props.offerStatus} />
            )}
          </div>
        </div>
      </ButtonBase>
      {props.isRegistered && (
        <div className={classes.hasRegisteredContainer}>
          <Typography variant="caption" className={classes.hasRegisteredTypo}>
            {t('booking:bookingModule.hasRegistered')}
          </Typography>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  disableContainer: {
    backgroundColor: 'rgba(80, 80, 80, .1)',
  },
  time: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
  generalInfo: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  disableOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, .5)',
    zIndex: 9999,
  },
  hasRegisteredContainer: {
    paddingLeft: theme.spacing(0.5),
    borderLeft: '1px solid rgba(80, 80, 80, .1)',
    borderRight: '1px solid rgba(80, 80, 80, .1)',
  },
  hasRegisteredTypo: {
    color: 'green',
  },
}));

export default OfferBookableItem;

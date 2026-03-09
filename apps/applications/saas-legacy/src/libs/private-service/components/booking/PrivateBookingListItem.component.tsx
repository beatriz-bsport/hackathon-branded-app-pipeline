import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import CancelIcon from '@material-ui/icons/Cancel';
import UpdateIcon from '@material-ui/icons/Update';
import MoneyOffOutlinedIcon from '@material-ui/icons/MoneyOffOutlined';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code.js';

import { getCreditsDividedDisplay } from '#src/libs/theme/utils';
import { PrivateBooking } from '#src/libs/private-service/types';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import {
  formatAsDatetime,
  formatISOStringAsTime,
} from '../../../../utils/datetime';
import { BookingStatusCodeText } from '../../../booking/utils';
import { SwapPassButton } from './SwapPassButton.component';

type Props = {
  divider?: boolean;
  onClick?: () => void;
  selected?: boolean;
  private_booking: PrivateBooking;
  onDelete?: () => void;
  onRestore?: () => void;
  onSetUnpaid?: () => void;
  setPrivateBookingUnpaidLoading?: boolean;
};
export const PrivateBookingListItem: React.FC<Props> = (props: Props) => {
  const getIsRecurrentBooking = () => {
    if (props.private_booking.recurrence_rule_private_booking) {
      return <UpdateIcon color="primary" fontSize="small" />;
    }
    return '';
  };

  const canBeConvertedToUnpaid =
    props.onSetUnpaid &&
    props.private_booking.booking_status_code === BOOKING_STATUS_OK.id &&
    !props.private_booking.is_unpaid &&
    DateTime.fromISO(props.private_booking.date_start) > DateTime.now();

  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  return (
    <ListItem
      // @ts-expect-error
      button={!!props.onClick}
      className={
        props.private_booking.booking_status_code !== BOOKING_STATUS_OK.id
          ? classes.disabled
          : null
      }
      divider={!!props.divider}
      onClick={props.onClick}
      selected={!!props.selected}
    >
      <ListItemText
        // @ts-expect-error
        className={classes.listItemText}
        primary={
          <div className={classes.rowPrimary}>
            <Typography variant="body2">
              {props.private_booking.name +
                (props.private_booking.first_in_company ? ' ★' : '')}
            </Typography>
            <Typography color="primary">{getIsRecurrentBooking()}</Typography>
            <Typography variant="body2">
              <BookingStatusCodeText booking={props.private_booking} />
            </Typography>
            {props.private_booking.is_unpaid ? null : (
              <Typography style={{ marginLeft: 'auto' }} variant="body2">
                {props.private_booking.booking_status_code !==
                  BOOKING_STATUS_OK.id &&
                  `${
                    props.private_booking.was_refunded
                      ? t('privateBooking.isRefunded')
                      : t('privateBooking.notRefunded')
                  }`}
              </Typography>
            )}
          </div>
        }
        secondary={
          <div>
            {props.private_booking.private_consumer_pass &&
              // @ts-expect-error
              props.private_booking.private_consumer_pass.private_pass && (
                <Typography color="primary" variant="caption">
                  {props.private_booking.is_unpaid
                    ? null
                    : // prettier-ignore
                      `${
                        // @ts-expect-error
                        props.private_booking.private_consumer_pass.private_pass
                          .name
                      } (${getCreditsDividedDisplay(
                        // @ts-expect-error
                        props.private_booking.private_consumer_pass.private_pass
                          .credits -
                          props.private_booking.private_consumer_pass
                            // @ts-expect-error
                            .used_credits,
                      )}/${getCreditsDividedDisplay(
                        // @ts-expect-error
                        props.private_booking.private_consumer_pass.private_pass
                          .credits,
                      )})`}
                </Typography>
              )}
            <Typography variant="body2">
              {`${formatAsDatetime(
                props.private_booking.date_start,
                props.private_booking.timezone_name,
              )} -> ${formatISOStringAsTime(
                props.private_booking.date_end,
                props.private_booking.timezone_name,
              )}`}
            </Typography>
          </div>
        }
      />
      {props.onRestore &&
        !props.private_booking.is_unpaid &&
        props.private_booking.booking_status_code !== BOOKING_STATUS_OK.id && (
          <IconButton onClick={props.onRestore}>
            <UndoIcon />
          </IconButton>
        )}
      {props.private_booking.is_unpaid && (
        <IconButton disabled>
          <Typography color="error" variant="body2">
            {t('privateBooking.isUnpaid')}
          </Typography>
        </IconButton>
      )}
      {canBeConvertedToUnpaid && (
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="reservation.privateBooking.allowed_actions.edit"
        >
          <Tooltip title={t('privateBooking.setUnpaid.button') ?? ''}>
            <IconButton
              disabled={props.setPrivateBookingUnpaidLoading}
              onClick={props.onSetUnpaid}
            >
              <MoneyOffOutlinedIcon />
            </IconButton>
          </Tooltip>
        </ObjectLevelPermissionWrapper>
      )}
      {props.private_booking.booking_status_code === BOOKING_STATUS_OK.id && (
        <SwapPassButton
          currentPrivateConsumerPassId={
            props.private_booking.private_consumer_pass
          }
          memberId={props.private_booking.member as number}
          privateBookingId={props.private_booking.id}
          privateSlotId={props.private_booking.private_slot as number}
        />
      )}
      {props.onDelete && (
        <ObjectLevelPermissionWrapper
          forcedBehavior="hidden"
          requiredPermission="reservation.privateBooking.allowed_actions.cancel"
        >
          <IconButton onClick={props.onDelete}>
            <CancelIcon />
          </IconButton>
        </ObjectLevelPermissionWrapper>
      )}
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  disabled: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
  rowPrimary: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
  },
}));

export default PrivateBookingListItem;

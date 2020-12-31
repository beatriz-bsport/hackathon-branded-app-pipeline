// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import CancelIcon from '@material-ui/icons/Cancel';
import UpdateIcon from '@material-ui/icons/Update';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import { getBookingStatusCode } from '../../../booking/utils';
import { formatAsDatetime, formatAsTime } from '../../../../datetime';

type Props = {
  t: TFunction,
  divider?: boolean,
  onClick?: () => void,
  selected?: boolean,
  private_booking: PrivateBooking,
  classes: Object,
  onDelete?: () => void,
  onRestore?: () => void,
};
export const PrivateBookingListItem = (props: Props) => {
  const getIsRecurrentBooking = () => {
    if (props.private_booking.recurrence_rule_private_booking) {
      return <UpdateIcon color="primary" fontsize="small" />;
    }
    return '';
  };

  return (
    <ListItem
      divider={!!props.divider}
      button={!!props.onClick}
      onClick={props.onClick}
      selected={!!props.selected}
      className={
        props.private_booking.booking_status_code !== BOOKING_STATUS_OK.id
          ? props.classes.disabled
          : null
      }
    >
      <ListItemText
        primary={
          <div className={props.classes.rowPrimary}>
            <Typography variant="body2">
              {props.private_booking.name}
            </Typography>
            <Typography color="primary">{getIsRecurrentBooking()}</Typography>
            <Typography variant="body2" inline>
              {getBookingStatusCode(props.t, props.private_booking)}
            </Typography>
          </div>
        }
        secondary={
          <div>
            <Typography variant="body2">
              {`${formatAsDatetime(
                props.private_booking.date_start,
                props.private_booking.timezone_name,
              )} -> ${formatAsTime(
                props.private_booking.date_end,
                props.private_booking.timezone_name,
              )}`}
            </Typography>
          </div>
        }
      />
      <ListItemSecondaryAction>
        {props.onRestore &&
          props.private_booking.booking_status_code !==
            BOOKING_STATUS_OK.id && (
            <IconButton onClick={props.onRestore}>
              <UndoIcon />
            </IconButton>
          )}

        {props.onDelete ? (
          <IconButton onClick={props.onDelete}>
            <CancelIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const styles = (theme) => ({
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
});

export default compose(
  withTranslation(['booking']),
  withStyles(styles),
)(PrivateBookingListItem);

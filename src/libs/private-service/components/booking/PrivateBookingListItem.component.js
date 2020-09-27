// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
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
};
export const PrivateBookingListItem = (props: Props) => {
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
          props.private_booking.name +
          getBookingStatusCode(props.t, props.private_booking)
        }
        secondary={`${formatAsDatetime(
          props.private_booking.date_start,
          props.private_booking.timezone_name,
        )} -> ${formatAsTime(
          props.private_booking.date_end,
          props.private_booking.timezone_name,
        )}`}
      />
      <ListItemSecondaryAction>
        {props.onDelete ? (
          <IconButton onClick={props.onDelete}>
            <CancelIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const styles = () => ({
  disabled: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
});

export default compose(
  withTranslation(['booking']),
  withStyles(styles),
)(PrivateBookingListItem);

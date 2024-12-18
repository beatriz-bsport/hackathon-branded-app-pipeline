import React from 'react';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import ReplayIcon from '@material-ui/icons/Replay';
import { useTranslation } from 'react-i18next';
import {
  PRIVATE_BOOKING_CANCELLED_BY_STAFF,
  PRIVATE_BOOKING_DATE_TIME_MODIFIED_BY_STAFF,
  PRIVATE_BOOKING_COACH_MODIFIED_BY_STAFF,
  PRIVATE_BOOKING_RESTORED_BY_STAFF,
  RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
  ActionStaffHistoryKindTranslationDict,
} from '#src/libs/private-service/components/constants';
import { makeStyles, Theme } from '@material-ui/core';
import { PrivateBookingModificationActionIdentifier } from '#src/libs/role/types';

const getActionIcon = (
  action_identifier: PrivateBookingModificationActionIdentifier,
) => {
  switch (action_identifier) {
    case PRIVATE_BOOKING_CANCELLED_BY_STAFF:
    case RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF:
      return <DeleteIcon color="action" />;
    case PRIVATE_BOOKING_COACH_MODIFIED_BY_STAFF:
      return <CreateIcon color="action" />;
    case PRIVATE_BOOKING_DATE_TIME_MODIFIED_BY_STAFF:
      return <CreateIcon color="action" />;
    case PRIVATE_BOOKING_RESTORED_BY_STAFF:
      return <ReplayIcon color="action" />;
    default:
      return <CreateIcon color="action" />;
  }
};

const getActionText = (
  action_identifier: PrivateBookingModificationActionIdentifier,
) => {
  const { t } = useTranslation('privateService');
  return t(
    `privateBooking.detail.${ActionStaffHistoryKindTranslationDict[action_identifier]}`,
  );
};

const getActionWithStaffText = (
  action_identifier: PrivateBookingModificationActionIdentifier,
) => {
  const { t } = useTranslation('privateService');
  return t(
    `privateBooking.detail.${ActionStaffHistoryKindTranslationDict[action_identifier]}By`,
  );
};

type ActionProps = {
  action_identifier: PrivateBookingModificationActionIdentifier;
  withStaff: boolean;
};
export const ActionIdentifierComponent: React.FC<ActionProps> = ({
  action_identifier,
  withStaff,
}) => {
  const classes = useStyles();
  if (withStaff) {
    return (
      <Typography>
        {`${getActionWithStaffText(action_identifier)}\u00A0:`}
      </Typography>
    );
  }
  return (
    <div className={classes.flexRow}>
      <div className={classes.icon}>{getActionIcon(action_identifier)}</div>
      <Typography>{getActionText(action_identifier)}</Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
    color: 'secondary',
  },
}));
export default ActionIdentifierComponent;

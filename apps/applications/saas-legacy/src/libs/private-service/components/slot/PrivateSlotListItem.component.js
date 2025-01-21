// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import { withTranslation, TFunction } from 'react-i18next';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';
import { formatMinutes } from '../../../../utils/datetime';
import withConfirm from '../../../../hocs/with-confirm.hoc';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CLASSPASS_COMPATIBLE_BOOKING_INTERVALS } from '#src/libs/private-service/constants';

import type { PrivateSlot } from '../../types';

type Props = {
  onDelete?: (slotId: number) => void,
  onEdit?: (slot: PrivateSlot | null) => void,
  onClick?: () => void,
  slot: PrivateSlot,
  t: TFunction,
  divider?: boolean,
  hideCredits?: boolean,
  availableOnPartnership?: boolean,
};

const DeleteButton = (props: { onClick: () => void }) => (
  <IconButton onClick={props.onClick}>
    <DeleteIcon />
  </IconButton>
);

const DeleteButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'privateService:privateSlot.delete.title',
  cancel: 'privateService:privateSlot.delete.cancel',
  confirm: 'privateService:privateSlot.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('privateService:privateSlot.delete.explain')}</p>
  ),
});

export const PrivateSlotListItem: React.FC<Props> = ({
  onDelete,
  onEdit,
  onClick,
  slot,
  t,
  divider,
  hideCredits,
  availableOnPartnership,
}) => {
  const classes = useStyles();

  const handleDeleteSlot = React.useCallback(() => {
    if (onDelete && slot?.id) {
      onDelete(slot.id);
    }
  }, [onDelete, slot]);
  const handleEditSlot = React.useCallback(() => {
    if (onEdit && slot) {
      onEdit(slot);
    }
  }, [onEdit, slot]);

  const showNotCompatibleWithPartnershipAlert = React.useMemo(
    () =>
      (slot.people_capacity_used === 1 &&
        CLASSPASS_COMPATIBLE_BOOKING_INTERVALS.includes(
          slot.booking_interval_minutes,
        )) ||
      !availableOnPartnership,
    [
      slot.booking_interval_minutes,
      slot.people_capacity_used,
      availableOnPartnership,
    ],
  );

  return (
    <ListItem button={!!onClick} divider={divider} onClick={onClick}>
      {!showNotCompatibleWithPartnershipAlert && (
        <ErrorOutlineIcon className={classes.alertIcon} />
      )}
      <ListItemText
        primary={slot.name}
        secondary={`${formatMinutes(slot.duration_minutes, t)}${
          hideCredits
            ? ''
            : ' - '.concat(
                t('privateService:slot.parameters.credit', {
                  credit: getCreditsDividedDisplay(slot.credit),
                }),
              )
        }`}
      />
      <ListItemSecondaryAction>
        {onEdit ? (
          <IconButton color="primary" onClick={handleEditSlot}>
            <EditIcon />
          </IconButton>
        ) : null}
        {onDelete ? (
          <DeleteButtonWithConfirm onClick={handleDeleteSlot} />
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};
const useStyles = makeStyles((theme) => ({
  alertIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.error.main,
  },
}));

export default withTranslation(['privateService', 'datetime'])(
  PrivateSlotListItem,
);

// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import { withTranslation, TFunction } from 'react-i18next';
import { formatMinutes } from '../../../../utils/datetime';
import withConfirm from '../../../../hocs/with-confirm.hoc';
import { getCreditsDividedDisplay } from '#libs/theme/utils';

import type { PrivateSlot } from '../../types';

type Props = {
  onDelete?: (slotId: number) => void,
  onEdit?: (slot: PrivateSlot | null) => void,
  onClick: ?() => void,
  slot: PrivateSlot,
  t: TFunction,
  divider?: boolean,
  hideCredits?: boolean,
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
}) => {
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

  return (
    <ListItem button={!!onClick} divider={divider} onClick={onClick}>
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

export default withTranslation(['privateService', 'datetime'])(
  PrivateSlotListItem,
);

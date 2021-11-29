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

import type { PrivateSlot } from '../../types';

type Props = {
  onDelete: () => void,
  onEdit: () => void,
  onClick: ?() => void,
  slot: PrivateSlot,
  t: TFunction,
  divider?: boolean,
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

export const PrivateSlotListItem = (props: Props) => {
  return (
    <ListItem
      divider={props.divider}
      button={!!props.onClick}
      onClick={props.onClick}
    >
      <ListItemText
        primary={props.slot.name}
        secondary={`${formatMinutes(
          props.slot.duration_minutes,
          props.t,
        )} - ${props.t('privateService:slot.parameters.credit', {
          credit: props.slot.credit,
        })}`}
      />
      <ListItemSecondaryAction>
        {props.onEdit ? (
          <IconButton color="primary" onClick={props.onEdit}>
            <EditIcon />
          </IconButton>
        ) : null}
        {props.onDelete ? (
          <DeleteButtonWithConfirm onClick={props.onDelete} />
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default withTranslation(['privateService', 'datetime'])(
  PrivateSlotListItem,
);

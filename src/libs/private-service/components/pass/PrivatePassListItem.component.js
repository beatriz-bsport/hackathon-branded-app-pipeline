// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Tooltip from '@material-ui/core/Tooltip';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Paper from '@material-ui/core/Paper';
import type { PrivatePass } from '../../types';
import { getValidityInfo } from '../../utils';
import PrivatePassForm from './PrivatePassForm.component';
import ListItemResponsiveAction from '../../../../components/button/ListItemResponsiveAction.component';

type Props = {
  pass: PrivatePass,
  t: TFunction,
  onClick?: () => void,
  onDelete?: () => void,
  onRestore?: () => void,
  divider?: boolean,
  setOpenEditForm: (boolean) => void,
  openEditForm: boolean,
  updatePrivatePass: (
    data: any,
    privatePassId: number,
    options?: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  draggable?: boolean,
};

export const PrivatePassListItem = React.memo((props: Props) => {
  const dateInfo = getValidityInfo(props.pass, props.t);
  const { listeners, attributes, transition, transform, setNodeRef } =
    useSortable({
      id: props.pass.id.toString(10),
    });

  return (
    <Paper
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
    >
      <ListItem
        divider={props.divider}
        button={!!props.onClick}
        onClick={props.onClick}
      >
        {props.draggable && (
          <IconButton {...listeners} {...attributes}>
            <DragHandleIcon />
          </IconButton>
        )}
        <ListItemText
          style={{ marginLeft: 10 }}
          primary={props.pass.name}
          secondary={`${props.t('privatePass.parameters.nbCredits', {
            count: props.pass.credits,
            credits: props.pass.credits,
          })} - ${dateInfo}`}
        />
        {props.pass.manager_only && (
          <Tooltip title={props.t('privatePass.form.managerOnly.label')}>
            <IconButton>
              <VisibilityOffIcon />
            </IconButton>
          </Tooltip>
        )}

        <ListItemResponsiveAction
          actions={[
            props.updatePrivatePass &&
              props.setOpenEditForm && {
                icon: EditIcon,
                label: props.t('privatePass.edit'),
                color: 'primary',
                onClick: () => {
                  props.setOpenEditForm(true);
                },
              },
            props.onDelete && {
              icon: DeleteIcon,
              label: props.t('privatePass.delete.delete'),
              onClick: props.onDelete,
            },
            props.onRestore && {
              icon: RestoreFromTrashIcon,
              onClick: props.onRestore,
            },
          ]}
        />
      </ListItem>
      <Dialog open={props.openEditForm}>
        <DialogTitle>{props.t('privatePass.form.title')}</DialogTitle>
        <DialogContent>
          <PrivatePassForm
            initial={props.pass}
            onSubmit={(data) => {
              props.updatePrivatePass(data, props.pass.id, {
                onSuccess: () => props.setOpenEditForm(false),
              });
            }}
            onCancel={(ev) => {
              ev.stopPropagation();
              props.setOpenEditForm(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
});

export default compose(
  withTranslation(['privateService']),
  withState('openEditForm', 'setOpenEditForm', false),
)(PrivatePassListItem);

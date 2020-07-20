// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { PrivatePass } from '../../types';
import { getValidityInfo } from '../../utils';
import PrivatePassForm from './PrivatePassForm.component';
import ListItemResponsiveAction from '../../../../components/button/ListItemResponsiveAction.component';

type Props = {
  pass: PrivatePass,
  t: TFunction,
  onClick: ?() => void,
  onDelete: ?() => void,
  onRestore: ?() => void,
  divider?: boolean,
  setOpenEditForm: (boolean) => void,
  openEditForm: boolean,
  updatePrivatePass: (
    data: any,
    privatePassId: number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
};

export const PrivatePassListItem = (props: Props) => {
  const dateInfo = getValidityInfo(props.pass, props.t);
  return (
    <div>
      <ListItem
        divider={props.divider}
        button={!!props.onClick}
        onClick={props.onClick}
      >
        <ListItemText
          primary={props.pass.name}
          secondary={`${props.t('privatePass.parameters.nbCredits', {
            credits: props.pass.credits,
          })} - ${dateInfo}`}
        />
        {props.onClick ? (
          <IconButton
            color="primary"
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              props.onClick(ev);
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        ) : null}
        <ListItemResponsiveAction
          actions={[
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
    </div>
  );
};

const styles = () => ({
  container: {},
});

export default compose(
  withTranslation(['privateService']),
  withState('openEditForm', 'setOpenEditForm', false),
  withStyles(styles),
)(PrivatePassListItem);

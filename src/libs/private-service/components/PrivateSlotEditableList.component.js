// @flow
import React from 'react';

import { compose, withState } from 'recompose';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import AddIcon from '@material-ui/icons/Add';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import EmptyListWarning from './EmptyListWarning.component';
import PrivateSlotForm from './PrivateSlotForm.component';
import PrivateSlotListItem from './PrivateSlotListItem.component';

import type { PrivateService } from '../types';

type Props = {
  privateService: PrivateService,
  setOpenSlotForm: (boolean) => void,
  openSlotForm: boolean,
  editSlotForm: PrivatSlotData,
  setEditSlotForm: (?PrivateSlotData) => void,

  createPrivateSlot: (
    privateServiceId: number,
    data: PrivateSlotData,
    id: ?number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
  updatePrivateSlot: (
    privateServiceId: number,
    data: PrivateSlotData,
    id: ?number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
  // eslint-disable-next-line
  deletePrivateSlot: (privateServiceId: number, slotId: number) => void,

  t: TFunction,
  classes: Object,
};

export const EditablePrivateSlotList = (props: Props) => (
  <div>
    <List disablePadding>
      {props.privateService.slots.map((s) => {
        if (s && s.id) {
          return (
            <PrivateSlotListItem
              key={s.id}
              slot={s}
              onEdit={() => props.setEditSlotForm(s)}
              onDelete={() =>
                props.deletePrivateSlot(props.privateService.id, s.id)
              }
            />
          );
        }
        return <CircularProgress key={s} />;
      })}
    </List>
    {props.privateService.slots.length === 0 ? (
      <EmptyListWarning text={props.t('service.parameters.slots.isEmpty')} />
    ) : null}
    <Button
      className={props.classes.button}
      variant="outlined"
      onClick={() => props.setOpenSlotForm(true)}
    >
      <AddIcon className={props.classes.leftIcon} />
      {props.t('service.form.addSlot')}
    </Button>
    <Dialog open={!!props.editSlotForm}>
      <DialogTitle>{props.t('slot.form.title')}</DialogTitle>
      <DialogContent>
        <PrivateSlotForm
          initial={props.editSlotForm}
          onSubmit={(data) =>
            props.updatePrivateSlot(
              props.privateService.id,
              {
                ...data,
                private_service: props.privateService.id,
              },
              props.editSlotForm.id,
              { onSuccess: () => props.setEditSlotForm(null) },
            )
          }
          onCancel={() => props.setEditSlotForm(null)}
        />
      </DialogContent>
    </Dialog>
    <Dialog open={props.openSlotForm}>
      <DialogTitle>{props.t('slot.form.title')}</DialogTitle>
      <DialogContent>
        <PrivateSlotForm
          onSubmit={(data) =>
            props.createPrivateSlot(
              props.privateService.id,
              {
                ...data,
                private_service: props.privateService.id,
              },
              null,
              { onSuccess: () => props.setOpenSlotForm(false) },
            )
          }
          onCancel={() => props.setOpenSlotForm(false)}
        />
      </DialogContent>
    </Dialog>
  </div>
);

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  button: { marginTop: theme.spacing.unit },
});
export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withState('openSlotForm', 'setOpenSlotForm', false),
  withState('editSlotForm', 'setEditSlotForm', null),
)(EditablePrivateSlotList);

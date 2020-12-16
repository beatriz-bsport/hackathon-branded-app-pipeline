// @flow
import React from 'react';

import { compose, withState } from 'recompose';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AddIcon from '@material-ui/icons/Add';
import WarningIcon from '@material-ui/icons/Warning';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PrivateSlotForm from './PrivateSlotForm.component';
import PrivateSlotListItem from './PrivateSlotListItem.component';

import type { PrivateService } from '../../types.ts';

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
  deletePrivateSlot: (slotId: number) => void,

  t: TFunction,
  classes: Object,
};

export const EditablePrivateSlotList = (props: Props) => {
  const slots = props.privateService.slots.filter((s) => s.available);
  return (
    <div className={props.classes.container}>
      <div className={props.classes.titleRow}>
        <AccessTimeIcon fontSize="large" className={props.classes.leftIcon} />
        <Typography variant="h4">
          {props.t('service.configuration.slot')}
        </Typography>
      </div>
      <List>
        <Paper>
          {slots.length === 0 ? (
            <div className={props.classes.row}>
              <WarningIcon color="error" className={props.classes.leftIcon} />
              <div className={props.classes.columnLeft}>
                <Typography>
                  {props.t('service.parameters.slots.isEmpty')}
                </Typography>
                <Typography color="error">
                  {props.t('service.parameters.slots.explainIsEmpty')}
                </Typography>
              </div>
            </div>
          ) : null}
          {slots.map((s) => {
            if (s && s.id) {
              return (
                <PrivateSlotListItem
                  key={s.id}
                  slot={s}
                  divider
                  onEdit={() => props.setEditSlotForm(s)}
                  onDelete={() => props.deletePrivateSlot(s.id)}
                />
              );
            }
            return <CircularProgress key={s} />;
          })}
        </Paper>
      </List>
      <Button
        className={props.classes.button}
        variant="contained"
        color="primary"
        onClick={() => props.setOpenSlotForm(true)}
      >
        <AddIcon className={props.classes.leftIcon} />
        {props.t('service.form.addSlot')}
      </Button>
      <Dialog open={!!props.editSlotForm}>
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
};

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(5),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  button: { marginTop: theme.spacing(1) },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#F8F8F8',
    borderRadius: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  columnLeft: {
    display: 'column',
    alignItems: 'flex-start',
    marginLeft: theme.spacing(1),
  },
});
export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
  withState('openSlotForm', 'setOpenSlotForm', false),
  withState('editSlotForm', 'setEditSlotForm', null),
)(EditablePrivateSlotList);

// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PrivateServiceListItem from '../service/PrivateServiceListItem.component';
import EmptyListWarning from '../EmptyListWarning.component';
import type { PrivatePass, PrivateService } from '../../types';
import PrivatePassForm from './PrivatePassForm.component';

type Props = {
  pass: PrivatePass,
  private_services: Array<PrivateService>,

  onDelete: ?() => void,
  setOpenEditForm: (boolean) => void,
  openEditForm: boolean,
  deleteCompatibleServicePass: (
    passId: number,
    privateServiceId: number,
  ) => void,

  setOpenCreateCompatibleServiceForm: (boolean) => void,
  openCompatibleServiceForm: boolean,

  setOpenDeleteCompatibility: (id: ?number) => void,
  openDeleteCompatibilityDialog: ?number,

  createCompatibleServicePass: (
    number,
    number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  updatePrivatePass: (
    data: any,
    privatePassId: number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
  classes: Object,
  t: TFunction,
};
export const PrivatePassDetail = (props: Props) => {
  if (!props.pass) {
    return null;
  }
  return (
    <div>
      <Paper className={props.classes.paperContainer}>
        <Typography variant="h3">{props.pass.name}</Typography>
        <div className={props.classes.editButton}>
          <IconButton onClick={() => props.setOpenEditForm(true)}>
            <EditIcon />
          </IconButton>
          {props.onDelete ? (
            <IconButton onClick={props.onDelete}>
              <DeleteIcon />
            </IconButton>
          ) : null}
        </div>
        <div className={props.classes.priceParameters}>
          <Typography variant="subtitle" color="textSecondary">
            {props.t('privatePass.parameters.nbCredits', {
              credits: props.pass.credits,
            })}
          </Typography>
          <Typography variant="subtitle" color="textSecondary">
            {props.t('privatePass.parameters.price', {
              price: props.pass.price,
            })}
          </Typography>
          <Typography variant="subtitle" color="textSecondary">
            {props.t('privatePass.parameters.tax', {
              tax: props.pass.tax,
            })}
          </Typography>
          {props.pass.manager_only ? (
            <div className={props.classes.row}>
              <VisibilityOffIcon className={props.classes.leftIcon} />
              <Typography variant="subtitle" color="textSecondary">
                {props.t('privatePass.parameters.managerOnly')}
              </Typography>
            </div>
          ) : null}
        </div>
        <Typography variant="h6" component="h4">
          {props.t('privatePass.compatibleServices.title')}
        </Typography>
        {props.pass.private_services.length === 0 ? (
          <EmptyListWarning
            text={props.t('privatePass.compatibleServices.isEmpty')}
          />
        ) : null}
        <List>
          {props.pass.private_services
            .filter((ps) => ps.available)
            .map((ps) => (
              <PrivateServiceListItem
                hideSecondary
                privateService={ps}
                key={ps.id}
                onCancel={() => props.setOpenDeleteCompatibility(ps.id)}
              />
            ))}
        </List>
        {props.openCompatibleServiceForm ? (
          <Select
            className={props.classes.select}
            onChange={(ev) =>
              props.createCompatibleServicePass(
                props.pass.id,
                ev.target.value,
                {
                  onSuccess: () =>
                    props.setOpenCreateCompatibleServiceForm(false),
                  onError: () =>
                    props.setOpenCreateCompatibleServiceForm(false),
                },
              )
            }
            choices={props.private_services.map((ps) => ps.id)}
          >
            {props.private_services
              .filter((ps) => ps.available)
              .map((ps) => (
                <MenuItem key={ps.id} value={ps.id}>
                  {ps.name}
                </MenuItem>
              ))}
          </Select>
        ) : (
          <Button
            onClick={() => props.setOpenCreateCompatibleServiceForm(true)}
          >
            <AddIcon /> {props.t('privatePass.compatibleServices.add')}
          </Button>
        )}
      </Paper>
      <Dialog open={props.openEditForm}>
        <DialogTitle>{props.t('privatePass.form.title')}</DialogTitle>
        <DialogContent>
          <PrivatePassForm
            initial={props.pass}
            onSubmit={(data) =>
              props.updatePrivatePass(data, props.pass.id, {
                onSuccess: () => props.setOpenEditForm(false),
              })
            }
            onCancel={() => props.setOpenEditForm(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={props.openDeleteCompatibilityDialog}>
        <DialogTitle>
          {props.t('privateServiceCompatibility.delete.title')}
        </DialogTitle>
        <DialogContent>
          {props.t('privateServiceCompatibility.delete.explain')}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setOpenDeleteCompatibility(null)}>
            {props.t('privateServiceCompatibility.delete.cancel')}
          </Button>
          <Button
            onClick={() => {
              props.setOpenDeleteCompatibility(null);
              props.deleteCompatibleServicePass(
                props.pass.id,
                props.openDeleteCompatibilityDialog,
              );
            }}
          >
            {props.t('privateServiceCompatibility.delete.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const styles = (theme) => ({
  paperContainer: {
    position: 'relative',
    padding: theme.spacing(2),
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  select: {
    minWidth: 240,
  },
  priceParameters: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '&>*': {
      paddingRight: theme.spacing(1),
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withState('openEditForm', 'setOpenEditForm', false),
  withState(
    'openCompatibleServiceForm',
    'setOpenCreateCompatibleServiceForm',
    false,
  ),
  withState(
    'openDeleteCompatibilityDialog',
    'setOpenDeleteCompatibility',
    false,
  ),
)(PrivatePassDetail);

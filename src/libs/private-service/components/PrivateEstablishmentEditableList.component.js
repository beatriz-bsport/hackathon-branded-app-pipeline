// @flow
import React from 'react';

import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import EstablishmentInput from '../../../components/input/EstablishmentInput.component';
import EstablishmentListItem from '../../establishment/components/EstablishmentListItem.component';

import EmptyListWarning from './EmptyListWarning.component';
import type { PrivateServiceWithRelatedFields } from '../types';

type Props = {
  privateService: PrivateServiceWithRelatedFields,
  deletePrivateEstablishment: (
    associated_establishment_id: number,
    private_service_id: number,
  ) => void,
  establishments: Array<Establishment>,
  createPrivateEstablishment: (
    associated_establishment_id: number,
    private_service_id: number,
    options: any,
  ) => void,

  setAddPrivateEstablishmentOpen: (boolean) => void,
  addPrivateEstablishmentOpen: boolean,
  deleteData: ?[number, number],
  setDeleteData: (?[number, number]) => void,

  t: TFunction,
  classes: Object,
};
const PrivateEstablishmentEditableList = (props: Props) => (
  <div>
    <List>
      {props.privateService.establishments.length === 0 ? (
        <EmptyListWarning
          text={props.t('service.parameters.establishments.isEmpty')}
        />
      ) : null}
      {props.privateService.establishments
        .filter((e) => !!e)
        .map((establishment) => (
          <EstablishmentListItem
            establishment={establishment}
            onClickDelete={() =>
              props.setDeleteData([
                establishment.associated_establishment_id,
                props.privateService.id,
              ])
            }
          />
        ))}
    </List>
    {props.addPrivateEstablishmentOpen ? (
      <EstablishmentInput
        value={null}
        onChange={(ev) => {
          props.createPrivateEstablishment(
            props.establishments.find((e) => e.id === ev)
              .associated_establishment_id,
            props.privateService.id,
            { onSuccess: () => props.setAddPrivateEstablishmentOpen(false) },
          );
        }}
        label={props.t('service.form.establishment.label')}
        establishments={props.establishments}
      />
    ) : null}
    <Dialog open={!!props.deleteData}>
      <DialogTitle>{props.t('privateEstablishment.delete.title')}</DialogTitle>
      <DialogContent>
        {props.t('privateEstablishment.delete.explain')}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setDeleteData(null)}>
          {props.t('privateEstablishment.delete.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            props.deletePrivateEstablishment(...props.deleteData);
            props.setDeleteData(null);
          }}
        >
          {props.t('privateEstablishment.delete.submit')}
        </Button>
      </DialogActions>
    </Dialog>
    {!props.addPrivateEstablishmentOpen &&
    props.privateService.establishments.length === 0 ? (
      <Button
        variant="outlined"
        onClick={() => {
          props.setAddPrivateEstablishmentOpen(true);
        }}
      >
        <AddIcon className={props.classes.leftIcon} />
        {props.t('service.form.addEstablishment')}
      </Button>
    ) : null}
  </div>
);

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withState(
    'addPrivateEstablishmentOpen',
    'setAddPrivateEstablishmentOpen',
    false,
  ),
  withState('deleteData', 'setDeleteData', null),
)(PrivateEstablishmentEditableList);

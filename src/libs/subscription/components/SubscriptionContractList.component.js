// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withState, compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { Contract } from '../types';

import SubscriptionContractListItem from './SubscriptionContractListItem.component';
import SubscriptionContractFormDrawer from './SubscriptionContractFormDrawer.component';

type Props = {
  t: TFunction,
  classes: Object,
  company?: { id: number, name: string },
  contractList: Array<Contract>,
  loading: boolean,
  contractToEdit: ?Contract,
  setContractToEdit: (contract: ?Contract) => void,
  createOpen: boolean,
  setCreateOpen: (boolean) => void,
  dense?: boolean,
  divider?: boolean,
  copy?: boolean,
  snackbar?: (string) => void,
  paymentComboList: Array<PaymentCombo>,

  selectedContract: ?number,
  onClick: (id: number) => void,

  onRegister: (Contract) => void,
  processing: boolean,
  displayNewCheckoutFlow: boolean,

  onDelete: (id: number, options: OptionCallback) => void,
  paymentPackList: Array<PaymentPack>,
  privatePassList: Array<PrivatePass>,
  onEdit: ?(data: any, options: OptionCallback) => void,
  onCreate: ?(data: any, options: OptionCallback) => void,
  onRestore: (id: number, options: OptionCallback) => void,
};
export const SubscriptionContractList = (props: Props) => {
  return (
    <div>
      {props.contractList?.length === 0 && !props.loading
        ? props.t('contract.list.isEmpty')
        : null}
      {props.loading ? <LinearProgress /> : null}
      <Paper>
        <List disablePadding>
          {props.contractList?.map((c) => (
            <SubscriptionContractListItem
              key={c.id}
              company={props.company}
              contract={c}
              copy={props.copy}
              dense={props.dense}
              divider={props.divider}
              onClick={props.onClick ? () => props.onClick(c.id) : null}
              onDelete={props.onDelete ? () => props.onDelete(c.id) : null}
              onEdit={props.onEdit ? () => props.setContractToEdit(c) : null}
              onRegister={props.onRegister ? () => props.onRegister(c) : null}
              onRestore={props.onRestore ? () => props.onRestore(c.id) : null}
              selected={c.id === props.selectedContract}
              snackbar={props.snackbar}
            />
          ))}
        </List>
      </Paper>
      {!!props.onCreate && (
        <div className={props.classes.buttonRow}>
          <Button
            color="primary"
            onClick={() => props.setCreateOpen(true)}
            variant="contained"
          >
            <AddIcon className={props.classes.leftIcon} />
            {props.t('contract.list.addButton')}
          </Button>
          {props.selectedContract ? (
            <Button
              color="primary"
              onClick={() =>
                props.onRegister(
                  props.contractList?.find(
                    (c) => c.id === props.selectedContract,
                  ),
                )
              }
              variant="contained"
            >
              <ReceiptIcon className={props.classes.leftIcon} />
              {props.t('contract.list.register')}
            </Button>
          ) : (
            <div />
          )}
        </div>
      )}
      <SubscriptionContractFormDrawer
        displayNewCheckoutFlow={props.displayNewCheckoutFlow}
        initial={props.contractToEdit}
        onClose={() => {
          props.setCreateOpen(false);
          props.setContractToEdit(null);
        }}
        onSubmit={(data, options) => {
          props.onCreate(data, {
            onSuccess: () => {
              props.setCreateOpen(false);
              if (options && options.onSuccess) options.onSuccess();
            },
            onError: (err) => {
              props.setCreateOpen(false);
              if (options && options.onError) options.onError(err);
            },
          });
        }}
        open={props.createOpen}
        paymentComboList={props.paymentComboList}
        paymentPackList={props.paymentPackList}
        privatePassList={props.privatePassList}
      />
      <SubscriptionContractFormDrawer
        displayNewCheckoutFlow={props.displayNewCheckoutFlow}
        initial={props.contractToEdit}
        onClose={() => props.setContractToEdit(null)}
        onSubmit={(data, options) => {
          props.onEdit(data, {
            onSuccess: () => {
              props.setContractToEdit(null);
              if (options && options.onSuccess) options.onSuccess();
            },
            onError: (err) => {
              if (options && options.onError) options.onError(err);
            },
          });
        }}
        open={!!props.contractToEdit}
        paymentComboList={props.paymentComboList}
        paymentPackList={props.paymentPackList}
        privatePassList={props.privatePassList}
        processing={props.processing}
      />
    </div>
  );
};

const styles = (theme) => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  buttonRow: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['subscription']),
  withStyles(styles),
  withState('createOpen', 'setCreateOpen', false),
  withState('contractToEdit', 'setContractToEdit', null),
)(SubscriptionContractList);

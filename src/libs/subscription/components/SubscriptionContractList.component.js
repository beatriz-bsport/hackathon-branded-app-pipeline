// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withState, compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import ReceiptIcon from '@material-ui/icons/Receipt';

import SubscriptionContractListItem from './SubscriptionContractListItem.component';
import SubscriptionContractFormDialog from './SubscriptionContractFormDialog.component';

type Props = {
  t: TFunction,
  classes: Object,
  company?: { id: number, name: string },
  contractList: Array<Contract>,
  loading: boolean,
  contractToEdit: ?Contract,
  setContractToEdit: (?Contract) => void,
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

  onDelete: (id: number, options: OptionCallback) => void,
  paymentPacks: Array<PaymentPack>,
  privatePassList: Array<PrivatePass>,
  onEdit: ?(data: *, options: OptionCallback) => void,
  onCreate: ?(data: *, options: OptionCallback) => void,
};
export const SubscriptionContractList = (props: Props) => {
  return (
    <div>
      {props.contractList.length === 0 && !props.loading
        ? props.t('contract.list.isEmpty')
        : null}
      {props.loading ? <LinearProgress /> : null}
      <Paper>
        <List disablePadding>
          {props.contractList.map((c) => (
            <SubscriptionContractListItem
              key={c.id}
              contract={c}
              divider={props.divider}
              dense={props.dense}
              selected={c.id === props.selectedContract}
              onClick={props.onClick ? () => props.onClick(c.id) : null}
              onRegister={() => props.onRegister(c)}
              onEdit={() => {
                props.setContractToEdit(c);
              }}
              onDelete={() => {
                props.onDelete(c.id);
              }}
              copy={props.copy}
              company={props.company}
              snackbar={props.snackbar}
            />
          ))}
        </List>
      </Paper>
      {!!props.onCreate && (
        <div className={props.classes.buttonRow}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => props.setCreateOpen(true)}
          >
            <AddIcon className={props.classes.leftIcon} />
            {props.t('contract.list.addButton')}
          </Button>
          {props.selectedContract ? (
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                props.onRegister(
                  props.contractList.find(
                    (c) => c.id === props.selectedContract,
                  ),
                )
              }
            >
              <ReceiptIcon className={props.classes.leftIcon} />
              {props.t('contract.list.register')}
            </Button>
          ) : (
            <div />
          )}
        </div>
      )}
      {props.createOpen ? (
        <SubscriptionContractFormDialog
          onClose={() => {
            props.setCreateOpen(false);
            props.setContractToEdit(null);
          }}
          open={props.createOpen}
          initial={props.contractToEdit}
          paymentPacks={props.paymentPacks}
          paymentComboList={props.paymentComboList}
          privatePassList={props.privatePassList}
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
        />
      ) : null}
      {props.contractToEdit ? (
        <SubscriptionContractFormDialog
          onClose={() => props.setContractToEdit(null)}
          initial={props.contractToEdit}
          open={!!props.contractToEdit}
          paymentPacks={props.paymentPacks}
          paymentComboList={props.paymentComboList}
          privatePassList={props.privatePassList}
          processing={props.processing}
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
        />
      ) : null}
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

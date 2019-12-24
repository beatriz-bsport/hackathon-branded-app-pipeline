// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withState, compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
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
  contractList: Array<Contract>,
  loading: boolean,
  contractToEdit: ?Contract,
  setContractToEdit: (?Contract) => void,
  createOpen: boolean,
  setCreateOpen: (boolean) => void,

  selectedContract: ?number,
  onClick: (id: number) => void,

  onRegister: (Contract) => void,
  processing: boolean,

  onDelete: (id: number, options: OptionCallback) => void,
  paymentPacks: Array<PaymentPack>,
  createOrUpdate: (data: *, options: OptionCallback) => void,
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
              selected={c.id === props.selectedContract}
              onClick={props.onClick ? () => props.onClick(c.id) : null}
              onRegister={() => props.onRegister(c)}
              onEdit={() => {
                props.setContractToEdit(c);
              }}
              onDelete={() => {
                props.onDelete(c.id);
              }}
            />
          ))}
        </List>
      </Paper>
      <div className={props.classes.buttonRow}>
        <Button
          color="primary"
          variant="outlined"
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
                props.contractList.find((c) => c.id === props.selectedContract),
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
      <SubscriptionContractFormDialog
        onClose={() => props.setCreateOpen(false)}
        open={props.createOpen}
        paymentPacks={props.paymentPacks}
        onSubmit={(data, options) => {
          props.createOrUpdate(data, {
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
      {props.contractToEdit ? (
        <SubscriptionContractFormDialog
          onClose={() => props.setContractToEdit(null)}
          initial={props.contractToEdit}
          open={!!props.contractToEdit}
          paymentPacks={props.paymentPacks}
          processing={props.processing}
          onSubmit={(data, options) => {
            props.createOrUpdate(data, {
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
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  buttonRow: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['subscription']),
  withStyles(styles),
  withState('createOpen', 'setCreateOpen', false),
  withState('contractToEdit', 'setContractToEdit', null),
)(SubscriptionContractList);

// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withState, compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

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

  onDelete: (id: number, options: OptionCallback) => void,
  paymentPacks: Array<PaymentPack>,
  createOrUpdate: (data: *, options: OptionCallback) => void,
};
export const SubscriptionContractList = (props: Props) => {
  return (
    <div>
      <Typography className={props.classes.sectionTitle} variant="h4">
        {props.t('contract.list.title')}
      </Typography>
      <Divider className={props.classes.divider} />
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
              onEdit={() => props.setContractToEdit(c)}
              onDelete={() => props.onDelete(c.id)}
            />
          ))}
        </List>
      </Paper>
      <Button
        color="primary"
        variant="outlined"
        className={props.classes.addButton}
        onClick={() => props.setCreateOpen(true)}
      >
        <AddIcon className={props.classes.leftIcon} />
        {props.t('contract.list.addButton')}
      </Button>
      <Typography className={props.classes.sectionTitle} variant="h4">
        {props.t('subscription.list.title')}
      </Typography>
      <Divider className={props.classes.divider} />
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
  divider: {
    marginBottom: theme.spacing.unit * 2,
  },
  sectionTitle: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  addButton: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
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

// @flow

import { compose, withHandlers, withStateHandlers } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import PaymentRuleForm from './PaymentRuleForm.component';

import type { PaymentRuleSet } from '../types';

type Props = {
  t: TFunction,
  open: boolean,
  handleClose: () => void,
  initial: PaymentRuleSet,
};

export function PaymentRuleSetFormDialog(props: Props) {
  const { t, open, handleClose } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={props.onSubmit}>
        <DialogTitle id="form-dialog-title">{t('addNew')}</DialogTitle>
        <DialogContent>
          <PaymentRuleForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            {t('cancel')}
          </Button>
          <Button color="primary" type="submit">
            {t('save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default compose(
  withNamespaces(['paymentRules']),
  withStateHandlers(
    ({ initial }) => initial || { name: '', base_price: 10, bonuses: [] },
    {
      onChangeName: () => (event: Object) => ({ name: event.target.value }),
      onChangeBasePrice: () => (event: Object) => ({
        base_price: event.target.value,
      }),
      removeRule: ({ bonuses }) => (bonus: PaymentRuleBonus) => ({
        bonuses: bonuses.filter((b) => b.id !== bonus.id),
      }),
      addRule: ({ bonuses }) => () => {
        const bonusRule = {
          id: -bonuses.reduce((s, a) => s + Math.abs(a.id), 1),
          threshold: bonuses.reduce((a, b) => Math.max(a, b.threshold), 0) + 5,
          variable_bonus:
            bonuses.reduce((a, b) => Math.max(a, b.variable_bonus), 0) + 1,
        };
        return {
          bonuses: [...bonuses, bonusRule],
        };
      },
      handleChangeRule: ({ bonuses }) => (bonus: PaymentRuleBonus) => ({
        bonuses: [...bonuses.filter((b) => b.id !== bonus.id), bonus].sort(
          (a, b) => a.threshold - b.threshold,
        ),
      }),
    },
  ),
  withHandlers({
    onSubmit: ({ id, name, base_price, bonuses, onSubmit }) => (event) => {
      event.preventDefault();
      onSubmit({ id, name, base_price, bonuses });
    },
  }),
)(PaymentRuleSetFormDialog);

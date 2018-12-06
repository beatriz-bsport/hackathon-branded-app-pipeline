// @flow

import React from 'react';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';

import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import PriceInput from '../../../components/input/PriceInput.component';

import BonusRuleForm from './BonusRuleForm.component';

import type { PaymentRule, PaymentRuleBonus } from '../types';

type Props = { t: TFunction, classes: * } & PaymentRule & {
    onChangeName: (value: Object) => void,
    onChangeBasePrice: (value: Object) => void,
    addRule: () => void,
    handleChangeRule: (PaymentRuleBonus) => void,
  } & { onSubmit: (PaymentRule) => void };

export function PaymentRuleForm(props: Props) {
  const { t, classes } = props;
  const { name, base_price, bonuses } = props;
  return (
    <div>
      <TextField
        name="name"
        value={name}
        label={t('name')}
        onChange={props.onChangeName}
        margin="normal"
        required
        fullWidth
      />
      <PriceInput
        name="base_price"
        value={base_price}
        onChange={props.onChangeBasePrice}
        label={t('base_price')}
        margin="normal"
        required
        fullWidth
      />
      <Paper className={classes.rulesContainer}>
        <Typography variant="subtitle1">{t('rules')}</Typography>
        <Table padding="dense">
          <TableHead>
            <TableRow>
              <TableCell>{t('bookingThreshold')}</TableCell>
              <TableCell>{t('pricePerAdditionalBooking')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bonuses.map((br) => (
              <BonusRuleForm
                key={br.threshold}
                rule={br}
                onRemove={() => props.removeRule(br)}
                onChange={props.handleChangeRule}
              />
            ))}
          </TableBody>
        </Table>
        <Button onClick={props.addRule} color="secondary">
          <AddIcon className={classes.leftButton} />
          {t('addBonus')}
        </Button>
      </Paper>
    </div>
  );
}
const styles = (theme) => ({
  rulesContainer: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['paymentRules']),
  withStyles(styles),
)(PaymentRuleForm);

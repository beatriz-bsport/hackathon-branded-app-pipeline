// @flow

import React from 'react';
import { compose, withHandlers } from 'recompose';

import { InputAdornment, withStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';

import type { PaymentRule } from '../types';

import PriceInput from '../../../components/input/PriceInput.component';

const styles = (theme) => ({
  paddedLeftBlock: {
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F8F8F8',
  },
  dense: {
    padding: 5,
  },
});

type Props = {
  onRemove: () => void,
  rule: PaymentRule,
  classes: Object,
  handleChange: (string) => (event: Object) => void,
};

export function BonusRuleForm(props: Props) {
  const { classes, rule, handleChange } = props;
  const { threshold, variable_bonus } = rule;
  return (
    <TableRow>
      <TableCell className={classes.dense}>
        <TextField
          InputProps={{
            inputProps: { min: 0 },
            startAdornment: <InputAdornment position="start">⩾</InputAdornment>,
          }}
          value={threshold}
          margin="dense"
          onChange={handleChange('threshold')}
          fullWidth
        />
      </TableCell>
      <TableCell className={classes.dense}>
        <PriceInput
          margin="dense"
          value={variable_bonus}
          onChange={handleChange('variable_bonus')}
          fullWidth
        />
      </TableCell>
      <TableCell className={classes.dense}>
        <IconButton onClick={props.onRemove} aria-label="Delete">
          <ClearIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default compose(
  withStyles(styles),
  withHandlers({
    handleChange: ({ rule, onChange }) => (name) => (event: Object) => {
      onChange({ ...rule, [name]: +event.target.value });
    },
  }),
)(BonusRuleForm);

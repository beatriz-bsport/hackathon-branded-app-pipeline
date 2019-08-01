// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withNamespaces } from 'react-i18next';

import PaymentPackSummary from '../payment-pack/PaymentPackSummary.component';

import type { PaymentPack } from '../../api/types';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    marginLeft: 0,
    minWidth: 260,
  },
});

type Props = {
  classes: Object,
  paymentPacks: Array<PaymentPack>,
  onChange: (?number) => void,
  helperText: string,
  value: ?number,
  label: ?string,
};

export function PaymentPackInput(props: Props) {
  const { value, label, onChange, paymentPacks, classes, helperText } = props;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink={value} htmlFor="pass-helper">
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={<Input name="pass" id="pass-helper" />}
      >
        <MenuItem value={null}>
          <em> - </em>
        </MenuItem>
        {paymentPacks
          .asMutable()
          .sort((pp, pp_) => pp.name > pp_.name)
          .map((pp) => (
            <MenuItem value={pp.id} key={pp.id}>
              <PaymentPackSummary noDivider paymentPack={pp} />
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default withStyles(styles)(withNamespaces()(PaymentPackInput));

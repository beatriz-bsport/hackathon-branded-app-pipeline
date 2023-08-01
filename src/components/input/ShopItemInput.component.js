// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withTranslation } from 'react-i18next';

import ShopItemSummary from '../shop/ShopItemSummary.component';

import type { ShopItem } from '../../api/types';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 360,
  },
});

type Props = {
  classes: Object,
  shopItems: Array<ShopItem>,
  onChange: (item: ?number) => void,
  helperText: string,
  value: ?number,
  label: ?string,
};

export function ShopItemInput(props: Props) {
  const { value, label, onChange, shopItems, classes, helperText } = props;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="pass-helper" shrink={value}>
        {label}
      </InputLabel>
      <Select
        input={<Input id="shop-item-helper" name="shop-item" />}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <MenuItem value={null}>
          <em> - </em>
        </MenuItem>
        {shopItems.map((si) => (
          <MenuItem key={si.id} value={si.id}>
            <ShopItemSummary shopItem={si} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default withStyles(styles)(withTranslation()(ShopItemInput));

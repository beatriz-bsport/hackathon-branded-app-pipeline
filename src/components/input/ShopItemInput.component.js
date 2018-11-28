// @flow

import React from 'react';

import {
  withStyles,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import ShopItemSummary from '../shop/ShopItemSummary.component';

import type { ShopItem } from '../../api/types';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 360,
  },
});

type Props = {
  classes: Object,
  shopItems: Array<ShopItem>,
  onChange: (?number) => void,
  helperText: string,
  value: ?number,
  label: ?string,
};

export function ShopItemInput(props: Props) {
  const { value, label, onChange, shopItems, classes, helperText } = props;
  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink={value} htmlFor="pass-helper">
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={<Input name="shop-item" id="shop-item-helper" />}
      >
        <MenuItem value={null}>
          <em> - </em>
        </MenuItem>
        {shopItems
          .asMutable()
          .sort((si, si_) => si.name > si_.name)
          .map((si) => (
            <MenuItem value={si.id} key={si.id}>
              <ShopItemSummary shopItem={si} />
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default withStyles(styles)(translate()(ShopItemInput));

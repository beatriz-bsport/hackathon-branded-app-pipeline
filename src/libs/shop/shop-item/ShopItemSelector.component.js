// @flow

import React from 'react';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { components } from 'react-select';
import SearchIcon from '@material-ui/icons/Search';
import ShopItemSummary from '../../../components/shop/ShopItemSummary.component';

import Selector from '../../../components/Selector.component';

import type { ShopItem } from '../../../api/types';

type Props = {
  classes: Object,
  shopItems: Array<ShopItem>,
  onChange: (?number) => void,
  helperText: string,
  value: ?number,
  selectorClass: string,
};

type OptionProps = {
  data: Object,
  innerRef: Object,
  innerProps: Object,
};
function ShopItemOption(props: OptionProps) {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <ShopItemSummary shopItem={data.si} button />
    </div>
  );
}

function ShopItemSelector(props: Props) {
  const { value, onChange, shopItems, selectorClass, helperText } = props;

  const suggestions = shopItems.asMutable().map((si) => ({
    value: si.id,
    label: si.name,
    si,
  }));

  return (
    <Selector
      searchIcon
      selected={value}
      suggestions={suggestions}
      components={{ Option: ShopItemOption }}
      className={selectorClass}
      onChange={(event) => onChange(event.value)}
      placeholder={helperText}
    />
  );
}

export default withNamespaces()(ShopItemSelector);

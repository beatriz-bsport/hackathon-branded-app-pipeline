// @ts-nocheck
import React from 'react';

import classNames from 'classnames';
import GiftcardListItem from './GiftcardListItem.component';
import Selector from '../../../components/Selector.component';

import { Giftcard } from '../types';
// @flow

type Props = {
  classes: any;
  giftcardList: Array<Giftcard>;
  onChange: (id: number | null) => void;
  helperText: string;
  nullCurrentValue?: boolean;
  value: number | null;
  selectorClass: string;
  autofocus: boolean;
};

type OptionProps = {
  data: any;
  innerRef: any;
  innerProps: any;
  isSelected: boolean;
  isFocused: boolean;
  autofocus: boolean;
  searchIcon: any;
  nullCurrentValue: boolean;
  selected: number;
  suggestions: Array<{ label: string; value: number; data: any }>;
  className: any;
  components: any;
  placeholder: string;
  onChange: (ev: any) => void;
};

function paymentComboOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <GiftcardListItem
        button
        dense
        noDivider
        giftcard={data.pp}
        isFocused={isFocused}
        selected={isSelected}
      />
    </div>
  );
}

export function GiftcardSelector(props: Props) {
  const {
    value,
    onChange,
    giftcardList,
    selectorClass,
    helperText,
    nullCurrentValue,
    autofocus,
    classes,
  } = props;
  const suggestions = [...(giftcardList || [])]
    .sort((pp, pp_) => pp.name > pp_.name)
    .map((pp) => ({ value: pp.id, label: pp.name, pp }));

  return (
    <Selector
      searchIcon
      autofocus={autofocus}
      className={classNames(classes, selectorClass)}
      components={{ Option: paymentComboOption }}
      nullCurrentValue={nullCurrentValue}
      onChange={(event) => onChange(event.value)}
      placeholder={helperText}
      selected={value}
      suggestions={suggestions}
    />
  );
}

export default GiftcardSelector;

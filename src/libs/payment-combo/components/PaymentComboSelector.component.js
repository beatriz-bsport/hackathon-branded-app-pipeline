// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';

import classNames from 'classnames';
import PaymentComboListItem from './PaymentComboListItem.component';

import Selector from '../../../components/Selector.component';

import type { PaymentCombo } from '../types';

type Props = {
  classes: Object,
  paymentComboList: Array<PaymentCombo>,
  onChange: (?number) => void,
  helperText: string,
  nullCurrentValue?: boolean,
  value: ?number,
  selectorClass: string,
};

type OptionProps = {
  data: Object,
  innerRef: Object,
  innerProps: Object,
  isSelected?: boolean,
  isFocused: boolean,
};

function paymentComboOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <PaymentComboListItem
        selected={isSelected}
        isFocused={isFocused}
        paymentCombo={data.pp}
        noDivider
        button
        dense
      />
    </div>
  );
}

export function PaymentComboSelector(props: Props) {
  const {
    value,
    onChange,
    paymentComboList,
    classes,
    selectorClass,
    helperText,
    nullCurrentValue,
  } = props;
  const suggestions = paymentComboList
    .asMutable()
    .sort((pp, pp_) => pp.name > pp_.name)
    .map((pp) => ({ value: pp.id, label: pp.name, pp }));

  return (
    <Selector
      searchIcon
      nullCurrentValue={nullCurrentValue}
      selected={value}
      suggestions={suggestions}
      className={classNames(classes, selectorClass)}
      components={{ Option: paymentComboOption }}
      placeholder={helperText}
      onChange={(event) => onChange(event.value)}
    />
  );
}

export default withTranslation()(PaymentComboSelector);

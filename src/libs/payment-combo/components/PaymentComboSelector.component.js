// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';

import classNames from 'classnames';
import PaymentComboListItem from './PaymentComboListItem.component';

import Selector from '../../../components/Selector.component';

import type { PaymentCombo } from '../types';

type Props = {
  classes: any,
  paymentComboList: Array<PaymentCombo>,
  onChange: (id: ?number) => void,
  helperText: string,
  nullCurrentValue?: boolean,
  value: ?number,
  selectorClass: string,
  autofocus: boolean,
};

type OptionProps = {
  data: any,
  innerRef: any,
  innerProps: any,
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
    autofocus,
  } = props;
  const suggestions = [...(paymentComboList || [])]
    .sort((pp, pp_) => pp.name > pp_.name)
    .map((pp) => ({ value: pp.id, label: pp.name, pp }));

  return (
    <Selector
      autofocus={autofocus}
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

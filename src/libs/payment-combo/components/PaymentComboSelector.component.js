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
  disabled?: boolean,
  error?: boolean,
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
        button
        dense
        noDivider
        isFocused={isFocused}
        paymentCombo={data.pp}
        selected={isSelected}
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
    error,
  } = props;
  const suggestions = [...(paymentComboList || [])]
    .sort((pp, pp_) => pp.name > pp_.name)
    .map((pp) => ({ value: pp.id, label: pp.name, pp }));

  return (
    <Selector
      searchIcon
      autofocus={autofocus}
      className={classNames(classes, selectorClass)}
      components={{ Option: paymentComboOption }}
      error={error}
      isDisabled={!!props.disabled}
      nullCurrentValue={nullCurrentValue}
      onChange={(event) => onChange(event.value)}
      placeholder={helperText}
      selected={value}
      suggestions={suggestions}
    />
  );
}

export default withTranslation()(PaymentComboSelector);

// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';

import classNames from 'classnames';
import PaymentPackSummary from '../../../components/payment-pack/PaymentPackSummary.component';

import Selector from '../../../components/Selector.component';

import type { PaymentPack } from '../../../api/types';

type Props = {
  classes: Object,
  paymentPacks: Array<PaymentPack>,
  onChange: (?number) => void,
  helperText: string,
  value: ?number,
  selectorClass: string,
  isMulti: boolean,
  nullCurrentValue?: boolean,
  autofocus: boolean,
};

type OptionProps = {
  data: Object,
  innerRef: Object,
  innerProps: Object,
  isSelected?: boolean,
  isFocused: boolean,
};

function paymentPackOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <PaymentPackSummary
        selected={isSelected}
        isFocused={isFocused}
        paymentPack={data.pp}
        noDivider
        button
      />
    </div>
  );
}

export function PaymentPackSelector(props: Props) {
  const {
    value,
    onChange,
    paymentPacks,
    classes,
    selectorClass,
    helperText,
    nullCurrentValue,
    autofocus,
  } = props;
  const suggestions = paymentPacks
    .asMutable()
    .sort((pp, pp_) => pp.name > pp_.name)
    .map((pp) => ({ value: pp.id, label: pp.name, pp }));
  return (
    <Selector
      autofocus={autofocus}
      searchIcon
      selected={value}
      nullCurrentValue={nullCurrentValue}
      suggestions={suggestions}
      className={classNames(classes, selectorClass)}
      components={{ Option: paymentPackOption }}
      placeholder={helperText}
      onChange={(event) => {
        if (props.isMulti) {
          onChange(event);
        } else {
          onChange(event.value);
        }
      }}
      isMulti={props.isMulti}
    />
  );
}

export default withTranslation()(PaymentPackSelector);

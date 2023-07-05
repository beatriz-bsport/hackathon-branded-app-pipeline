// @ts-nocheck
import React from 'react';

import classNames from 'classnames';
import PaymentPackSummary from '../../../components/payment-pack/PaymentPackSummary.component';

import Selector from '../../../components/Selector.component';

import type {
  PaymentPack,
  PaymentPackTemplate,
} from '#libs/payment-packs/types';

type Props = {
  classes?: Object;
  paymentPacks: Array<PaymentPack> | Array<PaymentPackTemplate>;
  onChange: (id: number | null) => void;
  helperText: string;
  value?: number | null;
  selectorClass?: string;
  isMulti?: boolean;
  nullCurrentValue?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
};

type OptionProps = {
  data: Object;
  innerRef: Object;
  innerProps: Object;
  isSelected?: boolean;
  isFocused: boolean;
};

function paymentPackOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <PaymentPackSummary
        button
        noDivider
        isFocused={isFocused}
        paymentPack={data.pp}
        selected={isSelected}
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
  const suggestions = [...paymentPacks]
    .sort((pp, pp_) => pp.name > pp_.name)
    .map((pp) => ({ value: pp.id, label: pp.name, pp }));
  return (
    <Selector
      searchIcon
      autofocus={autofocus}
      className={classNames(classes, selectorClass)}
      components={{ Option: paymentPackOption }}
      isDisabled={!!props.disabled}
      isMulti={props.isMulti}
      nullCurrentValue={nullCurrentValue}
      onChange={(event: number | { value: number; label: string }) => {
        if (props.isMulti) {
          onChange(event);
        } else {
          onChange(event.value);
        }
      }}
      placeholder={helperText}
      selected={value}
      suggestions={suggestions}
    />
  );
}

export default PaymentPackSelector;

import React from 'react';

import { withTranslation } from 'react-i18next';

import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// @ts-expect-error
import Selector from '../../../../components/Selector.component';

import type { PrivatePass } from '../../types';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';

type Props = {
  classes: Object;
  privatePassList: Array<PrivatePass>;
  onChange: (id?: number) => void;
  nullCurrentValue?: boolean;
  helperText: string;
  value?: number;
  selectorClass: string;
  autofocus: boolean;
  disabled?: boolean;
  error: boolean;
};

type OptionProps = {
  data: Object;
  innerRef: Object;
  innerProps: Object;
  isSelected?: boolean;
  isFocused: boolean;
};

export function privatePassOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    // @ts-expect-error
    <div ref={innerRef} {...innerProps}>
      <ListItem
        dense
        selected={!!isSelected}
        style={isFocused ? { backgroundColor: '#EFEFEF' } : {}}
      >
        <ListItemText
          // @ts-expect-error
          primary={data.pp.name}
          // @ts-expect-error
          secondary={`${getCurrencyDisplayWithPrice(data.pp.price)}`}
        />
      </ListItem>
    </div>
  );
}

export function PrivatePassSelector(props: Props) {
  const {
    value,
    onChange,
    privatePassList,
    classes,
    selectorClass,
    autofocus,
    helperText,
    error,
  } = props;
  const suggestions = privatePassList
    ? [...privatePassList]
        // @ts-expect-error
        .sort((pp, pp_) => pp.name > pp_.name)
        .map((pp) => ({ value: pp.id, label: pp.name, pp }))
    : [];
  return (
    <Selector
      searchIcon
      autofocus={autofocus}
      className={classNames(classes, selectorClass)}
      components={{ Option: privatePassOption }}
      error={error}
      isDisabled={!!props.disabled}
      nullCurrentValue={props.nullCurrentValue}
      // @ts-expect-error
      onChange={(event) => onChange(event.value)}
      placeholder={helperText}
      selected={value}
      suggestions={suggestions}
    />
  );
}
// @ts-expect-error
export default withTranslation()(PrivatePassSelector);

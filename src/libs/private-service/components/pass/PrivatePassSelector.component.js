// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';

import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Selector from '../../../../components/Selector.component';

import type { PrivatePass } from '../../types';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';

type Props = {
  classes: Object,
  privatePassList: Array<PrivatePass>,
  onChange: (id: ?number) => void,
  nullCurrentValue?: boolean,
  helperText: string,
  value: ?number,
  selectorClass: string,
  autofocus: boolean,
  disabled?: boolean,
  error: boolean,
};

type OptionProps = {
  data: Object,
  innerRef: Object,
  innerProps: Object,
  isSelected?: boolean,
  isFocused: boolean,
};

function privatePassOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <ListItem
        dense
        selected={!!isSelected}
        style={isFocused ? { backgroundColor: '#EFEFEF' } : {}}
      >
        <ListItemText
          primary={data.pp.name}
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
      onChange={(event) => onChange(event.value)}
      placeholder={helperText}
      selected={value}
      suggestions={suggestions}
    />
  );
}

export default withTranslation()(PrivatePassSelector);

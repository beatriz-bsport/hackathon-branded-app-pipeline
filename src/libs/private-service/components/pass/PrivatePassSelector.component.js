// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';

import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Selector from '../../../../components/Selector.component';

import type { PrivatePass } from '../../types';
import { getCurrencyDisplay } from '../../../theme/selectors';

type Props = {
  classes: Object,
  privatePassList: Array<PrivatePass>,
  onChange: (?number) => void,
  nullCurrentValue?: boolean,
  helperText: string,
  value: ?number,
  selectorClass: string,
  autofocus: boolean,
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
          secondary={`${data.pp.price}${getCurrencyDisplay()}`}
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
  } = props;
  const suggestions = privatePassList
    ? privatePassList
        .asMutable()
        .sort((pp, pp_) => pp.name > pp_.name)
        .map((pp) => ({ value: pp.id, label: pp.name, pp }))
    : [];
  return (
    <Selector
      autofocus={autofocus}
      searchIcon
      selected={value}
      nullCurrentValue={props.nullCurrentValue}
      suggestions={suggestions}
      className={classNames(classes, selectorClass)}
      components={{ Option: privatePassOption }}
      placeholder={helperText}
      onChange={(event) => onChange(event.value)}
    />
  );
}

export default withTranslation()(PrivatePassSelector);

// @flow
import React from 'react';

import classNames from 'classnames';

import Selector from '../../../components/Selector.component';
import UserItem from './UserItem.component';

import type { User } from '../types';

type Props = {
  classes: Object,
  userList: Array<User>,
  onChange: (user: ?number) => void,
  nullCurrentValue?: boolean,
  helperText: string,
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

function UserItemOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <UserItem
        selected={!!isSelected}
        isFocused={isFocused}
        user={data.user}
      />
    </div>
  );
}

export function UserSelector(props: Props) {
  const { value, onChange, userList, classes, selectorClass, helperText } =
    props;
  const suggestions = userList
    ? [...userList]
        .sort((u, u_) => u.email > u_.email)
        .map((user) => ({ value: user.id, label: user.email, user }))
    : [];

  return (
    <Selector
      searchIcon
      selected={value}
      nullCurrentValue={props.nullCurrentValue}
      suggestions={suggestions}
      className={classNames(classes, selectorClass)}
      components={{ Option: UserItemOption }}
      placeholder={helperText}
      onChange={(event) => onChange(event.value)}
    />
  );
}

export default UserSelector;

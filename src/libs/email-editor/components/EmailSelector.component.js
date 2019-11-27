// @flow
import React from 'react';

import { withNamespaces } from 'react-i18next';

import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import Selector from '../../../components/Selector.component';

type Props = {
  classes: Object,
  emails: Array<EmailTemplate>,
  onChange: (?number) => void,
  helperText: string,
  value: ?number,
  selectorClass: string,
  nullCurrentValue?: boolean,
};

type OptionProps = {
  data: Object,
  innerRef: Object,
  innerProps: Object,
  isSelected?: boolean,
  isFocused: boolean,
};

function emailOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <ListItem button divider selected={isFocused || isSelected}>
        <ListItemText
          dense
          primary={
            <Typography component="span" variant="subtitle1">
              {data.pp.title}
            </Typography>
          }
          secondary={data.pp.subject}
        />
      </ListItem>
    </div>
  );
}

export function EmailSelector(props: Props) {
  const {
    value,
    onChange,
    emails,
    classes,
    selectorClass,
    helperText,
    nullCurrentValue,
  } = props;
  const suggestions = emails
    .asMutable()
    .sort((pp, pp_) => pp.title > pp_.title)
    .map((pp) => ({ value: pp.id, label: pp.title, pp }));
  return (
    <Selector
      searchIcon
      selected={value}
      nullCurrentValue={nullCurrentValue}
      suggestions={suggestions}
      className={classNames(classes, selectorClass)}
      components={{ Option: emailOption }}
      placeholder={helperText}
      onChange={onChange}
    />
  );
}

export default withNamespaces()(EmailSelector);

// @ts-nocheck
import React from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import Selector from '../../../components/Selector.component';

type Props = {
  classes?: any;
  emails: Array<any>;
  onChange: (id?: number) => void;
  helperText: string;
  value?: number;
  selectorClass?: string;
  nullCurrentValue?: boolean;
  disabled?: boolean;
};

type OptionProps = {
  data: any;
  innerRef: any;
  innerProps: any;
  isSelected?: boolean;
  isFocused: boolean;
};

const emailOption = (props: OptionProps) => {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <ListItem button divider selected={isFocused || isSelected}>
        <ListItemText
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
};

export const EmailSelector = (props: Props) => {
  const {
    value,
    onChange,
    emails,
    classes,
    selectorClass,
    helperText,
    nullCurrentValue,
    disabled,
  } = props;

  const suggestions = [...emails]
    .filter((email) => !email.is_default_bsport_template)
    .sort((pp, pp_) => {
      if (moment(pp.date_modified) > moment(pp_.date_modified)) return 1;
      return -1;
    })
    .map((pp) => ({
      value: pp.id,
      label: pp.title,
      pp,
    }));
  return (
    <Selector
      isClearable
      searchIcon
      className={classNames(classes, selectorClass)}
      components={{ Option: emailOption }}
      isDisabled={disabled}
      nullCurrentValue={nullCurrentValue}
      onChange={onChange}
      placeholder={helperText}
      selected={value}
      suggestions={suggestions}
    />
  );
};

export default EmailSelector;

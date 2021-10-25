// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import Selector from '../../../components/Selector.component';

type Props = {
  classes: Object,
  emails: Array<EmailTemplateDetail>,
  onChange: (id: ?number) => void,
  helperText: string,
  value: ?number,
  selectorClass: string,
  nullCurrentValue?: boolean,
  disabled?: boolean,
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
    disabled,
  } = props;

  const suggestions = [...emails]
    .sort((pp, pp_) => {
      if (moment(pp.date_modifed) > moment(pp_.date_modifed)) return 1;
      return -1;
    })
    .map((pp) => ({
      value: pp.id,
      label: pp.title,
      pp,
    }));
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
      isClearable
      isDisabled={disabled}
    />
  );
}

export default withTranslation()(EmailSelector);

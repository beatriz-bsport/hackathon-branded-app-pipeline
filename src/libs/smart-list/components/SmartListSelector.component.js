// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';

import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import Selector from '../../../components/Selector.component';

type Props = {
  classes: Object,
  smartLists: Array<SmartList>,
  onChange: (number) => void,
  helperText: string,
  values: ?Array<number>,
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

function smartListOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <ListItem button divider selected={isFocused || isSelected}>
        <ListItemText
          dense
          primary={
            <Typography component="span" variant="subtitle1">
              {data.smartList.name}
            </Typography>
          }
          secondary={data.smartList.description}
        />
      </ListItem>
    </div>
  );
}

export function SmartListSelector(props: Props) {
  const {
    values,
    onChange,
    smartLists,
    classes,
    selectorClass,
    helperText,
    nullCurrentValue,
  } = props;
  const suggestions = smartLists
    .asMutable()
    .sort((smartList, smartList_) => smartList.name > smartList_.name)
    .map((smartList) => ({
      value: smartList.id,
      label: smartList.name,
      smartList,
    }));
  return (
    <Selector
      isMulti
      searchIcon
      className={classNames(classes, selectorClass)}
      components={{ Option: smartListOption }}
      nullCurrentValue={nullCurrentValue}
      onChange={onChange}
      placeholder={helperText}
      selected={values}
      suggestions={suggestions}
    />
  );
}

export default withTranslation()(SmartListSelector);

// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {
  DURATION_COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  setNotNullableData: (data: Array<string>) => void,
};

export class CreditAccountFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData(['comparator', 'value']);

    if (this.props.new) {
      this.props.onChange({ comparator: null, value: null, value_second: 30 });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <Select
          className={classes.input}
          value={filter_data.comparator}
          onChange={(ev) => onChange({ comparator: ev.target.value })}
        >
          {DURATION_COMPARATORS_DICT_BETWEEN.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {t(`filters.comparators.${item.value}`)}
            </MenuItem>
          ))}
        </Select>
        {filter_data.comparator === BETWEEN_COMPARATOR
          ? null
          : t(`filters.${filter_data.filter_identifier}.second`)}
        <DelayedNumericInput
          classes={classes}
          value={filter_data.value}
          onChange={(ev) =>
            onChange({ value: ev.target.value === '' ? null : ev.target.value })
          }
        />
        {filter_data.comparator === BETWEEN_COMPARATOR
          ? t(`filters.${filter_data.filter_identifier}.between`)
          : null}
        {filter_data.comparator === BETWEEN_COMPARATOR ? (
          <DelayedNumericInput
            classes={classes}
            value={filter_data.value_second}
            onChange={(ev) =>
              onChange({
                value_second: ev.target.value === '' ? null : ev.target.value,
              })
            }
          />
        ) : null}
        {t(`filters.${filter_data.filter_identifier}.third`)}
      </div>
    );
  }
}

const styles = (theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textInput: {
    width: '70px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(CreditAccountFilter);

// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {
  DURATION_COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
} from '@bsport/common/master-data/smart-list.js';

import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import { getCurrencyDisplay } from '../../../theme/selectors';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  isNew: boolean,
  setNotNullableData: (data: Array<string>) => void,
};

export class CreditAccountFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData(['comparator', 'value']);

    if (this.props.isNew) {
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
          onChange={(ev) => onChange({ comparator: ev.target.value })}
          value={filter_data.comparator}
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
          onChange={(ev) =>
            onChange({ value: ev.target.value === '' ? null : ev.target.value })
          }
          value={filter_data.value}
        />
        {filter_data.comparator === BETWEEN_COMPARATOR
          ? t(`filters.${filter_data.filter_identifier}.between`)
          : null}
        {filter_data.comparator === BETWEEN_COMPARATOR ? (
          <DelayedNumericInput
            classes={classes}
            onChange={(ev) =>
              onChange({
                value_second: ev.target.value === '' ? null : ev.target.value,
              })
            }
            value={filter_data.value_second}
          />
        ) : null}
        {t(`filters.${filter_data.filter_identifier}.third`, {
          currencyDisplay: getCurrencyDisplay(),
        })}
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

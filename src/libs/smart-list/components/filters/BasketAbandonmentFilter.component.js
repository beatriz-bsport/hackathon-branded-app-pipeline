// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import moment from 'moment';
import { COMPARATORS_DICT } from '@bsport/common/lib/master-data/smart-list';

import CalendarPicker from '../CalendarPicker.component';

import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  setNotNullableData: (Array<string>) => void,
};

const DATE_BETWEEN = 2;

export class BasketAbandonmentFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData(['basket_value', 'comparator']);

    if (this.props.new) {
      this.props.onChange({
        basket_value: 1,
        comparator: 2,
        date: moment().format('YYYY-MM-DD'),
        date_second: moment().format('YYYY-MM-DD'),
        duration: 0,
        duration_second: 0,
        date_filter_type: DATE_BETWEEN,
        date_filter_active: false,
      });
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
          {COMPARATORS_DICT.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {t(`filters.classic_comparators.${item.value}`)}
            </MenuItem>
          ))}
        </Select>
        {t(`filters.${filter_data.filter_identifier}.second`)}
        <DelayedNumericInput
          classes={classes}
          value={filter_data.basket_value}
          onChange={(ev) =>
            onChange({
              basket_value: ev.target.value === '' ? null : ev.target.value,
            })
          }
        />
        {t(`filters.${filter_data.filter_identifier}.third`)}

        <div className={classes.dateBoughtContainer}>
          <Switch
            checked={filter_data.date_filter_active}
            onChange={() =>
              onChange({
                date_filter_active: !filter_data.date_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          {this.props.t(`filters.${filter_data.filter_identifier}.date.first`)}
          <CalendarPicker filter_data={filter_data} onChange={onChange} />
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  dateBoughtContainer: { display: 'flex', alignItems: 'center' },

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
  withNamespaces(['smartList']),
  withStyles(styles),
)(BasketAbandonmentFilter);

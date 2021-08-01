// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment-timezone';

import { DATE_BETWEEN, DATE_BEFORE, DATE_AFTER } from '../constants';
import CalendarPicker from '../CalendarPicker.component';

type Props = {
  filter_data: any;
  t: TFunction;
  classes: Object;
  onChange: (foo: any) => void;
  new: boolean;
};

export class PaymentMethodFilter extends Component<Props> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({
        owns_payment_method: 0,
        date: moment().format('YYYY-MM-DD'),
        date_second: moment().format('YYYY-MM-DD'),
        date_filter_type: 0,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    let valueAsString = '0';
    if (filter_data.owns_payment_method === true) {
      valueAsString = '1';
    } else if (filter_data.owns_payment_method === false) {
      valueAsString = '0';
    } else if (filter_data.owns_payment_method === 1) {
      valueAsString = '1';
    } else if (filter_data.owns_payment_method === 0) {
      valueAsString = '0';
    } else if (filter_data.owns_payment_method === '1') {
      valueAsString = '1';
    }
    return (
      <div>
        <div>
          <Typography>
            {t(`filters.${filter_data.filter_identifier}.title`)}
          </Typography>
        </div>
        {t(`filters.${filter_data.filter_identifier}.labelFirst`)}
        <Select
          className={classes.input}
          value={valueAsString}
          onChange={(ev) => onChange({ owns_payment_method: ev.target.value })}
        >
          <MenuItem value="0">
            {t(`filters.${filter_data.filter_identifier}.does_not_own`)}
          </MenuItem>
          <MenuItem value="1">
            {t(`filters.${filter_data.filter_identifier}.owns`)}
          </MenuItem>
        </Select>

        {valueAsString === '1' && (
          <div className={classes.row}>
            {t(`filters.${filter_data.filter_identifier}.expiryDateLabel`)}
            <CalendarPicker
              hideDurationTab
              overrideDateList={[DATE_BETWEEN, DATE_BEFORE, DATE_AFTER]}
              filter_data={filter_data}
              onChange={onChange}
            />
          </div>
        )}
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(PaymentMethodFilter);

import React, { Component } from 'react';
import {
  withTranslation,
  // @ts-expect-error
  TFunction,
} from 'react-i18next';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/styles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

import { DateTime } from 'luxon';

import { Theme } from '@material-ui/core';
import { DATE_BETWEEN, DATE_BEFORE, DATE_AFTER } from '../constants';
import CalendarPicker from '../CalendarPicker.component';
import Config from '#src/config';

type Props = {
  filter_data: any;
  t: TFunction;
  onChange: (foo: any) => void;
  isNew: boolean;
} & WithStyles<typeof styles>;

export class PaymentMethodFilter extends Component<Props> {
  componentDidMount() {
    if (this.props.isNew) {
      this.props.onChange({
        owns_payment_method: 0,
        date: DateTime.now().toISODate(),
        date_second: DateTime.now().toISODate(),
        date_filter_active: false,
        date_filter_type: 0,
        duration: 0,
        duration_second: 0,
      });
    }
  }

  handleIsDateFilterActiveChange = () =>
    this.props.onChange({
      date_filter_active: !this.props.filter_data.date_filter_active,
    });

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
          onChange={(ev) => onChange({ owns_payment_method: ev.target.value })}
          value={valueAsString}
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
            <Switch
              checked={filter_data.date_filter_active}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              onChange={this.handleIsDateFilterActiveChange}
            />
            <div
              className={
                filter_data.date_filter_active
                  ? classes.inlineContainer
                  : classes.disabled
              }
            >
              {t(`filters.${filter_data.filter_identifier}.expiryDateLabel`)}
              <CalendarPicker
                // @ts-expect-error
                blockValidateOnClickAway
                filter_data={filter_data}
                // waiting for stripe migration to be done to enable this feature on prod
                hideDurationTab={
                  Config.REACT_APP_SENTRY_ENVIRONMENT === 'production'
                }
                onChange={onChange}
                overrideDateList={[DATE_BETWEEN, DATE_BEFORE, DATE_AFTER]}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
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
    disabled: {
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
      background: '#f1f1f1',
      borderRadius: '7px',
      paddingLeft: theme.spacing(1),
    },
    inlineContainer: { display: 'flex', alignItems: 'center' },
  });

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(PaymentMethodFilter);

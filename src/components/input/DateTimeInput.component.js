// @flow

import React from 'react';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';

import moment from 'moment-timezone';
import TextField from '@material-ui/core/TextField';

import { withTranslation } from 'react-i18next';
import { Moment } from '../../i18n';

type Props = {
  value: string,
  onChange: (string) => void,
  required?: boolean,
  disabled?: boolean,
  timezone?: string,
  minDate?: string,
  maxDate?: string,
  label?: string,
  separateInputs?: boolean,
};

const rebuildDatetime = (date, hour, minute, timezone) => {
  return moment(date)
    .tz(timezone)
    .set('hour', hour)
    .set('minute', minute)
    .format();
};

export function DateTimeForm(props: Props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        moment={Moment}
        locale={Moment.locale()}
      >
        <div
          className={classNames({
            [classes.responsiveFlex]: !!props.separateInputs,
          })}
        >
          <DatePicker
            id="date_picker"
            format="L"
            keyboard
            disabled={props.disabled}
            value={props.value}
            onChange={(date) =>
              props.onChange(
                rebuildDatetime(
                  date,
                  moment(props.value).tz(props.timezone).get('hour'),
                  moment(props.value).tz(props.timezone).get('minute'),
                  props.timezone,
                ),
              )
            }
            label={props.label}
            minDate={props.minDate}
            maxDate={props.maxDate}
          />
          <TextField
            id="time_picker"
            style={{ minWidth: 120 }}
            type="time"
            value={moment(props.value).tz(props.timezone).format('HH:mm')}
            required={props.required}
            disabled={props.disabled}
            onChange={(ev) =>
              props.onChange(
                rebuildDatetime(
                  props.value,
                  ev.target.value.split(':')[0] ||
                    moment().tz(props.timezone).get('hour'),
                  ev.target.value.split(':')[1] ||
                    moment().tz(props.timezone).get('minute'),
                  props.timezone,
                ),
              )
            }
          />
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  responsiveFlex: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
}));

export default withTranslation()(DateTimeForm);

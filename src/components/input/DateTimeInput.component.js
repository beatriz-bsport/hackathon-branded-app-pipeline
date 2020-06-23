// @flow

import React from 'react';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';

import moment from 'moment';
import TextField from '@material-ui/core/TextField';

import { withTranslation } from 'react-i18next';
import { Moment } from '../../i18n';
import { formatAsTime } from '../../datetime';

type Props = {
  value: string,
  onChange: (string) => void,
  required?: boolean,
  disabled?: boolean,
};

const rebuildDatetime = (date, hour, minute) => {
  return moment(date)
    .set('hour', hour)
    .set('minute', minute)
    .format();
};

export function DateTimeForm(props: Props) {
  return (
    <div>
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        moment={Moment}
        locale={Moment.locale()}
      >
        <DatePicker
          format="DD/MM/YYYY"
          keyboard
          disabled={props.disabled}
          value={props.value}
          onChange={(date) =>
            props.onChange(
              rebuildDatetime(
                date,
                moment(props.value).get('hour'),
                moment(props.value).get('minute'),
              ),
            )
          }
        />
        <TextField
          style={{ minWidth: 120 }}
          type="time"
          value={formatAsTime(moment(props.value))}
          required={props.required}
          disabled={props.disabled}
          onChange={(ev) =>
            props.onChange(
              rebuildDatetime(
                props.value,

                ev.target.value.split(':')[0] || moment().get('hour'),
                ev.target.value.split(':')[1] || moment().get('minute'),
              ),
            )
          }
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default withTranslation()(DateTimeForm);

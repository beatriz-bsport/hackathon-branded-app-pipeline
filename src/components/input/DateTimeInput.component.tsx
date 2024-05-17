import React from 'react';
import { DatePicker } from 'material-ui-pickers';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';

import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

type Props = {
  value: DateTime;
  onChange: (value: DateTime) => void;
  required?: boolean;
  disabled?: boolean;
  timezone?: string;
  minDate?: string;
  maxDate?: string;
  label?: string;
  separateInputs?: boolean;
  hasDateTooFarError?: boolean;
};

const rebuildDatetime = (
  datetime: DateTime,
  hour: number | string,
  minute: number | string,
  timezone: string,
) => {
  return datetime.setZone(timezone).set({
    hour: typeof hour === 'string' ? Number(hour) : hour,
    minute: typeof minute === 'string' ? Number(minute) : minute,
  });
};

export function DateTimeForm(props: Props) {
  const classes = useStyles();
  const { t } = useTranslation('translation');

  return (
    <div className={classes.container}>
      <div
        className={classNames({
          [classes.responsiveFlex]: !!props.separateInputs,
        })}
      >
        <DatePicker
          keyboard
          disabled={props.disabled}
          format="D"
          id="date_picker"
          onChange={(datetime: DateTime) => props.onChange(datetime)}
          value={props.value}
          {...(props.hasDateTooFarError
            ? { error: true, helperText: t('form.datePicker.rangeError') }
            : {})}
          label={props.label}
          maxDate={props.maxDate}
          minDate={props.minDate}
        />
        <TextField
          disabled={props.disabled}
          id="time_picker"
          onChange={(ev) =>
            props.onChange(
              rebuildDatetime(
                props.value,
                ev.target.value.split(':')[0] ||
                  DateTime.now().setZone(props.timezone).hour,
                ev.target.value.split(':')[1] ||
                  DateTime.now().setZone(props.timezone).minute,
                props.timezone,
              ),
            )
          }
          required={props.required}
          style={{ minWidth: 120 }}
          type="time"
          value={props.value.setZone(props.timezone).toFormat('HH:mm')}
        />
      </div>
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

export default DateTimeForm;

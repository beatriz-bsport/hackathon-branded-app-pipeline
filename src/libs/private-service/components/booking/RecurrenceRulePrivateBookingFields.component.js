// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

type Props = {
  privateSlotSet?: boolean,
  onTimeSettingChange: ({
    nb_of_weeks: number,
    day_of_week: number,
    hour: number,
    minute: number,
  }) => void,
  selectedSetting?: any,
};

export default function RecurrenceRuleTimeSettingFields(props: Props) {
  const { t } = useTranslation(['booking', 'datetime']);
  const classes = useStyles();
  const weekdayNumber = [0, 1, 2, 3, 4, 5, 6];

  const handleChange = (event) => {
    const { name } = event.target;
    props.onTimeSettingChange({
      ...props.selectedSetting,
      [name]: parseInt(event.target.value, 10),
    });
  };
  return (
    <div>
      {!props.privateSlotSet && (
        <div className={classes.row}>
          <FormControl required className={classes.formControl}>
            <InputLabel>
              {t('booking:recurrenceRule.form.dayOfWeek.label')}
            </InputLabel>
            <Select
              name="day_of_week"
              onChange={(ev) => handleChange(ev)}
              value={
                props.selectedSetting ? props.selectedSetting.day_of_week : null
              }
            >
              {weekdayNumber.map((c) => {
                return (
                  <MenuItem key={c} value={c}>
                    {t(`datetime:time.weekdayNumber.${c}`)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography style={{ paddingLeft: 10, paddingRight: 14 }}>
            {t('booking:recurrenceRule.form.at')}
          </Typography>
          <TextField
            className={classes.field}
            type="number"
            name="hour"
            InputProps={{
              inputProps: {
                max: 23,
                min: 0,
              },
            }}
            value={props.selectedSetting ? props.selectedSetting.hour : null}
            label={t('booking:recurrenceRule.form.hour.label')}
            required
            onChange={(ev) => handleChange(ev)}
          />
          <TextField
            className={classes.field}
            type="number"
            name="minute"
            InputProps={{
              inputProps: {
                max: 59,
                min: 0,
              },
            }}
            value={props.selectedSetting ? props.selectedSetting.minute : null}
            label={t('booking:recurrenceRule.form.minute.label')}
            required
            onChange={(ev) => handleChange(ev)}
          />
        </div>
      )}
      <TextField
        type="number"
        name="nb_of_weeks"
        InputProps={{
          inputProps: {
            max: 8,
            min: 1,
          },
        }}
        value={props.selectedSetting ? props.selectedSetting.nb_of_weeks : null}
        label={t('booking:recurrenceRule.form.delayWeek.label')}
        helperText={t('booking:recurrenceRule.form.delayWeek.helperText')}
        required
        onChange={(ev) => handleChange(ev)}
      />
      {!props.privateSlotSet && props.selectedSetting && (
        <Typography variant="body2">
          {t('booking:recurrenceRule.explain', {
            dayOfWeek: t(
              `datetime:time.weekdayNumber.${props.selectedSetting.day_of_week}`,
            ),
            hour: `${props.selectedSetting.hour}`.padStart(2, '0'),
            minute: `${props.selectedSetting.minute}`.padStart(2, '0'),
            delayWeek: props.selectedSetting.nb_of_weeks,
          })}
        </Typography>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  field: {
    margin: theme.spacing(1),
    minWidth: 80,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  formControl: {
    minWidth: 160,
  },
}));

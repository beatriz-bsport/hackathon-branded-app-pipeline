// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { Typography } from '@material-ui/core';

const styles = () => ({
  inputText: {
    width: 80,
  },
});

type Props = {
  t: TFunction,
  classes: Object,
  value: ?(number | string),
  onChange: (nbMinutes: number) => void,
  disallowedNullDuration: Object,
  durationError: Object,
};

const getMinutes = (totalMinutes) => {
  return parseInt(totalMinutes, 10) % 60;
};

const getHours = (totalMinutes) => {
  return (
    parseInt((parseInt(totalMinutes, 10) - getMinutes(totalMinutes)) / 60, 10) %
    24
  );
};

const getDays = (totalMinutes) => {
  return parseInt(
    (parseInt(totalMinutes, 10) -
      getHours(totalMinutes) -
      getMinutes(totalMinutes)) /
      (24 * 60),
    10,
  );
};

export class DurationInput extends Component<Props> {
  onChangeDays = (event: Object) => {
    const days = parseInt(event.target.value, 10);
    this.props.onChange(
      days * 24 * 60 +
        getHours(this.props.value) * 60 +
        getMinutes(this.props.value) || 0,
    );
  };

  onChangeHours = (event: Object) => {
    const hours = parseInt(event.target.value, 10);
    this.props.onChange(
      hours * 60 +
        getDays(this.props.value) * 24 * 60 +
        getMinutes(this.props.value) || 0,
    );
  };

  onChangeMinutes = (event: Object) => {
    const minutes = parseInt(event.target.value, 10);
    this.props.onChange(
      getDays(this.props.value) * 24 * 60 +
        minutes +
        getHours(this.props.value) * 60 || 0,
    );
  };

  render() {
    const { classes, t, disallowedNullDuration, durationError } = this.props;

    return (
      <Grid direction="column">
        <Grid container direction="row">
          <Grid item>
            <TextField
              id="duration_day"
              label="Duration"
              className={classes.inputText}
              defaultValue={null}
              value={getDays(this.props.value)}
              onChange={this.onChangeDays}
              error={disallowedNullDuration}
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 30,
                  style: { textAlign: 'right' },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    {t('common.daySmall')}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              id="duration_hour"
              label=" "
              className={classes.inputText}
              defaultValue={null}
              value={getHours(this.props.value)}
              onChange={this.onChangeHours}
              error={disallowedNullDuration}
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 59,
                  style: { textAlign: 'right' },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    {t('common.hourSmall')}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              id="duration_minute"
              label=" "
              className={classes.inputText}
              defaultValue={0}
              value={getMinutes(this.props.value)}
              error={disallowedNullDuration}
              onChange={this.onChangeMinutes}
              type="number"
              InputProps={{
                inputProps: { min: 0, max: 59, style: { textAlign: 'right' } },
                endAdornment: (
                  <InputAdornment position="end">
                    {t('common.minuteSmall')}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Grid item>
          {disallowedNullDuration ? (
            <Typography color="error" variant="caption">
              {durationError}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withTranslation()(DurationInput));

// @flow
import React, { Component } from 'react';

import { Grid, InputAdornment, TextField, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

const styles = () => ({
  inputText: {
    width: 80,
  },
});

type Props = {
  t: TFunction,
  classes: Object,
  onChange: (nbMinutes: number) => void,
};

type State = {
  hours: number,
  minutes: number,
};

export class DurationInput extends Component<Props, State> {
  state = {
    hours: 0,
    minutes: 0,
  };

  getDuration = (hours: ?number, minutes: number) =>
    parseInt(hours || 0, 10) * 60 + parseInt(minutes, 10);

  onChangeHours = (event: Object) => {
    const hours = event.target.value;
    this.setState({ hours });
    this.props.onChange(this.getDuration(hours, this.state.minutes));
  };

  onChangeMinutes = (event: Object) => {
    const minutes = Math.min(event.target.value || 0, 59);
    this.setState({ minutes });
    this.props.onChange(this.getDuration(this.state.hours, minutes));
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Grid container direction="row">
        <Grid item>
          <TextField
            label="Durée"
            className={classes.inputText}
            defaultValue={null}
            value={this.state.hours}
            onChange={this.onChangeHours}
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
            label=" "
            className={classes.inputText}
            defaultValue={0}
            value={this.state.minutes}
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
    );
  }
}

export default withStyles(styles)(translate()(DurationInput));

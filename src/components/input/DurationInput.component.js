// @flow
import React, { Component } from 'react';

import { Grid, InputAdornment, TextField, withStyles } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

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
};

const getMinutes = (totalMinutes) => {
  return parseInt(totalMinutes, 10) % 60;
};

const getHours = (totalMinutes) => {
  return parseInt(
    (parseInt(totalMinutes, 10) - getMinutes(totalMinutes)) / 60,
    10,
  );
};

export class DurationInput extends Component<Props> {
  onChangeHours = (event: Object) => {
    const hours = parseInt(event.target.value, 10);
    this.props.onChange(hours * 60 + getMinutes(this.props.value) || 0);
  };

  onChangeMinutes = (event: Object) => {
    const minutes = parseInt(event.target.value, 10);
    this.props.onChange(minutes + getHours(this.props.value) * 60 || 0);
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
            value={getHours(this.props.value)}
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
            value={getMinutes(this.props.value)}
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

export default withStyles(styles)(withNamespaces()(DurationInput));

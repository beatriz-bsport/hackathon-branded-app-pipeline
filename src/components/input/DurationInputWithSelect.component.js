// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
  inputText: {
    width: 70,
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
  },
  flexField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap-reverse',
  },
  selectField: {
    minWidth: 140,
    marginLeft: theme.spacing(2),
    visibility: 'hidden',
  },
});

type Props = {
  t: TFunction,
  classes: Object,
  value: ?(number | string),
  onChange: (nbMinutes: number) => void,
  disallowedNullDuration: Object,
  durationError: Object,
  selectDurationChoices: Object,
};
type State = {
  selectOpen: boolean,
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

export class DurationInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectOpen: false,
    };
  }

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

  onChangeSelect = (event: Object) => {
    this.props.onChange(event.target.value);
  };

  render() {
    const { classes, t, disallowedNullDuration, durationError } = this.props;

    return (
      <div className={classes.flexField}>
        <Grid direction="column">
          <Grid container direction="row">
            <Grid item>
              <TextField
                id="duration_day"
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
                className={classes.inputText}
                defaultValue={0}
                value={getMinutes(this.props.value)}
                error={disallowedNullDuration}
                onChange={this.onChangeMinutes}
                type="number"
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 59,
                    style: { textAlign: 'right' },
                  },
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
        <Tooltip title={t('slot.form.pre_selected_slots')}>
          <IconButton onClick={() => this.setState({ selectOpen: true })}>
            <KeyboardArrowDownIcon
              onClick={() => this.setState({ selectOpen: true })}
              color={this.state.selectOpen ? 'primary' : 'secondary'}
            />
          </IconButton>
        </Tooltip>
        <Select
          className={classes.selectField}
          value={this.props.value}
          onChange={this.onChangeSelect}
          open={this.state.selectOpen}
          onClose={() => this.setState({ selectOpen: false })}
        >
          {this.props.selectDurationChoices
            .slice(0, -1)
            .map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {t(`datetime:${label}`)}
              </MenuItem>
            ))}
        </Select>
      </div>
    );
  }
}

export default withStyles(styles)(withTranslation()(DurationInput));

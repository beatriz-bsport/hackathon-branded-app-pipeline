// @flow
import React, { Component } from 'react';

import {
  IconButton,
  Grid,
  Typography,
  Button,
  withStyles,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewWeek from '@material-ui/icons/ViewWeek';
import ViewComfy from '@material-ui/icons/ViewComfy';
import { Moment } from '../i18n';

const WEEKMODE: number = 0;
const MONTHMODE: number = 1;

type Props = {
  forceMonthDisplay: boolean,
  onDateClick: (Object) => void,
  classes: Object,
};

type State = {
  displayMode: number,
  selectedDay: Object,
};

export class Calendar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMode: props.forceMonthDisplay ? MONTHMODE : WEEKMODE,
      selectedDay: Moment()
        .set('hours', 0)
        .set('minutes', 0)
        .set('milliseconds', 0),
    };
  }

  static defaultProps = {
    events: {},
  };

  selectDate = (date: Object) => {
    this.setState({ selectedDay: date });
    this.props.onDateClick(date);
  };

  showNextWeek = () => {
    const { selectedDay } = this.state;
    this.selectDate(Moment(selectedDay.add(7, 'days')));
  };

  showPreviousWeek = () => {
    const { selectedDay } = this.state;
    this.selectDate(Moment(selectedDay.add(-7, 'days')));
  };

  showNext = () => {
    const { displayMode, selectedDay } = this.state;
    if (WEEKMODE === displayMode) {
      this.selectDate(Moment(selectedDay.add(1, 'weeks')));
    } else {
      this.selectDate(Moment(selectedDay.add(1, 'months')));
    }
  };

  showPrevious = () => {
    const { displayMode, selectedDay } = this.state;
    if (WEEKMODE === displayMode) {
      this.selectDate(Moment(selectedDay.add(-1, 'weeks')));
    } else {
      this.selectDate(Moment(selectedDay.add(-1, 'months')));
    }
  };

  toogleDisplayMode = () => {
    const { displayMode } = this.state;
    if (displayMode === WEEKMODE) {
      this.setState({ displayMode: MONTHMODE });
    } else if (displayMode === MONTHMODE) {
      this.setState({ displayMode: WEEKMODE });
    }
  };

  toogleWeekMode = () => {
    this.setState({ displayMode: WEEKMODE });
  };

  toogleMonthMode = () => {
    this.setState({ displayMode: MONTHMODE });
  };

  formatDay = (day: Object) => {
    // TODO optimize this
    const { classes } = this.props;
    const { displayMode } = this.state;
    const weekdays = Moment.weekdaysShort(true); // true for starting on local day
    return (
      <Grid container direction="column" alignItems="center">
        {displayMode === WEEKMODE ? (
          <Grid item>{weekdays[day.weekday()]}</Grid>
        ) : null}
        <Grid item>{day.date()}</Grid>
        <Grid item className={classes.dots}>
          {this.formatDots(day)}
        </Grid>
      </Grid>
    );
  };

  formatDots = (date: Object) => {
    // eslint-disable-next-line
    const dots = this.props.events[date.startOf('day')] || [];
    return (
      <Grid container direction="row">
        {dots.slice(0, 3).map(() => (
          <Grid item key={Math.random()}>
            {' '}
            •{' '}
          </Grid>
        ))}
      </Grid>
    );
  };

  renderDay = (day: Object) => {
    const { selectedDay, displayMode } = this.state;
    const { classes } = this.props;
    const isSelected = day.isSame(selectedDay, 'days');

    return (
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <Button
              variant={isSelected ? 'raised' : null}
              color="primary"
              className={classes.dayButton}
              disabled={
                !day.isSame(selectedDay, 'months') && displayMode === MONTHMODE
              }
              onClick={() => {
                this.selectDate(day);
              }}
            >
              {this.formatDay(day)}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderHeader = () => {
    const { forceMonthDisplay } = this.props;
    const { selectedDay, displayMode } = this.state;
    const month = Moment.months()[selectedDay.month()];
    const year = selectedDay.year();
    return (
      <Grid container justify="space-between" alignItems="center" wrap="nowrap">
        {forceMonthDisplay ? null : (
          <Grid item>
            <IconButton
              onClick={this.toogleWeekMode}
              color={displayMode === WEEKMODE ? 'primary' : 'default'}
            >
              <ViewWeek />
            </IconButton>
          </Grid>
        )}
        <Grid item>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={16}
            wrap="nowrap"
          >
            <Grid item>
              <IconButton onClick={this.showPrevious}>
                <ChevronLeftIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="title">
                {month} {year}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={this.showNext}>
                <ChevronRightIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        {forceMonthDisplay ? null : (
          <Grid item>
            <IconButton
              onClick={this.toogleMonthMode}
              color={displayMode === MONTHMODE ? 'primary' : 'default'}
            >
              <ViewComfy />
            </IconButton>
          </Grid>
        )}
      </Grid>
    );
  };

  renderWeekFrom = (firstDayWeek: Object) => (
    <Grid
      container
      direction="row"
      alignItems="center"
      justify="space-between"
      wrap="nowrap"
    >
      {this.renderDay(Moment(firstDayWeek).add(0, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(1, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(2, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(3, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(4, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(5, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(6, 'days'))}
    </Grid>
  );

  renderMonthFrom = (firstDayMonth: Object) => {
    const { classes } = this.props;
    const { selectedDay } = this.state;

    const weekRows = [];
    for (let i = 0; i < 6; i += 1) {
      const firstDayInRow = Moment(firstDayMonth).add(i * 7, 'days');
      if (firstDayInRow.isSameOrBefore(selectedDay, 'month')) {
        weekRows.push(
          <Grid item key={i}>
            {this.renderWeekFrom(firstDayInRow)}
          </Grid>,
        );
      }
    }

    return (
      <Grid container direction="column" alignItems="stretch">
        <Grid item>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            className={classes.weekdayNameRow}
            wrap="nowrap"
          >
            {Moment.weekdaysShort(true).map((wds) => (
              <Grid item key={wds}>
                <Typography variant="title">{wds}</Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {weekRows}
      </Grid>
    );
  };

  renderBulkDays = () => {
    const { selectedDay, displayMode } = this.state;
    const firstDayWeek = Moment(selectedDay).add(
      -selectedDay.weekday(),
      'days',
    );
    const firstDayMonth = Moment(selectedDay).add(
      -selectedDay.date() + 1,
      'days',
    );
    firstDayMonth.add(-firstDayMonth.weekday(), 'days');
    switch (displayMode) {
      case WEEKMODE:
        return this.renderWeekFrom(firstDayWeek);
      case MONTHMODE:
      default:
        return this.renderMonthFrom(firstDayMonth);
    }
  };

  render() {
    const { classes } = this.props;
    const { displayMode } = this.state;
    return (
      <Grid
        container
        spacing={16}
        direction="column"
        className={displayMode === WEEKMODE ? classes.container : null}
      >
        <Grid item xs={12}>
          {this.renderHeader()}
        </Grid>
        <Grid item xs={12} className={classes.dayRow}>
          {this.renderBulkDays()}
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    marginRight: theme.spacing.unit * 2,
  },

  arrowIconLeft: {
    marginLeft: -theme.spacing.unit * 2,
  },
  arrowIconRight: {
    marginRight: -theme.spacing.unit * 2,
  },
  dayButton: {
    marginLeft: -theme.spacing.unit * 2,
    marginRight: -theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  dots: {
    height: 5,
    marginBottom: theme.spacing.unit,
  },
  weekdayNameRow: {
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit,
  },
  dayRow: {
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  },
});

export default withStyles(styles)(Calendar);

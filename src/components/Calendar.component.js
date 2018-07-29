import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  IconButton,
  Grid,
  Paper,
  Typography,
  Button,
  withStyles,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewWeek from '@material-ui/icons/ViewWeek';
import ViewComfy from '@material-ui/icons/ViewComfy';
import { translate } from 'react-i18next';
import { Moment } from '../i18n';

const WEEKMODE = 0;
const MONTHMODE = 1;

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
});

type Props = {
  onDateClick: () => void,
  events: Object,
  forceMonthDisplay: boolean,
};

export class Calendar extends Component<Props> {
  constructor(props) {
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
    onDateClick: () => {},
    events: {},
    forceMonthDisplay: false,
  };

  selectDate = (date) => {
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

  showNextMonth = () => {
    const { selectedDay } = this.state;
    this.selectDate(Moment(selectedDay.add(1, 'months')));
  };
  showPreviousMonth = () => {
    const { selectedDay } = this.state;
    this.selectDate(Moment(selectedDay.add(-1, 'months')));
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

  formatDay = (day) => {
    // TODO optimize this
    const { classes } = this.props;
    const { displayMode } = this.state;
    const weekdays = Moment.weekdaysShort(true); //true for starting on local day
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

  formatDots = (date) => {
    const dots = this.props.events[date.startOf('day')] || [];
    return (
      <Grid container direction="row">
        {dots.map((d) => (
          <Grid item key={Math.random()}>
            {' '}
            •{' '}
          </Grid>
        ))}
      </Grid>
    );
  };

  renderDay = (day) => {
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
    const { t, forceMonthDisplay } = this.props;
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
              <IconButton onClick={this.showPreviousMonth}>
                <ChevronLeftIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="title">
                {month} {year}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={this.showNextMonth}>
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

  renderWeekFrom = (firstDayWeek) => {
    return (
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
  };

  renderMonthFrom = (firstDayMonth) => {
    const { t, classes } = this.props;
    const { selectedDay } = this.state;

    const weekRows = [];
    for (var i = 0; i < 6; i++) {
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
    const { classes } = this.props;
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
        <Grid item xs={12}>
          <Grid container direction="row" alignItems="center">
            {displayMode === MONTHMODE ? null : (
              <Grid item xs={1}>
                <IconButton
                  onClick={this.showPreviousWeek}
                  className={classes.arrowIconLeft}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Grid>
            )}
            <Grid item xs={displayMode === MONTHMODE ? 12 : 10}>
              {this.renderBulkDays()}
            </Grid>
            {displayMode === MONTHMODE ? null : (
              <Grid item xs={1}>
                <IconButton
                  onClick={this.showNextWeek}
                  className={classes.arrowIconRight}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(Calendar));

// @flow
import React, { Component } from 'react';
import classNames from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Collapse from '@material-ui/core/Collapse';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewWeek from '@material-ui/icons/ViewWeek';
import ViewComfy from '@material-ui/icons/ViewComfy';
import { colors } from '@bsport/common/lib/colors';
import { Moment } from '../../i18n';

const WEEKMODE: number = 0;
const MONTHMODE: number = 1;

type Props = {
  date: Object,
  forceMonthDisplay: boolean,
  onDateClick: (Object) => void,
  classes: Object,
  events?: { [*]: *[] },
};

type State = {
  displayMode: number,
  searchOn: boolean,
};

export class Calendar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMode: props.forceMonthDisplay ? MONTHMODE : WEEKMODE,
      searchOn: false,
    };
  }

  componentDidMount() {
    this.props.onDateClick(this.props.date);
  }

  static defaultProps = {
    events: {},
  };

  selectDate = (date: Object) => {
    this.props.onDateClick(date);
  };

  showNextWeek = () => {
    const { date } = this.props;
    this.selectDate(Moment(date.add(7, 'days')));
  };

  showPreviousWeek = () => {
    const { date } = this.props;
    this.selectDate(Moment(date.add(-7, 'days')));
  };

  showNext = () => {
    const { displayMode } = this.state;
    const { date } = this.props;
    if (WEEKMODE === displayMode) {
      this.selectDate(Moment(date.add(1, 'weeks')));
    } else {
      this.selectDate(Moment(date.add(1, 'months')));
    }
  };

  showPrevious = () => {
    const { displayMode } = this.state;
    const { date } = this.props;
    if (WEEKMODE === displayMode) {
      this.selectDate(Moment(date.add(-1, 'weeks')));
    } else {
      this.selectDate(Moment(date.add(-1, 'months')));
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {displayMode === WEEKMODE ? weekdays[day.weekday()][0] : null}
        <Typography color="inherit" variant="subtitle2">
          {day.date()}
        </Typography>
        <div className={classes.dots}>{this.formatDots(day)}</div>
      </div>
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
    const { displayMode } = this.state;
    const { date } = this.props;
    const { classes } = this.props;
    const isSelected = day.isSame(date, 'days');
    const disabled = !day.isSame(date, 'months') && displayMode === MONTHMODE;
    let dayButtonClass = null;
    if (isSelected) {
      dayButtonClass = classes.dayButtonSelected;
    }
    if (disabled) {
      dayButtonClass = classes.dayButtonDisabled;
    }

    return (
      <ButtonBase
        id={`calendar-day-${day.format('YYYY-MM-DD')}`}
        variant={isSelected ? 'contained' : null}
        color="primary"
        className={classNames(classes.dayButton, dayButtonClass)}
        disabled={disabled}
        onClick={() => {
          this.selectDate(day);
        }}
      >
        {this.formatDay(day)}
      </ButtonBase>
    );
  };

  renderSearchButton = () => {
    if (this.props.searchBar) {
      return (
        <IconButton
          onClick={() =>
            this.setState((prevState) => ({
              searchOn: !prevState.searchOn,
            }))
          }
        >
          <SearchIcon />
        </IconButton>
      );
    }
  };

  renderHeader = () => {
    const { date, forceMonthDisplay } = this.props;
    const { displayMode } = this.state;
    const month = Moment.months()[date.month()];
    const year = date.year();
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
              <Typography inline component="h3" variant="h6">
                {month} {year}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton id="calendar-next-month" onClick={this.showNext}>
                <ChevronRightIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {this.renderSearchButton()}
          {forceMonthDisplay ? null : (
            <IconButton
              onClick={this.toogleMonthMode}
              color={displayMode === MONTHMODE ? 'primary' : 'default'}
            >
              <ViewComfy />
            </IconButton>
          )}
        </Grid>
      </Grid>
    );
  };

  renderWeekFrom = (firstDayWeek: Object) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        wrap: 'nowrap',
      }}
    >
      {this.renderDay(Moment(firstDayWeek).add(0, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(1, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(2, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(3, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(4, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(5, 'days'))}
      {this.renderDay(Moment(firstDayWeek).add(6, 'days'))}
    </div>
  );

  renderMonthFrom = (firstDayMonth: Object) => {
    const { date, classes } = this.props;

    const weekRows = [];
    for (let i = 0; i < 6; i += 1) {
      const firstDayInRow = Moment(firstDayMonth).add(i * 7, 'days');
      if (firstDayInRow.isSameOrBefore(date, 'month')) {
        weekRows.push(
          <Grid item key={i}>
            {this.renderWeekFrom(firstDayInRow)}
          </Grid>,
        );
      }
    }

    return (
      <Grid container direction="column" alignItems="stretch">
        <Grid item className={classes.weekdayNameRow}>
          {Moment.weekdaysShort(true).map((wds) => (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={wds}
            >
              <Typography variant="h6">{wds[0]}</Typography>
            </div>
          ))}
        </Grid>
        {weekRows}
      </Grid>
    );
  };

  renderSearchBar = () => {
    const { searchBar, classes, loading } = this.props;
    let DividerComponent = Divider;
    if (loading) {
      DividerComponent = LinearProgress;
    }
    if (searchBar) {
      return (
        <div>
          <Collapse in={this.state.searchOn}>
            <div className={classes.searchBarContainer}>{searchBar}</div>
          </Collapse>
          <DividerComponent />
        </div>
      );
    }
    return <div />;
  };

  renderBulkDays = () => {
    const { displayMode } = this.state;
    const { date } = this.props;
    const firstDayWeek = Moment(date).add(-date.weekday(), 'days');
    const firstDayMonth = Moment(date).add(-date.date() + 1, 'days');
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
    return (
      <Grid id="calendar" container direction="column">
        <Grid item xs={12}>
          {this.renderHeader()}
        </Grid>
        <Grid item xs={12}>
          {this.renderSearchBar()}
        </Grid>
        <Grid item xs={12} className={classes.dayRow}>
          {this.renderBulkDays()}
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  dayButton: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexGrow: 1,
    flexBasis: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing.unit,
  },
  dayButtonSelected: {
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
    marginTop: -1,
    marginLeft: -1,
    marginRight: -1,
    marginBottom: -1,
  },
  dayButtonDisabled: {
    color: 'gray',
  },
  dots: {
    height: 5,
    marginBottom: theme.spacing.unit,
  },
  weekdayNameRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  dayRow: {
    paddingTop: theme.spacing.unit * 2,
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  },
  searchBarContainer: {
    marginBottom: theme.spacing.unit,
  },
});

export default withStyles(styles)(Calendar);

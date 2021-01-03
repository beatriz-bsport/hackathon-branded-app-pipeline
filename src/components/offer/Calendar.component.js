// @flow
import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { compose, withState } from 'recompose';

import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import BlockIcon from '@material-ui/icons/Block';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import SettingsIcon from '@material-ui/icons/Settings';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import FilterIcon from '@material-ui/icons/FilterList';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ButtonBase from '@material-ui/core/ButtonBase';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewWeek from '@material-ui/icons/ViewWeek';
import ViewComfy from '@material-ui/icons/ViewComfy';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Moment } from '../../i18n';
import { formatAsTitle, DATE_FORMAT } from '../../utils/datetime';
import { API_URI, getAuth, buildUrlParams } from '../../http';

const WEEKMODE: number = 0;
const MONTHMODE: number = 1;

type Props = {
  date: string,
  forceMonthDisplay: boolean,
  onDateClick: (Object) => void,
  toogleSearchBar: ?() => void,
  classes: Object,
  searchBarOpen: ?boolean,
  events?: { [*]: *[] },
  searchBar: ?any,
  loading: ?boolean,
  showDayName: ?boolean,
  hideDateBar: ?boolean,
  hideSwitchViewButton: ?boolean,
  filters: any,
  showDownloader?: boolean,
  onRequestMassDisable: (date: string) => void,
  t: TFunction,
  setMenuAnchorEl: (?HTMLElement) => void,
  menuAnchorEl: ?HTMLElement,

  setShowCancelledOffers?: (boolean) => void,
  showCancelledOffers?: boolean,
};

type State = {
  displayMode: number,
  isDownloading: boolean,
};

export class Calendar extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMode: props.forceMonthDisplay ? MONTHMODE : WEEKMODE,
      isDownloading: false,
    };
  }

  componentDidMount() {
    this.props.onDateClick(this.props.date);
  }

  static defaultProps = {
    events: {},
  };

  selectDate = (date: string) => this.props.onDateClick(date);

  showNextWeek = () => {
    const date = Moment(this.props.date, DATE_FORMAT);
    this.selectDate(date.add(7, 'days').format(DATE_FORMAT));
  };

  showPreviousWeek = () => {
    const date = Moment(this.props.date, DATE_FORMAT);
    this.selectDate(date.subtract(7, 'days').format(DATE_FORMAT));
  };

  showNext = () => {
    const { displayMode } = this.state;
    const date = Moment(this.props.date, DATE_FORMAT);
    if (WEEKMODE === displayMode) {
      this.selectDate(date.add(1, 'weeks').format(DATE_FORMAT));
    } else {
      this.selectDate(date.add(1, 'months').format(DATE_FORMAT));
    }
  };

  showPrevious = () => {
    const { displayMode } = this.state;
    const date = Moment(this.props.date, DATE_FORMAT);
    if (WEEKMODE === displayMode) {
      this.selectDate(date.add(-1, 'weeks').format(DATE_FORMAT));
    } else {
      this.selectDate(date.add(-1, 'months').format(DATE_FORMAT));
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
    const { classes, showDayName } = this.props;
    const { displayMode } = this.state;
    const showDayLetter = showDayName !== undefined ? showDayName : true;
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
        {displayMode === WEEKMODE && showDayLetter
          ? weekdays[day.weekday()][0]
          : null}
        <Typography color="inherit" variant="subtitle1">
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
      <div className={this.props.classes.row}>
        {dots.slice(0, 3).map((_, idx) => (
          <div key={idx}> • </div>
        ))}
      </div>
    );
  };

  renderDay(day: Object) {
    const { displayMode } = this.state;
    const { date, classes } = this.props;
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
        id={`calendar-day-${day.format(DATE_FORMAT)}`}
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
  }

  renderCalendarTitle = () => {
    const { displayMode } = this.state;
    if (displayMode === MONTHMODE) {
      const date_start = Moment(this.props.date, DATE_FORMAT);
      const dateMonth = Moment.months()[date_start.month()];
      const dateYear = date_start.year();
      return `${dateMonth} ${dateYear}`;
    }
    const date_start = Moment(this.props.date, DATE_FORMAT).startOf('week');
    const date_end = date_start.clone().add(6, 'days');
    return `${formatAsTitle(date_start)} - ${formatAsTitle(date_end)}`;
  };

  renderMenu = () => {
    const { forceMonthDisplay, hideSwitchViewButton, classes } = this.props;

    const { displayMode } = this.state;
    return (
      <Menu
        anchorEl={this.props.menuAnchorEl}
        keepMounted
        open={!!this.props.menuAnchorEl}
        onClose={() => this.props.setMenuAnchorEl(null)}
      >
        {!forceMonthDisplay &&
          displayMode !== WEEKMODE &&
          !hideSwitchViewButton && (
            <MenuItem onClick={this.toogleDisplayMode}>
              <ListItemIcon>
                <ViewWeek />
              </ListItemIcon>
              {this.props.t('menu.showWeek')}
            </MenuItem>
          )}
        {!forceMonthDisplay &&
          displayMode !== MONTHMODE &&
          !hideSwitchViewButton && (
            <MenuItem onClick={this.toogleDisplayMode}>
              <ListItemIcon>
                <ViewComfy />
              </ListItemIcon>
              {this.props.t('menu.showMonth')}
            </MenuItem>
          )}
        {this.props.setShowCancelledOffers && !this.props.showCancelledOffers && (
          <MenuItem
            onClick={() =>
              this.props.setShowCancelledOffers(!this.props.showCancelledOffers)
            }
          >
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            {this.props.t('menu.showCancelled')}
          </MenuItem>
        )}

        {this.props.setShowCancelledOffers && this.props.showCancelledOffers && (
          <MenuItem
            onClick={() =>
              this.props.setShowCancelledOffers(!this.props.showCancelledOffers)
            }
          >
            <ListItemIcon>
              <VisibilityOffIcon />
            </ListItemIcon>
            {this.props.t('menu.hideCancelled')}
          </MenuItem>
        )}
        {!!this.props.onRequestMassDisable && (
          <MenuItem
            onClick={() => this.props.onRequestMassDisable(this.props.date)}
          >
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            {this.props.t('menu.massDisable')}
          </MenuItem>
        )}
        {this.props.showDownloader ? (
          <MenuItem
            onClick={async () => {
              this.setState({ isDownloading: true });
              try {
                const response = await getAuth(
                  `${API_URI}/reporting/reports/offer_management/${buildUrlParams(
                    {
                      ...this.buildFilters(this.props.filters),
                      date: this.props.date,
                    },
                  )}`,
                );
                const link = document.createElement('a');
                link.setAttribute('type', 'hidden');
                link.href = response.data;
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (err) {
                console.error(err);
              }
              this.setState({ isDownloading: false });
            }}
            className={classes.actionButton}
          >
            <ListItemIcon>
              {this.state.isDownloading ? (
                <CircularProgress />
              ) : (
                <CloudDownloadIcon />
              )}
            </ListItemIcon>
            {this.props.t('menu.download')}
          </MenuItem>
        ) : null}
      </Menu>
    );
  };

  renderHeader = () => {
    const { classes } = this.props;
    return (
      <div className={classes.rowCentered}>
        {((!this.props.forceMonthDisplay && !this.props.hideSwitchViewButton) ||
          !!this.props.setShowCancelledOffers ||
          !!this.props.onRequestMassDisable ||
          !!this.props.showDownloader) && (
          <IconButton
            className={classes.absoluteLeft}
            onClick={(ev) => this.props.setMenuAnchorEl(ev.currentTarget)}
          >
            <SettingsIcon />
          </IconButton>
        )}
        {!!this.props.searchBar && (
          <IconButton
            className={classes.absoluteLeft}
            onClick={this.props.toogleSearchBar}
          >
            <FilterIcon />
          </IconButton>
        )}
        <IconButton onClick={this.showPrevious}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          inline
          component="h3"
          variant="h6"
          className={classes.textCapitalize}
        >
          {this.renderCalendarTitle()}
        </Typography>
        <IconButton id="calendar-next-month" onClick={this.showNext}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    );
  };

  renderWeekFrom = (firstDayWeek: Object) => {
    const { classes } = this.props;
    return (
      <div className={classes.weekRowContainer}>
        {this.renderDay(firstDayWeek.clone().add(0, 'days'))}
        {this.renderDay(firstDayWeek.clone().add(1, 'days'))}
        {this.renderDay(firstDayWeek.clone().add(2, 'days'))}
        {this.renderDay(firstDayWeek.clone().add(3, 'days'))}
        {this.renderDay(firstDayWeek.clone().add(4, 'days'))}
        {this.renderDay(firstDayWeek.clone().add(5, 'days'))}
        {this.renderDay(firstDayWeek.clone().add(6, 'days'))}
      </div>
    );
  };

  renderMonthFrom = (firstDayMonth: Object) => {
    const { date, classes } = this.props;
    const weekRows = [];
    for (let i = 0; i < 6; i += 1) {
      const firstDayInRow = firstDayMonth.clone().add(i * 7, 'days');
      if (firstDayInRow.isSameOrBefore(date, 'month')) {
        weekRows.push(
          <div key={i} className={classes.weekRow}>
            {this.renderWeekFrom(firstDayInRow)}
          </div>,
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

  buildFilters = (filters) => {
    const params = {};
    if (filters.coaches && filters.coaches.length > 0) {
      params.coach_in = filters.coaches;
    }
    if (filters.establishments && filters.establishments.length > 0) {
      params.establishment_in = filters.establishments;
    }
    if (filters.levels && filters.levels.length > 0) {
      params.level_in = filters.levels;
    }
    if (filters.metaActivities && filters.metaActivities.length > 0) {
      params.activity_in = filters.metaActivities;
    }
    return params;
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
          <Collapse in={this.props.searchBarOpen}>
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
    const date = Moment(this.props.date, DATE_FORMAT);
    const firstDayWeek = date.clone().startOf('week');
    const firstDayMonth = date.clone().startOf('month').startOf('week');

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
      <div id="calendar" className={classes.calendarContainer}>
        {this.renderHeader()}
        {this.renderSearchBar()}
        {!this.props.hideDateBar ? (
          <div className={classes.dayRow}>{this.renderBulkDays()}</div>
        ) : null}
        {this.renderMenu()}
      </div>
    );
  }
}

const styles = (theme) => ({
  calendarContainer: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  dayButton: {
    padding: theme.spacing(1),
    display: 'flex',
    flexGrow: 1,
    flexBasis: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(1),
  },
  dayButtonSelected: {
    color: 'primary',
    border: `1px solid ${theme.palette.primary.main}`,
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
    marginBottom: theme.spacing(1),
  },
  weekdayNameRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  dayRow: {
    paddingTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  searchBarContainer: {
    marginBottom: theme.spacing(1),
  },
  weekRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: '100%',
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  rowCentered: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  weekRow: {
    width: '100%',
  },
  absoluteLeft: {
    position: 'absolute',
    left: 0,
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['offer']),
  withState('menuAnchorEl', 'setMenuAnchorEl', null),
)(Calendar);

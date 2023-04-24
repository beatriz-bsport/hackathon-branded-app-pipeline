// @ts-nocheck
import React, { PureComponent } from 'react';
import { Moment as MomentType } from 'moment-timezone';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import BlockIcon from '@material-ui/icons/Block';
import { Theme, WithStyles, withStyles, createStyles } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ViewWeek from '@material-ui/icons/ViewWeek';
import ViewComfy from '@material-ui/icons/ViewComfy';
import { Moment } from '../../i18n';

import { DATE_FORMAT } from '../../utils/datetime';
import { CalendarDay } from './CalendarDay.component';
import { CalendarHeader } from './CalendarHeader.component';

export const WEEKMODE = 0;
export const MONTHMODE = 1;

type OwnProps = {
  date: string;
  ranges?: [string, string][];
  forceMonthDisplay: boolean;
  searchBarOpen?: boolean;
  events?: { [key: string]: Array<any> };
  searchBar?: any;
  loading?: boolean;
  showDayName?: boolean;
  hideDateBar?: boolean;
  hideSwitchViewButton?: boolean;
  isDownloading?: boolean;
  showCancelledOffers?: boolean;
  onDownload?: () => void;
  onRequestMassDisable?: (date: string) => void;
  onDateChange: (value: string) => void;
  toggleSearchBar?: () => void;
  setShowCancelledOffers?: (value: boolean) => void;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

type State = {
  isMenuOpen: boolean;
  displayMode: 0 | 1;
};

class Calendar extends PureComponent<Props, State> {
  anchorRef: React.RefObject<unknown>;

  constructor(props: Props) {
    super(props);
    this.state = {
      displayMode: props.forceMonthDisplay ? MONTHMODE : WEEKMODE,
      isMenuOpen: false,
    };

    this.anchorRef = React.createRef();
  }

  getDateSelected = () => {
    return Moment(this.props.date, DATE_FORMAT).clone();
  };

  renderDay = (day: MomentType) => {
    const dateSelected = this.getDateSelected();
    return (
      <CalendarDay
        events={this.props.events}
        ranges={this.props.ranges}
        dateSelected={dateSelected}
        day={day}
        showDayName={this.props.showDayName}
        displayMode={this.state.displayMode}
        onDateChange={this.props.onDateChange}
      />
    );
  };

  showNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const dateSelected = this.getDateSelected();

    this.props.onDateChange(
      dateSelected
        .add(1, this.state.displayMode === MONTHMODE ? 'months' : 'weeks')
        .format(DATE_FORMAT),
    );
  };

  showPrevious = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const dateSelected = this.getDateSelected();

    this.props.onDateChange(
      dateSelected
        .add(-1, this.state.displayMode === MONTHMODE ? 'months' : 'weeks')
        .format(DATE_FORMAT),
    );
  };

  togleDisplayMode = () => {
    this.setState((prevState: State) => ({
      displayMode: prevState.displayMode === WEEKMODE ? MONTHMODE : WEEKMODE,
    }));
  };

  handleOpenMenu = () => {
    this.setState({
      isMenuOpen: true,
    });
  };

  handleCloseMenu = () => {
    this.setState({
      isMenuOpen: false,
    });
  };

  handleToggleCancelDisplay = () => {
    this.props.setShowCancelledOffers(!this.props.showCancelledOffers);
  };

  handleMassDisable = () => {
    this.props.onRequestMassDisable(this.props.date);
  };

  renderMenu = () => {
    const {
      t,
      showCancelledOffers,
      forceMonthDisplay,
      hideSwitchViewButton,
      isDownloading,
      onRequestMassDisable,
      setShowCancelledOffers,
      onDownload,
    } = this.props;

    return (
      <Menu
        anchorEl={this.anchorRef?.current}
        keepMounted
        open={!!this.anchorRef && this.state.isMenuOpen}
        onClose={this.handleCloseMenu}
      >
        {!forceMonthDisplay && !hideSwitchViewButton && (
          <MenuItem onClick={this.togleDisplayMode}>
            {this.state.displayMode === MONTHMODE ? (
              <>
                <ListItemIcon>
                  <ViewWeek />
                </ListItemIcon>
                {t('menu.showWeek')}
              </>
            ) : (
              <>
                <ListItemIcon>
                  <ViewComfy />
                </ListItemIcon>
                {t('menu.showMonth')}
              </>
            )}
          </MenuItem>
        )}
        {setShowCancelledOffers && (
          <MenuItem onClick={this.handleToggleCancelDisplay}>
            {showCancelledOffers ? (
              <>
                <ListItemIcon>
                  <VisibilityOffIcon />
                </ListItemIcon>
                {t('menu.hideCancelled')}
              </>
            ) : (
              <>
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                {t('menu.showCancelled')}
              </>
            )}
          </MenuItem>
        )}

        {!!onRequestMassDisable && (
          <MenuItem onClick={this.handleMassDisable}>
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            {t('menu.massDisable')}
          </MenuItem>
        )}
        {onDownload && (
          <MenuItem onClick={onDownload}>
            <ListItemIcon>
              {isDownloading ? <CircularProgress /> : <CloudDownloadIcon />}
            </ListItemIcon>
            {t('menu.download')}
          </MenuItem>
        )}
      </Menu>
    );
  };

  renderWeekFrom = (firstDayWeek: MomentType) => {
    return (
      <div className={this.props.classes.weekRowContainer}>
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

  renderMonthFrom = (firstDayMonth: MomentType) => {
    const weekRows = [];
    for (let i = 0; i < 6; i += 1) {
      const firstDayInRow = firstDayMonth.clone().add(i * 7, 'days');
      if (firstDayInRow.isSameOrBefore(this.props.date, 'month')) {
        weekRows.push(
          <div key={`week-${i}`} className={this.props.classes.weekRow}>
            {this.renderWeekFrom(firstDayInRow)}
          </div>,
        );
      }
    }

    return (
      <Grid container direction="column" alignItems="stretch">
        <Grid item className={this.props.classes.weekdayNameRow}>
          {Moment.weekdaysShort(true).map((wds: string) => (
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
    let DividerComponent = Divider;
    if (this.props.loading) {
      DividerComponent = LinearProgress;
    }
    if (this.props.searchBar) {
      return (
        <div>
          <Collapse in={this.props.searchBarOpen}>
            <div className={this.props.classes.searchBarContainer}>
              {this.props.searchBar}
            </div>
          </Collapse>
          <DividerComponent />
        </div>
      );
    }
    return <div />;
  };

  renderBulkDays = () => {
    const dateSelected = this.getDateSelected();

    switch (this.state.displayMode) {
      case WEEKMODE:
        return (
          <>
            {!this.props.showDayName && (
              <div className={this.props.classes.weekRowContainer}>
                {Moment.weekdaysShort(true).map((wds: string) => (
                  <div className={this.props.classes.weekDayShort} key={wds}>
                    <Typography variant="caption" color="textSecondary">
                      {wds[0]}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
            {this.renderWeekFrom(dateSelected.clone().startOf('week'))}
          </>
        );
      case MONTHMODE:
      default:
        return this.renderMonthFrom(
          dateSelected.clone().startOf('month').startOf('week'),
        );
    }
  };

  render() {
    return (
      <div id="calendar" className={this.props.classes.calendarContainer}>
        <CalendarHeader
          forceMonthDisplay={this.props.forceMonthDisplay}
          hideSwitchViewButton={this.props.hideSwitchViewButton}
          setShowCancelledOffers={this.props.setShowCancelledOffers}
          onRequestMassDisable={this.props.onRequestMassDisable}
          onDownload={this.props.onDownload}
          searchBar={this.props.searchBar}
          toggleSearchBar={this.props.toggleSearchBar}
          displayMode={this.state.displayMode}
          getDateSelected={this.getDateSelected}
          dateSelected={this.props.date}
          handleOpenMenu={this.handleOpenMenu}
          showPrevious={this.showPrevious}
          showNext={this.showNext}
          onDateChange={this.props.onDateChange}
          ref={this.anchorRef}
        />
        {this.renderSearchBar()}
        {!this.props.hideDateBar && (
          <div className={this.props.classes.dayRow}>
            {this.renderBulkDays()}
          </div>
        )}
        {this.renderMenu()}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
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
    weekDayShort: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
    },

    weekRow: {
      width: '100%',
    },
    absoluteLeft: {
      position: 'absolute',
      left: 0,
    },
    dayButonInRange: {
      borderRadius: 0,
      border: 'none',
    },
    dayButonStartRange: {
      borderTopLeftRadius: theme.spacing(4),
      borderBottomLeftRadius: theme.spacing(4),
    },
    dayButonEndRange: {
      borderTopRightRadius: theme.spacing(4),
      borderBottomRightRadius: theme.spacing(4),
    },
  });

export default compose(
  withStyles(styles),
  withTranslation(['offer']),
)(Calendar);

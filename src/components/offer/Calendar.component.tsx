import React, { PureComponent } from 'react';
import { DateTime } from 'luxon';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import classNames from 'classnames';

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
import { getLocaleWeekdays } from '#src/utils/datetime';

import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { LuxonDateTime } from '#src/types';
import { CalendarDay } from './CalendarDay.component';
import { CalendarHeader } from './CalendarHeader.component';

export const WEEKMODE = 0;
export const MONTHMODE = 1;

type OwnProps = {
  date: string;
  ranges?: [string, string][];
  forceMonthDisplay: boolean;
  searchBarOpen?: boolean;
  events?: { [key: string]: boolean };
  searchBar?: any;
  loading?: boolean;
  showDayName?: boolean;
  hideDateBar?: boolean;
  hideSwitchViewButton?: boolean;
  isDownloading?: boolean;
  showCancelledOffers?: boolean;
  previewOnly?: boolean;
  wrapperStyle?: string;
  activeWrapperStyle?: string;
  weekRowContainerStyle?: string;
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
    return DateTime.fromISO(this.props.date);
  };

  renderDay = (day: LuxonDateTime) => {
    const dateSelected = this.getDateSelected();
    return (
      <CalendarDay
        activeWrapperStyle={this.props.activeWrapperStyle}
        dateSelected={dateSelected}
        day={day}
        displayMode={this.state.displayMode}
        // @ts-expect-error fix me
        events={this.props.events}
        onDateChange={this.props.onDateChange}
        previewOnly={this.props.previewOnly}
        ranges={this.props.ranges}
        showDayName={this.props.showDayName}
        wrapperStyle={this.props.wrapperStyle}
      />
    );
  };

  showNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const dateSelected = this.getDateSelected();

    this.props.onDateChange(
      dateSelected
        .plus({
          [this.state.displayMode === MONTHMODE ? 'months' : 'weeks']: 1,
        })
        .toISODate(),
    );
  };

  showPrevious = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const dateSelected = this.getDateSelected();

    this.props.onDateChange(
      dateSelected
        .minus({
          [this.state.displayMode === MONTHMODE ? 'months' : 'weeks']: 1,
        })
        .toISODate(),
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
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'planning.calendar.allowed_actions.bulkCancellation',
          'planning.calendar.allowed_actions.readCancellations',
          'export.allowed_actions.planning',
        ]}
      >
        {([
          hasBulkCancellationsPermission,
          hasReadCancellationsPermission,
          hasExportPermission,
        ]: boolean[]) => (
          <Menu
            keepMounted
            // @ts-expect-error fix me
            anchorEl={this.anchorRef?.current}
            onClose={this.handleCloseMenu}
            open={!!this.anchorRef && this.state.isMenuOpen}
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
            {setShowCancelledOffers && hasReadCancellationsPermission && (
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

            {!!onRequestMassDisable && hasBulkCancellationsPermission && (
              <MenuItem onClick={this.handleMassDisable}>
                <ListItemIcon>
                  <BlockIcon />
                </ListItemIcon>
                {t('menu.massDisable')}
              </MenuItem>
            )}
            {hasExportPermission && onDownload && (
              <MenuItem onClick={onDownload}>
                <ListItemIcon>
                  {isDownloading ? <CircularProgress /> : <CloudDownloadIcon />}
                </ListItemIcon>
                {t('menu.download')}
              </MenuItem>
            )}
          </Menu>
        )}
      </ObjectLevelPermissionProvider>
    );
  };

  renderWeekFrom = (firstDayWeek: LuxonDateTime) => {
    return (
      <div
        className={classNames(
          this.props.weekRowContainerStyle,
          this.props.classes.weekRowContainer,
        )}
      >
        {this.renderDay(firstDayWeek.plus({ day: 0 }))}
        {this.renderDay(firstDayWeek.plus({ day: 1 }))}
        {this.renderDay(firstDayWeek.plus({ day: 2 }))}
        {this.renderDay(firstDayWeek.plus({ day: 3 }))}
        {this.renderDay(firstDayWeek.plus({ day: 4 }))}
        {this.renderDay(firstDayWeek.plus({ day: 5 }))}
        {this.renderDay(firstDayWeek.plus({ day: 6 }))}
      </div>
    );
  };

  renderMonthFrom = (firstDayMonth: LuxonDateTime) => {
    const weekRows = [];
    for (let i = 0; i < 6; i += 1) {
      const firstDayInRow = firstDayMonth.plus({ day: i * 7 });
      if (
        firstDayInRow.startOf('month') <=
        DateTime.fromISO(this.props.date).startOf('month')
      ) {
        weekRows.push(
          <div key={`week-${i}`} className={this.props.classes.weekRow}>
            {this.renderWeekFrom(firstDayInRow)}
          </div>,
        );
      }
    }

    return (
      <Grid container alignItems="stretch" direction="column">
        <Grid item className={this.props.classes.weekdayNameRow}>
          {getLocaleWeekdays('short').map((wds: string) => (
            <div
              key={wds}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
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
      // @ts-expect-error fix me
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
                {getLocaleWeekdays('short').map((wds: string) => (
                  <div key={wds} className={this.props.classes.weekDayShort}>
                    <Typography color="textSecondary" variant="caption">
                      {wds[0]}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
            {this.renderWeekFrom(
              dateSelected.startOf('week', { useLocaleWeeks: true }),
            )}
          </>
        );
      case MONTHMODE:
      default:
        return this.renderMonthFrom(
          dateSelected
            .startOf('month')
            .startOf('week', { useLocaleWeeks: true }),
        );
    }
  };

  render() {
    return (
      <div className={this.props.classes.calendarContainer} id="calendar">
        <CalendarHeader
          ref={this.anchorRef}
          dateSelected={this.props.date}
          displayMode={this.state.displayMode}
          forceMonthDisplay={this.props.forceMonthDisplay}
          getDateSelected={this.getDateSelected}
          handleOpenMenu={this.handleOpenMenu}
          hideSwitchViewButton={this.props.hideSwitchViewButton}
          onDateChange={this.props.onDateChange}
          onDownload={this.props.onDownload}
          onRequestMassDisable={this.props.onRequestMassDisable}
          searchBar={this.props.searchBar}
          setShowCancelledOffers={this.props.setShowCancelledOffers}
          showNext={this.showNext}
          showPrevious={this.showPrevious}
          toggleSearchBar={this.props.toggleSearchBar}
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

export default compose<Props, OwnProps>(
  withStyles(styles),
  withTranslation(['offer']),
)(Calendar);

import React, { forwardRef, useCallback, useState } from 'react';
import { DateTime, Info } from 'luxon';
import { useTranslation } from 'react-i18next';
import {
  Theme,
  makeStyles,
  Button,
  ButtonBase,
  IconButton,
  Typography,
} from '@material-ui/core';

import { DatePicker } from 'material-ui-pickers';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SettingsIcon from '@material-ui/icons/Settings';
import FilterIcon from '@material-ui/icons/FilterList';
import TodayIcon from '@material-ui/icons/Today';
import classNames from 'classnames';
import { MONTHMODE } from './Calendar.component';
import { LUXON_ISO_SHORT_DATE, formatAsTitle } from '../../utils/datetime';
import type { LuxonDateTime } from '#src/types';

type Props = {
  forceMonthDisplay: boolean;
  hideSwitchViewButton?: boolean;
  setShowCancelledOffers?: (value: boolean) => void;
  onRequestMassDisable?: (date: string) => void;
  onDownload?: () => void;
  searchBar?: any;
  toggleSearchBar?: () => void;
  displayMode: 0 | 1;
  getDateSelected: () => LuxonDateTime;
  dateSelected: string;
  handleOpenMenu: () => void;
  showPrevious: (event: React.MouseEvent<HTMLButtonElement>) => void;
  showNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDateChange: (value: string) => void;
};

const hiddenDiv: React.FC = () => {
  return <div style={{ display: 'none' }} />;
};

export const CalendarHeader = forwardRef(
  (props: Props, anchorRef: React.RefObject<any>) => {
    const { t } = useTranslation(['offer']);
    const classes = useStyles();

    const { getDateSelected, displayMode, onDateChange } = props;

    const [open, setOpen] = useState<boolean>(false);

    const renderCalendarTitle = useCallback(() => {
      const dateSelected = getDateSelected();

      if (displayMode === MONTHMODE) {
        const dateMonth = Info.months()[dateSelected.month - 1];
        const dateYear = dateSelected.year;
        return `${dateMonth} ${dateYear}`;
      }

      const startDate = dateSelected.startOf('week', { useLocaleWeeks: true });
      const endDate = startDate.plus({ day: 6 });
      return `${formatAsTitle(startDate)} - ${formatAsTitle(endDate)}`;
    }, [getDateSelected, displayMode]);

    const goToToday = useCallback(() => {
      onDateChange(DateTime.now().toFormat(LUXON_ISO_SHORT_DATE));
    }, [onDateChange]);

    const setNewDate = useCallback(
      (newDate: LuxonDateTime) => {
        onDateChange(newDate.toFormat(LUXON_ISO_SHORT_DATE));
      },
      [onDateChange],
    );

    const openPicker = useCallback(() => {
      setOpen(true);
    }, [setOpen]);

    const closePicker = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const showSettingsIcon =
      (!props.forceMonthDisplay && !props.hideSwitchViewButton) ||
      !!props.setShowCancelledOffers ||
      !!props.onRequestMassDisable ||
      !!props.onDownload;

    return (
      <div className={classes.rowCentered}>
        <div className={classes.trick}>
          {showSettingsIcon && (
            <IconButton ref={anchorRef} onClick={props.handleOpenMenu}>
              <SettingsIcon />
            </IconButton>
          )}
          {!!props.searchBar && (
            <Button onClick={props.toggleSearchBar}>
              <FilterIcon />

              <Typography className={classes.filterLabel} variant="subtitle2">
                {t('calendar.filter')}
              </Typography>
            </Button>
          )}
        </div>
        <div
          className={classNames(classes.dateRow, {
            [classes.dateRowBorderColor]: open,
          })}
        >
          <IconButton onClick={props.showPrevious}>
            <ChevronLeftIcon
              className={classNames(classes.chevronColor, {
                [classes.chevronColorClickedButton]: open,
              })}
            />
          </IconButton>
          <ButtonBase
            disableRipple
            className={open ? classes.clickedButton : classes.unclickedButton}
            onClick={openPicker}
          >
            <Typography
              className={classes.textCapitalize}
              component="h3"
              variant="h6"
            >
              {renderCalendarTitle()}
            </Typography>
          </ButtonBase>
          <IconButton id="calendar-next-month" onClick={props.showNext}>
            <ChevronRightIcon
              className={classNames(classes.chevronColor, {
                [classes.chevronColorClickedButton]: open,
              })}
            />
          </IconButton>
          <div>
            <DatePicker
              DialogProps={{ open }}
              format="D"
              initialFocusedDate={
                props.dateSelected
                  ? props.dateSelected
                  : DateTime.now().toISODate()
              }
              onChange={setNewDate}
              onClose={closePicker}
              TextFieldComponent={hiddenDiv}
              value={null}
            />
          </div>
        </div>
        <div className={classes.trick}>
          <div className={classes.todayButtonContainer}>
            <div className={classes.trick} />
            <Button
              className={classes.showOnWideScreen}
              disabled={
                props.dateSelected ===
                DateTime.now().toFormat(LUXON_ISO_SHORT_DATE)
              }
              onClick={goToToday}
              variant="outlined"
            >
              {t('calendar.today')}
            </Button>
            <IconButton
              className={classes.showOnNarrowScreen}
              disabled={
                props.dateSelected ===
                DateTime.now().toFormat(LUXON_ISO_SHORT_DATE)
              }
              onClick={goToToday}
            >
              <TodayIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  },
);

const useStyles = makeStyles((theme: Theme) => ({
  trick: {
    flex: '1',
    [theme.breakpoints.down('xs')]: { flex: '0' },
  },
  rowCentered: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexWrap: 'wrap-reverse',
    padding: '8px',
  },
  filterLabel: {
    marginLeft: theme.spacing(1),
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    borderRadius: '22px',
    border: '1px solid #E0E0E0',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  dateRowBorderColor: {
    borderColor: theme.palette.primary.main,
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  unclickedButton: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  clickedButton: {
    color: theme.palette.primary.main,
  },
  chevronColor: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  chevronColorClickedButton: {
    color: theme.palette.primary.main,
  },
  todayButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  showOnNarrowScreen: {
    display: 'none',
    [theme.breakpoints.down('xs')]: { display: 'block' },
  },
  showOnWideScreen: {
    display: 'block',
    [theme.breakpoints.down('xs')]: { display: 'none' },
  },
}));

export default CalendarHeader;

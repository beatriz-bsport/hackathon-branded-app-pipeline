// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import {
  MuiPickersUtilsProvider,
  Calendar,
  BasePicker,
} from 'material-ui-pickers';
import NumericInput from '../../../components/input/NumericInput.component';

const DATE_AFTER = 0;
const DATE_BEFORE = 1;
const DATE_BETWEEN = 2;
const DATE_EXACT = 3;
const DURATION_AFTER = 4;
const DURATION_EXACT = 6;
const DURATION_BETWEEN = 7;
const DURATION_BEFORE_PAST = 9;
const DURATION_EXACT_PAST = 10;
const DURATION_BETWEEN_PAST = 11;

const DURATION_LIST = [
  DURATION_AFTER,
  DURATION_EXACT,
  DURATION_BETWEEN,
  DURATION_BEFORE_PAST,
  DURATION_EXACT_PAST,
  DURATION_BETWEEN_PAST,
];

const DATE_LIST = [DATE_BETWEEN, DATE_BEFORE, DATE_AFTER, DATE_EXACT];

type Props = {
  filter_data: any,
  t: TFunction,
  classes: Object,
  onChange: (any) => void,
  theme: Object,
};

const renderDurationTypeEnter = (value, duration_type, value_second) => {
  if (duration_type === DURATION_EXACT && value < 0) {
    return DURATION_EXACT_PAST;
  }
  if (duration_type === DURATION_BETWEEN && (value < 0 || value_second < 0)) {
    return DURATION_BETWEEN_PAST;
  }
  return duration_type;
};

export class CalendarPicker extends Component<Props, state> {
  state = {
    open: false,
    date_filter_type: renderDurationTypeEnter(
      this.props.filter_data.duration,
      this.props.filter_data.date_filter_type,
      this.props.filter_data.duration_second,
    ),
    duration_second: Math.abs(this.props.filter_data.duration_second),
    duration: Math.abs(this.props.filter_data.duration),
    date_second: this.props.filter_data.date_second,
    date: this.props.filter_data.date,
    mode:
      this.props.filter_data.date_filter_type === DURATION_AFTER ||
      this.props.filter_data.date_filter_type === DURATION_EXACT ||
      this.props.filter_data.date_filter_type === DURATION_BETWEEN ||
      this.props.filter_data.date_filter_type === DURATION_BEFORE_PAST
        ? 1
        : 0,
  };

  componentDidUpdate(prevProps) {
    if (this.props.filter_data !== prevProps.filter_data) {
      this.setState({
        date_filter_type: renderDurationTypeEnter(
          this.props.filter_data.duration,
          this.props.filter_data.date_filter_type,
          this.props.filter_data.duration_second,
        ),
        duration: Math.abs(this.props.filter_data.duration),
        duration_second: Math.abs(this.props.filter_data.duration_second),
        date: this.props.filter_data.date,
        date_second: this.props.filter_data.date_second,
        mode:
          this.props.filter_data.date_filter_type === DURATION_AFTER ||
          this.props.filter_data.date_filter_type === DURATION_EXACT ||
          this.props.filter_data.date_filter_type === DURATION_BETWEEN ||
          this.props.filter_data.date_filter_type === DURATION_BEFORE_PAST
            ? 1
            : 0,
      });
    }
  }

  handleChangeIndex = (index) => {
    this.setState({ mode: index });
  };

  handleClick = () => {
    this.setState((state) => ({
      open: !state.open,
    }));
  };

  renderInlineText = () => {
    const { t } = this.props;
    const {
      date_filter_type,
      date_second,
      date,
      duration,
      duration_second,
    } = this.state;
    if (date_filter_type === DATE_BETWEEN) {
      return (
        <Typography variant="body2">
          {`${t(
            `filters.calendarPicker.text.${date_filter_type}.first`,
          )} ${moment(date).format('DD/MM/YYYY')} ${t(
            `filters.calendarPicker.text.${date_filter_type}.second`,
          )} ${moment(date_second).format('DD/MM/YYYY')}`}
        </Typography>
      );
    }
    if (
      date_filter_type === DURATION_BETWEEN ||
      date_filter_type === DURATION_BETWEEN_PAST
    ) {
      return (
        <Typography variant="body2">
          {`${t(
            `filters.calendarPicker.text.${date_filter_type}.first`,
          )} ${duration} ${t(
            `filters.calendarPicker.text.${date_filter_type}.second`,
          )} ${duration_second} ${t(
            `filters.calendarPicker.text.${date_filter_type}.third`,
          )}`}
        </Typography>
      );
    }
    if (
      date_filter_type === DATE_EXACT ||
      date_filter_type === DATE_AFTER ||
      date_filter_type === DATE_BEFORE
    ) {
      return (
        <Typography variant="body2">
          {`${t(
            `filters.calendarPicker.text.${date_filter_type}.first`,
          )} ${moment(date).format('DD/MM/YYYY')}`}
        </Typography>
      );
    }
    return (
      <Typography variant="body2">
        {`${t(
          `filters.calendarPicker.text.${date_filter_type}.first`,
        )} ${duration} ${t(
          `filters.calendarPicker.text.${date_filter_type}.second`,
        )}`}
      </Typography>
    );
  };

  closePopoverAndValidate = () => {
    const exit_values = this.renderDurationValuesExit(
      this.state.duration,
      this.state.date_filter_type,
    );

    this.props.onChange({
      date_second: this.state.date_second || moment().format('YYYY-MM-DD'),
      date: this.state.date || moment().format('YYYY-MM-DD'),
      duration_second: this.renderDurationValuesExit(
        this.state.duration_second,
        this.state.date_filter_type,
      ).value,
      duration: exit_values.value,
      date_filter_type: exit_values.type,
    });

    this.setState({ open: false });
  };

  renderDateTab = () => {
    const { date, date_second } = this.state;
    const { classes, t } = this.props;
    return (
      <div className={classes.dateTabContainer}>
        <div className={classes.dateTabSelector}>
          <Select
            className={classes.input}
            value={this.state.date_filter_type}
            onChange={(ev) => {
              this.setState({ date_filter_type: ev.target.value });
            }}
          >
            {DATE_LIST.map((item) => (
              <MenuItem key={item} value={item}>
                {t(`filters.calendarPicker.select.${item}`)}
              </MenuItem>
            ))}
          </Select>
        </div>

        <MuiPickersUtilsProvider
          utils={MomentUtils}
          moment={moment}
          locale={moment.locale()}
        >
          <div className={classes.calendarsContainer}>
            <BasePicker>
              {() => (
                <div className={classes.picker}>
                  <Calendar
                    autoOk
                    maxDate={
                      this.state.date_filter_type === DATE_BETWEEN
                        ? moment(date_second, 'YYYY-MM-DD')
                        : undefined
                    }
                    date={date ? moment(date, 'YYYY-MM-DD') : moment()}
                    onChange={(ev) =>
                      this.setState({
                        date: ev.format('YYYY-MM-DD'),
                      })
                    }
                  />
                </div>
              )}
            </BasePicker>
            {this.state.date_filter_type === DATE_BETWEEN ? (
              <BasePicker>
                {() => (
                  <div className={classes.picker}>
                    <Calendar
                      minDate={moment(date)}
                      date={
                        date_second
                          ? moment(date_second, 'YYYY-MM-DD')
                          : moment()
                      }
                      onChange={(ev) =>
                        this.setState({
                          date_second: ev.format('YYYY-MM-DD'),
                        })
                      }
                    />
                  </div>
                )}
              </BasePicker>
            ) : null}
          </div>
        </MuiPickersUtilsProvider>
      </div>
    );
  };

  changeDurationTime = (duration_type) => {
    if (duration_type === DURATION_BEFORE_PAST) {
      this.setState((prevState) => ({
        duration: 0,
        duration_second: prevState.duration,
      }));
      return DURATION_BETWEEN;
    }
    if (duration_type === DURATION_AFTER) {
      this.setState((prevState) => ({
        duration: 0,
        duration_second: prevState.duration,
      }));

      return DURATION_BETWEEN_PAST;
    }
    if (duration_type === DURATION_EXACT) {
      return DURATION_EXACT_PAST;
    }
    if (duration_type === DURATION_EXACT_PAST) {
      return DURATION_EXACT;
    }
    if (duration_type === DURATION_BETWEEN) {
      return DURATION_BETWEEN_PAST;
    }
    if (duration_type === DURATION_BETWEEN_PAST) {
      return DURATION_BETWEEN;
    }
    return duration_type;
  };

  renderDurationValuesExit = (value, duration_type) => {
    if (duration_type === DURATION_BEFORE_PAST) {
      return { value: -value, type: DURATION_BEFORE_PAST };
    }
    if (duration_type === DURATION_EXACT_PAST) {
      return { value: -value, type: DURATION_EXACT };
    }
    if (duration_type === DURATION_BETWEEN_PAST) {
      return { value: -value, type: DURATION_BETWEEN };
    }
    return { value, type: duration_type };
  };

  renderDurationTab = () => {
    const { classes, t } = this.props;
    return (
      <div className={classes.durationContainer}>
        <Select
          className={classes.input}
          value={this.state.date_filter_type}
          onChange={(ev) =>
            this.setState({ date_filter_type: ev.target.value })
          }
        >
          {DURATION_LIST.map((item) => (
            <MenuItem key="afterDate" value={item}>
              {t(`filters.calendarPicker.selectduration.selector.${item}`)}
            </MenuItem>
          ))}
        </Select>
        <div className={classes.durationTabContainer}>
          <Typography variant="body2">
            {t(
              `filters.calendarPicker.selectduration.${this.state.date_filter_type}.first`,
            )}
          </Typography>
          <NumericInput
            classes={classes}
            value={this.state.duration}
            onChange={(ev) => {
              if (ev.target.value < 0) {
                this.setState((prevState) => ({
                  date_filter_type: this.changeDurationTime(
                    prevState.date_filter_type,
                  ),
                }));
              }
              this.setState({ duration: Math.abs(ev.target.value) });
              if (this.state.duration_second < Math.abs(ev.target.value)) {
                this.setState({ duration_second: Math.abs(ev.target.value) });
              }
            }}
          />
          {this.state.date_filter_type === DURATION_BETWEEN ? (
            <Typography variant="body2">
              {t(
                `filters.calendarPicker.selectduration.${DURATION_BETWEEN}.third`,
              )}
            </Typography>
          ) : null}
          {this.state.date_filter_type === DURATION_BETWEEN_PAST ? (
            <Typography variant="body2">
              {t(
                `filters.calendarPicker.selectduration.${DURATION_BETWEEN_PAST}.third`,
              )}
            </Typography>
          ) : null}
          {this.state.date_filter_type === DURATION_BETWEEN ||
          this.state.date_filter_type === DURATION_BETWEEN_PAST ? (
            <NumericInput
              classes={classes}
              value={this.state.duration_second}
              onChange={(ev) => {
                if (ev.target.value < 0) {
                  this.setState((prevState) => ({
                    date_filter_type: this.changeDurationTime(
                      prevState.date_filter_type,
                    ),
                  }));
                }
                this.setState({ duration_second: Math.abs(ev.target.value) });
                if (this.state.duration > Math.abs(ev.target.value)) {
                  this.setState({ duration: Math.abs(ev.target.value) });
                }
              }}
            />
          ) : null}

          <Typography variant="body2">
            {t(
              `filters.calendarPicker.selectduration.${this.state.date_filter_type}.second`,
            )}
          </Typography>
        </div>
      </div>
    );
  };

  switchTabs = (value) => {
    this.setState({ mode: value });
    if (value === 0) {
      this.setState({ date_filter_type: DATE_EXACT });
    }
    if (value === 1) {
      this.setState({
        date_filter_type: DURATION_BETWEEN_PAST,
        duration: 5,
        duration_second: 10,
      });
    }
  };

  render() {
    const { classes, t, theme } = this.props;
    return (
      <div className={classes.selector}>
        <ListItem
          classes={{
            gutters: classes.gutters,
            button: classes.listItemButton,
            root: classes.root,
            divider: classes.divider,
          }}
          button
          divider
          onClick={this.handleClick}
        >
          <ListItemText
            classes={{
              root: classes.listItemTextRoot,
            }}
            primary={
              <Typography variant="body2">{this.renderInlineText()}</Typography>
            }
          />
          <ArrowDropDownIcon style={{ color: '#757575' }} />
        </ListItem>
        <Dialog open={this.state.open} onClose={this.closePopoverAndValidate}>
          <div style={{ width: '100%' }}>
            <div className={classes.tabs}>
              <Tabs
                value={this.state.mode}
                indicatorColor="primary"
                textColor="primary"
                onChange={(ev, value) => this.switchTabs(value)}
                style={{ width: '100%', overflowX: 'hidden' }}
                variant="fullWidth"
              >
                <Tab label={t('filters.calendarPicker.dateTitle')} />
                <Tab label={t('filters.calendarPicker.durationTitle')} />
              </Tabs>
            </div>
            <SwipeableViews
              ignoreNativeScroll
              animateHeight
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={this.state.mode}
              onChangeIndex={this.handleChangeIndex}
              containerStyle={{
                marginTop: '24px',
                marginBottom: '24px',
              }}
            >
              {this.renderDateTab()}
              {this.renderDurationTab()}
            </SwipeableViews>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              variant="outlined"
              onClick={this.closePopoverAndValidate}
            >
              valider
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  durationContainer: {
    marginLeft: theme.spacing(4),
  },
  calendarsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  dateTabSelector: {
    marginBottom: theme.spacing(1),
  },
  dateTabContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationTabContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(1),
  },
  listItemTextRoot: {
    paddingRight: '0px',
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  picker: { margin: theme.spacing(1) },
  selector: {
    paddingRight: theme.spacing(2),
  },
  outlined: {
    borderBottom: '0px',
  },
  tabButton: {
    borderBottom: '1px solid black',
    width: '50%',
  },
  tabButtonSelectedLeft: {
    borderLeft: '1px solid black',
    width: '50%',
    background: theme.primary_color,
  },
  tabButtonSelectedRight: {
    borderRight: '1px solid black',
    width: '50%',
    color: theme.primary_color,
  },
  textField: {
    padding: '1px',
  },
  contained: {
    boxShadow: '0px',
    backgroundColor: 'red',
  },
  gutters: { paddingLeft: '0px' },
  searchBar: {
    padding: theme.spacing(1),
  },
  root: {
    paddingRight: '0px',
    paddingBottom: theme.spacing(1) / 4,
    paddingTop: (theme.spacing(3)) / 8,
    marginLeft: theme.spacing(1),
  },
  divider: { borderBottom: '1px solid #909090' },
  ListItemButton: { padding: '0px', margin: '0px' },
  tabs: { display: 'flex' },
  button: { width: '100%' },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles, { withTheme: true }),
)(CalendarPicker);

import React, { Component } from 'react';
import {
  withTranslation,
  // @ts-ignore
  TFunction,
} from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { WithStyles } from '@material-ui/styles';
import moment from 'moment-timezone';
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

import { createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  Calendar,
  BasePicker,
} from 'material-ui-pickers';
import NumericInput from '../../../components/input/NumericInput.component';

import {
  DATE_AFTER,
  DATE_BEFORE,
  DATE_BETWEEN,
  DATE_EXACT,
  DURATION_AFTER,
  DURATION_EXACT,
  DURATION_BETWEEN,
  DURATION_BEFORE_PAST,
  DURATION_EXACT_PAST,
  DURATION_BETWEEN_PAST,
  DURATION_LIST,
} from './constants';

const DATE_LIST = [DATE_BETWEEN, DATE_BEFORE, DATE_AFTER, DATE_EXACT];

type OwnProps = {
  filter_data: any;
  t: TFunction;
  classes: Object;
  onChange: (data: any) => void;
  theme: Object;
  overrideDateList?: Array<number>;
  hideDurationTab?: boolean;
  blockValidateOnClickAway: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

type State = {
  open: boolean;
  date_filter_type: number | unknown;
  duration_second: number;
  duration: number;
  date: string;
  date_second: string;
  mode: number;
};

const renderDurationTypeEnter = (
  value: number,
  duration_type: number,
  value_second: number,
) => {
  if (duration_type === DURATION_EXACT && value < 0) {
    return DURATION_EXACT_PAST;
  }
  if (duration_type === DURATION_BETWEEN && (value < 0 || value_second < 0)) {
    return DURATION_BETWEEN_PAST;
  }
  return duration_type;
};

export class CalendarPicker extends Component<Props, State> {
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

  componentDidUpdate(prevProps: Props) {
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

  handleChangeIndex = (index: number) => {
    this.setState({ mode: index });
  };

  handleClick = () => {
    this.setState((state) => ({
      open: !state.open,
    }));
  };

  renderInlineText = () => {
    const { t } = this.props;
    const { date_filter_type, date_second, date, duration, duration_second } =
      this.state;
    if (date_filter_type === DATE_BETWEEN) {
      return (
        <Typography variant="body2">
          {`${t(
            `filters.calendarPicker.text.${date_filter_type}.first`,
          )} ${moment(date).format('L')} ${t(
            `filters.calendarPicker.text.${date_filter_type}.second`,
          )} ${moment(date_second).format('L')}`}
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
          )} ${moment(date).format('L')}`}
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

  closePopoverAndValidate = (validate: boolean) => {
    if (validate) {
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
    } else {
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
        open: false,
      });
    }
  };

  renderDateTab = () => {
    const { date, date_second } = this.state;
    const { classes, t } = this.props;
    return (
      <div className={classes.dateTabContainer}>
        <div className={classes.dateTabSelector}>
          <Select
            onChange={(ev) => {
              this.setState({ date_filter_type: ev.target.value });
            }}
            value={this.state.date_filter_type}
          >
            {(this.props.overrideDateList || DATE_LIST).map((item) => (
              <MenuItem key={item} value={item}>
                {t(`filters.calendarPicker.select.${item}`)}
              </MenuItem>
            ))}
          </Select>
        </div>

        <MuiPickersUtilsProvider
          locale={moment.locale()}
          moment={moment}
          utils={MomentUtils}
        >
          <div className={classes.calendarsContainer}>
            {/* @ts-expect-error */}
            <BasePicker>
              {() => (
                <div className={classes.picker}>
                  <Calendar
                    // @ts-expect-error
                    autoOk
                    date={date ? moment(date, 'YYYY-MM-DD') : moment()}
                    maxDate={
                      this.state.date_filter_type === DATE_BETWEEN
                        ? moment(date_second, 'YYYY-MM-DD')
                        : undefined
                    }
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
              // @ts-expect-error
              <BasePicker>
                {() => (
                  <div className={classes.picker}>
                    {/* @ts-expect-error */}
                    <Calendar
                      date={
                        date_second
                          ? moment(date_second, 'YYYY-MM-DD')
                          : moment()
                      }
                      minDate={moment(date)}
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

  changeDurationTime = (duration_type: number) => {
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

  renderDurationValuesExit = (value: number, duration_type: number) => {
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
          onChange={(ev) =>
            this.setState({ date_filter_type: ev.target.value })
          }
          value={this.state.date_filter_type}
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
            // @ts-expect-error
            classes={classes}
            onChange={(ev) => {
              // @ts-expect-error
              if (ev.target.value < 0) {
                this.setState((prevState) => ({
                  date_filter_type: this.changeDurationTime(
                    // @ts-expect-error
                    prevState.date_filter_type,
                  ),
                }));
              }
              // @ts-expect-error
              this.setState({ duration: Math.abs(ev.target.value) });
              // @ts-expect-error
              if (this.state.duration_second < Math.abs(ev.target.value)) {
                this.setState({
                  // @ts-expect-error
                  duration_second: Math.abs(ev.target.value),
                });
              }
            }}
            value={this.state.duration}
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
              // @ts-expect-error
              classes={classes}
              onChange={(ev) => {
                // @ts-expect-error
                if (ev.target.value < 0) {
                  this.setState((prevState) => ({
                    date_filter_type: this.changeDurationTime(
                      // @ts-expect-error
                      prevState.date_filter_type,
                    ),
                  }));
                }
                // @ts-expect-error
                this.setState({ duration_second: Math.abs(ev.target.value) });
                // @ts-expect-error
                if (this.state.duration > Math.abs(ev.target.value)) {
                  this.setState(
                    // @ts-expect-error
                    { duration: Math.abs(ev.target.value) },
                  );
                }
              }}
              value={this.state.duration_second}
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

  switchTabs = (value: number) => {
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
          button
          divider
          classes={{
            gutters: classes.gutters,
            button: classes.listItemButton,
            root: classes.root,
            divider: classes.divider,
          }}
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
        <Dialog
          onClose={() =>
            this.closePopoverAndValidate(!this.props.blockValidateOnClickAway)
          }
          open={this.state.open}
        >
          <div style={{ width: '100%' }}>
            {!this.props.hideDurationTab && (
              <div className={classes.tabs}>
                <Tabs
                  indicatorColor="primary"
                  onChange={(ev, value) => this.switchTabs(value)}
                  style={{ width: '100%', overflowX: 'hidden' }}
                  textColor="primary"
                  value={this.state.mode}
                  variant="fullWidth"
                >
                  <Tab label={t('filters.calendarPicker.dateTitle')} />
                  <Tab label={t('filters.calendarPicker.durationTitle')} />
                </Tabs>
              </div>
            )}
            <SwipeableViews
              animateHeight
              ignoreNativeScroll
              axis={
                // @ts-expect-error
                theme.direction === 'rtl' ? 'x-reverse' : 'x'
              }
              containerStyle={{
                marginTop: '24px',
                marginBottom: '24px',
              }}
              index={this.state.mode}
              onChangeIndex={this.handleChangeIndex}
            >
              {this.renderDateTab()}
              {this.renderDurationTab()}
            </SwipeableViews>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.cancelButton}
              color="secondary"
              onClick={() => this.closePopoverAndValidate(false)}
              variant="outlined"
            >
              {t('modal.delete.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={() => this.closePopoverAndValidate(true)}
              variant="outlined"
            >
              {t('modal.validate')}
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
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
      paddingRight: 0,
    },
    textInput: {
      width: 50,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    picker: { margin: theme.spacing(1) },
    selector: {
      paddingRight: theme.spacing(2),
    },
    outlined: {
      borderBottom: 0,
    },
    tabButton: {
      borderBottom: '1px solid black',
      width: '50%',
    },
    tabButtonSelectedLeft: {
      borderLeft: '1px solid black',
      width: '50%',
      background: theme.palette.primary.main,
    },
    tabButtonSelectedRight: {
      borderRight: '1px solid black',
      width: '50%',
      color: theme.palette.primary.main,
    },
    textField: {
      padding: 1,
    },
    contained: {
      boxShadow: '0px',
      backgroundColor: 'red',
    },
    gutters: { paddingLeft: 0 },
    searchBar: {
      padding: theme.spacing(1),
    },
    root: {
      paddingRight: 0,
      paddingBottom: theme.spacing(1) / 4,
      paddingTop: theme.spacing(3) / 8,
      marginLeft: theme.spacing(1),
    },
    divider: { borderBottom: '1px solid #909090' },
    listItemButton: {
      padding: 0,
      marginLeft: theme.spacing(1),
      marginTop: 0,
      marginBottom: 0,
    },
    tabs: { display: 'flex' },
    button: { width: '100%' },
    cancelButton: { marginRight: theme.spacing(2) },
  });

export default compose(
  withTranslation(['smartList']),
  withStyles(styles, { withTheme: true }),
)(CalendarPicker);

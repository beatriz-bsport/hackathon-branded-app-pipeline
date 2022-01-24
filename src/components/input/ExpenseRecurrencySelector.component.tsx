import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RRule } from 'rrule';
import classnames from 'classnames';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import MomentUtils from '@date-io/moment/';
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import isEqual from 'lodash/isEqual';
import { MaterialStyleType } from '../../utils/types';
import { Moment } from '../../i18n';
import { ExpenseWithUser } from '../../libs/expense/types';
import WeekdaySelector from '#components/Selector/WeekdaySelector.component';

const months = [
  { value: 1, label: 'january' },
  { value: 2, label: 'february' },
  { value: 3, label: 'march' },
  { value: 4, label: 'april' },
  { value: 5, label: 'may' },
  { value: 6, label: 'june' },
  { value: 7, label: 'july' },
  { value: 8, label: 'august' },
  { value: 9, label: 'september' },
  { value: 10, label: 'october' },
  { value: 11, label: 'november' },
  { value: 12, label: 'december' },
];

type OwnProps = {
  showRepeat: boolean;
  setShowRepeat: (show: boolean) => void;
  onChange: (rrule: object) => void;
  radioValue: number;
  setRadioValue: (radioValue: number) => void;
  radioRepeatValue: number;
  setRadioRepeatValue: (radioRepeatValue: number) => void;
  initial?: ExpenseWithUser;
  rrule: {
    freq: number;
    interval: number;
    count: number;
    bymonthday: number;
    bymonth: number;
    byweekday: number;
    bysetpos: number;
    dtstart: Date;
    until: Date;
  };
  setRrule: (rrule: {
    freq: number;
    interval: number;
    count: number;
    bymonthday: number;
    bymonth: number;
    byweekday: number;
    bysetpos: number;
    dtstart: Date;
    until: Date;
  }) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class ExpenseRecurrencySelector extends Component<Props> {
  componentDidMount() {
    const { initial } = this.props;
    if (initial?.rrule?.options) {
      this.props.setRrule({
        freq: initial.rrule.options.freq,
        interval: initial.rrule.options.interval,
        count: initial.rrule.options.count,
        bymonthday: initial.rrule.options.bymonthday
          ? initial.rrule.options.bymonthday[0]
          : null,
        bymonth: initial.rrule.options.bymonth
          ? initial.rrule.options.bymonth[0]
          : null,
        byweekday: initial.rrule.options.byweekday
          ? initial.rrule.options.byweekday[0]
          : null,
        bysetpos: initial.rrule.options.bysetpos
          ? initial.rrule.options.bysetpos[0]
          : null,
        dtstart: initial.rrule.options.dtstart,
        until: initial.rrule.options.until,
      });
      this.props.setShowRepeat(true);
      if (initial.rrule.options.dtstart && initial.rrule.options.until) {
        this.props.setRadioRepeatValue(1);
      }
      if (
        initial.rrule.options.freq === RRule.MONTHLY &&
        initial.rrule.options.bysetpos &&
        initial.rrule.options.byweekday
      ) {
        this.props.setRadioValue(1);
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps.rrule, this.props.rrule)) {
      this.props.onChange(this.props.rrule);
    }
  }

  handleShowRepeat = () => {
    const now = new Date();
    const { setRrule, setShowRepeat } = this.props;

    if (!this.props.showRepeat) {
      setRrule({
        freq: RRule.MONTHLY,
        interval: 1,
        bymonthday: now.getDate(),
        bymonth: null,
        byweekday: null,
        bysetpos: null,
        count: 12,
        dtstart: now,
        until: null,
      });
      setShowRepeat(true);
    } else {
      setRrule({
        freq: null,
        interval: null,
        count: null,
        bymonthday: null,
        bymonth: null,
        byweekday: null,
        bysetpos: null,
        dtstart: null,
        until: null,
      });
      setShowRepeat(false);
    }
  };

  handleFrequency = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = new Date();
    const { setRrule, rrule } = this.props;

    if (Number(e.target.value) === RRule.DAILY) {
      setRrule({
        ...rrule,
        freq: Number(e.target.value),
        byweekday: null,
        bymonthday: null,
        bymonth: null,
        bysetpos: null,
      });
    }
    if (Number(e.target.value) === RRule.WEEKLY) {
      setRrule({
        ...rrule,
        freq: Number(e.target.value),
        byweekday: 0,
        bymonthday: null,
        bymonth: null,
        bysetpos: null,
      });
    }
    if (Number(e.target.value) === RRule.MONTHLY) {
      setRrule({
        ...rrule,
        freq: Number(e.target.value),
        bymonthday: now.getDate(),
        byweekday: null,
        bymonth: null,
        bysetpos: null,
      });
      this.props.setRadioValue(0);
    }
    if (Number(e.target.value) === RRule.YEARLY) {
      setRrule({
        ...rrule,
        freq: Number(e.target.value),
        bymonthday: now.getDate(),
        bymonth: now.getMonth(),
        byweekday: null,
        bysetpos: null,
      });
    }
  };

  handleMonthlyRules = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = new Date();
    const { setRrule, rrule } = this.props;

    if (Number(e.target.value) === 0) {
      setRrule({
        ...rrule,
        byweekday: null,
        bysetpos: null,
        bymonthday: now.getDate(),
      });
    }
    if (Number(e.target.value) === 1) {
      setRrule({
        ...rrule,
        bymonthday: null,
        byweekday: 0,
        bysetpos: 1,
      });
    }
    this.props.setRadioValue(Number(e.target.value));
  };

  handleRepeatRules = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = new Date();
    const { setRrule, rrule } = this.props;

    if (Number(e.target.value) === 0) {
      setRrule({
        ...rrule,
        count: 1,
        dtstart: now,
        until: null,
      });
    }
    if (Number(e.target.value) === 1) {
      let newDate = new Date().setMonth(now.getMonth() + 1);
      if (rrule.freq !== RRule.WEEKLY) {
        newDate = new Date().setFullYear(now.getFullYear() + 1);
      }
      setRrule({
        ...rrule,
        count: null,
        dtstart: now,
        until: new Date(newDate),
      });
    }
    this.props.setRadioRepeatValue(Number(e.target.value));
  };

  render() {
    const {
      showRepeat,
      radioValue,
      radioRepeatValue,
      initial,
      rrule,
      setRrule,
      classes,
      t,
    } = this.props;
    const now = new Date();
    const maxDate = new Date(new Date().setFullYear(now.getFullYear() + 10));

    let maxInterval = 52;
    let maxCount = 104;
    if (rrule?.freq === RRule.MONTHLY) {
      maxInterval = 24;
      maxCount = 60;
    }
    if (rrule?.freq === RRule.YEARLY) {
      maxInterval = 5;
      maxCount = 10;
    }

    return (
      <React.Fragment>
        {!initial?.rrule && (
          <div className={classes.repeat}>
            <FormControlLabel
              control={
                <Switch
                  checked={showRepeat}
                  disabled={!!initial?.id}
                  onChange={this.handleShowRepeat}
                  color="primary"
                />
              }
              label={t('form.repeat.title')}
            />
          </div>
        )}

        {showRepeat && (
          <div className={classnames(classes.field, classes.flexRow)}>
            <Typography className={initial?.rrule ? classes.disabled : ''}>
              {t('form.repeat.repeatEvery')}
            </Typography>
            <TextField
              type="number"
              name="interval"
              InputProps={{
                inputProps: { min: 0, step: 1, max: { maxInterval } },
              }}
              value={rrule.interval}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRrule({ ...rrule, interval: Number(e.target.value) });
              }}
              className={classnames(classes.integerField, classes.margin)}
              disabled={!!initial?.rrule}
            />
            <Select
              aria-label="repeat"
              name="repeat-freq"
              value={rrule.freq}
              onChange={this.handleFrequency}
              disabled={!!initial?.rrule}
            >
              <MenuItem key={RRule.DAILY} value={RRule.DAILY}>
                {t('form.repeat.day').toLowerCase()}
              </MenuItem>
              <MenuItem key={RRule.WEEKLY} value={RRule.WEEKLY}>
                {t('form.repeat.week').toLowerCase()}
              </MenuItem>
              <MenuItem key={RRule.MONTHLY} value={RRule.MONTHLY}>
                {t('form.repeat.month').toLowerCase()}
              </MenuItem>
              <MenuItem key={RRule.YEARLY} value={RRule.YEARLY}>
                {t('form.repeat.year').toLowerCase()}
              </MenuItem>
            </Select>
          </div>
        )}

        {showRepeat && rrule.freq === RRule.WEEKLY && (
          <div className={classes.field}>
            <WeekdaySelector
              text={
                rrule.interval > 1
                  ? t('form.repeat.repeatWeek_nb', { nb: rrule.interval })
                  : t('form.repeat.repeatWeek')
              }
              name="repeat-weekday"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRrule({ ...rrule, byweekday: Number(e.target.value) })
              }
              value={rrule.byweekday}
              lowercase
              disabled={!!initial?.rrule}
            />
          </div>
        )}

        {showRepeat && rrule.freq === RRule.MONTHLY && (
          <div className={classes.field}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="montly-repeat"
                name="montly-repeat"
                value={radioValue}
                onChange={this.handleMonthlyRules}
                disabled={!!initial?.rrule}
              >
                <div className={classes.flexRow}>
                  <Radio disabled={!!initial?.rrule} value={0} />
                  <Typography>
                    {rrule.interval > 1
                      ? t('form.repeat.repeatMonth_nb', { nb: rrule.interval })
                      : t('form.repeat.repeatMonth')}
                  </Typography>
                  <TextField
                    type="number"
                    name="repeat-day"
                    InputProps={{
                      inputProps: { min: 1, step: 1, max: 31 },
                    }}
                    value={rrule.bymonthday}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRrule({
                        ...rrule,
                        bymonthday: Number(e.target.value),
                      });
                    }}
                    className={classnames(classes.integerField, classes.margin)}
                    disabled={radioValue !== 0 || !!initial?.rrule}
                  />
                </div>
                <div
                  className={classnames(
                    classes.field,
                    classes.flexRow,
                    classes.wrap,
                  )}
                >
                  <Radio disabled={!!initial?.rrule} value={1} />
                  <Typography>{t('form.repeat.repeatMonthDay')}</Typography>
                  <Select
                    aria-label="repeat"
                    name="repeat-month-day"
                    disabled={radioValue !== 1 || !!initial?.rrule}
                    value={rrule.bysetpos}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRrule({
                        ...rrule,
                        bysetpos: Number(e.target.value),
                      });
                    }}
                    className={classes.marginLeft}
                  >
                    <MenuItem key={1} value={1}>
                      {t('form.repeat.weekdays.first')}
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                      {t('form.repeat.weekdays.second')}
                    </MenuItem>
                    <MenuItem key={3} value={3}>
                      {t('form.repeat.weekdays.third')}
                    </MenuItem>
                    <MenuItem key={4} value={4}>
                      {t('form.repeat.weekdays.fourth')}
                    </MenuItem>
                  </Select>
                  <WeekdaySelector
                    disabled={radioValue !== 1 || !!initial?.rrule}
                    name="repeat-weekday-per-month"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRrule({
                        ...rrule,
                        byweekday: Number(e.target.value),
                      })
                    }
                    value={rrule.byweekday}
                    plural
                    lowercase
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        )}

        {showRepeat && rrule.freq === RRule.YEARLY && (
          <div className={classnames(classes.field, classes.flexRow)}>
            <Typography>
              {rrule.interval > 1
                ? t('form.repeat.repeatYear_nb', { nb: rrule.interval })
                : t('form.repeat.repeatYear')}
            </Typography>
            <TextField
              type="number"
              name="repeat-day"
              InputProps={{
                inputProps: { min: 1, step: 1, max: 31 },
              }}
              value={rrule.bymonthday}
              disabled={!!initial?.rrule}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRrule({
                  ...rrule,
                  bymonthday: Number(e.target.value),
                })
              }
              className={classnames(classes.integerField, classes.margin)}
            />
            <Select
              aria-label="repeat"
              disabled={!!initial?.rrule}
              name="repeat-month-day"
              value={rrule.bymonth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRrule({
                  ...rrule,
                  bymonth: Number(e.target.value),
                });
              }}
              className={classes.marginLeft}
            >
              {months.map((m) => {
                return (
                  <MenuItem key={m.value} value={m.value}>
                    {t(`form.repeat.months.${m.label}`).toLowerCase()}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        )}

        {showRepeat && (
          <div className={classes.field}>
            <div className={classes.field}>
              <Typography>{t('form.repeat.number')}</Typography>
            </div>
            <RadioGroup
              aria-label="occurrences"
              name="occurrences"
              value={radioRepeatValue}
              onChange={this.handleRepeatRules}
            >
              <div className={classes.flexRow}>
                <Radio disabled={!!initial?.rrule} value={0} />
                <Typography>{t('form.repeat.count')}</Typography>
                <TextField
                  type="number"
                  name="count"
                  InputProps={{
                    inputProps: { min: 1, step: 1, max: { maxCount } },
                  }}
                  value={rrule.count}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setRrule({ ...rrule, count: Number(e.target.value) });
                  }}
                  className={classnames(classes.integerField, classes.margin)}
                  disabled={radioRepeatValue !== 0 || !!initial?.rrule}
                />
                <Typography>
                  {t('form.repeat.fromDate').toLowerCase()}
                </Typography>
                <MuiPickersUtilsProvider
                  utils={MomentUtils}
                  moment={Moment}
                  locale={Moment.locale()}
                >
                  <DatePicker
                    style={{ width: 120 }}
                    value={rrule.dtstart}
                    onChange={(date: Date) => {
                      setRrule({ ...rrule, dtstart: date });
                    }}
                    format="L"
                    className={classes.margin}
                    disabled={radioRepeatValue === 1 || !!initial?.rrule}
                  />
                  <InsertInvitationIcon className={classes.calendarIcon} />
                </MuiPickersUtilsProvider>
              </div>
              <div
                className={classnames(
                  classes.field,
                  classes.flexRow,
                  classes.wrap,
                )}
              >
                <Radio disabled={!!initial?.rrule} value={1} />
                <Typography>{t('form.repeat.from')}</Typography>
                <MuiPickersUtilsProvider
                  utils={MomentUtils}
                  moment={Moment}
                  locale={Moment.locale()}
                >
                  <DatePicker
                    style={{ width: 120 }}
                    value={rrule.dtstart}
                    onChange={(date: Date) => {
                      setRrule({ ...rrule, dtstart: date });
                      if (rrule.until < date) {
                        setRrule({ ...rrule, until: date });
                      }
                    }}
                    format="L"
                    className={classes.margin}
                    disabled={radioRepeatValue !== 1 || !!initial?.rrule}
                  />
                  <InsertInvitationIcon className={classes.calendarIcon} />
                </MuiPickersUtilsProvider>
                <Typography>{t('form.repeat.until').toLowerCase()}</Typography>
                <MuiPickersUtilsProvider
                  utils={MomentUtils}
                  moment={Moment}
                  locale={Moment.locale()}
                >
                  <DatePicker
                    style={{ width: 120 }}
                    value={rrule.until}
                    onChange={(date: Date) => {
                      setRrule({ ...rrule, until: date });
                    }}
                    format="L"
                    className={classes.margin}
                    minDate={rrule.dtstart}
                    disabled={radioRepeatValue !== 1 || !!initial?.disabled}
                    maxDate={maxDate}
                  />
                  <InsertInvitationIcon className={classes.calendarIcon} />
                </MuiPickersUtilsProvider>
              </div>
            </RadioGroup>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const styles = (theme: Theme): any => ({
  field: {
    marginBottom: theme.spacing(2),
  },
  repeat: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  margin: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  wrap: {
    flexWrap: 'wrap',
  },
  integerField: {
    width: 50,
  },
  calendarIcon: {
    marginLeft: -theme.spacing(4),
    marginRight: theme.spacing(2),
    color: 'grey',
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.42)',
  },
});

export default compose<any, Props>(
  withTranslation('expense'),
  withStyles(styles),
)(ExpenseRecurrencySelector);

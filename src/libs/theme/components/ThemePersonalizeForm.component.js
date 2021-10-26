// @flow

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import RadioGroup from '@material-ui/core/RadioGroup';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Switch from '@material-ui/core/Switch';
import {
  BOOKING_DATE_ORDER,
  BOOKING_FIRSTNAME_ORDER,
  BOOKING_LASTNAME_ORDER,
} from '@bsport/common/lib/master-data/settings';

import moment from 'moment-timezone';
import TextField from '@material-ui/core/TextField';
import clx from 'classnames';
import type { CompanyTheme } from '../types';
import Checkbox from '../../../components/input/Checkbox.component';
import NumericInput from '../../../components/input/NumericInput.component';

type Props = {
  theme: CompanyTheme,
  onSubmit: (id: number, data: *) => void,
  processing: boolean,
  t: TFunction,
  classes: Object,
};

type State = {
  theme: CompanyTheme,
  timerange: string,
};

export class ThemePersonalize extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: props.theme,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.theme !== this.props.theme) {
      this.setState({ theme: this.props.theme });
    }
  }

  handleChange = (key: string) => (value: any) =>
    this.setState((prevState) => ({
      theme: { ...prevState.theme, [key]: value },
    }));

  checkChange = () => {
    return (
      this.state.theme.show_offers_filling ===
        this.props.theme.show_offers_filling &&
      this.state.theme.max_future_booking ===
        this.props.theme.max_future_booking &&
      this.state.theme.accept_double_booking ===
        this.props.theme.accept_double_booking &&
      this.state.theme.hidden_from_marketplace ===
        this.props.theme.hidden_from_marketplace &&
      this.state.theme.consumer_regularize_debt ===
        this.props.theme.consumer_regularize_debt &&
      this.state.theme.default_booking_ordering ===
        this.props.theme.default_booking_ordering &&
      this.state.theme.default_attendance ===
        this.props.theme.default_attendance &&
      this.state.theme.show_cancelled_offers_manager ===
        this.props.theme.show_cancelled_offers_manager &&
      this.state.theme.show_cancelled_offers_customer ===
        this.props.theme.show_cancelled_offers_customer &&
      this.state.theme.hideCoach === this.props.theme.hideCoach &&
      this.state.theme.show_workshops_customer ===
        this.props.theme.show_workshops_customer &&
      this.state.theme.basket_expiration_days ===
        this.props.theme.basket_expiration_days &&
      this.state.theme.show_booked_gender_offer ===
        this.props.theme.show_booked_gender_offer &&
      this.state.theme.is_checking_balance ===
        this.props.theme.is_checking_balance &&
      this.state.theme.nb_to_check_balance ===
        this.props.theme.nb_to_check_balance &&
      this.state.theme.gender_max_shift_for_booking ===
        this.props.theme.gender_max_shift_for_booking &&
      this.state.theme.schedule_timerange_begin ===
        this.props.theme.schedule_timerange_begin &&
      this.state.theme.schedule_timerange_end ===
        this.props.theme.schedule_timerange_end
    );
  };

  onSubmit = () => {
    const data = new FormData();
    [
      'show_offers_filling',
      'consumer_regularize_debt',
      'accept_double_booking',
      'hidden_from_marketplace',
      'max_future_booking',
      'default_booking_ordering',
      'default_attendance',
      'show_cancelled_offers_customer',
      'hideCoach',
      'show_cancelled_offers_manager',
      'show_workshops_customer',
      'basket_expiration_days',
      'show_booked_gender_offer',
      'is_checking_balance',
      'nb_to_check_balance',
      'gender_max_shift_for_booking',
      'schedule_timerange_begin',
      'schedule_timerange_end',
    ].map((key) => data.append(key, this.state.theme[key]));
    if (
      (!!this.state.theme.basket_expiration_days ||
        this.state.theme.basket_expiration_days === 0) &&
      (moment(this.state.theme?.schedule_timerange_end).get('hour') || 23) >
        (moment(this.state.theme?.schedule_timerange_begin).get('hour') || 6)
    ) {
      this.props.onSubmit(this.props.theme.company, data);
    } else if (
      !(
        (moment(this.state.theme?.schedule_timerange_end).get('hour') || 23) >
        (moment(this.state.theme?.schedule_timerange_begin).get('hour') || 6)
      )
    ) {
      alert(this.props.t('forms.themePersonalization.schedule.alert'));
    } else {
      alert(
        this.props.t('forms.themePersonalization.basket_expiration_days.alert'),
      );
    }
  };

  rebuildDatetime(ev) {
    const hour = ev.target.value.split(':')[0] || moment().get('hour');
    const minute = ev.target.value.split(':')[1] || moment().get('minute');
    return moment()
      .tz(this.props.theme.timezone_name)
      .set('hour', hour)
      .set('minute', minute)
      .format();
  }

  renderScheduleConfig(begin: boolean, classes) {
    const timerange = begin
      ? this.state.theme?.schedule_timerange_begin
      : this.state.theme?.schedule_timerange_end;
    return (
      <TextField
        id="time_picker"
        className={clx([
          classes.timeRange,
          begin ? classes.timeRangeF : classes.timeRangeS,
        ])}
        type="time"
        value={
          timerange
            ? moment(timerange).format('HH:mm')
            : moment()
                .set('hour', begin ? 6 : 23)
                .set('minute', 0)
                .format('HH:mm')
        }
        onChange={(ev) =>
          begin
            ? this.handleChange('schedule_timerange_begin')(
                this.rebuildDatetime(ev),
              )
            : this.handleChange('schedule_timerange_end')(
                this.rebuildDatetime(ev),
              )
        }
      />
    );
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.consumer_regularize_debt}
            onChange={() =>
              this.handleChange('consumer_regularize_debt')(
                !this.state.theme.consumer_regularize_debt,
              )
            }
          />
          <Typography>
            {t('forms.themePersonalization.consumerRegularizeDebt')}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.accept_double_booking}
            onChange={() =>
              this.handleChange('accept_double_booking')(
                !this.state.theme.accept_double_booking,
              )
            }
          />
          <Typography>
            {t('forms.themePersonalization.acceptDoubleBooking')}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <Switch
            checked={!this.state.theme.hidden_from_marketplace}
            onChange={() =>
              this.handleChange('hidden_from_marketplace')(
                !this.state.theme.hidden_from_marketplace,
              )
            }
          />
          <Typography>
            {t('forms.themePersonalization.hiddenFromMarketplace')}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.max_future_booking > 0}
            onChange={() =>
              this.handleChange('max_future_booking')(
                this.state.theme.max_future_booking ? 0 : 10,
              )
            }
          />
          <Typography>
            {t('forms.themePersonalization.maxFutureBooking.label')}
          </Typography>
        </div>
        {this.state.theme.max_future_booking ? (
          <div className={classes.radioButtonContainer}>
            <div className={classes.verticalInput}>
              <NumericInput
                variant="outlined"
                helperText={t(
                  'forms.themePersonalization.maxFutureBooking.numberCheck.helperText',
                )}
                label={t(
                  'forms.themePersonalization.maxFutureBooking.numberCheck.placeholder',
                )}
                value={this.state.theme.max_future_booking}
                InputProps={{
                  inputProps: { min: 1, step: 1, max: 50 },
                }}
                onChange={(ev) =>
                  this.handleChange('max_future_booking')(
                    Math.max(1, parseInt(ev.target.value, 10)),
                  )
                }
              />
            </div>
          </div>
        ) : null}
        <div className={classes.formControlContain}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.theme.basket_expiration_days !== 0}
                onChange={() =>
                  this.handleChange('basket_expiration_days')(
                    this.state.theme.basket_expiration_days === 0 ? '' : 0,
                  )
                }
              />
            }
            label={t('forms.themePersonalization.basket_expiration_days.label')}
          />
          <NumericInput
            helperText={t(
              'forms.themePersonalization.basket_expiration_days.helperText',
            )}
            label={t(
              'forms.themePersonalization.basket_expiration_days.placeholder',
            )}
            fullWidth={false}
            disabled={this.state.theme.basket_expiration_days === 0}
            value={this.state.theme.basket_expiration_days}
            InputProps={{
              inputProps: { min: 1, step: 1, max: 100 },
            }}
            onChange={(ev) =>
              this.handleChange('basket_expiration_days')(
                parseInt(ev.target.value, 10),
              )
            }
          />
        </div>
        <Typography className={classes.namesHeader}>
          {t('forms.themePersonalization.calendarPersonalizationTitle')}
        </Typography>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.show_offers_filling}
            onChange={() =>
              this.handleChange('show_offers_filling')(
                !this.state.theme.show_offers_filling,
              )
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <Typography>
            {t('forms.themePersonalization.offersFilling')}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.show_cancelled_offers_customer}
            onChange={() =>
              this.handleChange('show_cancelled_offers_customer')(
                !this.state.theme.show_cancelled_offers_customer,
              )
            }
          />
          <Typography>
            {t('forms.themePersonalization.cancelledOffersCustomer')}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.hideCoach}
            onChange={() =>
              this.handleChange('hideCoach')(!this.state.theme.hideCoach)
            }
          />
          <Typography>{t('forms.themePersonalization.hideCoach')}</Typography>
        </div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.show_cancelled_offers_manager}
            onChange={() =>
              this.handleChange('show_cancelled_offers_manager')(
                !this.state.theme.show_cancelled_offers_manager,
              )
            }
          />
          <Typography>
            {t('forms.themePersonalization.cancelledOffersManager')}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.show_workshops_customer}
            onChange={() =>
              this.handleChange('show_workshops_customer')(
                !this.state.theme.show_workshops_customer,
              )
            }
          />
          <Typography>
            {t('forms.themePersonalization.workshopsCustomer')}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <Switch
            checked={this.state.theme.show_booked_gender_offer}
            onChange={() =>
              this.handleChange('show_booked_gender_offer')(
                !this.state.theme.show_booked_gender_offer,
              )
            }
          />
          <Typography>
            {t('forms.themePersonalization.showGenderOffer')}
          </Typography>
        </div>
        <Typography>
          {t('forms.themePersonalization.schedule.title')}
        </Typography>
        <div className={classes.sched}>
          <div className={classes.timeText}>
            <Typography>
              {t('forms.themePersonalization.schedule.begin')}
            </Typography>
            <Typography className={classes.timeTextS}>
              {t('forms.themePersonalization.schedule.end')}
            </Typography>
          </div>
          <div className={classes.time}>
            {this.renderScheduleConfig(true, classes)}
            {this.renderScheduleConfig(false, classes)}
          </div>
        </div>
        <Typography className={classes.namesHeader}>
          {t('forms.themePersonalization.offerBalance')}
        </Typography>
        <div className={classes.radioButtonContainer}>
          <Checkbox
            label={t('forms.themePersonalization.checkBalance.checkbox')}
            checked={this.state.theme.is_checking_balance}
            onChange={() =>
              this.handleChange('is_checking_balance')(
                !this.state.theme.is_checking_balance,
              )
            }
          />
        </div>
        {this.state.theme.is_checking_balance ? (
          <div className={classes.radioButtonContainer}>
            <div className={classes.verticalInput}>
              <NumericInput
                variant="outlined"
                helperText={t(
                  'forms.themePersonalization.checkBalance.numberCheck.helperText',
                )}
                label={t(
                  'forms.themePersonalization.checkBalance.numberCheck.placeholder',
                  { number: this.state.theme.nb_to_check_balance },
                )}
                value={this.state.theme.nb_to_check_balance}
                InputProps={{
                  inputProps: { min: 2, step: 1, max: 10 },
                }}
                onChange={(ev) =>
                  this.handleChange('nb_to_check_balance')(
                    parseInt(ev.target.value, 10),
                  )
                }
              />
            </div>
            <div className={classes.verticalInput}>
              <NumericInput
                variant="outlined"
                fullWidth
                label={t(
                  'forms.themePersonalization.checkBalance.shiftRatio.placeholder',
                )}
                value={this.state.theme.gender_max_shift_for_booking}
                InputProps={{
                  inputProps: { min: 1, step: 1, max: 10 },
                }}
                onChange={(ev) =>
                  this.handleChange('gender_max_shift_for_booking')(
                    parseInt(ev.target.value, 10),
                  )
                }
              />
            </div>
            <Typography variant="body2">
              {t('forms.themePersonalization.checkBalance.shiftRatio.explain', {
                numberCheck: this.state.theme.nb_to_check_balance,
                gender_max_shift_for_booking: this.state.theme
                  .gender_max_shift_for_booking,
              })}
            </Typography>
          </div>
        ) : null}
        <Typography className={classes.namesHeader}>
          {t('forms.themePersonalization.default_booking_ordering.title')}
        </Typography>
        <div className={classes.radioButtonContainer}>
          <RadioGroup
            value={this.state.theme.default_booking_ordering}
            onChange={(ev) =>
              this.handleChange('default_booking_ordering')(ev.target.value)
            }
          >
            <FormControlLabel
              value={BOOKING_DATE_ORDER}
              control={
                <Radio
                  checked={
                    BOOKING_DATE_ORDER ===
                    this.state.theme.default_booking_ordering
                  }
                />
              }
              label={t(
                'forms.themePersonalization.default_booking_ordering.date',
              )}
            />
            <FormControlLabel
              value={BOOKING_FIRSTNAME_ORDER}
              control={
                <Radio
                  checked={
                    BOOKING_FIRSTNAME_ORDER ===
                    this.state.theme.default_booking_ordering
                  }
                />
              }
              label={t(
                'forms.themePersonalization.default_booking_ordering.firstname',
              )}
            />
            <FormControlLabel
              value={BOOKING_LASTNAME_ORDER}
              control={
                <Radio
                  checked={
                    BOOKING_LASTNAME_ORDER ===
                    this.state.theme.default_booking_ordering
                  }
                />
              }
              label={t(
                'forms.themePersonalization.default_booking_ordering.lastname',
              )}
            />
          </RadioGroup>
        </div>
        <Typography className={classes.namesHeader}>
          {t('forms.themePersonalization.default_attendance.title')}
        </Typography>
        <div className={classes.radioButtonContainer}>
          <RadioGroup
            value={this.state.theme.default_attendance}
            onChange={(ev) => {
              this.handleChange('default_attendance')(
                ev.target.value === 'true',
              );
            }}
          >
            <FormControlLabel
              value={false}
              control={<Radio checked={!this.state.theme.default_attendance} />}
              label={t('forms.themePersonalization.default_attendance.missing')}
            />
            <FormControlLabel
              value
              control={<Radio checked={this.state.theme.default_attendance} />}
              label={t('forms.themePersonalization.default_attendance.present')}
            />
          </RadioGroup>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            onClick={() => this.onSubmit(this.state.theme)}
            disabled={this.checkChange() || this.props.processing}
            variant="contained"
            color="primary"
          >
            {t('forms.submit')}
          </Button>
          {this.props.processing ? (
            <CircularProgress className={classes.progress} />
          ) : null}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  namesHeader: { marginBottom: theme.spacing(2) },
  horizontalInput: {
    marginRight: theme.spacing(3),
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(3),
    alignItems: 'center',
  },
  radioButtonContainer: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    marginLeft: theme.spacing(1),
  },
  formControlContain: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
  verticalInput: {
    marginBottom: theme.spacing(2),
  },
  time: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  timeText: {
    marginTop: theme.spacing(2.5),
    marginLeft: theme.spacing(1.5),
  },
  timeTextS: {
    marginTop: theme.spacing(2.5),
  },
  timeRange: {
    minWidth: 100,
    marginLeft: theme.spacing(2),
  },
  timeRangeF: {
    marginTop: theme.spacing(2),
  },
  timeRangeS: {
    marginTop: theme.spacing(1.4),
  },
  sched: {
    display: 'flex',
    maxWidth: 400,
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['theme']),
)(ThemePersonalize);

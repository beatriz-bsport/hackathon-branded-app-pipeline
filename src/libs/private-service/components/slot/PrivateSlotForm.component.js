// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import DurationInput from '../../../../components/input/DurationInputWithSelect.component';
import NumericInput from '../../../../components/input/NumericInput.component';
import { DURATION_CHOICES_SHORT, Submit } from '../../../../components/forms';
import { getCreditFactor } from '#libs/theme/selectors';

type PrivateSlotData = any;

type Props = {
  initial: ?PrivateSlotData,
  onSubmit: (PrivateSlotData) => void,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
};

type State = PrivateSlotData;

const MIN_DURATION_MINUTES = 10;
const MAX_DURATION_MINUTES = 60 * 24;

export class PrivateSlotForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        name: props.initial.name,
        duration_minutes: props.initial.duration_minutes,
        credit: props.initial.credit / getCreditFactor(),
        people_capacity_used: props.initial.people_capacity_used,
        booking_interval_minutes: props.initial.booking_interval_minutes,
        isSubmitting: false,
      };
    } else {
      this.state = {
        name: null,
        duration_minutes: 60,
        credit: 1,
        people_capacity_used: 1,
        booking_interval_minutes: 15,
        isSubmitting: false,
      };
    }
  }

  get isDurationError() {
    return (
      this.state.duration_minutes > MAX_DURATION_MINUTES ||
      !this.state.duration_minutes ||
      this.state.duration_minutes < MIN_DURATION_MINUTES
    );
  }

  get isBookingIntervalError() {
    return (
      parseInt(this.state.booking_interval_minutes) < MIN_DURATION_MINUTES ||
      this.state.booking_interval_minutes === ''
    );
  }

  get isFormError() {
    return (
      this.isDurationError ||
      this.isBookingIntervalError ||
      !this.state.name ||
      this.state.credit < 0 ||
      this.state.people_capacity_used < 0 ||
      this.state.isSubmitting
    );
  }

  handleBlur = () => {
    this.setState((prevState) =>
      this.isBookingIntervalError
        ? {
            ...prevState,
            booking_interval_minutes: MIN_DURATION_MINUTES,
          }
        : prevState,
    );
  };

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.setState({ isSubmitting: true });
    this.props.onSubmit(
      {
        name: this.state.name,
        description: this.state.description,
        duration_minutes: this.state.duration_minutes,
        credit: this.state.credit * getCreditFactor(),
        people_capacity_used: this.state.people_capacity_used,
        booking_interval_minutes:
          this.state.booking_interval_minutes || MIN_DURATION_MINUTES,
      },
      {
        onSuccess: () => this.setState({ isSubmitting: false }),
        onError: () => this.setState({ isSubmitting: false }),
      },
    );
  };

  onFormFieldChange = (value: *) => {
    const updatedValue =
      value <= MAX_DURATION_MINUTES ? value : MAX_DURATION_MINUTES;
    this.setState({ duration_minutes: updatedValue });
  };

  render() {
    const { t, classes, onCancel } = this.props;

    return (
      <form
        className={classes.container}
        data-testid="privateslot-form"
        onSubmit={this.onSubmit}
      >
        <div className={classes.field}>
          <TextField
            fullWidth
            id="name-input"
            label={t('slot.form.name.label')}
            onChange={(ev) => this.setState({ name: ev.target.value })}
            placeholder={t('slot.form.name.placeholder')}
            value={this.state.name}
          />
        </div>
        <div className={classes.field} id="credit-input">
          <NumericInput
            fullWidth
            error={this.state.credit < 0}
            helperText={t('slot.form.credit.helperText')}
            label={t('slot.form.credit.label')}
            onChange={(ev) => this.setState({ credit: ev.target.value })}
            value={this.state.credit}
          />
        </div>
        <div className={classes.field} id="people-capacity-input">
          <NumericInput
            fullWidth
            error={this.state.people_capacity_used < 0}
            helperText={t('slot.form.people_capacity_used.helperText')}
            label={t('slot.form.people_capacity_used.label')}
            onChange={(ev) =>
              this.setState({ people_capacity_used: ev.target.value })
            }
            value={this.state.people_capacity_used}
          />
        </div>
        <div className={classes.field} id="duration-input">
          <FormControl className={classes.flexField}>
            <InputLabel>{t('slot.form.duration_minutes.label')}</InputLabel>
            <DurationInput
              required
              disallowedNullDuration={this.isDurationError}
              durationError={t('slot.form.durationError')}
              onChange={(e) => {
                this.onFormFieldChange(e || 0);
              }}
              selectDurationChoices={DURATION_CHOICES_SHORT}
              value={this.state.duration_minutes}
            />
          </FormControl>
        </div>
        <div className={classes.field} id="booking-interval-input">
          <NumericInput
            fullWidth
            isPositive
            error={this.isBookingIntervalError}
            helperText={t('slot.form.booking_interval_minutes.helperText')}
            InputProps={{ step: 15, max: MAX_DURATION_MINUTES }}
            label={t('slot.form.booking_interval_minutes.label')}
            onBlur={this.handleBlur}
            onChange={(ev) => {
              if (parseInt(ev.target.value) < MIN_DURATION_MINUTES) {
                this.setState({
                  booking_interval_minutes: ev.target.value,
                });
              } else {
                this.setState({ booking_interval_minutes: ev.target.value });
              }
            }}
            value={this.state.booking_interval_minutes}
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button id="button-cancel" onClick={onCancel}>
            {t('slot.form.cancel')}
          </Button>
          <Submit disabled={this.isFormError} id="button-submit">
            {t('slot.form.submit')}
          </Submit>
        </div>
      </form>
    );
  }
}

const styles = (theme) => ({
  container: {},
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    justifyContent: 'end',
  },
  selectField: {
    minWidth: 140,
    marginLeft: theme.spacing(2),
    visibility: 'hidden',
  },
  field: {
    marginBottom: theme.spacing(1),
  },
  flexField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap-reverse',
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateSlotForm);

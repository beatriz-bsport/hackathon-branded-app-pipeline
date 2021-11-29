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
import { DURATION_CHOICES_SHORT } from '../../../../components/forms';

type PrivateSlotData = any;

type Props = {
  initial: ?PrivateSlotData,
  onSubmit: (PrivateSlotData) => void,
  onCancel: () => void,
  t: TFunction,
  classes: Object,
};

type State = PrivateSlotData;

export class PrivateSlotForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        name: props.initial.name,
        duration_minutes: props.initial.duration_minutes,
        credit: props.initial.credit,
        people_capacity_used: props.initial.people_capacity_used,
        booking_interval_minutes: props.initial.booking_interval_minutes,
      };
    } else {
      this.state = {
        name: null,
        duration_minutes: 60,
        credit: 1,
        people_capacity_used: 1,
        booking_interval_minutes: 15,
      };
    }
  }

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.props.onSubmit({
      name: this.state.name,
      description: this.state.description,
      duration_minutes: this.state.duration_minutes,
      credit: this.state.credit,
      people_capacity_used: this.state.people_capacity_used,
      booking_interval_minutes: this.state.booking_interval_minutes,
    });
  };

  onFormFieldChange = (value: *) => {
    const updatedValue = value <= 1440 ? value : 1440;
    this.setState({ duration_minutes: updatedValue });
  };

  render() {
    const { t, classes, onCancel } = this.props;

    const durationError =
      this.state.duration_minutes > 1440 ||
      !this.state.duration_minutes ||
      this.state.duration_minutes < 15;
    return (
      <form onSubmit={this.onSubmit} className={classes.container}>
        <div className={classes.field}>
          <TextField
            fullWidth
            label={t('slot.form.name.label')}
            placeholder={t('slot.form.name.placeholder')}
            value={this.state.name}
            onChange={(ev) => this.setState({ name: ev.target.value })}
          />
        </div>
        <div className={classes.field}>
          <NumericInput
            fullWidth
            label={t('slot.form.credit.label')}
            helperText={t('slot.form.credit.helperText')}
            value={this.state.credit}
            onChange={(ev) => this.setState({ credit: ev.target.value })}
          />
        </div>
        <div className={classes.field}>
          <NumericInput
            fullWidth
            label={t('slot.form.people_capacity_used.label')}
            helperText={t('slot.form.people_capacity_used.helperText')}
            value={this.state.people_capacity_used}
            onChange={(ev) =>
              this.setState({ people_capacity_used: ev.target.value })
            }
          />
        </div>
        <div className={classes.field}>
          <FormControl className={classes.flexField}>
            <InputLabel>{t('slot.form.duration_minutes.label')}</InputLabel>
            <DurationInput
              required
              value={this.state.duration_minutes}
              disallowedNullDuration={durationError}
              durationError={t('slot.form.durationError')}
              onChange={(e) => {
                this.onFormFieldChange(e || 0);
              }}
              selectDurationChoices={DURATION_CHOICES_SHORT}
            />
          </FormControl>
        </div>
        <div className={classes.field}>
          <NumericInput
            fullWidth
            InputProps={{ min: 10, step: 15, max: 60 * 24 }}
            label={t('slot.form.booking_interval_minutes.label')}
            helperText={t('slot.form.booking_interval_minutes.helperText')}
            value={this.state.booking_interval_minutes}
            onChange={(ev) => {
              if (parseInt(ev.target.value, 10) < 10) {
                this.setState({ booking_interval_minutes: '10' });
              } else {
                this.setState({ booking_interval_minutes: ev.target.value });
              }
            }}
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button onClick={onCancel}>{t('slot.form.cancel')}</Button>
          <Button type="submit" color="primary" disabled={durationError}>
            {t('slot.form.submit')}
          </Button>
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

// @flow

import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
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
import Config from '../../../config';

import type { Theme } from '../types';

type Props = {
  theme: Theme,
  onSubmit: (id: number, data: *) => void,
  processing: boolean,
  t: TFunction,
  classes: Object,
};

type State = {
  theme: Theme,
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
      this.state.theme.last_name_label === this.props.theme.last_name_label &&
      this.state.theme.first_name_label === this.props.theme.first_name_label &&
      this.state.theme.consumer_regularize_debt ===
        this.props.theme.consumer_regularize_debt &&
      this.state.theme.default_booking_ordering ===
        this.props.theme.default_booking_ordering &&
      this.state.theme.default_attendance ===
        this.props.theme.default_attendance
    );
  };

  onSubmit = () => {
    const data = new FormData();
    [
      'show_offers_filling',
      'consumer_regularize_debt',
      'first_name_label',
      'last_name_label',
      'default_booking_ordering',
      'default_attendance',
    ].map((key) => data.append(key, this.state.theme[key]));
    this.props.onSubmit(this.props.theme.company, data);
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <Typography className={classes.namesHeader}>
          {t('forms.themePersonalization.names_label_info')}
        </Typography>
        <div className={classes.inputContainer}>
          <div className={classes.horizontalInput}>
            <TextField
              variant="outlined"
              placeholder={t(
                'forms.themePersonalization.first_name_label.placeholder',
              )}
              helperText={t(
                'forms.themePersonalization.first_name_label.helperText',
              )}
              label={t('forms.themePersonalization.first_name_label.label')}
              value={this.state.theme.first_name_label}
              onChange={(ev) =>
                this.handleChange('first_name_label')(ev.target.value)
              }
            />
          </div>
          <div className={classes.horizontalInput}>
            <TextField
              variant="outlined"
              placeholder={t(
                'forms.themePersonalization.last_name_label.placeholder',
              )}
              helperText={t(
                'forms.themePersonalization.last_name_label.helperText',
              )}
              label={t('forms.themePersonalization.last_name_label.label')}
              value={this.state.theme.last_name_label}
              onChange={(ev) =>
                this.handleChange('last_name_label')(ev.target.value)
              }
            />
          </div>
        </div>
        {Config.NODE_ENV === 'staging' || Config.NODE_ENV === 'development' ? (
          <div>
            <Typography className={classes.namesHeader}>
              {t('forms.themePersonalization.calendar.title')}
            </Typography>
            <div className={classes.inputContainer}>
              <div className={classes.horizontalInput}>
                <TextField
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder={t(
                    'forms.themePersonalization.calendar.columns.placeholder',
                  )}
                  helperText={t(
                    'forms.themePersonalization.calendar.columns.helperText',
                  )}
                  label={t('forms.themePersonalization.calendar.columns.label')}
                />
              </div>
              <div className={classes.horizontalInput}>
                <TextField
                  rows={3}
                  multiline
                  variant="outlined"
                  placeholder={t(
                    'forms.themePersonalization.calendar.offerCard.placeholder',
                  )}
                  helperText={t(
                    'forms.themePersonalization.calendar.offerCard.helperText',
                  )}
                  label={t(
                    'forms.themePersonalization.calendar.offerCard.label',
                  )}
                />
              </div>
            </div>
            <div className={classes.inputContainer}>
              <div className={classes.horizontalInput}>
                <TextField
                  rows={3}
                  multiline
                  variant="outlined"
                  placeholder={t(
                    'forms.themePersonalization.calendar.bookButton.placeholder',
                  )}
                  helperText={t(
                    'forms.themePersonalization.calendar.bookButton.helperText',
                  )}
                  label={t(
                    'forms.themePersonalization.calendar.bookButton.label',
                  )}
                />
              </div>
              <div className={classes.horizontalInput}>
                <TextField
                  rows={3}
                  multiline
                  variant="outlined"
                  placeholder={t(
                    'forms.themePersonalization.calendar.police.placeholder',
                  )}
                  helperText={t(
                    'forms.themePersonalization.calendar.police.helperText',
                  )}
                  label={t('forms.themePersonalization.calendar.police.label')}
                />
              </div>
            </div>
          </div>
        ) : null}
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
});

export default compose(
  withStyles(styles),
  withTranslation(['theme']),
)(ThemePersonalize);

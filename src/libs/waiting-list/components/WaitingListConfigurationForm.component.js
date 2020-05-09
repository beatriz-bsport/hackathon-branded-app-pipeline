// @flow

import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import {
  WAITING_LIST_AUTO_CANCELLATION_DUMB,
  WAITING_LIST_AUTO_CANCELLATION_SMART,
} from '@bsport/common/lib/master-data/waiting-list-auto-cancellation';
import type { WaitingListConfiguration } from '../types';

import NumericInput from '../../../components/input/NumericInput.component';

type Props = {
  t: TFunction,
  classes: *,
  configuration: WaitingListConfiguration,
  onSubmit: (*) => void,
};

type State = {
  configuration: WaitingListConfiguration,
};

export class WaitingListConfigurationForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      configuration: props.configuration,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.configuration !== this.props.configuration) {
      this.setState({ configuration: this.props.configuration });
    }
  }

  handleChange = (field) => (value) => {
    this.setState((prevState) => ({
      configuration: { ...prevState.configuration, [field]: value },
    }));
  };

  compareStateToProps = () => {
    const propsConfig = this.props.configuration;
    const stateConfig = this.state.configuration;
    return (
      propsConfig.auto_cancellation_type ===
        stateConfig.auto_cancellation_type &&
      propsConfig.smart_delay_percentage ===
        stateConfig.smart_delay_percentage &&
      propsConfig.dumb_delay_minutes === stateConfig.dumb_delay_minutes
    );
  };

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.props.onSubmit({ ...this.state.configuration });
  };

  computeExample = () => {
    const nbMinutesBeforeOffer = 180;
    if (
      this.state.configuration.auto_cancellation_type ===
      WAITING_LIST_AUTO_CANCELLATION_DUMB.id
    ) {
      return {
        nbMinutesBeforeOffer,
        nbMinutesBeforeBookingOptionExpire:
          this.state.configuration.dumb_delay_minutes || 180,
      };
    }
    if (
      this.state.configuration.auto_cancellation_type ===
      WAITING_LIST_AUTO_CANCELLATION_SMART.id
    ) {
      return {
        nbMinutesBeforeOffer,
        nbMinutesBeforeBookingOptionExpire: parseInt(
          (this.state.configuration.smart_delay_percentage *
            nbMinutesBeforeOffer) /
            100 || 0,
          10,
        ),
      };
    }
    return {};
  };

  render() {
    const { classes, t } = this.props;
    const {
      nbMinutesBeforeOffer,
      nbMinutesBeforeBookingOptionExpire,
    } = this.computeExample();
    return (
      <form onSubmit={this.onSubmit} className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">
            {t('form.auto_cancellation_type.title')}
          </FormLabel>
          <FormControlLabel
            control={
              <Radio
                checked={
                  this.state.configuration.auto_cancellation_type ===
                  WAITING_LIST_AUTO_CANCELLATION_DUMB.id
                }
                onChange={() =>
                  this.handleChange('auto_cancellation_type')(
                    WAITING_LIST_AUTO_CANCELLATION_DUMB.id,
                  )
                }
                value={WAITING_LIST_AUTO_CANCELLATION_DUMB.id}
                name="simple"
                aria-label="simple"
              />
            }
            label={t('form.dumb_delay_minutes.label')}
          />
          <NumericInput
            helperText={t('form.dumb_delay_minutes.helper')}
            InputProps={{
              inputProps: { min: 60, step: 1, max: 32000 },
              endAdornment: <InputAdornment position="end">min</InputAdornment>,
            }}
            disabled={
              this.state.configuration.auto_cancellation_type ===
              WAITING_LIST_AUTO_CANCELLATION_SMART.id
            }
            value={this.state.configuration.dumb_delay_minutes}
            onChange={(ev) =>
              this.handleChange('dumb_delay_minutes')(
                parseInt(ev.target.value, 10),
              )
            }
          />
          <FormControlLabel
            control={
              <Radio
                checked={
                  this.state.configuration.auto_cancellation_type ===
                  WAITING_LIST_AUTO_CANCELLATION_SMART.id
                }
                onChange={() =>
                  this.handleChange('auto_cancellation_type')(
                    WAITING_LIST_AUTO_CANCELLATION_SMART.id,
                  )
                }
                value={WAITING_LIST_AUTO_CANCELLATION_SMART.id}
                name="smart"
                aria-label="smart"
              />
            }
            label={t('form.smart_delay_percentage.label')}
          />
          <NumericInput
            helperText={t('form.smart_delay_percentage.helper')}
            fullWidth={false}
            value={this.state.configuration.smart_delay_percentage}
            InputProps={{
              inputProps: { min: 10, step: 1, max: 100 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            disabled={
              this.state.configuration.auto_cancellation_type ===
              WAITING_LIST_AUTO_CANCELLATION_DUMB.id
            }
            onChange={(ev) =>
              this.handleChange('smart_delay_percentage')(
                parseInt(ev.target.value, 10),
              )
            }
          />
          <Typography className={classes.explainWaitingListConf}>
            {t('explainWaitingListConf', {
              nbMinutesBeforeOffer,
              nbMinutesBeforeBookingOptionExpire,
            })}
          </Typography>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={this.compareStateToProps()}
        >
          {t('form.submit')}
        </Button>
      </form>
    );
  }
}

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  formControl: {
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  explainWaitingListConf: {
    paddingTop: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['waitingList']),
)(WaitingListConfigurationForm);

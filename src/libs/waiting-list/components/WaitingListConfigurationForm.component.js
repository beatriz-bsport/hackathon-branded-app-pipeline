// @flow

import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import {
  WAITING_LIST_AUTO_CANCELLATION_DUMB,
  WAITING_LIST_AUTO_CANCELLATION_SMART,
} from '@bsport/common/lib/master-data/waiting-list-auto-cancellation';
import {
  WAITING_LIST_DYNAMIC_UNORDERED,
  WAITING_LIST_DYNAMIC_ORDERED,
} from '@bsport/common/lib/master-data/waiting-list-dynamic';
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
      propsConfig.dumb_delay_minutes === stateConfig.dumb_delay_minutes &&
      propsConfig.dynamic === stateConfig.dynamic &&
      propsConfig.auto_consume_pack === stateConfig.auto_consume_pack &&
      propsConfig.autokick_delay === stateConfig.autokick_delay &&
      propsConfig.auto_consume_pack === stateConfig.auto_consume_pack &&
      propsConfig.is_option_blocking === stateConfig.is_option_blocking
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

  renderUnorderedForm = () => {
    return (
      <Typography color="textSecondary" variant="caption">
        {this.props.t(`form.dynamic.${WAITING_LIST_DYNAMIC_UNORDERED}.explain`)}
      </Typography>
    );
  };

  renderOrderedForm = () => {
    const { classes, t } = this.props;
    const {
      nbMinutesBeforeOffer,
      nbMinutesBeforeBookingOptionExpire,
    } = this.computeExample();
    return (
      <div>
        <Typography color="textSecondary" variant="caption">
          {t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.explain`)}
        </Typography>
        <fieldset className={classes.column}>
          <legend>
            {t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.settings`)}
          </legend>
          <div className={classes.field}>
            <NumericInput
              helperText={t('form.autokick_delay.helper')}
              label={t('form.autokick_delay.label')}
              fullWidth={false}
              value={this.state.configuration.autokick_delay}
              InputProps={{
                inputProps: { min: 1, step: 1, max: 100 },
              }}
              onChange={(ev) =>
                this.handleChange('autokick_delay')(
                  parseInt(ev.target.value, 10),
                )
              }
            />
          </div>
          <div className={classes.field}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.configuration.auto_consume_pack}
                  onChange={(event) =>
                    this.handleChange('auto_consume_pack')(event.target.checked)
                  }
                  value={this.state.configuration.auto_consume_pack}
                />
              }
              label={t('form.auto_consume_pack.label')}
            />
            <Typography
              variant="caption"
              className={classes.helperText}
              color="textSecondary"
            >
              {t('form.auto_consume_pack.helper')}
            </Typography>
          </div>
          <div className={classes.divider} />
          <div className={classes.field}>
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
            <NumericInput
              helperText={t('form.dumb_delay_minutes.helper')}
              InputProps={{
                inputProps: { min: 60, step: 1, max: 32000 },
                endAdornment: (
                  <InputAdornment position="end">min</InputAdornment>
                ),
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
          </div>
          <div className={classes.field}>
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
          </div>
        </fieldset>
      </div>
    );
  };

  render() {
    const { classes, t } = this.props;
    return (
      <form onSubmit={this.onSubmit} className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">
            {t('form.auto_cancellation_type.title')}
          </FormLabel>
          <div className={classes.field}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.configuration.is_option_blocking}
                  onChange={(event) =>
                    this.handleChange('is_option_blocking')(
                      event.target.checked,
                    )
                  }
                  value={this.state.configuration.is_option_blocking}
                />
              }
              label={t('form.is_option_blocking.label')}
            />
            <Typography
              variant="caption"
              className={classes.helperText}
              color="textSecondary"
            >
              {t('form.is_option_blocking.helper')}
            </Typography>
          </div>

          <div className={classes.field}>
            <RadioGroup
              onChange={(ev) =>
                this.handleChange('dynamic')(parseInt(ev.target.value, 10))
              }
              value={`${this.state.configuration.dynamic}`}
              row
              aria-label="position"
              defaultValue="right"
            >
              <FormControlLabel
                value={`${WAITING_LIST_DYNAMIC_ORDERED}`}
                control={<Radio color="primary" />}
                label={t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.label`)}
                labelPlacement="right"
              />
              <FormControlLabel
                value={`${WAITING_LIST_DYNAMIC_UNORDERED}`}
                control={<Radio color="primary" />}
                label={t(
                  `form.dynamic.${WAITING_LIST_DYNAMIC_UNORDERED}.label`,
                )}
                labelPlacement="right"
              />
            </RadioGroup>
          </div>
          <Collapse
            in={
              this.state.configuration.dynamic === WAITING_LIST_DYNAMIC_ORDERED
            }
          >
            {this.renderOrderedForm()}
          </Collapse>
          <Collapse
            in={
              this.state.configuration.dynamic ===
              WAITING_LIST_DYNAMIC_UNORDERED
            }
          >
            {this.renderUnorderedForm()}
          </Collapse>
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
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  explainWaitingListConf: {
    paddingTop: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  field: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  helperText: {
    marginTop: theme.spacing(-1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['waitingList']),
)(WaitingListConfigurationForm);

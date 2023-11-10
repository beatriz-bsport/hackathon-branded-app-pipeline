// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import {
  WAITING_LIST_DYNAMIC_UNORDERED,
  WAITING_LIST_DYNAMIC_ORDERED,
} from '@bsport/common/lib/master-data/waiting-list-dynamic';
import Switch from '@material-ui/core/Switch';
import NumericInput from '../../../components/input/NumericInput.component';

import {
  WaitingListConfiguration,
  WaitingListAutoCancellation,
} from '../types';

type Props = {
  t: TFunction,
  classes: any,
  configuration: WaitingListConfiguration,
  onSubmit: (data: any) => void,
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
      propsConfig.kick_if_no_pack_when_auto_consume ===
        stateConfig.kick_if_no_pack_when_auto_consume &&
      propsConfig.auto_consume_pack === stateConfig.auto_consume_pack &&
      propsConfig.last_delay_before_auto_consume ===
        stateConfig.last_delay_before_auto_consume &&
      propsConfig.is_option_blocking === stateConfig.is_option_blocking &&
      propsConfig.check_credit === stateConfig.check_credit &&
      propsConfig.display_member_position ===
        stateConfig.display_member_position
    );
  };

  onSubmit = (ev: SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    this.props.onSubmit({ ...this.state.configuration });
  };

  renderUnorderedForm = () => {
    return (
      <div className={this.props.classes.singleRow}>
        <InfoOutlineIcon className={this.props.classes.leftIcon} />
        <Typography color="textSecondary">
          {this.props.t(
            `form.dynamic.${WAITING_LIST_DYNAMIC_UNORDERED}.explain`,
          )}
        </Typography>
      </div>
    );
  };

  generateAlertInfoContent = () => {
    const { t } = this.props;
    if (
      this.state.configuration.auto_cancellation_type ===
      WaitingListAutoCancellation.dumb
    ) {
      return t(
        `form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.overallExplainSimple`,
        {
          autokick_delay: this.state.configuration.autokick_delay,
          dumb_delay_minutes: this.state.configuration.dumb_delay_minutes,
        },
      );
    }
    const exampleHoursBefore = 3;
    const exampleComputedDelayOne = (
      exampleHoursBefore *
      60 *
      (this.state.configuration.smart_delay_percentage / 100)
    ).toFixed(0);
    const exampleComputedDelayTwo = (
      (exampleHoursBefore * 60 - exampleComputedDelayOne) *
      (this.state.configuration.smart_delay_percentage / 100)
    ).toFixed(0);
    return t(
      `form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.overallExplainSmart`,
      {
        autokick_delay: this.state.configuration.autokick_delay,
        smart_delay_percentage: this.state.configuration.smart_delay_percentage,
        example_hours_before: 3,
        example_computed_delay_one: exampleComputedDelayOne,
        example_computed_delay_two: exampleComputedDelayTwo,
      },
    );
  };

  handleDisplayPositionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isDisplayPositionChecked = event.target.checked;
    this.handleChange('display_member_position')(isDisplayPositionChecked);
  };

  renderOrderedForm = () => {
    const { classes, t } = this.props;
    return (
      <div>
        <div className={classes.row}>
          <InfoOutlineIcon className={classes.leftIcon} />
          <Typography color="textSecondary">
            {t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.explain`)}
          </Typography>
        </div>
        <div className={classes.field}>
          <NumericInput
            fullWidth={false}
            helperText={t('form.autokick_delay.helper')}
            InputProps={{
              inputProps: { min: 2, step: 1, max: 100 },
            }}
            label={t('form.autokick_delay.label')}
            onChange={(ev) =>
              this.handleChange('autokick_delay')(parseInt(ev.target.value, 10))
            }
            value={this.state.configuration.autokick_delay}
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
            className={classes.helperText}
            color="textSecondary"
            variant="caption"
          >
            {t('form.auto_consume_pack.helper')}
          </Typography>
        </div>
        <div className={classes.field}>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  this.state.configuration.kick_if_no_pack_when_auto_consume &&
                  this.state.configuration.auto_consume_pack
                }
                disabled={!this.state.configuration.auto_consume_pack}
                onChange={(event) =>
                  this.handleChange('kick_if_no_pack_when_auto_consume')(
                    event.target.checked,
                  )
                }
                value={
                  this.state.configuration.kick_if_no_pack_when_auto_consume
                }
              />
            }
            label={t('form.kick_if_no_pack_when_auto_consume.label')}
          />
          <Typography
            className={classes.helperText}
            color="textSecondary"
            variant="caption"
          >
            {t('form.kick_if_no_pack_when_auto_consume.helper')}
          </Typography>
        </div>
        <div className={classes.field}>
          <NumericInput
            fullWidth={false}
            helperText={t('form.last_delay_before_auto_consume.helper')}
            InputProps={{
              inputProps: { min: 0, step: 1, max: 4 * 60 },
              endAdornment: <InputAdornment position="end">min</InputAdornment>,
            }}
            label={t('form.last_delay_before_auto_consume.label')}
            onChange={(ev) =>
              this.handleChange('last_delay_before_auto_consume')(
                parseInt(ev.target.value, 10),
              )
            }
            value={this.state.configuration.last_delay_before_auto_consume}
          />
        </div>
        <div className={classes.divider} />
        <fieldset className={classes.column}>
          <legend>
            {t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.settingsDelay`)}
          </legend>
          <Alert className={classes.alert} severity="info" variant="outlined">
            {this.generateAlertInfoContent()}
          </Alert>
          <div className={classes.field}>
            <FormControlLabel
              control={
                <Radio
                  aria-label="simple"
                  checked={
                    this.state.configuration.auto_cancellation_type ===
                    WaitingListAutoCancellation.dumb
                  }
                  name="simple"
                  onChange={() =>
                    this.handleChange('auto_cancellation_type')(
                      WaitingListAutoCancellation.dumb,
                    )
                  }
                  value={WaitingListAutoCancellation.dumb}
                />
              }
              label={t('form.dumb_delay_minutes.label')}
            />
            <NumericInput
              disabled={
                this.state.configuration.auto_cancellation_type ===
                WaitingListAutoCancellation.smart
              }
              InputProps={{
                inputProps: { min: 15, step: 1, max: 32000 },
                endAdornment: (
                  <InputAdornment position="end">min</InputAdornment>
                ),
              }}
              onChange={(ev) =>
                this.handleChange('dumb_delay_minutes')(
                  parseInt(ev.target.value, 10),
                )
              }
              value={this.state.configuration.dumb_delay_minutes}
            />
          </div>
          <div className={classes.field}>
            <FormControlLabel
              control={
                <Radio
                  aria-label="smart"
                  checked={
                    this.state.configuration.auto_cancellation_type ===
                    WaitingListAutoCancellation.smart
                  }
                  name="smart"
                  onChange={() =>
                    this.handleChange('auto_cancellation_type')(
                      WaitingListAutoCancellation.smart,
                    )
                  }
                  value={WaitingListAutoCancellation.smart}
                />
              }
              label={t('form.smart_delay_percentage.label')}
            />
            <NumericInput
              disabled={
                this.state.configuration.auto_cancellation_type ===
                WaitingListAutoCancellation.dumb
              }
              fullWidth={false}
              InputProps={{
                inputProps: { min: 10, step: 1, max: 100 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onChange={(ev) =>
                this.handleChange('smart_delay_percentage')(
                  parseInt(ev.target.value, 10),
                )
              }
              value={this.state.configuration.smart_delay_percentage}
            />
          </div>
        </fieldset>
        <div className={classes.field}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.configuration.display_member_position}
                color="primary"
                onChange={this.handleDisplayPositionChange}
                value={this.state.configuration.display_member_position}
              />
            }
            label={t('form.display_member_position.label')}
          />
        </div>
      </div>
    );
  };

  render() {
    const { classes, t } = this.props;
    return (
      <form className={classes.root} onSubmit={this.onSubmit}>
        <FormControl className={classes.formControl} component="fieldset">
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
              className={classes.helperText}
              color="textSecondary"
              variant="caption"
            >
              {t('form.is_option_blocking.helper')}
            </Typography>
          </div>

          <div className={classes.field}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.configuration.check_credit}
                  onChange={(event) =>
                    this.handleChange('check_credit')(event.target.checked)
                  }
                  value={this.state.configuration.check_credit}
                />
              }
              label={t('form.check_credit.label')}
            />
            <Typography
              className={classes.helperText}
              color="textSecondary"
              variant="caption"
            >
              {t('form.check_credit.helper')}
            </Typography>
          </div>

          <FormControl className={classes.field} component="fieldset">
            <FormLabel component="div">{t('form.dynamic.label')}</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              defaultValue="right"
              onChange={(ev) =>
                this.handleChange('dynamic')(parseInt(ev.target.value, 10))
              }
              value={`${this.state.configuration.dynamic}`}
            >
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.label`)}
                labelPlacement="right"
                value={`${WAITING_LIST_DYNAMIC_ORDERED}`}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t(
                  `form.dynamic.${WAITING_LIST_DYNAMIC_UNORDERED}.label`,
                )}
                labelPlacement="right"
                value={`${WAITING_LIST_DYNAMIC_UNORDERED}`}
              />
            </RadioGroup>
          </FormControl>
          <div className={classes.settingsInner}>
            <Collapse
              in={
                this.state.configuration.dynamic ===
                WAITING_LIST_DYNAMIC_ORDERED
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
          </div>
        </FormControl>
        <Button
          color="primary"
          disabled={this.compareStateToProps()}
          type="submit"
          variant="contained"
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
    width: '70%',
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  helperText: {
    marginTop: theme.spacing(-1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  singleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  settingsInner: {
    backgroundColor: '#F3F3F3',
    borderRadius: theme.spacing(2),
    border: '1px solid #F3F3F3',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px ${theme.spacing(
      2,
    )}px`,
    width: '100%',
  },
  alert: {
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['waitingList']),
)(WaitingListConfigurationForm);

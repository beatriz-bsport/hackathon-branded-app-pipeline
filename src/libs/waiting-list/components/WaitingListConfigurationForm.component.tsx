import React, { Component } from 'react';

import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';

import createStyles from '@material-ui/core/styles/createStyles';
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
import { withFormik, FormikProps, Form } from 'formik';
import type { Theme, WithStyles } from '@material-ui/core/styles/';
import NumericInput from '#components/input/NumericInput.component';

import {
  WaitingListConfiguration,
  WaitingListAutoCancellation,
} from '#libs/waiting-list/types';

type FormikValues = {
  autoCancellationType: WaitingListAutoCancellation;
  autoConsumePack: boolean;
  autokickDelay: number;
  checkCredit: boolean;
  displayMemberPosition: boolean;
  dumbDelayMinutes: number;
  dynamic: number;
  isOptionBlocking: boolean;
  kickIfNoPackWhenAutoConsume: boolean;
  lastDelayBeforeAutoConsume: number;
  smartDelayPercentage: number;
};

type OwnProps = {
  configuration: WaitingListConfiguration;
  onSubmit: (data: WaitingListConfiguration) => void;
};

type OuterProps = FormikProps<FormikValues> &
  WithStyles<typeof styles> &
  WithTranslation;

type Props = OwnProps & OuterProps;

export class WaitingListConfigurationForm extends Component<Props> {
  handleChange = (field: string) => (value: any) => {
    this.props.setFieldValue(field, value);
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
      this.props.values.autoCancellationType ===
      WaitingListAutoCancellation.dumb
    ) {
      return t(
        `form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.overallExplainSimple`,
        {
          autokick_delay: this.props.values.autokickDelay,
          dumb_delay_minutes: this.props.values.dumbDelayMinutes,
        },
      );
    }
    const exampleHoursBefore = 3;
    const exampleComputedDelayOne = (
      exampleHoursBefore *
      60 *
      (this.props.values.smartDelayPercentage / 100)
    ).toFixed(0);
    const exampleComputedDelayTwo = (
      (exampleHoursBefore * 60 - parseInt(exampleComputedDelayOne)) *
      (this.props.values.smartDelayPercentage / 100)
    ).toFixed(0);
    return t(
      `form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.overallExplainSmart`,
      {
        autokick_delay: this.props.values.autokickDelay,
        smart_delay_percentage: this.props.values.smartDelayPercentage,
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
    this.handleChange('displayMemberPosition')(isDisplayPositionChecked);
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
            error={!!this.props.errors.autokickDelay}
            fullWidth={false}
            helperText={t('form.autokick_delay.helper')}
            InputProps={{
              inputProps: { min: 2, step: 1, max: 100 },
            }}
            label={t('form.autokick_delay.label')}
            onChange={(ev) =>
              this.handleChange('autokickDelay')(parseInt(ev.target.value, 10))
            }
            value={this.props.values.autokickDelay}
          />
        </div>
        <div className={classes.field}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.props.values.autoConsumePack}
                onChange={(event) =>
                  this.handleChange('autoConsumePack')(event.target.checked)
                }
                value={this.props.values.autoConsumePack}
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
                  this.props.values.kickIfNoPackWhenAutoConsume &&
                  this.props.values.autoConsumePack
                }
                disabled={!this.props.values.autoConsumePack}
                onChange={(event) =>
                  this.handleChange('kickIfNoPackWhenAutoConsume')(
                    event.target.checked,
                  )
                }
                value={this.props.values.kickIfNoPackWhenAutoConsume}
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
            error={!!this.props.errors.lastDelayBeforeAutoConsume}
            fullWidth={false}
            helperText={t('form.last_delay_before_auto_consume.helper')}
            InputProps={{
              inputProps: { min: 0, step: 1, max: 4 * 60 },
              endAdornment: <InputAdornment position="end">min</InputAdornment>,
            }}
            label={t('form.last_delay_before_auto_consume.label')}
            onChange={(ev) =>
              this.handleChange('lastDelayBeforeAutoConsume')(
                parseInt(ev.target.value, 10),
              )
            }
            value={this.props.values.lastDelayBeforeAutoConsume}
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
                    this.props.values.autoCancellationType ===
                    WaitingListAutoCancellation.dumb
                  }
                  name="simple"
                  onChange={() =>
                    this.handleChange('autoCancellationType')(
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
                this.props.values.autoCancellationType ===
                WaitingListAutoCancellation.smart
              }
              error={!!this.props.errors.dumbDelayMinutes}
              InputProps={{
                inputProps: { min: 15, step: 1, max: 32000 },
                endAdornment: (
                  <InputAdornment position="end">min</InputAdornment>
                ),
              }}
              onChange={(ev) =>
                this.handleChange('dumbDelayMinutes')(
                  parseInt(ev.target.value, 10),
                )
              }
              value={this.props.values.dumbDelayMinutes}
            />
          </div>
          <div className={classes.field}>
            <FormControlLabel
              control={
                <Radio
                  aria-label="smart"
                  checked={
                    this.props.values.autoCancellationType ===
                    WaitingListAutoCancellation.smart
                  }
                  name="smart"
                  onChange={() =>
                    this.handleChange('autoCancellationType')(
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
                this.props.values.autoCancellationType ===
                WaitingListAutoCancellation.dumb
              }
              error={!!this.props.errors.smartDelayPercentage}
              fullWidth={false}
              InputProps={{
                inputProps: { min: 10, step: 1, max: 100 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onChange={(ev) =>
                this.handleChange('smartDelayPercentage')(
                  parseInt(ev.target.value, 10),
                )
              }
              value={this.props.values.smartDelayPercentage}
            />
          </div>
        </fieldset>
        <div className={classes.field}>
          <FormControlLabel
            control={
              <Switch
                checked={this.props.values.displayMemberPosition}
                color="primary"
                onChange={this.handleDisplayPositionChange}
                value={this.props.values.displayMemberPosition}
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
      <Form className={classes.root}>
        <FormControl className={classes.formControl} component="fieldset">
          <div className={classes.field}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.values.isOptionBlocking}
                  onChange={(event) =>
                    this.handleChange('isOptionBlocking')(event.target.checked)
                  }
                  value={this.props.values.isOptionBlocking}
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
                  checked={this.props.values.checkCredit}
                  onChange={(event) =>
                    this.handleChange('checkCredit')(event.target.checked)
                  }
                  value={this.props.values.checkCredit}
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
              value={`${this.props.values.dynamic}`}
            >
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t(`form.dynamic.${WAITING_LIST_DYNAMIC_ORDERED}.label`)}
                value={`${WAITING_LIST_DYNAMIC_ORDERED}`}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t(
                  `form.dynamic.${WAITING_LIST_DYNAMIC_UNORDERED}.label`,
                )}
                value={`${WAITING_LIST_DYNAMIC_UNORDERED}`}
              />
            </RadioGroup>
          </FormControl>
          <div className={classes.settingsInner}>
            <Collapse
              in={this.props.values.dynamic === WAITING_LIST_DYNAMIC_ORDERED}
            >
              {this.renderOrderedForm()}
            </Collapse>
            <Collapse
              in={this.props.values.dynamic === WAITING_LIST_DYNAMIC_UNORDERED}
            >
              {this.renderUnorderedForm()}
            </Collapse>
          </div>
        </FormControl>
        <Button
          color="primary"
          disabled={!this.props.dirty || this.props.isSubmitting}
          type="submit"
          variant="contained"
        >
          {t('form.submit')}
        </Button>
      </Form>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
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
export default compose<OwnProps, OuterProps>(
  withFormik<Props, FormikValues>({
    enableReinitialize: true,
    mapPropsToValues: ({ configuration }) => {
      const {
        auto_cancellation_type: autoCancellationType,
        auto_consume_pack: autoConsumePack,
        autokick_delay: autokickDelay,
        check_credit: checkCredit,
        display_member_position: displayMemberPosition,
        dumb_delay_minutes: dumbDelayMinutes,
        dynamic,
        is_option_blocking: isOptionBlocking,
        kick_if_no_pack_when_auto_consume: kickIfNoPackWhenAutoConsume,
        last_delay_before_auto_consume: lastDelayBeforeAutoConsume,
        smart_delay_percentage: smartDelayPercentage,
      } = configuration;
      return {
        autoCancellationType,
        autoConsumePack,
        autokickDelay,
        checkCredit,
        displayMemberPosition,
        dumbDelayMinutes,
        dynamic,
        isOptionBlocking,
        kickIfNoPackWhenAutoConsume,
        lastDelayBeforeAutoConsume,
        smartDelayPercentage,
      };
    },
    handleSubmit: (values, { props: { onSubmit, configuration } }) => {
      const sanitizedConfiguration = {
        ...configuration,
        auto_cancellation_type: values.autoCancellationType,
        auto_consume_pack: values.autoConsumePack,
        autokick_delay: values.autokickDelay,
        check_credit: values.checkCredit,
        display_member_position: values.displayMemberPosition,
        dumb_delay_minutes: values.dumbDelayMinutes,
        dynamic: values.dynamic,
        is_option_blocking: values.isOptionBlocking,
        kick_if_no_pack_when_auto_consume: values.kickIfNoPackWhenAutoConsume,
        last_delay_before_auto_consume: values.lastDelayBeforeAutoConsume,
        smart_delay_percentage: values.smartDelayPercentage,
      };
      onSubmit(sanitizedConfiguration);
    },
  }),
  withStyles(styles),
  withTranslation('waitingList'),
)(React.memo(WaitingListConfigurationForm));

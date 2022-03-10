// @flow
import React from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AttachIcon from '@material-ui/icons/Attachment';
import { withTranslation, TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import WarningIcon from '@material-ui/icons/Warning';
import Switch from '@material-ui/core/Switch';
import NumberInput from '../../../components/input/NumericInput.component';
import ThemeInternalAccountForm from '#libs/theme/components/ThemeInternalAccountForm.component';
import ProvincialTaxForm from '../../theme/components/ProvincialTax.form';
import TaxDisplayForm from '../../theme/components/TaxDisplay.form';

type Props = {
  classes: any,
  t: TFunction,
  configuration: {
    stripe_footer: string,
    show_company_email_in_invoice: boolean,
    nb_retries_subscription_payments: number,
    disable_pass_on_fail_subscription_payment: boolean,
    revert_bookings_on_fail_subscription_payment: boolean,
    advance_sepa_billing: boolean,
  },
  processing: boolean,
  onSubmit: (data: any) => void,
  theme: CompanyTheme,
  submitTheme: (company_id: number, data: any) => void,
  goToReports: () => void,
  patchTheme: (data: FormData, options?: OptionCallback) => void,
};

type State = {
  stripe_footer: string,
  activateSmartRetries: boolean,
  show_company_email_in_invoice: boolean,
  nb_retries_subscription_payments: number,
  disable_pass_on_fail_subscription_payment: boolean,
  revert_bookings_on_fail_subscription_payment: boolean,
  advance_sepa_billing: boolean,
};

export class InvoiceConfigurationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stripe_footer: props.configuration.stripe_footer,
      show_company_email_in_invoice:
        props.configuration.show_company_email_in_invoice,
      activateSmartRetries:
        props.configuration.nb_retries_subscription_payments > 0,
      nb_retries_subscription_payments:
        props.configuration.nb_retries_subscription_payments,
      disable_pass_on_fail_subscription_payment:
        props.configuration.disable_pass_on_fail_subscription_payment,
      revert_bookings_on_fail_subscription_payment:
        props.configuration.revert_bookings_on_fail_subscription_payment,
      advance_sepa_billing: props.configuration.advance_sepa_billing,
    };
  }

  render() {
    const { classes, t } = this.props;
    return (
      <div>
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <Typography variant="h6" component="h3">
              {t('configuration.subscription.title')}
            </Typography>
          </div>
          <div className={classes.inputContainer}>
            <Switch
              checked={this.state.activateSmartRetries}
              onChange={(ev) => {
                if (ev.target.checked) {
                  this.setState({
                    activateSmartRetries: true,
                  });
                } else {
                  this.setState({
                    activateSmartRetries: false,
                    nb_retries_subscription_payments: 0,
                  });
                }
              }}
            />
            <Typography>
              {t('configuration.subscription.forms.activateSmartRetries.label')}
            </Typography>
          </div>
          <div className={classes.helperTextContainer}>
            <Typography variant="caption">
              {t(
                'configuration.subscription.forms.activateSmartRetries.helperText',
              )}
            </Typography>
          </div>
          <NumberInput
            fullWidth
            variant="outlined"
            multiline
            disabled={!this.state.activateSmartRetries}
            InputProps={{
              step: 1,
              min: 0,
              max: 5,
            }}
            helperText={t(
              'configuration.subscription.forms.nbRetriesSubscriptionPayments.helperText',
            )}
            label={t(
              'configuration.subscription.forms.nbRetriesSubscriptionPayments.label',
            )}
            onBlur={() =>
              this.setState((prevState) => ({
                nb_retries_subscription_payments: Math.min(
                  parseInt(prevState.nb_retries_subscription_payments, 10),
                  5,
                ),
              }))
            }
            onChange={(ev) =>
              this.setState({
                nb_retries_subscription_payments: ev.target.value,
              })
            }
            value={this.state.nb_retries_subscription_payments}
          />
          <div className={classes.inputContainer}>
            <Switch
              checked={this.state.disable_pass_on_fail_subscription_payment}
              onChange={(ev) => {
                const c = ev.target.checked;
                this.setState((prevState) => ({
                  disable_pass_on_fail_subscription_payment: c,
                  revert_bookings_on_fail_subscription_payment: c
                    ? prevState.revert_bookings_on_fail_subscription_payment
                    : false,
                }));
              }}
            />
            <Typography>
              {t(
                'configuration.subscription.forms.disable_pass_on_fail_subscription_payment.label',
              )}
            </Typography>
          </div>
          <div className={classes.helperTextContainer}>
            <Typography variant="caption">
              {t(
                'configuration.subscription.forms.disable_pass_on_fail_subscription_payment.helperText',
              )}
            </Typography>
          </div>
          <div className={classes.inputContainer}>
            <Switch
              disabled={!this.state.disable_pass_on_fail_subscription_payment}
              checked={this.state.revert_bookings_on_fail_subscription_payment}
              onChange={(ev) => {
                this.setState({
                  revert_bookings_on_fail_subscription_payment:
                    ev.target.checked,
                });
              }}
            />
            <Typography
              color={
                this.state.disable_pass_on_fail_subscription_payment
                  ? 'default'
                  : 'textSecondary'
              }
            >
              {t(
                'configuration.subscription.forms.revert_bookings_on_fail_subscription_payment.label',
              )}
            </Typography>
          </div>
          <div className={classes.helperTextContainer}>
            <Typography
              variant="caption"
              color={
                this.state.disable_pass_on_fail_subscription_payment
                  ? 'default'
                  : 'textSecondary'
              }
            >
              {t(
                'configuration.subscription.forms.revert_bookings_on_fail_subscription_payment.helperText',
              )}
            </Typography>
          </div>
          <Collapse
            in={this.state.revert_bookings_on_fail_subscription_payment}
          >
            <div className={classes.warningContainer}>
              <WarningIcon color="error" fontSize="small" />
              <Typography
                variant="caption"
                color={
                  this.state.revert_bookings_on_fail_subscription_payment
                    ? 'default'
                    : 'textSecondary'
                }
              >
                {t(
                  'configuration.subscription.forms.revert_bookings_on_fail_subscription_payment.warning',
                )}
              </Typography>
            </div>
          </Collapse>
          <div className={classes.inputContainer}>
            <Switch
              checked={this.state.advance_sepa_billing}
              onChange={(ev) => {
                this.setState({
                  advance_sepa_billing: ev.target.checked,
                });
              }}
            />
            <Typography
              color={
                this.state.advance_sepa_billing ? 'default' : 'textSecondary'
              }
            >
              {t('configuration.subscription.forms.advance_sepa_billing.label')}
            </Typography>
          </div>
          <div className={classes.helperTextContainer}>
            <Typography variant="caption" color="textSecondary">
              {t(
                'configuration.subscription.forms.advance_sepa_billing.helperText',
              )}
            </Typography>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                this.props.onSubmit({
                  disable_pass_on_fail_subscription_payment:
                    this.state.disable_pass_on_fail_subscription_payment,
                  revert_bookings_on_fail_subscription_payment:
                    this.state.revert_bookings_on_fail_subscription_payment,
                  nb_retries_subscription_payments:
                    this.state.nb_retries_subscription_payments,
                  advance_sepa_billing: this.state.advance_sepa_billing,
                })
              }
              disabled={
                (this.props.configuration.nb_retries_subscription_payments ===
                  parseInt(this.state.nb_retries_subscription_payments, 10) &&
                  this.props.configuration
                    .disable_pass_on_fail_subscription_payment ===
                    this.state.disable_pass_on_fail_subscription_payment &&
                  this.props.configuration.advance_sepa_billing ===
                    this.state.advance_sepa_billing &&
                  this.props.configuration
                    .revert_bookings_on_fail_subscription_payment ===
                    this.state.revert_bookings_on_fail_subscription_payment) ||
                this.props.processing
              }
            >
              {t('configuration.submit_stripe_footer')}
            </Button>
            {this.props.processing ? (
              <CircularProgress style={{ marginLeft: 12 }} size={20} />
            ) : null}
          </div>
        </Paper>
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <Typography variant="h6" component="h3">
              {t('configuration.invoiceGeneral')}
            </Typography>
          </div>
          <div className={classes.inputContainer}>
            <Checkbox
              checked={this.state.show_company_email_in_invoice}
              onChange={(ev) => {
                const c = ev.target.checked;
                this.setState({ show_company_email_in_invoice: c });
              }}
            />
            <Typography>
              {t('configuration.forms.show_company_email_in_invoice')}
            </Typography>
          </div>
          <div className={classes.header}>
            <Typography variant="h6" component="h3">
              {t('configuration.stripe_footer')}
            </Typography>
          </div>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('configuration.forms.stripe_footer_placeholder')}
            multiline
            maxLength="4800"
            helperText={t('configuration.explainStripeFooter')}
            onChange={(ev) => this.setState({ stripe_footer: ev.target.value })}
            value={this.state.stripe_footer}
          />
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                this.props.onSubmit({
                  stripe_footer: this.state.stripe_footer,
                  show_company_email_in_invoice:
                    this.state.show_company_email_in_invoice,
                })
              }
              disabled={
                (this.props.configuration.show_company_email_in_invoice ===
                  this.state.show_company_email_in_invoice &&
                  this.props.configuration.stripe_footer ===
                    this.state.stripe_footer) ||
                this.props.processing
              }
            >
              {t('configuration.submit_stripe_footer')}
            </Button>
            {this.props.processing ? (
              <CircularProgress style={{ marginLeft: 12 }} size={20} />
            ) : null}
          </div>
        </Paper>
        <div className={classes.content}>
          <TaxDisplayForm
            initial={{
              is_tax_excluded_in_marketplace:
                this.props.theme?.is_tax_excluded_in_marketplace,
            }}
            submit={this.props.patchTheme}
          />
        </div>
        {this.props.theme?.locale.split('_')[1] === 'CA' && (
          <div className={classes.content}>
            <ProvincialTaxForm
              initial={{
                name: this.props.theme?.provincial_tax_name,
                value: this.props.theme?.provincial_tax_value,
              }}
              submit={this.props.patchTheme}
            />
          </div>
        )}
        <ThemeInternalAccountForm
          theme={this.props.theme}
          onSubmit={this.props.submitTheme}
          goToReports={this.props.goToReports}
        />
        <Paper className={classes.paper}>
          <div className={classes.header}>
            <Typography variant="h6" component="h3">
              {t('configuration.nf525')}
            </Typography>
          </div>
          <div className={classes.content}>
            <Typography>{t('configuration.nf525Explain')}</Typography>
          </div>
          <Button
            component="a"
            variant="outlined"
            href="https://cdn.bsport.io/assets/docs/NF525-29-04-2020.pdf"
          >
            <AttachIcon className={classes.leftIcon} />
            {t('configuration.nf525Button')}
          </Button>
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  content: {
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  helperTextContainer: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(2),
  },
  warningContainer: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(2),
    display: 'flex',
    border: '1px solid red',
    borderRadius: 8,
    padding: theme.spacing(1),
    backgroundColor: 'rgba(255, 50, 0, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
});

export default compose(
  withTranslation(['invoice']),
  withStyles(styles),
)(InvoiceConfigurationForm);

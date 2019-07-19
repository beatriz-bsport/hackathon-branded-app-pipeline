// @flow
import React from 'react';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Tooltip from '../../../components/Tooltip.component';

type Props = {
  classes: *,
  t: TFunction,
  configuration: {
    stripe_footer: string,
  },
  processing: boolean,
  onSubmit: (*) => void,
};

type State = {
  stripe_footer: string,
};

export class InvoiceConfigurationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stripe_footer: props.configuration.stripe_footer,
    };
  }

  render() {
    const { classes, t } = this.props;
    return (
      <div>
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
              })
            }
            disabled={
              this.props.configuration.stripe_footer ===
                this.state.stripe_footer || this.props.processing
            }
          >
            {t('configuration.submit_stripe_footer')}
          </Button>
          {this.props.processing ? (
            <CircularProgress style={{ marginLeft: 12 }} size={20} />
          ) : null}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['invoice']),
  withStyles(styles),
)(InvoiceConfigurationForm);

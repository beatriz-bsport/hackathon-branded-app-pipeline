// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT } from '@bsport/common/lib/master-data/payment-methods';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import AcceptTermsAndConditions from './AcceptTermsAndConditions.component';

type Props = {
  termsAndConditions: string,
  setTermsAccepted: (boolean) => void,
  termsAccepted: boolean,
  loading: boolean,
  onCancel: () => void,
  submitPayment: (data: any, options: OptionCallback) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  processing: boolean,
};

export class PaymentByCredit extends React.Component<Props, State> {
  state = {
    processing: false,
  };

  render() {
    return (
      <div>
        {this.state.processing ? (
          <div className={this.props.classes.loading}>
            <CircularProgress />
          </div>
        ) : (
          <Typography
            align="center"
            color="textSecondary"
            className={this.props.classes.explainText}
          >
            {this.props.t('forms.credit.explain')}
          </Typography>
        )}
        {this.props.termsAndConditions ? (
          <AcceptTermsAndConditions
            accepted={this.props.termsAccepted}
            onChecked={(termsAccepted) =>
              this.props.setTermsAccepted(termsAccepted)
            }
            termsAndConditions={this.props.termsAndConditions}
            type="theTermsAndConditions"
          />
        ) : null}
        <div className={this.props.classes.buttonContainer}>
          <Button
            onClick={this.props.onCancel}
            disabled={this.props.loading || this.state.processing}
          >
            {this.props.t('forms.cancelPayment')}
          </Button>
          <Button
            onClick={() => {
              this.setState({ processing: true });
              this.props.submitPayment(
                {
                  payment_method: PAYMENT_METHOD_CREDIT_ACCOUNT.id,
                },
                {
                  onSuccess: () => this.setState({ processing: false }),
                  onError: (err) => {
                    console.error(err);
                    this.setState({
                      processing: false,
                    });
                  },
                },
              );
            }}
            color="primary"
            variant="contained"
            disabled={
              (!this.props.termsAccepted && this.props.termsAndConditions) ||
              this.props.loading ||
              this.state.processing
            }
          >
            {this.props.t('forms.credit.pay')}
          </Button>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  explainText: {
    marginTop: theme.spacing(2),
    border: '2px solid #efefef',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  loading: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  buttonContainer: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default compose(
  withTranslation(['payment']),
  withStyles(styles),
  withState('termsAccepted', 'setTermsAccepted', false),
)(PaymentByCredit);

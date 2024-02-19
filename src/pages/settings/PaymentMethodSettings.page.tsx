import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withStyles, Theme, Paper } from '@material-ui/core';

import { MaterialStyleType } from '../../utils/types';
import { RootState } from '../../reducers';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import { updateCompanyTheme } from '#libs/theme/actions';
import { snackbarError, snackbarSuccess } from '#libs/snackbar/actions';
import type { PaymentMethodsFormValues } from '#libs/settings/components/PaymentMethodsForm/PaymentMethodsForm.component';
import PaymentMethodsForm from '#libs/settings/components/PaymentMethodsForm';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

class PaymentMethodSettings extends React.PureComponent<Props> {
  onSubmit = (values: PaymentMethodsFormValues) => {
    this.props.updateCompanyTheme(this.props.theme.company, values, {
      onSuccess: () => this.props.snackbarSuccess('dashboard.save.success'),
      onError: () => this.props.snackbarError('dashboard.save.error'),
    });
  };

  render() {
    const { classes } = this.props;
    if (this.props.loading) {
      return (
        <div className={classes.container}>
          <BackofficeLinearProgress />
        </div>
      );
    }

    let payment_method_available_basket: number[] = [];
    let payment_method_available_subscription: number[] = [];
    if (
      this.props.theme &&
      this.props.theme.payment_method_available_basket &&
      this.props.theme.payment_method_available_subscription
    ) {
      payment_method_available_basket =
        this.props.theme.payment_method_available_basket;

      payment_method_available_subscription =
        this.props.theme.payment_method_available_subscription;
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.container}>
          <PaymentMethodsForm
            cardBillingDetailsMandatory={
              this.props.theme.force_billing_details_on_cards
            }
            first_warning_payment_method_expiration_days={parseInt(
              this.props.theme.first_warning_payment_method_expiration_days,
            )}
            onSubmit={this.onSubmit}
            payment_method_available={this.props.theme.payment_method_available}
            payment_method_available_basket={payment_method_available_basket}
            payment_method_available_recurringly={
              this.props.theme.payment_method_available_recurringly
            }
            payment_method_available_subscription={
              payment_method_available_subscription
            }
            second_warning_payment_method_expiration_days={parseInt(
              this.props.theme.second_warning_payment_method_expiration_days,
            )}
            updateLoading={this.props.updateLoading}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme,
  loading: state.theme.loading,
  updateLoading: state.theme.createOrUpdate.loading,
});

const mapDispatchToProps = {
  updateCompanyTheme,
  snackbarSuccess,
  snackbarError,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  React.memo,
)(PaymentMethodSettings);

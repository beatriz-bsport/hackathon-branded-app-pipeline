import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import InfoOutlineIcon from '@material-ui/icons/Info';
import { WithTranslation, withTranslation } from 'react-i18next';
import {
  withStyles,
  Theme,
  Paper,
  LinearProgress,
  Typography,
  Button,
} from '@material-ui/core';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';

import { MaterialStyleType } from '../../../utils/types';
import { RootState } from '../../../reducers';
import BackofficeLinearProgress from '../../../components/navigation/BackofficeLinearProgress.component';
import PaymentMethodMultiSelector from '../../../libs/payment/components/PaymentMethodMultiSelector.component';
import { updateCompanyTheme } from '../../../libs/theme/actions';
import {
  snackbarError,
  snackbarSuccess,
} from '../../../actions/snackbar.actions';

type OwnProps = {};

type Props = OwnProps &
  WithTranslation &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  payment_method_available_basket: number[];
  payment_method_available_subscription: number[];
  subscriptionError: boolean;
};

class PaymentMethodSettings extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const state: State = {
      payment_method_available_basket: [],
      payment_method_available_subscription: [],
      subscriptionError: false,
    };

    if (
      props.theme &&
      props.theme.payment_method_available_basket &&
      props.theme.payment_method_available_subscription
    ) {
      state.payment_method_available_basket =
        props.theme.payment_method_available_basket;

      state.payment_method_available_subscription =
        props.theme.payment_method_available_subscription;
    }

    this.state = state;
  }

  componentDidUpdate(prevProps: Props) {
    const themeChanged =
      prevProps.theme !== this.props.theme && this.props.theme;
    const basketMethodChanged =
      this.props.theme &&
      prevProps.theme.payment_method_available_basket !==
        this.props.theme.payment_method_available_basket;
    const subscriptionMethodChanged =
      this.props.theme &&
      prevProps.theme.payment_method_available_subscription !==
        this.props.theme.payment_method_available_subscription;

    if (
      (themeChanged || basketMethodChanged || subscriptionMethodChanged) &&
      this.props.theme.payment_method_available_basket &&
      this.props.theme.payment_method_available_subscription
    ) {
      this.setState({
        payment_method_available_basket: this.props.theme
          .payment_method_available_basket,
        payment_method_available_subscription: this.props.theme
          .payment_method_available_subscription,
      });
    }
  }

  addOrRemove = (arr: number[], v: number) => {
    const _arr = [...arr];
    const index = _arr.indexOf(v);
    index === -1 ? _arr.push(v) : _arr.splice(index, 1);
    if (!_arr.length) {
      return arr;
    }
    return _arr;
  };

  onBasketMethodChange = (id: number) => {
    this.setState((prevState: State) => {
      const payment_method_available_basket = this.addOrRemove(
        prevState.payment_method_available_basket,
        id,
      );

      return {
        payment_method_available_basket,
      };
    });
  };

  onSubscriptionMethodsChange = (id: number) => {
    this.setState((prevState: State) => {
      const payment_method_available_subscription = this.addOrRemove(
        prevState.payment_method_available_subscription,
        id,
      );

      return {
        payment_method_available_subscription,
      };
    });
  };

  onClickSave = () => {
    this.setState((prevState: State) => ({
      subscriptionError: !prevState.payment_method_available_subscription
        .length,
    }));

    if (!this.state.payment_method_available_subscription.length) {
      return;
    }

    this.props.updateCompanyTheme(
      this.props.theme.company,
      {
        payment_method_available_basket: this.state
          .payment_method_available_basket,
        payment_method_available_subscription: this.state
          .payment_method_available_subscription,
      },
      {
        onSuccess: () => this.props.snackbarSuccess('dashboard.save.success'),
        onError: () => this.props.snackbarError('dashboard.save.error'),
      },
    );
  };

  render() {
    const { classes, t } = this.props;

    if (this.props.loading) {
      return (
        <div className={classes.container}>
          <BackofficeLinearProgress />
        </div>
      );
    }

    const {
      payment_method_available_basket,
      payment_method_available_subscription,
    } = this.state;

    return (
      <div className={classes.container}>
        <Paper className={classes.container}>
          <div>
            <Typography className={classes.title} variant="h5">
              {t('paymentMethods.title')}
            </Typography>
            <Typography color="textSecondary">
              {t('paymentMethods.subtitle')}
            </Typography>
            <Typography color="textSecondary">
              {t('paymentMethods.subtitle2')}
            </Typography>

            <div className={classes.basketContainer}>
              <Typography variant="h6">
                {t('paymentMethods.methodPaymentBasket')}
              </Typography>
              <div className={classes.row}>
                <InfoOutlineIcon className={classes.leftIcon} />
                <Typography color="textSecondary" variant="body2">
                  {t('paymentMethods.methodPaymentBasketHelper')}
                </Typography>
              </div>
              <div className={classes.selectorContainer}>
                <PaymentMethodMultiSelector
                  paymentMethodsSelected={payment_method_available_basket}
                  paymentMethodChoices={
                    this.props.theme.payment_method_available
                  }
                  selectPaymentMethod={this.onBasketMethodChange}
                  disabled={[PAYMENT_GROUP_METHOD_IDENTIFIER_CB]}
                />
              </div>
            </div>

            <div className={classes.subscriptionContainer}>
              <Typography variant="h6">
                {t('paymentMethods.methodPaymentSubscription')}
              </Typography>
              <div className={classes.row}>
                <InfoOutlineIcon className={classes.leftIcon} />
                <Typography color="textSecondary" variant="body2">
                  {t('paymentMethods.methodPaymentSubscriptionHelper')}
                </Typography>
              </div>
              <div className={classes.selectorContainer}>
                <PaymentMethodMultiSelector
                  paymentMethodsSelected={payment_method_available_subscription}
                  paymentMethodChoices={[
                    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
                    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
                  ]}
                  selectPaymentMethod={this.onSubscriptionMethodsChange}
                />
                {this.state.subscriptionError && (
                  <Typography color="error">
                    {t('paymentMethods.methodPaymentSubscriptionError')}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </Paper>

        {this.props.updateLoading && (
          <LinearProgress className={classes.fullWidth} />
        )}

        <div className={classes.saveButtonContainer}>
          <Button
            onClick={this.onClickSave}
            variant="contained"
            color="primary"
            disabled={this.props.updateLoading}
          >
            {t('paymentMethods.save')}
          </Button>
        </div>
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
  fullWidth: {
    width: '100%',
  },
  basketContainer: {
    marginTop: theme.spacing(2),
  },
  subscriptionContainer: {
    marginTop: theme.spacing(2),
  },
  saveButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: theme.spacing(2),
  },
  selectorContainer: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(-1),
  },
  leftIcon: {
    margin: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(2),
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
  withTranslation(['settings']),
  connect(mapStateToProps, mapDispatchToProps),
)(PaymentMethodSettings);

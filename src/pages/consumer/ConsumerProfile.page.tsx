// @flow
import React from 'react';
import { compose, withState, withHandlers, withProps } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme } from '@material-ui/core';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import { RootState } from '../../reducers';
import { WithHandlerType } from '../../utils/types';
import WidgetUtils from '../../libs/widget/WidgetUtils';
import MemberSummaryCard from '../../libs/member/components/MemberSummaryCard.component';
import MemberPaymentMethodPanel from '../../libs/member/components/MemberPaymentMethodPanel.component';
import CustomFormView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
import CustomFormViewDialog from '../../libs/custom-form/components/consumer-form/CustomFormViewDialog.component';
import {
  fetchMember as fetchMemberAction,
  fetchMyUserProfile,
} from '../../libs/member/actions';

import {
  fetchPaymentMethodList,
  detachPaymentMethod,
} from '../../libs/payment/actions';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';
import themeSelectors from '../../libs/theme/selectors';

import { getMemberDetail } from '../../libs/member/selectors';

import type { Membership } from '../../libs/membership/types';

import {
  snackbarWarning,
  snackbarSuccess,
} from '../../actions/snackbar.actions';
import {
  fetchCompanyCustomMemberForm,
  submitCustomForm,
} from '../../libs/custom-form/actions';
import {
  getMemberCustomFormWithEnabledField,
  showVaccinationStatus,
  withMemberProfileData,
} from '../../libs/custom-form/selectors';
import { disconnect } from '../../actions/auth.actions';
import type { OptionCallback } from '../../state/types';
import withQueryParams from '../../hocs/with-query-params.hoc';
import AddPaymentMethod from '#libs/payment/components/AddPaymentMethod.component';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#libs/payment/api';
import PaymentModal from '#libs/payment/components/PaymentModal.component';

type RouterProps = {
  membership: Membership;
  isAddPaymentMethodDialogOpen: boolean;
  setQueryParams: (queryParam: string) => (value: boolean | null) => void;
};
type StateProps = {
  editMember: boolean;
  setEditMember: (editMember: boolean) => void;
};
type Props = StateProps &
  RouterProps &
  ConnectedProps<typeof connector> &
  WithHandlerType<typeof mapWithHandler> &
  WithStyles<typeof styles>;
type State = {
  paymentMethodType: string;
};
export class ConsumerProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paymentMethodType:
        this.props.theme.currency === 'eur' ? 'sepa_debit' : 'card',
    };
  }

  componentDidMount() {
    if (this.props.membership) {
      this.fetchData();
    }
  }

  fetchData = () => {
    this.props.fetchMember(this.props.membership.id);
    this.props.fetchMemberPaymentMethod();
    this.props.fetchCompanyCustomMemberForm({
      company: this.props.membership.company,
    });
    this.props.fetchMyUserProfile();
  };

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.membership && this.props.membership) {
      this.fetchData();
    }
  }

  openAddPaymentMethodDialog = (open?: boolean) => {
    this.props.setQueryParams('isAddPaymentMethodDialogOpen')(
      open ? true : null,
    );
  };

  submitCustomForm = (formdata: FormData, options?: OptionCallback) => {
    this.props.submitCustomForm(formdata, this.props.membership.company, {
      onSuccess: () => {
        this.props.setEditMember(false);
        this.props.fetchMember(this.props.membership.id);
        this.props.fetchMyUserProfile();
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  requestSetupIntentSecret = () => {
    return requestSetupIntentSecretAPI(this.props.membership.id, null);
  };

  changePaymentMethodType = (value: string) => {
    this.setState({ paymentMethodType: value });
  };

  render() {
    const { classes } = this.props;
    if (!this.props.membership) {
      return (
        <Grid container className={classes.flexGrid} spacing={2}>
          <Grid item xs={12} md={6}>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid container className={classes.flexGrid} spacing={2}>
        <Grid item xs={12} md={6}>
          <MemberSummaryCard
            member={this.props.member}
            hideContactButton
            editMember={() => this.props.setEditMember(true)}
            showVaccinationStatus={this.props.showVaccinationStatus}
          />
        </Grid>

        <CustomFormViewDialog
          isWidget={WidgetUtils.isWidget()}
          open={this.props.editMember}
          maxWidth="md"
          fullWidth
        >
          <div className={classes.customFormContainer}>
            {this.props.memberCustomForm && (
              <CustomFormView
                initial={this.props.memberCustomForm}
                onSubmit={this.submitCustomForm}
                layouts={this.props.memberCustomForm.layout}
                waiver={this.props.theme.waiver}
                general_terms_and_conditions={
                  this.props.theme.general_terms_of_use
                }
                onCancel={() => this.props.setEditMember(false)}
                textButtonConfirm
              />
            )}
          </div>
        </CustomFormViewDialog>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paymentContainer}>
            <MemberPaymentMethodPanel
              paymentMethod={this.props.paymentMethod}
              paymentMethodLoading={this.props.paymentMethodLoading}
              detachPaymentMethod={this.props.detachPaymentMethod}
              detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
              openAddPaymentMethodDialog={this.openAddPaymentMethodDialog}
            />
          </Paper>
        </Grid>
        {this.props.membership?.id && (
          <PaymentModal isOpen={this.props.isAddPaymentMethodDialogOpen}>
            <AddPaymentMethod
              onCancel={() => this.openAddPaymentMethodDialog(false)}
              requestSetupIntentSecret={this.requestSetupIntentSecret}
              refreshSavedPaymentMethodList={
                this.props.fetchMemberPaymentMethod
              }
              paymentMethodType={this.state.paymentMethodType}
              enabledPaymentMethods={[
                BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
                ...(this.props.theme.currency === 'eur'
                  ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA]
                  : []),
              ]}
              onChange={this.changePaymentMethodType}
              disabled={false}
              sepaDefaultName={this.props.member ? this.props.member.name : ''}
              sepaDefaultEmail={
                this.props.member ? this.props.member.email : ''
              }
            />
          </PaymentModal>
        )}
      </Grid>
    );
  }
}
const connector = connect(
  (state: RootState, { membership }: { membership: Membership }) => ({
    memberLoading: state.member.loading,
    member: getMemberDetail(state, membership && membership.id),
    theme: themeSelectors.getTheme(state),
    paymentMethod: state.paymentBackend.paymentMethod.items,
    paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
    detachPaymentMethodLoading:
      state.paymentBackend.detachPaymentMethod.loading,
    memberCustomForm: withMemberProfileData(
      getMemberCustomFormWithEnabledField,
    )(state, membership?.id),
    showVaccinationStatus: showVaccinationStatus(state),
  }),
  {
    fetchMember: fetchMemberAction,
    fetchSignFormUpConfiguration,
    push: pushRouter,
    fetchPaymentMethodListActions: fetchPaymentMethodList,
    detachPaymentMethodAction: detachPaymentMethod,
    snackbarErrorMsg: snackbarWarning,
    snackbarSuccessMsg: snackbarSuccess,
    fetchCompanyCustomMemberForm,
    submitCustomForm,
    disconnect,
    fetchMyUserProfile,
  },
);

const mapWithHandler = {
  detachPaymentMethod:
    ({
      detachPaymentMethodAction,
      fetchPaymentMethodListActions,
      membership,
    }: RouterProps & ConnectedProps<typeof connector>) =>
    (pm_id: string, options?: OptionCallback) => {
      detachPaymentMethodAction(
        { member: membership.id, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchPaymentMethodListActions({ member: membership.id });
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: options && options.onError,
        },
      );
    },

  fetchMemberPaymentMethod:
    ({
      fetchPaymentMethodListActions,
      membership,
    }: RouterProps & ConnectedProps<typeof connector>) =>
    () => {
      fetchPaymentMethodListActions({ member: membership.id });
    },
};
const styles = (theme: Theme) =>
  createStyles({
    flexGrid: {
      flexGrow: 1,
      spacing: theme.spacing(2),
    },
    paymentContainer: {
      padding: theme.spacing(2),
    },
    customFormContainer: {
      padding: theme.spacing(4),
    },
  });

export default compose(
  connector,
  withTranslation(['snackbar']),
  withState('editMember', 'setEditMember', false),
  withStyles(styles),
  withHandlers(mapWithHandler),
  withQueryParams([
    ['isAddPaymentMethodDialogOpen'],
    'queryParams',
    'setQueryParams',
  ]),
  withProps(
    (props: { queryParams: { isAddPaymentMethodDialogOpen: string } }) => {
      return {
        isAddPaymentMethodDialogOpen:
          props.queryParams?.isAddPaymentMethodDialogOpen === 'true',
      };
    },
  ),
)(ConsumerProfile);

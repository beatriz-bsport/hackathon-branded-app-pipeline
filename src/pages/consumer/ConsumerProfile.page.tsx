import React from 'react';
import { compose, withState, withHandlers, withProps } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { push as pushRouter } from 'connected-react-router';
// @ts-expect-error
import { withTranslation, TFunction } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme } from '@material-ui/core';
import { buildMemberReferralLink } from '@bsport/common/lib/referrals';
import Config from '../../config';
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
  updateSpiviPrivacySettings as updateSpiviPrivacySettingsAction,
} from '../../libs/member/actions';

import {
  fetchPaymentMethodList,
  detachPaymentMethod,
} from '../../libs/payment/actions';
import { fetchSignFormUpConfiguration } from '../../libs/sign-up-form/actions';
import themeSelectors, {
  getCompanyCountry,
  getStripeRegion,
} from '../../libs/theme/selectors';
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
// @ts-expect-error
import { disconnect } from '../../actions/auth.actions';
import type { OptionCallback } from '../../state/types';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';
import AddPaymentMethod from '#libs/payment/components/AddPaymentMethod.component';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#libs/payment/api';
import PaymentModal from '#libs/payment/components/PaymentModal.component';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#libs/payment/utils';
import SpiviPrivacySettingsPanel from '#libs/spivi/components/SpiviPrivacySettingsPanel.component';
import ReferralMemberSumup from '#libs/referral/components/referral-member-sumup';
import {
  retrieveReferralProgramForCompany as retrieveReferralProgramForCompanyAction,
  retrieveReferralMemberStatus as retrieveReferralMemberStatusAction,
} from '#libs/referral/actions';
import {
  getTheReferralProgram,
  getReferralMemberStatusWithMemberId,
  getReferralProgramsLoading,
  getReferralMemberStatusLoading,
} from '#libs/referral/selectors';
import { CUSTOM_FORM_CSS_VARIANT_ACTIVATED } from '#libs/custom-form/constants';

type RouterProps = {
  membership: Membership;
  isAddPaymentMethodDialogOpen: boolean;
  setQueryParams: (queryParam: string) => (value: boolean | null) => void;
  t: TFunction;
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
    if (this.props.theme.is_referral_program_activated) {
      this.props.retrieveReferralProgramForCompany(
        this.props.membership.company,
      );
      this.props.retrieveReferralMemberStatus(this.props.membership.id);
    }
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
    // @ts-expect-error
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
    const companyCountry = getCompanyCountry();
    const stripeRegion = getStripeRegion();

    const referralLink = this.props.theme.is_referral_program_activated
      ? `${Config.PUBLIC_URL}${buildMemberReferralLink(
          this.props.membership.company,
          this.props?.member?.referral_uuid,
        )}`
      : '';

    if (!this.props.membership || this.props.companyThemeLoading) {
      return (
        <Grid container className={classes.flexGrid} spacing={2}>
          <Grid item md={6} xs={12}>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid container className={classes.flexGrid} spacing={2}>
        <Grid item md={6} xs={12}>
          <MemberSummaryCard
            hideContactButton
            companyCountry={this.props.companyCountry}
            editMember={() => this.props.setEditMember(true)}
            member={this.props.member}
            showVaccinationStatus={this.props.showVaccinationStatus}
          />
        </Grid>
        {/* @ts-expect-error  */}
        <CustomFormViewDialog
          fullWidth
          isWidget={WidgetUtils.isWidget()}
          maxWidth="md"
          open={this.props.editMember}
        >
          <div className={classes.customFormContainer}>
            {this.props.memberCustomForm && (
              <CustomFormView
                shouldWrapLayerInCssHoc
                textButtonConfirm
                general_terms_and_conditions={
                  this.props.theme.general_terms_of_use
                }
                // @ts-expect-error
                initial={this.props.memberCustomForm}
                isCssVariantActivated={CUSTOM_FORM_CSS_VARIANT_ACTIVATED}
                // @ts-expect-error
                layouts={this.props.memberCustomForm.layout}
                onCancel={() => this.props.setEditMember(false)}
                // @ts-expect-error
                onSubmit={this.submitCustomForm}
                waiver={this.props.theme.waiver}
              />
            )}
          </div>
        </CustomFormViewDialog>
        <Grid item md={6} xs={12}>
          <Paper className={classes.gridItemContainer}>
            {/* @ts-expect-error */}
            <MemberPaymentMethodPanel
              detachPaymentMethod={this.props.detachPaymentMethod}
              detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
              openAddPaymentMethodDialog={this.openAddPaymentMethodDialog}
              paymentMethod={this.props.paymentMethod}
              paymentMethodLoading={this.props.paymentMethodLoading}
            />
          </Paper>
          {this.props.member?.spivi_privacy_settings_accepted !== null &&
            this.props.member?.spivi_privacy_settings_accepted !==
              undefined && (
              <Paper className={classes.gridItemContainer}>
                <SpiviPrivacySettingsPanel
                  member={this.props.member}
                  spiviPrivacySettingsLoading={
                    this.props.spiviPrivacySettingsLoading
                  }
                  updateSpiviPrivacySettings={
                    this.props.updateSpiviPrivacySettings
                  }
                />
              </Paper>
            )}
          {this.props.theme.is_referral_program_activated && (
            <Paper className={classes.gridItemContainer}>
              <ReferralMemberSumup
                isLoading={
                  this.props.referralProgramLoading &&
                  this.props.referralMemberStatusLoading
                }
                nbRemainingReferralUses={
                  this.props.referralMemberStatus?.nb_remaining_referral_uses
                }
                referralLink={referralLink}
                referralProgram={this.props.referralProgram}
              />
            </Paper>
          )}
        </Grid>
        {this.props.membership?.id && !!companyCountry && !!stripeRegion && (
          <PaymentModal isOpen={this.props.isAddPaymentMethodDialogOpen}>
            <AddPaymentMethod
              cardBillingDetailsMandatory={
                this.props.theme.force_billing_details_on_cards
              }
              companyId={this.props.membership.company}
              disabled={false}
              enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods(
                {
                  currency: this.props.theme.currency,
                  companyCountry,
                  stripeRegion,
                },
              )}
              onCancel={() => this.openAddPaymentMethodDialog(false)}
              onChange={this.changePaymentMethodType}
              paymentMethodType={this.state.paymentMethodType}
              refreshSavedPaymentMethodList={
                this.props.fetchMemberPaymentMethod
              }
              requestSetupIntentSecret={this.requestSetupIntentSecret}
              sepaDefaultEmail={
                this.props.member ? this.props.member.email : ''
              }
              sepaDefaultName={this.props.member ? this.props.member.name : ''}
            />
          </PaymentModal>
        )}
      </Grid>
    );
  }
}
const connector = connect(
  (state: RootState, { membership }: { membership: Membership }) => ({
    companyThemeLoading: state.theme.loading,
    memberLoading: state.member.loading,
    member: getMemberDetail(state, membership && membership.id),
    theme: themeSelectors.getTheme(state),
    companyCountry: state.theme.theme.locale.split('_')[1],
    paymentMethod: state.paymentBackend.paymentMethod.items,
    paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
    detachPaymentMethodLoading:
      state.paymentBackend.detachPaymentMethod.loading,
    memberCustomForm: withMemberProfileData(
      getMemberCustomFormWithEnabledField,
    )(state, membership?.id),
    showVaccinationStatus: showVaccinationStatus(state),
    // @ts-expect-error
    spiviPrivacySettingsLoading: state.member.spivi_privacy_settings.loading,
    referralProgram: getTheReferralProgram(state),
    referralProgramLoading: getReferralProgramsLoading(state),
    referralMemberStatus: getReferralMemberStatusWithMemberId(
      state,
      membership?.id,
    ),
    referralMemberStatusLoading: getReferralMemberStatusLoading(state),
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
    updateSpiviPrivacySettings: updateSpiviPrivacySettingsAction,
    retrieveReferralProgramForCompany: retrieveReferralProgramForCompanyAction,
    retrieveReferralMemberStatus: retrieveReferralMemberStatusAction,
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
    customFormContainer: {
      padding: theme.spacing(4),
    },
    gridItemContainer: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  });

export default compose(
  connector,
  withTranslation(['snackbar', 'consumerSpace']),
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

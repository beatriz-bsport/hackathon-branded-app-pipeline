// @flow
import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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
import type { Member } from '../../libs/member/types';
import type { Theme } from '../../libs/theme/types';
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
import type { CustomForm } from '../../libs/custom-form/types';
import { disconnect } from '../../actions/auth.actions';
import type { OptionCallback } from '../../state/types';

type Props = {
  fetchMember: (number) => void,
  membership: Membership,
  member: ?Member,
  editMember: (boolean) => void,
  setEditMember: (boolean) => void,
  theme: Theme,
  classes: Object,
  fetchMemberPaymentMethod: (memberId: string) => void,
  paymentMethodLoading: boolean,
  detachPaymentMethodLoading: boolean,
  paymentMethod: Array<any>,
  detachPaymentMethod: (pm_id: string) => void,
  snackbarErrorMsg: (msg: string) => void,
  snackbarSuccessMsg: (msg: string) => void,
  memberCustomForm: CustomForm,
  fetchCompanyCustomMemberForm: (params: { company: string }) => void,
  submitCustomForm: (
    formdata: FormData,
    company_id: number,
    options: OptionCallback,
  ) => void,
  fetchMyUserProfile: () => void,
  showVaccinationStatus: boolean,
};

export class ConsumerProfile extends React.Component<Props> {
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
            memberId={this.props.membership.id}
            member={this.props.member}
            hideContactButton
            hideCreditAccount
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
              memberId={this.props.membership.id}
              paymentMethod={this.props.paymentMethod}
              paymentMethodLoading={this.props.paymentMethodLoading}
              detachPaymentMethod={this.props.detachPaymentMethod}
              detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
              snackbarErrorMsg={this.props.snackbarErrorMsg}
              snackbarSuccess={this.props.snackbarSuccessMsg}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
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
  connect(
    (state, { membership }) => ({
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
  ),
  withTranslation(['snackbar']),
  withState('editMember', 'setEditMember', false),
  withStyles(styles),
  withHandlers({
    fetchMemberPaymentMethod: ({
      fetchPaymentMethodListActions,
      membership,
    }) => () => {
      fetchPaymentMethodListActions({ member: membership.id });
    },
  }),
  withHandlers({
    detachPaymentMethod: ({
      detachPaymentMethodAction,
      fetchPaymentMethodListActions,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      membership,
      t,
    }) => (pm_id, options) => {
      detachPaymentMethodAction(
        { member: membership.id, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchPaymentMethodListActions({ member: membership.id });
            snackbarSuccessMsg(t('paymentMethod.detach.pm_deleted'));
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: (data) => {
            snackbarErrorMsg(t(`paymentMethod.detach.${data}`));
          },
        },
      );
    },
  }),
)(ConsumerProfile);

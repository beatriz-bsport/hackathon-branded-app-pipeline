import React from 'react';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import type { Theme } from '@material-ui/core/styles';
import {
  CUSTOM_FORM_SUBMITTION_SNOOZED,
  CUSTOM_FORM_SUBMITTION_COMPLETED,
  CUSTOM_FORM_SUBMITTION_DRAFT,
} from '@bsport/common/lib/master-data/custom-form.js';
import withStyles from '@material-ui/core/styles/withStyles';
import { fetchCurrentBasket as fetchCurrentBasketAction } from '../../libs/checkout/actions';
import CustomFormView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
import WidgetUtils from '../../libs/widget/WidgetUtils';
import {
  fetchMember as fetchMemberAction,
  fetchMyUserProfile,
} from '../../libs/member/actions';
import {
  linkMeToCompany as linkMeToCompanyAction,
  requestMembershipValidation as requestMembershipValidationAction,
} from '../../libs/membership/actions';
import {
  getMemberThroughMembership,
  getMemberDetailData,
} from '../../libs/member/selectors';
import {
  submitCustomForm,
  submitCustomFormDraft,
} from '../../libs/custom-form/actions';
import { RootState } from '../../reducers';
import type { Membership } from '../../libs/membership/types';
import { getMembership } from '../../libs/membership/selectors';
// @ts-expect-error
import { disconnect } from '../../actions/auth.actions';
import {
  getCustomFormListWithEnableField,
  getCustomFormDisplayRuleBlockingList,
  withUserProfileData,
  getMemberCustomFormWithEnabledField,
} from '../../libs/custom-form/selectors';
import CustomFormStepper from '../../libs/custom-form/components/CustomFormStepper.component';
import type {
  CustomForm,
  CustomFormFieldAnswer,
} from '../../libs/custom-form/types';
import { WithHandlerType } from '../../utils/types';
import { OptionCallback } from '../../state/types';
import MemberGreetingBanner from '../../libs/custom-form/components/consumer-form/CustomFormMemberGreetingBanner.component';
import { Member } from '../../libs/member/types';

type StateHandlerInit = {
  temporaryCustomFormData: {
    [id: number]: { completed: FormData; draft: CustomForm; snoozed: boolean };
  };
  customFormListIsSubmitting: boolean;
  currentCustomFormSubmittingId: null | number;
};
// @ts-expect-error
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {
  companyId: number;
  // eslint-disable-next-line react/no-unused-prop-types
  membership: Membership;
  disconnect: () => void;
  submitCustomMembeForm: (formData: FormData, options?: OptionCallback) => void;
  authenticated: boolean;
  customFormIdsList: Array<number>;
  isFormUrl: boolean;
  isRelationNavigation?: boolean;
};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
// @ts-expect-error
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps;
export class MemberShipValidationWrapper extends React.Component<Props> {
  handleOnSubitCustomFormItem = (customFormId: number, formData: FormData) => {
    return this.props.setTemporaryCustomFormData(
      customFormId,
      CUSTOM_FORM_SUBMITTION_COMPLETED,
      formData,
    );
  };

  handleSubmitCustomFormDraft = (customFormId: number, values: CustomForm) => {
    return this.props.setTemporaryCustomFormData(
      customFormId,
      CUSTOM_FORM_SUBMITTION_DRAFT,
      values,
    );
  };

  handleSubmitSnooze = (customFormId: number) => {
    return this.props.setTemporaryCustomFormData(
      customFormId,
      CUSTOM_FORM_SUBMITTION_SNOOZED,
    );
  };

  handleRefreshMissingCustomForm = () => {
    return this.props.requestMemberCustomFormNotification(
      { company_id: this.props.companyId },
      {
        // @ts-expect-error
        onSuccess: (payload) => {
          this.props.fetchMissingCustomFormBulk({
            id__in: payload.missing_custom_form_informations.map(
              (info: {
                custom_form_id: number;
                custom_form_display_rule: number;
              }) => info.custom_form_id,
            ),
          });
          this.props.fetchBlockingCustomFormDisplayRuleBulk({
            id__in: payload.missing_custom_form_informations.map(
              (info: {
                custom_form_id: number;
                custom_form_display_rule_id: number;
              }) => info.custom_form_display_rule_id,
            ),
          });
        },
      },
    );
  };

  handleSubmitCutomFormList = () => {
    return this.props.submitCustomFormList({
      onSuccess: () => {
        this.handleRefreshMissingCustomForm();
      },
    });
  };

  handleDirectSubmit = (
    formData: FormData,
    customFormId: number,
    isDraft: boolean,
    options?: OptionCallback,
  ) => {
    return this.props.directSubmitcustomForm(formData, customFormId, isDraft, {
      onSuccess: () => {
        this.handleRefreshMissingCustomForm();
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  render() {
    const { classes } = this.props;
    if (!this.props.theme) {
      return this.props.children;
    }
    return (
      <>
        {this.props.memberCustomForm && (
          <Dialog
            fullWidth
            fullScreen={window.innerWidth < 700 || WidgetUtils.isWidget()}
            maxWidth="md"
            open={
              !this.props.memberCustomFormLoading &&
              this.props.authenticated &&
              !this.props.isRelationNavigation &&
              !this.props.isValidated
            }
            style={{ zIndex: 'unset' }}
          >
            <div className={classes.customFormContainer}>
              {this.props.memberCustomForm && (
                <>
                  <div className={classes.greetingContainer}>
                    <MemberGreetingBanner
                      userProfile={this.props.userProfile}
                      userStatus={this.props.userStatus}
                    />
                  </div>
                  <CustomFormView
                    disconnectOnCancel
                    shouldWrapLayerInCssHoc
                    general_terms_and_conditions={
                      this.props.theme.general_terms_of_use
                    }
                    initial={this.props.memberCustomForm}
                    layouts={this.props.memberCustomForm.layout}
                    onCancel={() => this.props.disconnect()}
                    onSubmit={this.props.submitCustomMembeForm}
                    waiver={this.props.theme.waiver}
                  />
                </>
              )}
            </div>
          </Dialog>
        )}
        {!this.props.isFormUrl &&
          !this.props.isRelationNavigation &&
          !this.props.customFormLoading &&
          this.props.customFormIdsList &&
          this.props.customFormIdsList?.length !== 0 &&
          this.props.customFormList[0] && (
            <Dialog
              fullWidth
              fullScreen={window.innerWidth < 700 || WidgetUtils.isWidget()}
              open={
                this.props.customFormIdsList?.length !== 0 &&
                this.props.isValidated &&
                this.props.authenticated
              }
            >
              <CustomFormStepper
                currentCustomFormSubmittingId={
                  this.props.currentCustomFormSubmittingId
                }
                customFormDisplayRuleList={this.props.customFormDisplayRuleList}
                customFormList={this.props.customFormList}
                customFormListIsSubmitting={
                  this.props.customFormListIsSubmitting
                }
                onDirectSubmit={this.handleDirectSubmit}
                onDisconnect={() => this.props.disconnect()}
                onSubmitCustomFormItem={(
                  customFormId: number,
                  formData: FormData,
                ) => this.handleOnSubitCustomFormItem(customFormId, formData)}
                onSubmitCustomFormList={() => this.handleSubmitCutomFormList()}
                onSubmitDraft={(customFormId: number, values: CustomForm) =>
                  this.handleSubmitCustomFormDraft(customFormId, values)
                }
                onSubmitSnoozed={(customFormId: number) =>
                  this.handleSubmitSnooze(customFormId)
                }
                temporaryCustomFormData={this.props.temporaryCustomFormData}
              />
            </Dialog>
          )}
        {this.props.children}
      </>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  {
    companyId,
    customFormIdsList,
    customFormDisplayRuleList,
  }: {
    companyId: number;
    customFormIdsList: Array<number>;
    customFormDisplayRuleList: Array<number>;
  },
) => ({
  theme: state.theme.theme,
  authenticated: state.auth.authenticated,
  isValidated:
    state.membership.memberShipValidation.missingInformation.validated,
  // eslint-disable-next-line react/no-unused-prop-types
  missingInformation:
    state.membership.memberShipValidation.missingInformation.fields,
  userStatus: state.membership.memberShipValidation.missingInformation.status,
  // eslint-disable-next-line react/no-unused-prop-types
  member: getMemberThroughMembership(getMemberDetailData)(state, companyId),
  membership: getMembership(state, companyId),
  userProfile: state.member.userProfile.profile,
  // eslint-disable-next-line react/no-unused-prop-types
  memberLoading: state.member.loading,
  customFormLoading: state.customForm.loading,
  // @ts-expect-error
  customFormList: withUserProfileData(getCustomFormListWithEnableField)(
    state,
    // @ts-expect-error
    customFormIdsList,
  ),
  customFormDisplayRuleList: getCustomFormDisplayRuleBlockingList(
    state,
    customFormDisplayRuleList,
  ),
  memberCustomForm: withUserProfileData(getMemberCustomFormWithEnabledField)(
    state,
  ),
  memberCustomFormLoading: state.customForm.memberForm.loading,
});

const mapDispatchToProps = {
  fetchMember: fetchMemberAction,
  fetchMyUserProfile,
  linkMeToCompany: linkMeToCompanyAction,
  requestMembershipValidation: requestMembershipValidationAction,
  fetchCurrentBasket: fetchCurrentBasketAction,
  disconnectAction: disconnect,
  submitCustomFormAction: submitCustomForm,
  submitCustomFormDraftAction: submitCustomFormDraft,
};

const withStateHandlersInit: StateHandlerInit = {
  temporaryCustomFormData: {},
  customFormListIsSubmitting: false,
  currentCustomFormSubmittingId: null,
};
// @ts-expect-error
const withStateHandlersSetter = {
  setTemporaryCustomFormData:
    (props: OwnAndConnectedProps) =>
    (customFormId: number, status: number, data?: FormData | CustomForm) => {
      if (status === CUSTOM_FORM_SUBMITTION_DRAFT) {
        return {
          temporaryCustomFormData: {
            ...props.temporaryCustomFormData,
            [customFormId]: {
              ...props.temporaryCustomFormData[customFormId],
              draft: data,
              snoozed: false,
            },
          },
        };
      }
      if (status === CUSTOM_FORM_SUBMITTION_COMPLETED) {
        return {
          temporaryCustomFormData: {
            ...props.temporaryCustomFormData,
            [customFormId]: {
              ...props.temporaryCustomFormData[customFormId],
              completed: data,
              snoozed: false,
            },
          },
        };
      }
      return {
        temporaryCustomFormData: {
          ...props.temporaryCustomFormData,
          [customFormId]: {
            snoozed: true,
          },
        },
      };
    },
  setCustomFormSelected: () => (customFormId: number | null) => {
    return { customFormSelected: customFormId };
  },
  setLoading: () => (loading: boolean) => {
    return { loading };
  },
  setCustomFormListIsSubmitting:
    () => (customFormListIsSubmitting: boolean) => {
      return { customFormListIsSubmitting };
    },
  setCurrentCustomFormSubmittingId:
    () => (currentCustomFormSubmittingId: null | number) => {
      return { currentCustomFormSubmittingId };
    },
};

const styles = (theme: Theme) => ({
  customFormContainer: {
    padding: theme.spacing(4),
  },
  greetingContainer: {
    paddingBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers({
    disconnect:
      ({ disconnectAction }) =>
      () => {
        disconnectAction();
      },
  }),
  withHandlers({
    submitCustomMembeForm:
      ({
        submitCustomFormAction,
        membership,
        fetchMember,
        requestMembershipValidation,
        companyId,
        linkMeToCompany,
        fetchCurrentBasket,
      }) =>
      (formdata: CustomFormFieldAnswer, options?: OptionCallback) => {
        if (!membership) {
          linkMeToCompany(
            { company: companyId },
            {
              onSuccess: (payload: Member) => {
                submitCustomFormAction(
                  { form_filled: formdata, companyId },
                  {
                    ...options,
                    onSuccess: () => {
                      fetchMember(payload.id);
                      options.onSuccess();
                      requestMembershipValidation({ company: companyId });
                      fetchCurrentBasket(companyId);
                    },
                  },
                );
              },
            },
          );
        } else {
          submitCustomFormAction(
            { form_filled: formdata, companyId },
            {
              ...(options || {}),
              onSuccess: () => {
                fetchMember(membership.id);
                if (options && options.onSuccess) options.onSuccess();
                requestMembershipValidation({ company: companyId });
                fetchCurrentBasket(companyId);
              },
            },
          );
        }
      },
  }),
  withHandlers({
    submitCustomFormList:
      ({
        submitCustomFormAction,
        submitCustomFormDraftAction,
        temporaryCustomFormData,
        setCustomFormListIsSubmitting,
        setCurrentCustomFormSubmittingId,
        companyId,
      }) =>
      async (options?: OptionCallback) => {
        setCustomFormListIsSubmitting(true);
        try {
          for (const customFormId of Object.keys(temporaryCustomFormData)) {
            if (customFormId !== null) {
              setCurrentCustomFormSubmittingId(customFormId);
              const request_data = temporaryCustomFormData[customFormId];
              const callBacks = {
                onSuccess: () => {
                  setCurrentCustomFormSubmittingId(null);
                },
                onError: () => {
                  setCurrentCustomFormSubmittingId(null);
                },
              };
              if (request_data.snoozed) {
                await submitCustomFormDraftAction(
                  {
                    custom_form_id: customFormId,
                    companyId,
                  },
                  callBacks,
                );
              } else {
                await submitCustomFormAction(
                  { form_filled: request_data.completed, companyId },
                  callBacks,
                );
              }
            }
          }
          if (options && options.onSuccess) options.onSuccess();
        } catch (err) {
          console.error(err);
        }
        setCustomFormListIsSubmitting(false);
      },
  }),
  withHandlers({
    directSubmitcustomForm:
      ({
        submitCustomFormAction,
        submitCustomFormDraftAction,
        setCustomFormListIsSubmitting,
        companyId,
      }) =>
      async (
        formData: FormData | null,
        customFormId: number,
        isDraft: boolean,
        options?: OptionCallback,
      ) => {
        setCustomFormListIsSubmitting(true);
        if (isDraft === true) {
          await submitCustomFormDraftAction(
            {
              custom_form_id: customFormId,
              companyId,
            },
            options,
          );
        } else {
          await submitCustomFormAction(
            { form_filled: formData, companyId },
            options,
          );
        }
        setCustomFormListIsSubmitting(false);
      },
  }),
)(MemberShipValidationWrapper);

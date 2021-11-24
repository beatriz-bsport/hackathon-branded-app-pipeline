import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { push as pushRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import LinkIcon from '@material-ui/icons/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper';
import { CUSTOM_FORM_DISPLAY_ON_SIGN_UP } from '@bsport/common/lib/master-data/custom-form';
import { TFunction } from 'i18next';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import withTitle from '../../hocs/with-title.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchAllCustomForm,
  upsertCustomForm as upsertCustomFormActions,
  fetchAllCustomFormDisplayRule,
  upsertCustomFormDisplayRule as upsertCustomFormDisplayRuleAction,
  deleteCustomFormDisplayRule as deleteCustomFormDisplayRuleAction,
  fetchCompanyCustomSignUp,
  fetchCompanyCustomMemberForm,
  updateCutsomFormLayout,
} from '../../libs/custom-form/actions';
import {
  getCustomForm,
  withDisplayRule,
  getSignUpCustomForm,
  getMemberCustomForm,
} from '../../libs/custom-form/selectors';
import CustomFormConfigurationTable from '../../libs/custom-form/components/form/customFormConfigurationTable/CustomFormConfigurationTable.form';

import type {
  CustomForm,
  CustomFormDisplayRule,
} from '../../libs/custom-form/types';
import { snackbarSuccess } from '../../libs/snackbar/actions';
import { fetchTags } from '../../libs/tag/actions';
import tagSelectors from '../../libs/tag/selectors';
import CustomFormDisplayRulePanel from '../../libs/custom-form/components/display-rule/CustomFormDisplayRulePanel.component';
import CustomFormDisplayFormDialog from '../../libs/custom-form/components/display-rule/CustomFormDisplayRuleFormDialog.component';
import { generateMarketPlaceCustomFormLink } from '../../libs/marketplace/routing-utils';

import CustomFormView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
import CustomFormsKeleton from '../../libs/custom-form/components/CustomFormSkeleton.component';
import CustomFormLayoutEditor from '../../libs/custom-form/components/consumer-form-layout/CustomFormLayoutEditor.dialog';

import themeSelectors from '../../libs/theme/selectors';

type StateHandlerInit = {
  customFormRefresh: CustomForm;
  customFormView: CustomForm;
  refreshLoading: boolean;
  isSubmitting: boolean;
  displayRuleSubmitting: boolean;
  initialDisplayRule: null | CustomFormDisplayRule;
  openDisplayRuleDialog: boolean;
  numberOfQuestionsHasChanged: boolean;
  openLayoutUpdateDialog: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {
  id: number;
};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
type State = {};
export class CustomFormDetail extends React.Component<Props, State> {
  componentDidMount() {
    this.props.fetchAllCustomForm();
    this.props.fetchTags();
    this.props.fetchAllCustomFormDisplayRule();
    this.props.fetchCompanyCustomSignUp({ company: this.props.theme.company });
    this.props.fetchCompanyCustomMemberForm({
      company: this.props.theme.company,
    });
  }

  handleUpdateView = async (customFormRefresh: CustomForm) => {
    this.props.setCustomFormRefresh(customFormRefresh);
    this.props.setCustomFormView({
      ...customFormRefresh,
      custom_form_field: customFormRefresh.custom_form_field.filter(
        (field) => !field.disabled,
      ),
    });
  };

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.customForm &&
        prevProps.customForm.custom_form_field &&
        prevProps.customForm !== this.props.customForm) ||
      (this.props.customForm && !this.props.customFormRefresh)
    ) {
      this.handleUpdateView({ ...this.props.customForm });
    }
    if (prevProps.id !== this.props.id) {
      this.props.fetchAllCustomForm();
    }
  }

  getDisplayRuleOnSignUpAlreadyExists = () => {
    return this.props.customForm?.display_rules?.find(
      (rule: CustomFormDisplayRule) =>
        rule.kind === CUSTOM_FORM_DISPLAY_ON_SIGN_UP,
    );
  };

  render() {
    const { t, classes } = this.props;
    if (
      !this.props.customFormRefresh ||
      !this.props.customFormRefresh.custom_form_field ||
      this.props.loading
    ) {
      return <BackofficeLinearProgress color="secondary" />;
    }
    return (
      <>
        <div className={classes.container}>
          <Grid container direction="row" spacing={3}>
            <Grid item xs={12} md={6}>
              {this.props.customForm?.is_member_form ||
              this.props.customForm?.is_signup ? null : (
                <>
                  <Typography variant="h5">
                    {t('customForm.CustomFormLink')}
                  </Typography>
                  <div className={classes.textAndIcon}>
                    <div className={classes.textAndIconInner}>
                      <InfoIcon className={classes.leftIcon} fontSize="small" />
                      <Typography variant="caption">
                        {t('customForm.linkHelper')}
                      </Typography>
                    </div>
                    <CopyToClipboard
                      text={generateMarketPlaceCustomFormLink(
                        this.props.theme.company_name,
                        this.props.theme.company,
                        this.props.id,
                      )}
                    >
                      <div className={classes.clipBoard}>
                        <div className={classes.linkContainer}>
                          <Button
                            className={classes.buttonBase}
                            variant="outlined"
                            onClick={() =>
                              this.props.snackbarSuccess('link.copied')
                            }
                          >
                            <LinkIcon className={classes.linkIcon} />
                            <Typography variant="caption">
                              {generateMarketPlaceCustomFormLink(
                                this.props.theme.company_name,
                                this.props.theme.company,
                                this.props.id,
                              )}
                            </Typography>
                          </Button>
                        </div>
                      </div>
                    </CopyToClipboard>
                  </div>
                </>
              )}

              <CustomFormConfigurationTable
                initial={this.props.customForm}
                onSubmit={this.props.upsertCustomForm}
                handleUpdateView={this.handleUpdateView}
                tag_groups={this.props.tag_groups}
                tags={this.props.tags}
                isSubmitting={this.props.isSubmitting}
                navigateToSignup={this.props.navigateToSignup}
                navigateToMemberForm={this.props.navigateToMemberForm}
                setNumberOfQuestionsHasChanged={
                  this.props.setNumberOfQuestionsHasChanged
                }
                companyTheme={this.props.companyTheme}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {this.props.customForm?.is_member_form ||
              this.props.customForm?.is_signup ? null : (
                <div className={classes.displayRulePanel}>
                  <CustomFormDisplayRulePanel
                    customForm={this.props.customForm}
                    onDeleteDisplayRule={this.props.deleteCustomFormDisplayRule}
                    onEditDisplayRule={(
                      display_rule: CustomFormDisplayRule,
                    ) => {
                      this.props.setInitialDisplayRule(display_rule);
                      this.props.setOpenDisplayRuleDialog(true);
                    }}
                    onAddRule={() => this.props.setOpenDisplayRuleDialog(true)}
                    withItemDivider
                  />
                </div>
              )}
              <div className={classes.previewTitle}>
                <Typography variant="h6">{t('customForm.preview')}</Typography>
                {this.props.customForm?.layout &&
                  Object.keys(this.props.customForm.layout || {})?.length ===
                    4 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => this.props.setOpenLayoutUpdateDialog(true)}
                    >
                      <ViewCompactIcon className={classes.leftIcon} />
                      {t('marketing:customForm.actions.customization')}
                    </Button>
                  )}
              </div>
              <Paper className={classes.paperContainer}>
                {this.props.isSubmitting ? (
                  <CustomFormsKeleton
                    layouts={this.props.customFormView?.layout}
                    customForm={this.props.customFormView}
                  />
                ) : (
                  <CustomFormView
                    refreshLoading={this.props.isSubmitting}
                    layouts={this.props.customFormView?.layout}
                    initial={this.props.customFormView}
                    asManager
                    waiver={this.props.theme?.waiver}
                    general_terms_and_conditions={
                      this.props.theme?.general_terms_of_use
                    }
                  />
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
        {this.props.openDisplayRuleDialog && (
          <CustomFormDisplayFormDialog
            open={this.props.openDisplayRuleDialog}
            onClose={() => {
              this.props.setOpenDisplayRuleDialog(false);
              this.props.setInitialDisplayRule(null);
            }}
            onSubmit={this.props.upsertCustomFormDisplayRule}
            initial={this.props.initialDisplayRule}
            signUpRuleAlreadyExists={
              !!this.getDisplayRuleOnSignUpAlreadyExists()
            }
          />
        )}

        {this.props.openLayoutUpdateDialog && (
          <CustomFormLayoutEditor
            open={this.props.openLayoutUpdateDialog}
            initial={this.props.customFormView}
            waiver={this.props.theme?.waiver}
            general_terms_and_conditions={
              this.props.theme?.general_terms_and_conditions
            }
            saveLayouts={(layouts) =>
              this.props.updateCutsomFormLayout(
                { formId: this.props.customForm.id, layout: layouts },
                { noSuccessMessage: true },
              )
            }
            closeEditor={() => this.props.setOpenLayoutUpdateDialog(false)}
          />
        )}
      </>
    );
  }
}
const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  textAndIcon: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    border: '1px solid #e0e0e0',
    borderRadius: theme.spacing(0.5),
  },
  textAndIconInner: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  linkContainer: {
    padding: theme.spacing(1),
  },
  clipBoard: {
    paddingTop: theme.spacing(1),
  },
  linkIcon: {
    marginRight: theme.spacing(1),
  },
  previewTitle: {
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonBase: {
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  paperContainer: {
    padding: theme.spacing(6),
  },
  displayRulePanel: {
    paddingBottom: theme.spacing(2),
  },
});
const mapStateToProps = (state: RootState, { id }: { id: number }) => ({
  customForm: withDisplayRule(getCustomForm)(state, id),
  loading: state.customForm.loading,
  theme: state.theme.theme,
  tag_groups: tagSelectors.getMemberTagGroups(state),
  tags: tagSelectors.getMemberTags(state),
  signUpCustomForm: getSignUpCustomForm(state),
  memberCustomForm: getMemberCustomForm(state),
  layoutLoading: state.customForm.layout.loading,
  companyTheme: themeSelectors.getTheme(state),
});
const mapDispatchToProps = {
  fetchAllCustomForm,
  upsertCustomFormActions,
  snackbarSuccess,
  fetchTags,
  fetchAllCustomFormDisplayRule,
  upsertCustomFormDisplayRuleAction,
  deleteCustomFormDisplayRuleAction,
  fetchCompanyCustomSignUp,
  fetchCompanyCustomMemberForm,
  push: pushRouter,
  updateCutsomFormLayout,
};
const mapWithHandlers = {
  upsertCustomForm: (props: OwnAndConnectedProps) => (form: CustomForm) => {
    props.setSubmitting(true);
    props.upsertCustomFormActions(form, {
      onSuccess: () => {
        props.setSubmitting(false);
        if (
          props.numberOfQuestionsHasChanged &&
          form.layout &&
          Object.keys(form?.layout || {})?.length === 4
        ) {
          props.setOpenLayoutUpdateDialog(true);
        }
      },
      onError: () => props.setSubmitting(false),
    });
  },
  upsertCustomFormDisplayRule:
    (props: OwnAndConnectedProps) => (display_rule: CustomFormDisplayRule) => {
      props.setDisplayRuleSubmitting(true);
      props.upsertCustomFormDisplayRuleAction(
        { ...display_rule, custom_form_id: props.customForm.id },
        {
          onSuccess: () => {
            props.setDisplayRuleSubmitting(false);
            props.setInitialDisplayRule(null);
            props.setOpenDisplayRuleDialog(false);
          },
          onError: () => {
            props.setDisplayRuleSubmitting(false);
            props.setInitialDisplayRule(null);
          },
        },
      );
    },
  deleteCustomFormDisplayRule:
    (props: OwnAndConnectedProps) => (display_rule_id: number) => {
      props.setDisplayRuleSubmitting(true);
      props.deleteCustomFormDisplayRuleAction(display_rule_id, {
        onSuccess: () => {
          props.setDisplayRuleSubmitting(false);
          props.setInitialDisplayRule(null);
        },
        onError: () => {
          props.setDisplayRuleSubmitting(false);
          props.setInitialDisplayRule(null);
        },
      });
    },
  navigateToSignup: (props: OwnAndConnectedProps) => () => {
    props.push(`/custom-form/details/${props.signUpCustomForm.id}/general`);
  },
  navigateToMemberForm: (props: OwnAndConnectedProps) => () => {
    props.push(`/custom-form/details/${props.memberCustomForm.id}/general`);
  },
};
const withStateHandlersInit: StateHandlerInit = {
  customFormRefresh: null,
  customFormView: null,
  refreshLoading: false,
  isSubmitting: false,
  displayRuleSubmitting: false,
  initialDisplayRule: null,
  openDisplayRuleDialog: false,
  numberOfQuestionsHasChanged: false,
  openLayoutUpdateDialog: false,
};
const withStateHandlersSetter = {
  setCustomFormRefresh: () => (customFormRefresh: CustomForm) => {
    return { customFormRefresh };
  },
  setCustomFormView: () => (customFormView: CustomForm) => {
    return { customFormView };
  },
  setRefreshLoading: () => (refreshLoading: boolean) => {
    return { refreshLoading };
  },
  setSubmitting: () => (isSubmitting: boolean) => {
    return { isSubmitting };
  },
  setDisplayRuleSubmitting: () => (displayRuleSubmitting: boolean) => {
    return { displayRuleSubmitting };
  },
  setOpenDisplayRuleDialog: () => (openDisplayRuleDialog: boolean) => {
    return { openDisplayRuleDialog };
  },
  setInitialDisplayRule:
    () => (initialDisplayRule: null | CustomFormDisplayRule) => {
      return { initialDisplayRule };
    },
  setNumberOfQuestionsHasChanged:
    () => (numberOfQuestionsHasChanged: boolean) => {
      return { numberOfQuestionsHasChanged };
    },
  setOpenLayoutUpdateDialog: () => (openLayoutUpdateDialog: boolean) => {
    return { openLayoutUpdateDialog };
  },
};
export default compose<any, OwnProps>(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation('marketing'),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withTitle(({ customForm, t }: { customForm: CustomForm; t: TFunction }) => {
    if (customForm?.is_signup) {
      return t('marketing:customForm.signupFormTitle');
    }
    if (customForm?.is_member_form) {
      return t('marketing:customForm.memberFormTitle');
    }
    return customForm ? `${customForm.name}` : '';
  }),
  withHandlers(mapWithHandlers),
)(CustomFormDetail);

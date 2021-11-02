import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/styles';
import { TFunction } from 'i18next';
import { push as pushRouter } from 'connected-react-router';

import type { Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import InfoIcon from '@material-ui/icons/Info';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withTitle from '../../hocs/with-title.hoc';
import { fetchTags } from '../../libs/tag/actions';
import { RootState } from '../../reducers';
import themeSelectors from '../../libs/theme/selectors';
import { MaterialStyleType } from '../../utils/types';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  fetchAllCustomForm,
  fetchAllCustomFormDisplayRule,
  fetchCompanyCustomSignUp,
  fetchCompanyCustomMemberForm,
  upsertCustomForm as upsertCustomFormAction,
} from '../../libs/custom-form/actions';
import {
  getSignUpCustomFormWithEnabledField,
  getMemberCustomFormWithEnabledField,
} from '../../libs/custom-form/selectors';
import CustomFormList from '../../libs/custom-form/components/CustomFormList.component';

import CustomFormView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
import type { WithHandlerType } from '../../utils/types';
import tagSelectors from '../../libs/tag/selectors';
import type { CustomForm } from '../../libs/custom-form/types';

type OwnProps = {
  isSubmitting: boolean;
  goToCustomFormPage: (formId: number) => void;
};

type StateHandlerInit = {
  customFormSelected: CustomForm | null;
  isSubmitting: boolean;
  selectedFormIsDirty: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>> &
  StateHandlerType;
export class FormsConfiguration extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyCustomSignUp({ company: this.props.theme.company });
    this.props.fetchCompanyCustomMemberForm({
      company: this.props.theme.company,
    });
    this.props.fetchTags();
  }

  getSelectedFormWithEnabledFields = (customForm: CustomForm) => {
    return {
      ...customForm,
      custom_form_field: customForm?.custom_form_field.filter(
        (field) => !field.disabled,
      ),
    };
  };

  selected = (id: number) => {
    if (id === this.props.customFormSelected?.id) {
      this.props.goToEdit(id);
    } else {
      this.props.handleCustomFormSelection(id);
    }
  };

  render() {
    const { classes, loading, t } = this.props;
    const customFormList = [
      this.props.signUpCustomForm,
      this.props.memberCustomForm,
    ];
    if (
      loading ||
      !this.props.signUpCustomForm ||
      !this.props.memberCustomForm
    ) {
      return <BackofficeLinearProgress />;
    }
    return (
      <div className={classes.container}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={6}>
            <div className={classes.textAndIconInner}>
              <InfoIcon className={classes.leftIcon} fontSize="small" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption">
                  {t('marketing:customForm.signUp.helperSignup')}
                </Typography>
                <Typography variant="caption">
                  {t('marketing:customForm.signUp.helperMemberForm')}
                </Typography>
              </div>
            </div>
            {customFormList && customFormList.length > 0 ? (
              <>
                <Paper>
                  {customFormList && (
                    <CustomFormList
                      customFormList={customFormList.filter(
                        (form: CustomForm) => !form.disabled,
                      )}
                      onClick={(id: number) => this.selected(id)}
                      onClickEdit={(id: number) => this.props.goToEdit(id)}
                      customFormSelected={this.props.customFormSelected?.id}
                    />
                  )}
                </Paper>
              </>
            ) : null}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.props.customFormSelected ? (
              <div style={{ flexWrap: 'wrap' }}>
                <Typography variant="h6" className={classes.divider}>
                  {t('marketing:customForm.content')}
                </Typography>
                <div className={classes.topButton}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      this.props.goToEdit(this.props.customFormSelected?.id)
                    }
                    className={classes.button}
                  >
                    <ArrowForwardIcon className={classes.leftIcon} />
                    {t('marketing:customForm.actions.configure')}
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      this.props.goToStatistics(
                        this.props.customFormSelected?.id,
                      )
                    }
                    className={classes.button}
                  >
                    <EqualizerIcon className={classes.leftIcon} />
                    {t('marketing:customForm.actions.statistics')}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      this.props.goToCustomization(
                        this.props.customFormSelected?.id,
                      )
                    }
                    className={classes.button}
                  >
                    <ViewCompactIcon className={classes.leftIcon} />
                    {t('marketing:customForm.actions.customization')}
                  </Button>
                </div>
                <Typography variant="h6">
                  {t('marketing:customForm.preview')}
                </Typography>
                <Paper className={classes.paperContainer}>
                  <CustomFormView
                    key={this.props.customFormSelected}
                    initial={this.props.customFormSelected}
                    asManager
                  />
                </Paper>
              </div>
            ) : (
              <>
                {customFormList && customFormList.length ? (
                  <div className={classes.emptyContainer}>
                    <div className={classes.column}>
                      <InfoIcon className={classes.leftIcon} />
                      <Typography variant="caption">
                        {t('customForm.selectCustomForm')}
                      </Typography>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  divider: {
    marginBottom: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(2),
  },
  textAndIconInner: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `solid 1px ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  emptyContainer: {
    padding: theme.spacing(10),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    paddingBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paperContainer: {
    padding: theme.spacing(6),
  },
});

const mapStateToProps = (state: RootState) => ({
  loading:
    state.customForm.signUp.loading || state.customForm.memberForm.loading,
  theme: themeSelectors.getTheme(state),
  signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
  memberCustomForm: getMemberCustomFormWithEnabledField(state),
  tag_groups: tagSelectors.getMemberTagGroups(state),
  tags: tagSelectors.getMemberTags(state),
});
const mapDispatchToProps = {
  fetchAllCustomForm,
  fetchAllCustomFormDisplayRule,
  push: pushRouter,
  fetchCompanyCustomSignUp,
  fetchCompanyCustomMemberForm,
  fetchTags,
  upsertCustomFormAction,
};

const withStateHandlersInit: StateHandlerInit = {
  customFormSelected: null,
  isSubmitting: false,
  selectedFormIsDirty: false,
};

const withStateHandlersSetter = {
  setCustomFormSelected: () => (customForm: CustomForm) => {
    return { customFormSelected: customForm };
  },
  setSubmitting: () => (isSubmitting: boolean) => {
    return { isSubmitting };
  },
  setSelectedFormIsDirty: () => (selectedFormIsDirty: boolean) => {
    return { selectedFormIsDirty };
  },
};

const mapWithHandlers = {
  upsertCustomForm: (props: OwnAndConnectedProps) => (form: CustomForm) => {
    props.setSubmitting(true);
    props.upsertCustomFormAction(form, {
      onSuccess: () => {
        props.setSubmitting(false);
        props.fetchCompanyCustomSignUp({ company: props.theme.company });
        props.fetchCompanyCustomMemberForm({ company: props.theme.company });
      },
      onError: () => props.setSubmitting(false),
    });
  },
  handleCustomFormSelection: (props: OwnAndConnectedProps) => (
    customFormId: number,
  ) => {
    if (customFormId === props.signUpCustomForm?.id) {
      return props.setCustomFormSelected(props.signUpCustomForm);
    }

    return props.setCustomFormSelected(props.memberCustomForm);
  },
  goToEdit: (props: OwnAndConnectedProps) => (formId: number) => {
    props.push(`/custom-form/details/${formId}/general`);
  },
  goToStatistics: (props: OwnAndConnectedProps) => (formId: number) => {
    props.push(`/custom-form/details/${formId}/statistics`);
  },
  goToCustomization: (props: OwnAndConnectedProps) => (formId: number) => {
    props.push(`/custom-form/details/${formId}/layout`);
  },
};
export default compose(
  withStyles(styles),
  withTranslation(['theme', 'marketing']),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
  withTitle(({ t }: { t: TFunction }) => t('theme:signUpForm.title')),
)(FormsConfiguration);

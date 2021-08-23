import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import LinkIcon from '@material-ui/icons/Link';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InfoIcon from '@material-ui/icons/Info';
import withTitle from '../../hocs/with-title.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchAllCustomForm,
  upsertCustomForm as upsertCustomFormActions,
} from '../../libs/custom-form/actions';
import { getCustomForm } from '../../libs/custom-form/selectors';
import CustomFormFormPaper from '../../libs/custom-form/components/form/customFormPaper/CustomFormPaper.component';
import CustomFormConsumerView from '../../libs/custom-form/components/consumer-form/CustomForm.form';
import { CustomForm } from '../../libs/custom-form/types';
import { snackbarSuccess } from '../../actions/snackbar.actions';
import { fetchTags } from '../../libs/tag/actions';
import tagSelectors from '../../libs/tag/selectors';

type StateHandlerInit = {
  customFormRefresh: CustomForm;
  customFormView: CustomForm;
  refreshLoading: boolean;
  isSubmitting: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {};
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
  }

  handleUpdateView = async (customFormRefresh: CustomForm) => {
    this.props.setRefreshLoading(true);
    this.props.setCustomFormRefresh(customFormRefresh);
    this.props.setCustomFormView({
      ...customFormRefresh,
      custom_form_field: customFormRefresh.custom_form_field.filter(
        (field) => !field.disabled,
      ),
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    this.props.setRefreshLoading(false);
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
  }

  render() {
    const { t, classes } = this.props;
    if (
      !this.props.customFormRefresh ||
      !this.props.customFormRefresh.custom_form_field ||
      this.props.loading
    ) {
      return <LinearProgress color="primary" />;
    }
    return (
      <div className={classes.container}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">
              {t('customForm.CustomFormLink')}
            </Typography>
            <CopyToClipboard
              text={`${window.location.origin}/m/${this.props.theme.company_name}/${this.props.theme.company}/form/${this.props.customForm.id}`}
            >
              <div className={classes.clipBoard}>
                <Paper className={classes.linkContainer}>
                  <ButtonBase
                    className={classes.buttonBase}
                    onClick={() => this.props.snackbarSuccess('link.copied')}
                  >
                    <LinkIcon className={classes.linkIcon} />
                    <Typography variant="caption">
                      {`${window.location.origin}/m/${this.props.theme.company_name}/${this.props.theme.company}/form/${this.props.customForm.id}`}
                    </Typography>
                  </ButtonBase>
                </Paper>
              </div>
            </CopyToClipboard>
            <div className={classes.textAndIcon}>
              <InfoIcon className={classes.leftIcon} fontSize="small" />
              <div className={classes.helperTextContainer}>
                <Typography>{t('customForm.linkHelper')}</Typography>
              </div>
            </div>
            <CustomFormFormPaper
              initial={this.props.customFormRefresh}
              onSubmit={this.props.upsertCustomForm}
              handleUpdateView={this.handleUpdateView}
              tag_groups={this.props.tag_groups}
              tags={this.props.tags}
              isSubmitting={this.props.isSubmitting}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.previewTitle}>
              {t('customForm.preview')}
            </Typography>
            <CustomFormConsumerView
              refreshLoading={
                this.props.refreshLoading ||
                this.props.loading ||
                this.props.isSubmitting
              }
              initial={this.props.customFormView}
              asManager
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}
const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  textAndIcon: {
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  helperTextContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: theme.spacing(0.5),
  },
  linkContainer: {
    padding: theme.spacing(1),
  },
  clipBoard: {
    paddingBottom: theme.spacing(2),
  },
  linkIcon: {
    marginRight: theme.spacing(1),
  },
  previewTitle: {
    paddingBottom: theme.spacing(1),
  },
  buttonBase: {
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
});
const mapStateToProps = (state: RootState, { id }: { id: number }) => ({
  customForm: getCustomForm(state, id),
  loading: state.customForm.upsert.loading,
  theme: state.theme.theme,
  tag_groups: tagSelectors.getMemberTagGroups(state),
  tags: tagSelectors.getMemberTags(state),
});
const mapDispatchToProps = {
  fetchAllCustomForm,
  upsertCustomFormActions,
  snackbarSuccess,
  fetchTags,
};
const mapWithHandlers = {
  upsertCustomForm: (props: OwnAndConnectedProps) => (form: CustomForm) => {
    props.setSubmitting(true);
    props.upsertCustomFormActions(form, {
      onSuccess: () => props.setSubmitting(false),
      onError: () => props.setSubmitting(false),
    });
  },
};
const withStateHandlersInit: StateHandlerInit = {
  customFormRefresh: null,
  customFormView: null,
  refreshLoading: false,
  isSubmitting: false,
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
};
export default compose<any, OwnProps>(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation('marketing'),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withTitle(({ customForm }: { customForm: CustomForm }) => {
    return customForm ? `${customForm.name}` : '';
  }),
  withHandlers(mapWithHandlers),
)(CustomFormDetail);

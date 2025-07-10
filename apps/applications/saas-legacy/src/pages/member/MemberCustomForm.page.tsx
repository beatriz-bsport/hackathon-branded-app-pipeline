import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';
import { TFunction } from 'i18next';
import Alert from '@material-ui/lab/Alert/Alert';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import withTitle from '../../hocs/with-title.hoc';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchMemberCustomFormFilled,
  fetchAllCustomForm,
} from '../../libs/custom-form/actions';
import {
  getMemberCustomFormFilled,
  excludeDraftCustomFormFilled,
  getCustomFormListWithEnabledFieldAnswered,
  getCustomFormListWithDisabledFieldAnswered,
} from '../../libs/custom-form/selectors';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import CustomFormCompletedList from '../../libs/custom-form/components/CustomFormCompletedList.component';
import CustomFormView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
// @ts-expect-error
import type { CustomFormFieldAnswerAPI } from '../../libs/custom-form/types';
import themeSelector from '../../libs/theme/selectors';

type StateHandlerInit = {
  customFormFilledSelected: boolean;
  customFormViewLoading: boolean;
  showDisabledField: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {};
// @ts-expect-error
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
// @ts-expect-error
type OwnAndConnectedProps = ConnectedProps & StateHandlerType;
type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation;
export class MemberCustomForm extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllCustomForm();
    this.props.fetchMemberCustomFormFilled(this.props.id);
  }

  setSelected = async (id: number) => {
    if (id !== this.props.customFormFilledSelected) {
      this.props.setCustomFormFilledSelected(id);
      this.props.setCustomFormViewLoading(true);
      this.props.setShowDisabledField(false);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      this.props.setCustomFormViewLoading(false);
    }
  };

  getCustomFormEnabledFieldWithAnswer = () => {
    return this.props.customFormWithAnswer.find(
      (form_filled: CustomFormFieldAnswerAPI) =>
        form_filled.custom_form_filled_id ===
        this.props.customFormFilledSelected,
    );
  };

  getCustomFormDisabledFieldWithAnswer = () => {
    return this.props.customFormDisabledFieldwithAnswer.find(
      (form_filled: CustomFormFieldAnswerAPI) =>
        form_filled.custom_form_filled_id ===
        this.props.customFormFilledSelected,
    );
  };

  render() {
    const { t, classes } = this.props;
    if (this.props.loading) {
      return <BackofficeLinearProgress additionalMargin={1} />;
    }
    return (
      <ObjectLevelPermissionWrapper requiredPermission="member.allowed_actions.readInfo">
        <Grid container direction="row" spacing={3}>
          <Grid item md={6} xs={12}>
            <Paper>
              <CustomFormCompletedList
                customFormFilledList={this.props.customFormFilledList}
                onClickItem={(id) => this.setSelected(id)}
              />
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className={classes.formContainer}>
              {this.props.customFormFilledSelected ? (
                this.getCustomFormEnabledFieldWithAnswer() && (
                  <>
                    {this.getCustomFormEnabledFieldWithAnswer()
                      ?.custom_form_field?.length ? (
                      <Paper className={classes.paperContainer}>
                        <CustomFormView
                          key={this.props.customFormFilledSelected}
                          asManager
                          disableLayout
                          shouldWrapLayerInCssHoc
                          general_terms_and_conditions={
                            this.props.theme.general_terms_of_use
                          }
                          initialWithAnswer={this.getCustomFormEnabledFieldWithAnswer()}
                          refreshLoading={this.props.customFormViewLoading}
                          waiver={this.props?.theme.waiver}
                        />
                      </Paper>
                    ) : (
                      <div className={classes.emptyContainer}>
                        <div className={classes.column}>
                          <Alert
                            className={classes.alertIcon}
                            // @ts-expect-error
                            color="grey"
                            severity="info"
                          >
                            {t('customForm.allFieldDisabled')}
                          </Alert>
                        </div>
                      </div>
                    )}
                  </>
                )
              ) : (
                <>
                  <div className={classes.emptyContainer}>
                    <div className={classes.column}>
                      <Alert
                        className={classes.alertIcon}
                        // @ts-expect-error
                        color="grey"
                        severity="info"
                      >
                        {' '}
                        {t('customForm.selectCustomFormFilled')}
                      </Alert>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className={classes.formContainer}>
              {this.props.customFormFilledSelected
                ? this.getCustomFormDisabledFieldWithAnswer()?.custom_form_field
                    ?.length !== 0 && (
                    <>
                      <ButtonBase
                        className={classes.disabledHeader}
                        onClick={() =>
                          this.props.setShowDisabledField(
                            !this.props.showDisabledField,
                          )
                        }
                      >
                        <Typography variant="h5">
                          {`${t('customForm.answerForDisabledField')} (${
                            this.getCustomFormDisabledFieldWithAnswer()
                              ?.custom_form_field?.length
                          })`}
                        </Typography>
                        {this.props.showDisabledField ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </ButtonBase>
                      <Divider className={classes.divider} />
                      <Collapse in={this.props.showDisabledField}>
                        <Paper className={classes.paperContainer}>
                          <CustomFormView
                            key={this.props.customFormFilledSelected}
                            asManager
                            disableLayout
                            general_terms_and_conditions={
                              this.props.theme.general_terms_of_use
                            }
                            initialWithAnswer={this.getCustomFormDisabledFieldWithAnswer()}
                            refreshLoading={this.props.customFormViewLoading}
                            waiver={this.props?.theme.waiver}
                          />
                        </Paper>
                      </Collapse>
                    </>
                  )
                : null}
            </div>
          </Grid>
        </Grid>
      </ObjectLevelPermissionWrapper>
    );
  }
}
const styles = (theme: Theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: theme.spacing(10),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formContainer: {
    marginBottom: theme.spacing(4),
  },
  disabledHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  paperContainer: {
    padding: theme.spacing(6),
  },
});

// @ts-expect-error
const mapStateToProps = (state: RootState, props: OwnAndConnectedProps) => ({
  theme: themeSelector.getTheme(state),
  loading: state.customForm.loading || state.customForm.filled.loading,
  // @ts-expect-error
  customFormFilledList: excludeDraftCustomFormFilled(getMemberCustomFormFilled)(
    state,
    // @ts-expect-error
    props.id,
  ),
  customFormWithAnswer: getCustomFormListWithEnabledFieldAnswered(state),
  customFormDisabledFieldwithAnswer:
    getCustomFormListWithDisabledFieldAnswered(state),
});
const mapDispatchToProps = {
  fetchAllCustomForm,
  fetchMemberCustomFormFilled,
};
const mapWithHandlers = {};
const withStateHandlersInit: StateHandlerInit = {
  customFormFilledSelected: null,
  customFormViewLoading: false,
  showDisabledField: false,
};
const withStateHandlersSetter = {
  setCustomFormFilledSelected:
    () => (customFormFilledSelected: number | null) => {
      return { customFormFilledSelected };
    },
  setCustomFormViewLoading: () => (customFormViewLoading: boolean) => {
    return { customFormViewLoading };
  },
  setShowDisabledField: () => (showDisabledField: boolean) => {
    return { showDisabledField };
  },
};
export default compose<any, OwnProps>(
  withTranslation(['marketing']),
  // @ts-expect-error
  withStyles(styles),
  routerParamsToProps({
    id: 'id:number',
  }),
  withTitle(({ t }: { t: TFunction }) => t('customForm.title')),
  // @ts-expect-error
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(MemberCustomForm);

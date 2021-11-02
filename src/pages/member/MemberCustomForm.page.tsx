import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';
import { TFunction } from 'i18next';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
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
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
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
      return <BackofficeLinearProgress />;
    }
    return (
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper>
            <CustomFormCompletedList
              customFormFilledList={this.props.customFormFilledList}
              onClickItem={(id) => this.setSelected(id)}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.formContainer}>
            {this.props.customFormFilledSelected ? (
              this.getCustomFormEnabledFieldWithAnswer() && (
                <>
                  {this.getCustomFormEnabledFieldWithAnswer()?.custom_form_field
                    ?.length ? (
                    <Paper className={classes.paperContainer}>
                      <CustomFormView
                        key={this.props.customFormFilledSelected}
                        initialWithAnswer={this.getCustomFormEnabledFieldWithAnswer()}
                        refreshLoading={this.props.customFormViewLoading}
                        asManager
                        waiver={this.props?.theme.waiver}
                        general_terms_and_conditions={
                          this.props.theme.general_terms_and_conditions
                        }
                      />
                    </Paper>
                  ) : (
                    <div className={classes.emptyContainer}>
                      <div className={classes.column}>
                        <InfoIcon className={classes.leftIcon} />
                        <Typography variant="caption">
                          {t('customForm.allFieldDisabled')}
                        </Typography>
                      </div>
                    </div>
                  )}
                </>
              )
            ) : (
              <>
                <div className={classes.emptyContainer}>
                  <div className={classes.column}>
                    <InfoIcon className={classes.leftIcon} />
                    <Typography variant="caption">
                      {t('customForm.selectCustomFormFilled')}
                    </Typography>
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
                      onClick={() =>
                        this.props.setShowDisabledField(
                          !this.props.showDisabledField,
                        )
                      }
                      className={classes.disabledHeader}
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
                          initialWithAnswer={this.getCustomFormDisabledFieldWithAnswer()}
                          refreshLoading={this.props.customFormViewLoading}
                          asManager
                          waiver={this.props?.theme.waiver}
                          general_terms_and_conditions={
                            this.props.theme.general_terms_and_conditions
                          }
                          layouts={this.props.customFormFilledSelected?.layout}
                        />
                      </Paper>
                    </Collapse>
                  </>
                )
              : null}
          </div>
        </Grid>
      </Grid>
    );
  }
}
const styles = (theme: Theme) => ({
  emptyContainer: {
    padding: theme.spacing(10),
  },

  leftIcon: {
    marginRight: theme.spacing(1),
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

const mapStateToProps = (state: RootState, props: OwnAndConnectedProps) => ({
  theme: themeSelector.getTheme(state),
  loading: state.customForm.loading || state.customForm.filled.loading,
  customFormFilledList: excludeDraftCustomFormFilled(getMemberCustomFormFilled)(
    state,
    props.id,
  ),
  customFormWithAnswer: getCustomFormListWithEnabledFieldAnswered(state),
  customFormDisabledFieldwithAnswer: getCustomFormListWithDisabledFieldAnswered(
    state,
  ),
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
  setCustomFormFilledSelected: () => (
    customFormFilledSelected: number | null,
  ) => {
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
  withStyles(styles),
  routerParamsToProps({
    id: 'id:number',
  }),
  withTitle(({ t }: { t: TFunction }) => t('customForm.title')),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(MemberCustomForm);

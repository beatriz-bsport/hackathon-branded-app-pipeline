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
  getCustomFormListWithAnswer,
} from '../../libs/custom-form/selectors';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import CustomFormCompletedList from '../../libs/custom-form/components/CustomFormCompletedList.component';
import CustomForm from '../../libs/custom-form/components/consumer-form/CustomForm.form';
import type { CustomFormFieldAnswerAPI } from '../../libs/custom-form/types';

type StateHandlerInit = {
  customFormFilledSelected: boolean;
  customFormViewLoading: boolean;
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
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      this.props.setCustomFormViewLoading(false);
    }
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
          {this.props.customFormFilledSelected ? (
            this.props.customFormWithAnswer.find(
              (form_filled: CustomFormFieldAnswerAPI) =>
                form_filled.custom_form_filled_id ===
                this.props.customFormFilledSelected,
            ) && (
              <CustomForm
                key={this.props.customFormFilledSelected}
                initialWithAnswer={this.props.customFormWithAnswer.find(
                  (form_filled: CustomFormFieldAnswerAPI) =>
                    form_filled.custom_form_filled_id ===
                    this.props.customFormFilledSelected,
                )}
                refreshLoading={this.props.customFormViewLoading}
                asManager
              />
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
});

const mapStateToProps = (state: RootState, props: OwnAndConnectedProps) => ({
  loading: state.customForm.loading || state.customForm.filled.loading,
  customFormFilledList: getMemberCustomFormFilled(state, props.id),
  customFormWithAnswer: getCustomFormListWithAnswer(state),
});
const mapDispatchToProps = {
  fetchAllCustomForm,
  fetchMemberCustomFormFilled,
};
const mapWithHandlers = {};
const withStateHandlersInit: StateHandlerInit = {
  customFormFilledSelected: null,
  customFormViewLoading: false,
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

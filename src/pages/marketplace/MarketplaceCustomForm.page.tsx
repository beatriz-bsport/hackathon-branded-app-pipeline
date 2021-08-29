import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { push as pushRouter } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CustomFormConsumerView from '../../libs/custom-form/components/consumer-form/CustomForm.form';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import {
  fetchCustomForm as fetchCustomFormAction,
  submitCustomForm as submitCustomFormAction,
} from '../../libs/custom-form/actions';
import { getCustomFormWithEnableField } from '../../libs/custom-form/selectors';
import ConsumerAppBar from '../checkout/ConsumerAppBar.container';
import CustomFormSubmitDialog from '../../libs/custom-form/components/consumer-form/CustomFormSubmit.dialog';
import type { CustomForm } from '../../libs/custom-form/types';
import { getMembership } from '../../libs/membership/selectors';
import { fetchMembership } from '../../libs/membership/actions';

type StateHandlerInit = {
  submitSuccess: boolean;
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

export class MarketplaceCustomForm extends React.Component<Props, State> {
  componentWillMount() {
    this.props.fetchMembership(this.props.companyId);
  }

  componentDidMount() {
    this.props.activeMemberShip &&
      this.props.fetchCustomForm({
        companyId: this.props.companyId,
        customFormId: this.props.customFormId,
        memberId: this.props.activeMemberShip.id,
      });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.activeMemberShip &&
      prevProps.activeMemberShip.company !==
        this.props.activeMemberShip.company &&
      !this.props.customFormWithEnabledField
    ) {
      this.props.fetchCustomForm({
        companyId: this.props.companyId,
        customFormId: this.props.customFormId,
        memberId: this.props.activeMemberShip.id,
      });
    }
  }

  getLoginUrl = () => {
    const { pathname } = this.props.location;
    return `/login/customer?next=${encodeURIComponent(
      `${pathname}${
        window.location.search ? window.location.search : '?'
      }&membership=${this.props.companyId}`,
    )}&membership=${this.props.companyId}`;
  };

  render() {
    const { classes, authenticated, t } = this.props;
    if (!authenticated) {
      return <Redirect to={this.getLoginUrl()} />;
    }
    if (
      this.props.customFormLoading ||
      !this.props.customFormWithEnabledField
    ) {
      return <LinearProgress color="primary" />;
    }
    return (
      <ConsumerAppBar>
        <div className={classes.container}>
          <Grid container className={classes.gridContainer}>
            <Grid item md={6} xs={12}>
              {this.props.customFormWithEnabledField.disabled ? (
                <Paper className={classes.disabledFormPaper}>
                  <Typography
                    variant="h5"
                    align="center"
                    className={classes.disabledTitle}
                  >
                    {t('customForm.unaccessibleForm')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      this.props.pushRouter(`/c/${this.props.companyId}`)
                    }
                  >
                    <ArrowForwardIcon className={classes.arrowIcon} />
                    {t('customForm.backToUserSpace')}
                  </Button>
                </Paper>
              ) : (
                <CustomFormConsumerView
                  initial={this.props.customFormWithEnabledField}
                  onSubmit={this.props.submitCustomForm}
                />
              )}
            </Grid>
          </Grid>
          <CustomFormSubmitDialog
            open={this.props.submitSuccess}
            goToUserSpace={() =>
              this.props.pushRouter(`/c/${this.props.companyId}`)
            }
          />
        </div>
      </ConsumerAppBar>
    );
  }
}
const styles = (theme: Theme) => ({
  container: {
    width: '100vw',
    height: '100vh',
    margin: 0,
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    width: '40%',
    margin: 'auto',
    paddingTop: theme.spacing(5),
  },
  disabledFormPaper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '20vh',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    border: '2px solid',
    borderColor: theme.palette.primary.main,
  },
  disabledTitle: {
    marginBottom: theme.spacing(2),
  },
  arrowIcon: {
    marginRight: theme.spacing(1),
  },
});
const mapStateToProps = (state: RootState, props: OwnAndConnectedProps) => ({
  activeMemberShip: getMembership(state, props.companyId),
  customFormLoading: state.customForm.loading,
  customFormWithEnabledField: getCustomFormWithEnableField(
    state,
    props.customFormId,
  ),
  authenticated: state.auth.authenticated,
});
const mapDispatchToProps = {
  fetchCustomForm: fetchCustomFormAction,
  submitCustomFormAction,
  fetchMembership,
  pushRouter,
};
const mapWithHandlers = {
  submitCustomForm: (props: OwnAndConnectedProps) => (
    form_filled: any,
    options: any,
  ) => {
    props.submitCustomFormAction(form_filled, props.companyId, {
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
        props.setSubmitSuccess(true);
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  },
};
const withStateHandlersInit: StateHandlerInit = {
  submitSuccess: false,
};
const withStateHandlersSetter = {
  setSubmitSuccess: () => (submitSuccess: boolean) => {
    return { submitSuccess };
  },
};
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  routerParamsToProps({
    companyId: 'companyId',
    customFormId: 'customFormId',
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withTitle(
    ({
      customFormWithEnabledField,
    }: {
      customFormWithEnabledField: CustomForm;
    }) => {
      return customFormWithEnabledField && customFormWithEnabledField.name;
    },
  ),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),

  withHandlers(mapWithHandlers),
)(MarketplaceCustomForm);

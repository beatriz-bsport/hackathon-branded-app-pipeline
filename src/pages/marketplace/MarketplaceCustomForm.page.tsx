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
import { createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { CUSTOM_FORM_CSS_VARIANT_ACTIVATED } from '#src/libs/custom-form/constants';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import {
  getLoginUrl as getLoginRedirectionUrl,
  getUserSpaceUrl,
} from '#src/libs/marketplace/routing-utils';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import {
  fetchCustomForm as fetchCustomFormAction,
  submitCustomForm as submitCustomFormAction,
} from '../../libs/custom-form/actions';
import {
  getCustomFormWithEnableField,
  withUserProfileData,
} from '../../libs/custom-form/selectors';
import ConsumerAppBar from '../checkout/ConsumerAppBar.container';
import CustomFormSubmitDialog from '../../libs/custom-form/components/consumer-form/CustomFormSubmit.dialog';
import type {
  CustomForm,
  CustomFormFieldAnswer,
} from '../../libs/custom-form/types';
import { getMembership } from '../../libs/membership/selectors';
import { fetchMembershipByCompany } from '../../libs/membership/actions';
import CustomFormView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
import { OptionCallback } from '../../state/types';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import themeSelectors from '../../libs/theme/selectors';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';

type StateHandlerInit = {
  submitSuccess: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type RouterParamsToPropsProps = {
  companyId: number;
  customFormId: number;
};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = RouterParamsToPropsProps &
  ConnectedProps &
  StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
type State = {};

export class MarketplaceCustomForm extends React.Component<Props, State> {
  UNSAFE_componentWillMount() {
    this.props.fetchMembershipByCompany(this.props.companyId);
  }

  componentDidMount() {
    if (this.props.activeMemberShip) {
      this.props.fetchCustomForm({
        companyId: this.props.companyId,
        customFormId: this.props.customFormId,
        memberId: this.props.activeMemberShip.id,
      });
      this.props.fetchCompanyTheme(this.props.companyId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.activeMemberShip &&
      (!prevProps.activeMemberShip ||
        prevProps.activeMemberShip.company !==
          this.props.activeMemberShip.company) &&
      !this.props.customFormWithEnabledField
    ) {
      this.props.fetchCustomForm({
        companyId: this.props.companyId,
        customFormId: this.props.customFormId,
        memberId: this.props.activeMemberShip.id,
      });
      this.props.fetchCompanyTheme(this.props.companyId);
    }
  }

  getLoginUrl = () => {
    // @ts-expect-error
    const { pathname } = this.props.location;
    return getLoginRedirectionUrl(
      this.props.companyId,
      pathname,
      window.location.search,
    );
  };

  goToMemberProfile = () => {
    this.props.pushRouter(getUserSpaceUrl(this.props.companyId));
  };

  render() {
    const { classes, authenticated, t } = this.props;
    if (!authenticated) {
      return <Redirect to={this.getLoginUrl()} />;
    }

    if (
      this.props.customFormLoading ||
      !this.props.customFormWithEnabledField ||
      !this.props.theme
    ) {
      return (
        /* Wrapper used here because the user can be redirected through a custom form link here without being a member.
           Thus no fetch are made here so props never changes and we stay inside this condition forever */
        <MemberShipValidationWrapper companyId={this.props.companyId}>
          <LinearProgress color="primary" />
        </MemberShipValidationWrapper>
      );
    }

    return (
      <MemberShipValidationWrapper companyId={this.props.companyId}>
        <ConsumerAppBar>
          <div className={classes.container}>
            <Grid container className={classes.gridContainer}>
              <Grid item md={6} xs={12}>
                {/* @ts-expect-error */}
                {this.props.customFormWithEnabledField?.disabled ||
                // @ts-expect-error
                this.props.customFormWithEnabledField?.is_signup ? (
                  <Paper className={classes.disabledFormPaper}>
                    <Typography
                      align="center"
                      className={classes.disabledTitle}
                      variant="h5"
                    >
                      {t('customForm.unaccessibleForm')}
                    </Typography>
                    <Button
                      color="primary"
                      onClick={this.goToMemberProfile}
                      variant="contained"
                    >
                      <ArrowForwardIcon className={classes.arrowIcon} />
                      {t('customForm.backToUserSpace')}
                    </Button>
                  </Paper>
                ) : (
                  <Paper className={classes.paperContainer}>
                    <CustomFormView
                      fieldsAreIndependent
                      general_terms_and_conditions={
                        this.props.theme.general_terms_of_use
                      }
                      // @ts-expect-error
                      initial={this.props.customFormWithEnabledField}
                      isCssVariantActivated={CUSTOM_FORM_CSS_VARIANT_ACTIVATED}
                      // @ts-expect-error
                      layouts={this.props.customFormWithEnabledField?.layout}
                      onSubmit={this.props.submitCustomForm}
                      waiver={this.props.theme.waiver}
                    />
                  </Paper>
                )}
              </Grid>
            </Grid>
            <CustomFormSubmitDialog
              goToUserSpace={this.goToMemberProfile}
              open={this.props.submitSuccess}
            />
          </div>
        </ConsumerAppBar>
      </MemberShipValidationWrapper>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
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
    paperContainer: {
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(6),
      },
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
      },
    },
  });

const mapStateToProps = (
  state: RootState,
  props: RouterParamsToPropsProps,
) => ({
  theme: themeSelectors.getTheme(state),
  activeMemberShip: getMembership(state, props.companyId),
  customFormLoading: state.customForm.loading,
  // @ts-expect-error
  customFormWithEnabledField: withUserProfileData(getCustomFormWithEnableField)(
    state,
    // @ts-expect-error
    props.customFormId,
  ),
  authenticated: state.auth.authenticated,
});
const mapDispatchToProps = {
  fetchCustomForm: fetchCustomFormAction,
  submitCustomFormAction,
  fetchMembershipByCompany,
  pushRouter,
  fetchCompanyTheme,
};
const mapWithHandlers = {
  submitCustomForm:
    (props: OwnAndConnectedProps) =>
    (form_filled: CustomFormFieldAnswer, options?: OptionCallback) => {
      props.submitCustomFormAction(
        // @ts-expect-error
        { form_filled: form_filled, companyId: props.companyId },
        {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            props.setSubmitSuccess(true);
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        },
      );
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
export default compose<any, Props>(
  withTranslation('marketing'),
  routerParamsToProps({
    // @ts-expect-error
    companyId: 'companyId',
    // @ts-expect-error
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
  marketplaceCssHoc(),
)(MarketplaceCustomForm);

// @flow
import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withHandlers } from 'recompose';
import { push } from 'connected-react-router';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import ValidateEmailWithToken from '#libs/login/components/ValidateEmailWithToken.component';
import { validateEmail as validateEmailAction } from '#libs/login/actions';
import ClassicLoginBackground from '#libs/login/components/ClassicLoginBackground.component';
import type { Theme as CompanyTheme } from '#libs/theme/types';

type OwnProps = {
  uid: string,
  token: string,
  validateEmail: (data: any, options: OptionCallback) => void,
  goToRoot: () => void,
};

export const ValidateEmailWithTokenPage = (props: OwnProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <ValidateEmailWithToken
        uid={props.uid}
        token={props.token}
        validateEmail={props.validateEmail}
        goToLogin={props.goToRoot}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    padding: theme.spacing(6),
    width: '100%',
    marginTop: '10vh',
    maxWidth: 600,
  },
}));

type ThemeProps = {
  theme: CompanyTheme,
};

type Props = OwnProps & ThemeProps;

export const ValidateEmailWithTokenPageWithBackground = (props: Props) => {
  return (
    <ClassicLoginBackground theme={props.theme}>
      <ValidateEmailWithTokenPage {...props} />
    </ClassicLoginBackground>
  );
};

export default compose(
  routerParamsToProps({ uid: 'uid', token: 'token' }),
  connect(null, {
    goToRoot: () => push('/'),
    validateEmail: validateEmailAction,
  }),
  withHandlers({
    validateEmail:
      ({ validateEmail, goToRoot }) =>
      (data, options) => {
        validateEmail(data, {
          onSuccess: (...args) => {
            if (options && options.onSuccess) options.onSuccess(...args);
            goToRoot();
          },
          onError: options && options.onError,
        });
      },
  }),
)(ValidateEmailWithTokenPageWithBackground);

// @flow
import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withHandlers } from 'recompose';
import { push } from 'connected-react-router';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import ValidateEmailWithToken from '../../libs/login/components/ValidateEmailWithToken.component';
import { validateEmail as validateEmailAction } from '../../libs/login/actions';

type Props = {
  uid: string,
  token: string,
  validateEmail: (data: any, options: OptionCallback) => void,
  goToRoot: () => void,
};

export const ValidateEmailWithTokenPage = (props: Props) => {
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

export default compose(
  routerParamsToProps({ uid: 'uid', token: 'token' }),
  connect(
    null,
    {
      goToRoot: () => push('/'),
      validateEmail: validateEmailAction,
    },
  ),
  withHandlers({
    validateEmail: ({ validateEmail, goToRoot }) => (data, options) => {
      validateEmail(data, {
        onSuccess: (...args) => {
          if (options && options.onSuccess) options.onSuccess(...args);
          goToRoot();
        },
        onError: options && options.onError,
      });
    },
  }),
)(ValidateEmailWithTokenPage);

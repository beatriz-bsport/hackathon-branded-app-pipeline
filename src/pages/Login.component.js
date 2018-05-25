import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Button, Grid, Input, Paper, } from '@material-ui/core';

import { auth as authActions } from '../redux/actions';

export class Login extends Component<{}> {
  render() {
    return (
      <Grid container direction='column' justify='center' alignItems='center'>
            <div>
              <Input label="Email" type="email"/>
            </div>
            <div>
              <Input label="Mot de passe" type="password"/>
            </div>
            <Button>OK</Button>
        </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login() {
      dispatch(authActions.login());
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);

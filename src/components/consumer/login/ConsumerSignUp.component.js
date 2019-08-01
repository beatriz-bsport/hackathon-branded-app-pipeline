// @flow

import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withNamespaces } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import type { TFunction } from 'react-i18next';
import api from '../../../api';
import { auth as authActions } from '../../../actions';
import SignUpForm from '../../form/SignUpForm.component';

type Props = {
  t: TFunction,
  authenticated: boolean,
  classes: Object,
  signUpEmail: ({
    phone: string,
    code: string,
    email: string,
    lastname: string,
    firstname: string,
  }) => void,
  updateProfile: ({
    email: string,
    lastname: string,
    firstname: string,
  }) => void,
};

type State = {
  loading: boolean,
  phone: string,
  email: string,
  lastname: string,
  firstname: string,
};

export class ConsumerSignUp extends Component<Props, State> {
  state = {
    loading: false,
    phone: '',
    email: '',
    firstname: '',
    lastname: '',
  };

  onChange = (phone: string) => {
    this.setState({ phone });
  };

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  onFormComplete = async (data: {
    phone: string,
    email: string,
    firstname: string,
    lastname: string,
  }) => {
    const { phone, email, firstname, lastname } = data;
    this.setState({ loading: true, email, phone, firstname, lastname });

    const response = await api.auth.requestSMSCode(phone);

    if (response.status === 200) {
      this.setState({
        loading: false,
      });
    } else {
      this.setState({ loading: false });
    }
  };

  validateEmail = (code: string) => {
    const { phone, email, firstname, lastname } = this.state;
    this.props.signUpEmail({ phone, code, email, lastname, firstname });
  };

  getContent = () => {
    const { loading } = this.state;
    if (loading) {
      return (
        <Grid container item justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      );
    }
    return <SignUpForm onComplete={this.onFormComplete} />;
  };

  render() {
    const { t, authenticated, updateProfile, classes } = this.props;
    if (authenticated) {
      const { email, firstname, lastname } = this.state;
      updateProfile({ email, firstname, lastname });
      return <Redirect to="/" />;
    }
    return (
      <Grid
        container
        direction="column"
        spacing={32}
        className={classes.container}
      >
        <Grid item>
          <Typography variant="h6">{t('form.signUpTitle')}</Typography>
        </Grid>
        <Grid item>{this.getContent()}</Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProfile({ email, firstname, lastname }) {
      dispatch(authActions.updateProfile({ email, firstname, lastname }));
    },
  };
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(
  withNamespaces()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(ConsumerSignUp),
  ),
);

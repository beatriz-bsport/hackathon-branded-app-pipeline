// @flow

import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/Help';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import RedButton from '../../button/RedButton.component';
import PasswordInput from '../../input/PasswordInput.component';

import { FormField } from '../../input';
import { openIntercomHelp } from '../../../intercom';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  headIcon: {
    height: 90,
    width: 90,
    marginBottom: theme.spacing(2),
  },
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  bottomButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  field: {
    marginBottom: theme.spacing(1),
  },
  errorMessage: {
    marginTop: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(2),
  },
  loginContainer: {
    maxWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    position: 'relative',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    minWidth: 300,
  },
});

type Props = {
  doEmailLogin: ({ email: string, password: string }) => void,
  requestSignUp: () => void,
  loading: boolean,
  classes: Object,
  error: ?boolean,
  errorFields: ?{
    email: ?string,
    password: ?string,
  },
  t: TFunction,
};

type State = {
  email: string,
  password: string,
};

type DividerProps = {
  t: TFunction,
};
function Divider(props: DividerProps) {
  const { t } = props;
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      direction="row"
      spacing={2}
      style={{ paddingLeft: 10, paddingRight: 10 }}
    >
      <Grid item>
        <div style={{ width: 50, height: 1, backgroundColor: '#E1E1E1' }} />
      </Grid>
      <Grid item style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Typography variant="caption">{t('or')}</Typography>
      </Grid>
      <Grid item>
        <div style={{ width: 50, height: 1, backgroundColor: '#E1E1E1' }} />
      </Grid>
    </Grid>
  );
}

export class ConsumerLogin extends Component<Props, State> {
  state = {
    email: '',
    password: '',
  };

  onFormFieldChange = (id: string) => (value: Object) => {
    this.setState({ [id]: value });
  };

  getEmailLogin = () => {
    const { classes, error, errorFields, t } = this.props;
    let errorMessage = t('error.authError');

    if (errorFields && errorFields.password) {
      errorMessage = t('error.invalidPassword');
    }
    if (errorFields && errorFields.email) {
      errorMessage = t('error.invalidEmail');
    }

    return (
      <div className={classes.loginContainer}>
        <IconButton
          style={{ position: 'absolute', top: 0, right: 0 }}
          onClick={() => openIntercomHelp('login')}
        >
          <HelpIcon />
        </IconButton>
        <PersonIcon className={classes.headIcon} />
        <form className={classes.column} onSubmit={this.doEmailLogin}>
          <FormField
            id="email"
            name="login"
            onChange={this.onFormFieldChange}
            fullWidth
            className={classes.field}
          />
          <PasswordInput
            fullWidth
            value={this.state.password}
            className={classes.field}
            onChange={(ev) =>
              this.onFormFieldChange('password')(ev.target.value)
            }
          />
          {error ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Typography color="error" className={classes.errorMessage}>
                {errorMessage}
              </Typography>
              <IconButton onClick={() => openIntercomHelp('login')}>
                <HelpIcon />
              </IconButton>
            </div>
          ) : null}
          <Button
            className={classes.bottomButton}
            color="primary"
            variant="contained"
            type="submit"
            id="btn-signin"
          >
            {t('actions.signin')}
          </Button>
          <a
            href="https://backoffice.bsport.io/login/reset_password"
            style={{ textDecoration: 'none' }}
          >
            <Typography color="secondary" variant="caption">
              {t('actions.forgottenPassword')}
            </Typography>
          </a>
        </form>
      </div>
    );
  };

  doEmailLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.doEmailLogin({ email, password });
  };

  render() {
    const { loading, t, classes } = this.props;

    if (loading) {
      return (
        <div className={classes.container}>
          <CircularProgress />
        </div>
      );
    }

    const { requestSignUp } = this.props;
    return (
      <div className={classes.container}>
        {this.getEmailLogin()}
        <Divider t={t} />
        <RedButton
          id="btn-goto-signup"
          variant="contained"
          onClick={requestSignUp}
        >
          {t('actions.signup')}
        </RedButton>
      </div>
    );
  }
}
export default withStyles(styles)(withTranslation(['login'])(ConsumerLogin));

// @flow
import React from 'react';

import { Typography, Button, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoginBase } from '../../components';

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit * 2,
    paddingTop: 0,
    marginTop: 0,
  },
  button: {
    margin: '8px auto',
    width: '100%',
  },
});

type Props = {
  t: (x: string) => string,
  classes: Object,
};

export function LoginChoice(props: Props) {
  const { classes, t } = props;
  return (
    <LoginBase>
      <div className={classes.container}>
        <Typography variant="subheading">
          {t('login.choseYourUserspace')}
        </Typography>
        <Link style={{ textDecoration: 'none' }} to="/login/customer">
          <Button
            id="btn-login-customer"
            color="primary"
            variant="contained"
            className={classes.button}
          >
            {t('login.loginAsConsumer')}
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/login/pro">
          <Button
            color="secondary"
            variant="contained"
            className={classes.button}
          >
            {t('login.loginAsPro')}
          </Button>
        </Link>
      </div>
    </LoginBase>
  );
}

export default withStyles(styles)(translate()(LoginChoice));

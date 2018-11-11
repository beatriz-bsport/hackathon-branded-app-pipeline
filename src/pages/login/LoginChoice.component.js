// @flow
import React, { Component } from 'react';

import { Typography, Button, Grid, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoginBase } from '../../components';

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 3,
    margin: theme.spacing.unit * 2,
    paddingTop: 0,
    marginTop: 0,
  },
});

type Props = {
  t: (x: string) => string,
  classes: Object,
};

export class LoginChoice extends Component<Props> {
  renderChoiceButtons = () => (
    <Grid container direction="column" alignItems="flex-start" spacing={24}>
      <Grid item>
        <Link style={{ textDecoration: 'none' }} to="/login/customer">
          <Button color="primary" variant="raised">
            {this.props.t('login.loginAsConsumer')}
          </Button>
        </Link>
      </Grid>
      <Grid item>
        <Link style={{ textDecoration: 'none' }} to="/login/pro">
          <Button color="secondary" variant="raised">
            {this.props.t('login.loginAsPro')}
          </Button>
        </Link>
      </Grid>
    </Grid>
  );

  render() {
    const { classes, t } = this.props;
    return (
      <LoginBase>
        <Grid
          className={classes.container}
          container
          direction="column"
          spacing={40}
          alignItems="flex-start"
        >
          <Grid item>
            <Typography variant="subheading">
              {t('login.choseYourUserspace')}
            </Typography>
          </Grid>
          <Grid item>{this.renderChoiceButtons()}</Grid>
        </Grid>
      </LoginBase>
    );
  }
}

export default withStyles(styles)(translate()(LoginChoice));

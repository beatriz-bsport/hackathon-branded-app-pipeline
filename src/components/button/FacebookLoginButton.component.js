// @flow
import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
  Button,
} from '@material-ui/core';

const FACEBOOK_LOGO = require('../../public/images/facebook.png');

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
const FACEBOOK_PERMISSIONS = 'public_profile,email,user_friends';

const facebookTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#3b5998',
    },
  },
});

type Props = {
  onClick: () => void,
  onLoginFinished: () => void,
  classes: Object,
};

export class FacebookLoginButton extends Component<Props> {
  onClick = () => {
    this.props.onClick();
  };

  responseFacebook = () => {
    this.props.onLoginFinished();
  };

  render() {
    const { classes } = this.props;
    return (
      <FacebookLogin
        appId={FACEBOOK_APP_ID}
        autoLoad
        fields={FACEBOOK_PERMISSIONS}
        callback={this.responseFacebook}
        render={(renderProps) => (
          <MuiThemeProvider theme={facebookTheme}>
            <Button
              variant="contained"
              color="primary"
              onClick={renderProps.onClick}
              className={classes.button}
            >
              <img
                src={FACEBOOK_LOGO}
                className={classes.facebookLogo}
                alt="facebook logo"
              />
              Connect
            </Button>
          </MuiThemeProvider>
        )}
      />
    );
  }
}

const styles = (theme) => ({
  button: {
    backgroundColor: '#3b5998',
  },
  facebookLogo: {
    height: 24,
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(FacebookLoginButton);

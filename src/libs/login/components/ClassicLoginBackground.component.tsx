import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import WidgetUtils from '#libs/widget/WidgetUtils';
import type { Theme as CompanyTheme } from '#libs/theme/types';

type Props = {
  children: React.ReactNode;
  theme?: CompanyTheme;
};

export const ClassicLoginBackground = (props: Props) => {
  const classes = useStyles(props);
  return (
    <Grid container>
      {!WidgetUtils.isWidget() && (
        <Hidden xsDown>
          <Grid item sm={6} md={6} lg={7} className={classes.logoContainer}>
            <div
              style={{
                position: 'fixed',
                zIndex: 0,
                width: '100vw',
                height: '100vh',
              }}
            />
            <Fade in>
              <img
                src={props.theme ? props.theme.cover : '/logo-fond-bleu.svg'}
                className={classes.logo}
                alt="bsport-logo"
              />
            </Fade>
          </Grid>
        </Hidden>
      )}
      <Grid
        item
        xs={12}
        sm={6 + (WidgetUtils.isWidget() ? 6 : 0)}
        md={6 + (WidgetUtils.isWidget() ? 6 : 0)}
        lg={5 + (WidgetUtils.isWidget() ? 7 : 0)}
        style={{ zIndex: 20 }}
      >
        <Paper elevation={16} className={classes.loginContainer}>
          {props.children}
        </Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(() => ({
  logoContainer: (props: Props) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: !!props.theme && props.theme.company ? 'white' : '#07162D',
    position: 'relative',
    zIndex: 9,
  }),
  logo: {
    marginTop: '-10%',
    maxWidth: '40%',
    position: 'absolute',
    zIndex: 20,
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
  },
}));

export default ClassicLoginBackground;

import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import {
  Fade,
  Hidden,
  isWidthDown,
  MuiThemeProvider,
  Paper,
  withWidth,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import themeSelectors from '#libs/theme/selectors';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import Welcome from '#libs/login/components/Welcome.component';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';
import { CompanyTheme } from '#libs/theme/types';
import LoginBackgroundComponent from '#libs/login/components/LoginBackground.component';
import { getTheme } from '../../theme';
import Config from '../../config';
import LanguageButton from '../../components/button/LanguageButton.component';

type Props = {
  fetchCompanyTheme: any;
  companyId: number;
  theme: CompanyTheme;

  width: Breakpoint;
};

export const WelcomePage = (props: Props) => {
  const classes = useStyles();

  const { fetchCompanyTheme, companyId } = props;

  const isMobile = isWidthDown('xs', props.width);

  useEffect(() => {
    fetchCompanyTheme(companyId);
  }, [fetchCompanyTheme, companyId]);
  let src: string = 'https://cdn.bsport.io/bsport_logo_txt.png';
  let alt: string = 'bsport-logo';
  if (props.theme) {
    src = props.theme.cover;
    alt = `${props.theme.company_name} - logo`;
  }

  return (
    <MuiThemeProvider theme={getTheme(props.theme)}>
      <Hidden xsDown>
        <LoginBackgroundComponent company />
        <Fade in>
          <div className={classes.header}>
            <img src={src} className={classes.logo} alt={alt} />

            <LanguageButton />
          </div>
        </Fade>
      </Hidden>
      <Paper
        className={classNames(classes.container, {
          [classes.containerIsMobile]: isMobile,
        })}
      >
        <Welcome
          companyName={props.theme.company_name}
          urlRedirection={
            props.theme.confirm_email_url_redirection ||
            `${Config.PUBLIC_URL}/c/${props.companyId}`
          }
          isMobile={isMobile}
        />
      </Paper>
    </MuiThemeProvider>
  );
};
const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    padding: 0,
    position: 'fixed',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    boxShadow: 'none',
    minWidth: '340px',
  },
  containerIsMobile: {
    top: '50%',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    zIndex: 2,
  },
  header: {
    display: 'flex',
    position: 'absolute',
    padding: theme.spacing(5),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9,
  },
  logo: {
    height: 50,
  },
  circularProgress: {
    position: 'fixed',
    top: '40%',
    left: '50%',
  },
}));

export default compose(
  routerParamsToProps({ membership: 'membership' }),
  withProps(({ membership }) => ({
    companyId: parseInt(membership),
  })),
  withWidth(),
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchCompanyTheme: fetchCompanyThemeAction,
    },
  ),
)(WelcomePage);

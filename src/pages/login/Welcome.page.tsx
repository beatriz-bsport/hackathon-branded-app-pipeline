import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { Fade, Hidden, Paper, makeStyles } from '@material-ui/core';
import themeSelectors from '#libs/theme/selectors';
// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import Welcome from '#libs/login/components/Welcome.component';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';
import { CompanyTheme } from '#libs/theme/types';
import LoginBackgroundComponent from '#libs/login/components/LoginBackground.component';
import Config from '../../config';
// @ts-expect-error
import LanguageButton from '../../components/button/LanguageButton.component';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import withThemeProvider from '#hocs/company-themifier.hoc';
import { RootState } from '../../reducers';

type Props = {
  fetchCompanyTheme: any;
  companyId: number;
  theme: CompanyTheme;
  simplifyUI?: boolean;
};

export const WelcomePage: React.FC<Props> = ({
  fetchCompanyTheme,
  companyId,
  theme,
  simplifyUI,
}) => {
  const classes = useStyles();

  useEffect(() => {
    fetchCompanyTheme(companyId);
  }, [fetchCompanyTheme, companyId]);
  let src: string = 'https://cdn.bsport.io/bsport_logo_txt.png';
  let alt: string = 'bsport-logo';
  if (theme) {
    src = theme.cover;
    alt = `${theme.company_name} - logo`;
  }

  return (
    <>
      {!simplifyUI && (
        <Hidden xsDown>
          <LoginBackgroundComponent company />
          <Fade in>
            <div className={classes.header}>
              <img src={src} className={classes.logo} alt={alt} />

              <LanguageButton />
            </div>
          </Fade>
        </Hidden>
      )}
      <Paper className={classes.container}>
        <Welcome
          companyName={theme.company_name}
          urlRedirection={
            theme.confirm_email_url_redirection ||
            `${Config.PUBLIC_URL}/c/${companyId}`
          }
          simplifyUI={simplifyUI}
        />
      </Paper>
    </>
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
    [theme.breakpoints.down('xs')]: {
      top: '50%',
    },
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
  connect(
    (state: RootState) => ({
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchCompanyTheme: fetchCompanyThemeAction,
    },
  ),
  withThemeProvider,
  marketplaceCssHoc(),
)(WelcomePage);

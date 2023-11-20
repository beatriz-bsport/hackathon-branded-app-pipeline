import React from 'react';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

import { CompanyTheme } from '#libs/theme/types';
import { Franchise } from '#libs/franchise/types';

// @ts-expect-error
import B_ASSET from '../../../public/images/b_dark.jpg';

interface FranchiseWithCompany extends Franchise {
  company_theme: CompanyTheme;
  company_name: string;
}

export type Props = {
  companyTheme: CompanyTheme;
  franchisor: FranchiseWithCompany;
  membership?: number;
  franchisorId?: number;
  simplifyUI?: boolean;
  processing?: boolean;
  hasExpired?: boolean;
  password1: string;
  password2: string;
  error?: string;
  requestResetLink: (
    membership: number | null,
    franchisorId: number | null,
  ) => void;
  handlePassword1Change: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handlePassword2Change: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
};

const useStyles = makeStyles<Theme, Pick<Props, 'simplifyUI'>>((theme) => ({
  formContainer: {
    margin: theme.spacing(2),
  },
  button: ({ simplifyUI }) => ({
    borderRadius: simplifyUI ? 24 : 8,
    width: '100%',
  }),
  container: {
    textAlign: 'center',
    padding: 0,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  bsportLogo: {
    position: 'absolute',
    objectFit: 'contain',
    width: '100%',
    height: '100%',
    maxWidth: '250px',
  },
  content: {
    padding: theme.spacing(1),
  },
  logoWrapper: {
    position: 'relative',
    paddingBottom: '56.2%',
    textAlign: 'start',
    display: 'flex',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    maxHeight: '250px',
  },
  fullWidth: {
    width: '100%',
  },
}));

const ChangePasswordForm: React.FC<Props> = ({
  companyTheme,
  franchisor,
  membership,
  franchisorId,
  simplifyUI,
  processing,
  hasExpired,
  password1,
  password2,
  error,
  handlePassword1Change,
  handlePassword2Change,
  requestResetLink,
  onSubmit,
}) => {
  const { t } = useTranslation(['translation', 'common']);
  const classes = useStyles({ simplifyUI });

  const theme = companyTheme || franchisor;

  return (
    <Paper className={classes.container}>
      <div className={classes.logoContainer}>
        <div className={classes.logoWrapper}>
          <img
            alt={`${theme?.company_name || 'bsport'} logo`}
            className={classes.bsportLogo}
            src={theme?.cover || B_ASSET}
          />
        </div>
      </div>
      <div className={classes.content}>
        <form className={classes.formContainer} onSubmit={onSubmit}>
          <Grid container alignItems="center" direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6">
                {t('form.login.changePasswordTitle')}
              </Typography>
            </Grid>
            {!hasExpired && (
              <Grid item className={classes.fullWidth}>
                <TextField
                  required
                  className={classes.fullWidth}
                  name="password"
                  onChange={handlePassword1Change}
                  placeholder={t('form.login.password')}
                  type="password"
                  value={password1}
                />
              </Grid>
            )}
            {!hasExpired && (
              <Grid item className={classes.fullWidth}>
                <TextField
                  required
                  className={classes.fullWidth}
                  name="passwordConfirm"
                  onChange={handlePassword2Change}
                  placeholder={t('form.login.confirmPassword')}
                  type="password"
                  value={password2}
                />
              </Grid>
            )}
            {error ? (
              <Grid item className={classes.fullWidth}>
                <Typography color="error" variant="caption">
                  {error}
                </Typography>
              </Grid>
            ) : null}
            <Grid item className={classes.fullWidth}>
              {!!processing && <CircularProgress />}
              {!processing && !hasExpired && (
                <Button
                  className={classes.button}
                  color="primary"
                  id="btn-new-password-confirm"
                  type="submit"
                  variant="contained"
                >
                  {t('common.ok')}
                </Button>
              )}
              {!!hasExpired && (
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={() => requestResetLink(membership, franchisorId)}
                  variant="contained"
                >
                  {t('form.login.resetAgainPassword')}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    </Paper>
  );
};

export default React.memo(ChangePasswordForm);

import React from 'react';
import '#csscomponents/Login/LoginBackground.css';
import Button from '@material-ui/core/Button';
import '#csscomponents/Login/styles.css';
import { useTranslation } from 'react-i18next';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Typography, useTheme, makeStyles } from '@material-ui/core';
import { LoginTitleCssHoc } from './LoginTitle.component';
import WelcomeIcon from '#components/icons/WelcomeIcon.component';
import { httpParser } from '#libs/marketplace/utils';

type Props = {
  companyName: string;
  urlRedirection?: string;
  simplifyUI?: boolean;
  onConfirm?: () => void;
};

export const WelcomeComponent: React.FC<Props> = ({
  companyName,
  urlRedirection,
  simplifyUI,
  onConfirm,
}) => {
  const { t } = useTranslation('login');
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.content}>
      <LoginTitleCssHoc
        isCompany={!!companyName}
        simplifyUI={simplifyUI}
        title={t('welcome.title', { companyName })}
      />
      {!simplifyUI && (
        <div className={classes.welcomeIconContainer}>
          <WelcomeIcon
            className={classes.welcomeIcon}
            fill={theme.palette.primary.main}
          />
        </div>
      )}
      <Typography className={classes.textExplain} variant="body1">
        {t('welcome.textExplain')}
      </Typography>
      {(!!urlRedirection || !!onConfirm) && (
        <Button
          className={classes.beginButton}
          color="primary"
          id="btn-begin"
          onClick={() => {
            if (urlRedirection) {
              window.location.href = httpParser(urlRedirection);
            } else if (typeof onConfirm === 'function') {
              onConfirm();
            }
          }}
          variant="contained"
        >
          {t('welcome.begin')}
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  welcomeIcon: {
    color: theme.palette.primary.main,
  },
  welcomeIconContainer: {
    display: 'flex',
    marginTop: '10vh',
    width: '110px',
    height: '110px',
    backgroundColor: lighten(theme.palette.primary.light, 0.4),
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textExplain: {
    marginTop: theme.spacing(6),
    maxWidth: '600px',
  },
  beginButton: {
    marginTop: theme.spacing(7),
    borderRadius: theme.spacing(4),
  },
}));

export default React.memo(WelcomeComponent);

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import TodayIcon from '@material-ui/icons/Today';
import ButtonBase from '@material-ui/core/ButtonBase';
import Slide from '@material-ui/core/Slide';

import { useTranslation } from 'react-i18next';

type Props = {
  isFranchisorNavigation: boolean;
  networkAvailable: boolean;
  navigateBackToFranchisor: () => void;
  environment?: string;
};

export const Banner = (props: Props) => {
  const {
    environment,
    networkAvailable,
    isFranchisorNavigation,
    navigateBackToFranchisor,
  } = props;
  const { t } = useTranslation(['titles']);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.visible}>
        {isFranchisorNavigation && (
          <Slide in={isFranchisorNavigation}>
            <ButtonBase
              onClick={navigateBackToFranchisor}
              className={classes.franchisorBanner}
            >
              <div className={classes.text}>
                {t('banner.franchiseConnection')}
              </div>
            </ButtonBase>
          </Slide>
        )}
        <Slide in={!networkAvailable}>
          <ButtonBase
            onClick={() => document.location.reload()}
            className={classes.errorBanner}
          >
            <div className={classes.text}>{t('banner.networkError')}</div>
          </ButtonBase>
        </Slide>
      </div>
      {environment === 'staging' && (
        <div className={classes.infoBanner}>
          <div className={classes.visible}>
            <a
              href="https://calendly.com/bsport/demoen?month=2020-07"
              style={{ textDecoration: 'none' }}
            >
              <Fab variant="extended" color="primary">
                <TodayIcon className={classes.leftIcon} />
                {t('banner.isStaging')}
              </Fab>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    zIndex: 999999,
    position: 'fixed',
    visibility: 'hidden',
    width: '100vw',
    height: '100vh',
  },
  errorBanner: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.error.dark,
  },
  franchisorBanner: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
  },
  infoBanner: {
    display: 'flex',
    justifyContent: 'center',
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  text: {
    color: '#FEFEFE',
    fontSize: 14,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1) / 4,
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  visible: {
    visibility: 'visible',
  },
}));

export default Banner;

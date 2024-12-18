import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Slide from '@material-ui/core/Slide';

import { useTranslation } from 'react-i18next';

type Props = {
  networkAvailable: boolean;
};

export const Banner = (props: Props) => {
  const { networkAvailable } = props;
  const { t } = useTranslation(['titles']);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.visible}>
        <Slide in={!networkAvailable}>
          <ButtonBase
            className={classes.errorBanner}
            // @ts-expect-error
            onClick={() => document.location.reload(true)}
          >
            <div className={classes.text}>{t('banner.networkError')}</div>
          </ButtonBase>
        </Slide>
      </div>
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

// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import TodayIcon from '@material-ui/icons/Today';
import ButtonBase from '@material-ui/core/ButtonBase';
import { compose } from 'recompose';
import Slide from '@material-ui/core/Slide';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  networkAvailable: boolean,
  environment: ?string,
  t: TFunction,
  classes: Object,
};

export const Banner = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <div style={{ visibility: 'visible' }}>
        <Slide in={!props.networkAvailable}>
          <ButtonBase
            onClick={() => document.location.reload(true)}
            className={props.classes.errorBanner}
          >
            <div className={props.classes.text}>
              {props.t('banner.networkError')}
            </div>
          </ButtonBase>
        </Slide>
      </div>
      {props.environment === 'staging' ? (
        <div className={props.classes.infoBanner}>
          <div style={{ visibility: 'visible' }}>
            <a
              href="https://calendly.com/bsport/demoen?month=2020-07"
              style={{ textDecoration: 'none' }}
            >
              <Fab variant="extended" color="primary">
                <TodayIcon className={props.classes.leftIcon} />
                {props.t('banner.isStaging')}
              </Fab>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const styles = (theme) => ({
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
    padding: theme.spacing(1) / 4,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['titles']),
  withStyles(styles),
)(Banner);

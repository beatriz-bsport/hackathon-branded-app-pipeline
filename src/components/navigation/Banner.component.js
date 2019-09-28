// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import TodayIcon from '@material-ui/icons/Today';
import ButtonBase from '@material-ui/core/ButtonBase';
import { compose } from 'recompose';
import Slide from '@material-ui/core/Slide';

import { withNamespaces } from 'react-i18next';
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
      <div className={props.classes.infoBanner}>
        <div style={{ visibility: 'visible' }}>
          <Fade in={props.environment === 'staging'}>
            <a
              href="https://bsport.io/api-v0/redirect?type=demo&site=https://app.hubspot.com/meetings/zmansour"
              style={{ textDecoration: 'none' }}
            >
              <Fab variant="extended" color="primary">
                <TodayIcon className={props.classes.leftIcon} />
                {props.t('banner.isStaging')}
              </Fab>
            </a>
          </Fade>
        </div>
      </div>
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
    marginBottom: theme.spacing.unit * 2,
  },
  text: {
    color: '#FEFEFE',
    fontSize: 14,
    padding: theme.spacing.unit / 4,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['titles']),
  withStyles(styles),
)(Banner);

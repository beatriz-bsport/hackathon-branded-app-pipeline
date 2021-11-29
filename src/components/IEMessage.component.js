// @flow
import React from 'react';

import { compose, withStateHandlers } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';

import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import firefox from './browser-icon/firefox_logo.png';
import chrome from './browser-icon/chrome_logo.png';

type Props = {
  classes: Object,
  t: TFunction,
  open: boolen,
  close: () => void,
};

export function IEMessage(props: Props) {
  return (
    <UserAgentProvider ua={window.navigator.userAgent}>
      <UserAgent returnFullParser>
        {(parser) => {
          const { name: browserName, major: browserMajor } =
            parser.getBrowser();

          const shouldDialogOpen =
            (browserName === 'IE' && parseInt(browserMajor, 10) <= 11) ||
            (browserName === 'Safari' && parseInt(browserMajor, 10) <= 10);
          if (shouldDialogOpen) {
            return (
              <Dialog open={props.open}>
                <DialogContent>
                  <div className={props.classes.explainText}>
                    <Typography>
                      {props.t('deprecatedNavigator.navigatorError')}
                    </Typography>
                  </div>
                  <div className={props.classes.row}>
                    <img
                      src={firefox}
                      alt="Firefox logo"
                      className={props.classes.image}
                    />
                    <a
                      href="https://www.mozilla.org/fr/firefox/new/"
                      target="blank"
                      className={props.classes.link}
                    >
                      {props.t('deprecatedNavigator.downloadFirefox')}
                    </a>
                  </div>
                  <div className={props.classes.row}>
                    <img
                      src={chrome}
                      alt="Chrome logo"
                      className={props.classes.image}
                    />
                    <a
                      href="https://www.google.com/chrome/"
                      target="blank"
                      className={props.classes.link}
                    >
                      {props.t('deprecatedNavigator.downloadChrome')}
                    </a>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={props.close}>
                    {props.t('deprecatedNavigator.close')}
                  </Button>
                </DialogActions>
              </Dialog>
            );
          }
          return null;
        }}
      </UserAgent>
    </UserAgentProvider>
  );
}

const styles = (theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  explainText: {
    paddingBottom: theme.spacing(2),
  },
  image: {
    width: '50px',
    height: 'auto',
    marginRight: theme.spacing(2),
  },
  link: {
    color: 'inherit',
    fontWeight: 'bold',
  },
});

export default compose(
  withTranslation(['navigation']),
  withStyles(styles),
  withStateHandlers({ open: true }, { close: () => () => ({ open: false }) }),
)(IEMessage);

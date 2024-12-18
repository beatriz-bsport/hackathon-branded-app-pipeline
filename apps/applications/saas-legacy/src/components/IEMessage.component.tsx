import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import firefox from './browser-icon/firefox_logo.png';
import chrome from './browser-icon/chrome_logo.png';
import type UAParser from 'ua-parser-js';

interface BrowserInfo {
  name: string;
  major: string;
}

const IEMessage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const classes = useStyles();
  const { t } = useTranslation(['navigation']);

  const closeDialogModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <UserAgentProvider ua={window.navigator.userAgent}>
      <UserAgent returnFullParser>
        {(parser: UAParser) => {
          const { name: browserName, major: browserMajor }: BrowserInfo =
            parser.getBrowser();

          const shouldDialogOpen =
            (browserName === 'IE' && parseInt(browserMajor, 10) <= 11) ||
            (browserName === 'Safari' && parseInt(browserMajor, 10) <= 10);

          return (
            shouldDialogOpen && (
              <Dialog open={isOpen}>
                <DialogContent>
                  <div className={classes.explainText}>
                    <Typography>
                      {t('deprecatedNavigator.navigatorError')}
                    </Typography>
                  </div>
                  <div className={classes.row}>
                    <img
                      alt="Firefox logo"
                      className={classes.image}
                      src={firefox}
                    />
                    <a
                      className={classes.link}
                      href="https://www.mozilla.org/fr/firefox/new/"
                      target="blank"
                    >
                      {t('deprecatedNavigator.downloadFirefox')}
                    </a>
                  </div>
                  <div className={classes.row}>
                    <img
                      alt="Chrome logo"
                      className={classes.image}
                      src={chrome}
                    />
                    <a
                      className={classes.link}
                      href="https://www.google.com/chrome/"
                      target="blank"
                    >
                      {t('deprecatedNavigator.downloadChrome')}
                    </a>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeDialogModal}>
                    {t('deprecatedNavigator.close')}
                  </Button>
                </DialogActions>
              </Dialog>
            )
          );
        }}
      </UserAgent>
    </UserAgentProvider>
  );
};

const useStyles = makeStyles((theme) => ({
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
}));

export default React.memo(IEMessage);

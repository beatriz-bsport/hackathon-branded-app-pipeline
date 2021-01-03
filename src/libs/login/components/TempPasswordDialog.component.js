// @flow
import React from 'react';
import { withProps, withState, compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import LinkIcon from '@material-ui/icons/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import RedButton from '../../../components/button/RedButton.component';
import { formatAsTime } from '../../../utils/datetime';

type Props = {
  tempPassword: ?string,
  classes: Object,
  passwordCopied: boolean,
  tempPasswordExpirationDate: ?string,
  setPasswordCopied: (boolean) => void,
  resetAndClose: () => void,
  requestPassword: () => void,
  open: boolean,
  loading: boolean,
  step: number,
  t: TFunction,
};

const STEP_EXPLAIN = 0;
const STEP_SHOW = 1;

export const TempPasswordDialog = (props: Props) => {
  if (props.loading) {
    return (
      <Dialog open={props.open}>
        <DialogTitle>{props.t('tempPassword.title')}</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.resetAndClose}>
            {props.t('tempPassword.close')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  if (props.step === STEP_EXPLAIN) {
    return (
      <Dialog open={props.open}>
        <DialogTitle>{props.t('tempPassword.title')}</DialogTitle>
        <DialogContent>{props.t('tempPassword.explainRequest')}</DialogContent>
        <DialogActions>
          <Button onClick={props.resetAndClose}>
            {props.t('tempPassword.close')}
          </Button>
          <RedButton onClick={props.requestPassword}>
            {props.t('tempPassword.submit')}
          </RedButton>
        </DialogActions>
      </Dialog>
    );
  }
  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.t('tempPassword.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="h6" component="p">
          {props.tempPassword}
        </Typography>
        <div className={props.classes.clipboard}>
          <CopyToClipboard text={props.tempPassword}>
            <ButtonBase
              className={props.classes.link}
              onClick={() => props.setPasswordCopied(true)}
            >
              <LinkIcon />
              <Typography className={props.classes.linkTypo}>
                {props.t('login:tempPassword:copy')}
              </Typography>
            </ButtonBase>
          </CopyToClipboard>
          {props.passwordCopied ? (
            <Typography
              className={props.classes.copied}
              variant="secondary"
              color="textSecondary"
              component="span"
            >
              {props.t('login:tempPassword.copied')}
            </Typography>
          ) : null}
        </div>
        <Typography color="textSecondary">
          {props.t('tempPassword.explain', {
            expirationDate: formatAsTime(props.tempPasswordExpirationDate),
          })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.resetAndClose}>
          {props.t('tempPassword.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = (theme) => ({
  link: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
  },
  linkTypo: {
    paddingLeft: theme.spacing(1),
  },
  clipboard: {
    display: 'flex',
    alignItems: 'center',
  },
  copied: {
    paddingLeft: theme.spacing(3),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['login']),
  withState('step', 'setStep', STEP_EXPLAIN),
  withState('passwordCopied', 'setPasswordCopied', false),
  withProps(
    ({ setStep, setPasswordCopied, generateTempPassword, onClose }) => ({
      requestPassword: () => {
        generateTempPassword();
        setStep(STEP_SHOW);
      },
      resetAndClose: () => {
        setStep(STEP_EXPLAIN);
        setPasswordCopied(false);
        onClose();
      },
    }),
  ),
)(TempPasswordDialog);

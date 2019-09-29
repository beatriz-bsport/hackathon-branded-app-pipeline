// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { withProps, withState, compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import RedButton from '../../../components/button/RedButton.component';
import { formatAsTime } from '../../../datetime';

type Props = {
  tempPassword: ?string,
  tempPasswordExpirationDate: ?string,
  resetAndClose: () => void,
  requestPassword: () => void,
  open: boolean,
  loading: boolean,
  step: number,
  t: TFunction,
  classes: Object,
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
        <Typography
          variant="h6"
          component="p"
          className={props.classes.password}
        >
          {props.tempPassword}
        </Typography>
        <Typography color="textSecondary" className={props.classes.password}>
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
  container: {},
});

export default compose(
  withNamespaces(['login']),
  withStyles(styles),
  withState('step', 'setStep', STEP_EXPLAIN),
  withProps(({ setStep, generateTempPassword, onClose }) => ({
    requestPassword: () => {
      generateTempPassword();
      setStep(STEP_SHOW);
    },
    resetAndClose: () => {
      setStep(STEP_EXPLAIN);
      onClose();
    },
  })),
)(TempPasswordDialog);

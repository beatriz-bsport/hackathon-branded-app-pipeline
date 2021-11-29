// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { compose, withState } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import RedButton from '../../../components/button/RedButton.component';

type Props = {
  username: string,
  password: string,
  setUsername: (string) => void,
  setPassword: (string) => void,

  onSubmit: (string, string) => void,
  authError: boolean,

  open: boolean,
  onClose: () => void,
  t: TFunction,
};

export const CheckInSignout = (props: Props) => {
  const { t } = props;
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          props.onSubmit(props.username, props.password);
        }}
      >
        <DialogTitle>{t('signout.title')}</DialogTitle>
        <DialogContent>
          {t('signout.explain')}
          <div
            style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}
          >
            <TextField
              required
              type="email"
              label={t('signout.form.username.label')}
              onChange={(ev) => props.setUsername(ev.target.value)}
              value={props.username}
            />
            <TextField
              required
              type="password"
              label={t('signout.form.password.label')}
              onChange={(ev) => props.setPassword(ev.target.value)}
              value={props.password}
            />
          </div>
          <div style={{ paddingTop: 12 }}>
            <Typography color="error">
              {props.authError ? t('signout.passwordError') : <br />}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>{t('signout.cancel')}</Button>
          <RedButton type="submit">{t('signout.signout')}</RedButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default compose(
  withTranslation(['selfCheckIn']),
  withState('password', 'setPassword', ''),
  withState('username', 'setUsername', ''),
)(CheckInSignout);

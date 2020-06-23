// @flow

import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

type Props = {
  t: TFunction,
  email: string,
  setEmail: (SyntheticEvent<HTMLElement>) => void,
  submit: (email: string) => void,
  onCancel: () => void,
};

export const CoachEmailCheckDialog = (props: Props) => (
  <div>
    <DialogTitle>{props.t('forms.linkByEmail.title')}</DialogTitle>
    <DialogContent>
      <Typography>{props.t('forms.linkByEmail.explain')}</Typography>
      <TextField
        type="email"
        style={{ marginTop: 16 }}
        placeholder={props.t('forms.linkByEmail.emailPlaceHolder')}
        label={props.t('forms.linkByEmail.emailLabel')}
        onChange={(ev) => props.setEmail(ev.target.value)}
        value={props.email}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onCancel}>
        {props.t('forms.linkByEmail.cancel')}
      </Button>
      <Button
        onClick={() => props.submit(props.email)}
        color="primary"
        variant="contained"
      >
        {props.t('forms.linkByEmail.submit')}
      </Button>
    </DialogActions>
  </div>
);

export default compose(
  withTranslation(['coach']),
  withState('email', 'setEmail', ''),
)(CoachEmailCheckDialog);

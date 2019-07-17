// @flow
import React from 'react';
import { compose, withState } from 'recompose';

import TextField from '@material-ui/core/TextField';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  fullWidth: ?boolean,
  value: ?string,
  isVisible: boolean,
  toogleVisible: (boolean) => void,
  onChange: (SyntheticEvent<HTMLElement>) => void,
  t: TFunction,
};

export const PasswordInput = (props: Props) => (
  <TextField
    value={props.value}
    fullWidth={props.fullWidth}
    autocomplete="current-password"
    label={props.t('forms.password.label')}
    type={props.isVisible ? 'text' : 'password'}
    onChange={props.onChange}
    InputProps={
      props.isVisible
        ? {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => props.toogleVisible(!props.isVisible)}
                >
                  <VisibilityIcon />
                </IconButton>
              </InputAdornment>
            ),
          }
        : {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => props.toogleVisible(!props.isVisible)}
                >
                  <VisibilityOffIcon />
                </IconButton>
              </InputAdornment>
            ),
          }
    }
  />
);

export default compose(
  withNamespaces(['login']),
  withState('isVisible', 'toogleVisible', false),
)(PasswordInput);

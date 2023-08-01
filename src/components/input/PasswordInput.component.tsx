import React from 'react';

import TextField from '@material-ui/core/TextField';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import { useTranslation } from 'react-i18next';

type Props = {
  fullWidth?: boolean;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLElement>) => void;
  error?: Error | boolean;
  label?: string;
  helperText?: string;
  disabled?: boolean;
};

export const PasswordInput = (props: Props) => {
  const { t } = useTranslation(['login']);
  const [isVisible, toogleVisible] = React.useState<boolean>(false);
  return (
    <TextField
      autoComplete="current-password"
      data-testid="password"
      disabled={props.disabled}
      error={!!props.error}
      fullWidth={props.fullWidth}
      helperText={props.helperText}
      id="textfield_password"
      InputProps={
        isVisible
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toogleVisible(!isVisible)}>
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toogleVisible(!isVisible)}>
                    <VisibilityOffIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }
      }
      label={props.label || t('forms.password.label')}
      onChange={props.onChange}
      type={isVisible ? 'text' : 'password'}
      value={props.value}
    />
  );
};

export default PasswordInput;

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
  helperText: string;
};

export const PasswordInput = (props: Props) => {
  const { t } = useTranslation(['login']);
  const [isVisible, toogleVisible] = React.useState<boolean>(false);
  return (
    <TextField
      id="textfield_password"
      value={props.value}
      fullWidth={props.fullWidth}
      autoComplete="current-password"
      error={!!props.error}
      label={props.label || t('forms.password.label')}
      helperText={props.helperText}
      type={isVisible ? 'text' : 'password'}
      onChange={props.onChange}
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
    />
  );
};

export default PasswordInput;

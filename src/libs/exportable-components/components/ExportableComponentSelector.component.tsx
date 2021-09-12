import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  source: string[];
  value: string;
  onChange: (type: string) => void;
  error?: string;
}

const ExportableComponentSelector = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation('settings');
  const { value, onChange, error } = props;

  return (
    <FormControl className={classes.fullWidth}>
      <InputLabel>
        {t('marketplaceSettings.createDialog.selectComponent')}
      </InputLabel>
      <Select
        value={value}
        color="primary"
        onChange={(ev: any) => onChange(ev.target.value)}
      >
        {props.source.map((component) => {
          return (
            <MenuItem key={component} value={component}>
              {t(`marketplaceSettings.componentType.${component}`)}
            </MenuItem>
          );
        })}
      </Select>
      {error && <Typography color="error">{error}</Typography>}
    </FormControl>
  );
};

export default ExportableComponentSelector;

const useStyles = makeStyles(() => ({
  fullWidth: {
    width: '100%',
  },
}));

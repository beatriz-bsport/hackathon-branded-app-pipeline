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

import { MarketplaceComponentsEnum, WidgetComponentsEnum } from '../types';

interface Props {
  source: string[];
  value: MarketplaceComponentsEnum | WidgetComponentsEnum;
  onChange: (type: MarketplaceComponentsEnum | WidgetComponentsEnum) => void;
  error?: string;
}

const MarketplaceComponentTypeSelector: React.FC<Props> = (props) => {
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

export default MarketplaceComponentTypeSelector;

const useStyles = makeStyles(() => ({
  fullWidth: {
    width: '100%',
  },
}));

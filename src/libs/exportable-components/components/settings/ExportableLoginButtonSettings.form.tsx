import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import type { MarketplaceLoginButtonWidgetConfig } from '#src/libs/exportable-components/types';

interface Props {
  config?: MarketplaceLoginButtonWidgetConfig;
  onChange: (config: MarketplaceLoginButtonWidgetConfig) => void;
}

type PickBooleans<T> = {
  [K in keyof T as T[K] extends boolean | undefined ? K : never]: T[K];
};

const defaultConfig: MarketplaceLoginButtonWidgetConfig = {
  openMemberProfile: true,
};

const ExportableLoginButtonSettings: React.FC<Props> = ({
  config,
  onChange,
}) => {
  const classes = useStyles('widget');
  const { t } = useTranslation();

  const handleBooleanChange = useCallback(
    (key: keyof PickBooleans<MarketplaceLoginButtonWidgetConfig>) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        onChange({ ...config, [key]: checked });
      },
    [onChange, config],
  );

  return (
    <div className={classes.flexColumn}>
      <FormControlLabel
        control={
          <Switch
            checked={
              config?.openMemberProfile ?? defaultConfig?.openMemberProfile
            }
            color="primary"
            onChange={handleBooleanChange('openMemberProfile')}
          />
        }
        label={t('widget.loginButton.openMemberProfile')}
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

export default React.memo(ExportableLoginButtonSettings);

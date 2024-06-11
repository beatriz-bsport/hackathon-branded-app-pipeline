import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';

import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';
import type { DisconnectedStatusWidgetConfig } from '#src/libs/login/types';

interface Props {
  config?: DisconnectedStatusWidgetConfig;
  onChange: (config: DisconnectedStatusWidgetConfig) => void;
}

type PickBooleans<T> = {
  [K in keyof T as T[K] extends boolean | undefined ? K : never]: T[K];
};

type PickStrings<T> = {
  [K in keyof T as T[K] extends string | undefined ? K : never]: T[K];
};

const ExportableLoginWithDisconnectedStatusSettingsForm: React.FC<Props> = ({
  config = {},
  onChange,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleStringChange = useCallback(
    (key: keyof PickStrings<DisconnectedStatusWidgetConfig>) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        onChange({ ...config, [key]: value });
      },
    [onChange, config],
  );

  const handleBooleanChange = useCallback(
    (key: keyof PickBooleans<DisconnectedStatusWidgetConfig>) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        onChange({ ...config, [key]: checked });
      },
    [onChange, config],
  );

  if (!config) {
    return null;
  }

  return (
    <div className={classes.flexCol}>
      <Typography variant="subtitle1">
        {t('widget:widget.disconnectedStatusConfigTitle')}
      </Typography>
      <TextField
        label={t('widget:widget.newsletterV2.title')}
        onChange={handleStringChange('loginTitle')}
        value={config?.loginTitle}
      />
      <FormControlLabel
        control={
          <Switch
            checked={config?.showTitle}
            color="primary"
            onChange={handleBooleanChange('showTitle')}
          />
        }
        label={t('widget:widget.newsletterV2.showTitle')}
      />

      <TextField
        label={t('widget:widget.newsletterV2.subtitle')}
        onChange={handleStringChange('loginSubtitle')}
        value={config?.loginSubtitle}
      />
      <FormControlLabel
        control={
          <Switch
            checked={config?.showSubtitle}
            color="primary"
            onChange={handleBooleanChange('showSubtitle')}
          />
        }
        label={t('widget:widget.newsletterV2.showSubtitle')}
      />

      <FormControlLabel
        control={
          <Switch
            checked={config?.hideWhenNotLoggedIn}
            color="primary"
            onChange={handleBooleanChange('hideWhenNotLoggedIn')}
          />
        }
        label={t('widget:widget.hideWidgets')}
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

export default React.memo(ExportableLoginWithDisconnectedStatusSettingsForm);

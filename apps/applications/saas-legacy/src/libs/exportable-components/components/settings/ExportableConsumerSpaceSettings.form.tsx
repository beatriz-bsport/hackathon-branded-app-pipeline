import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import ExportableLoginWithDisconnectedStatusSettingsForm from './ExportableLoginWithDisconnectedStatusSettings.form';

import type {
  ConsumerSpaceWidgetConfig,
  ConsumerSpaceWidgetPage,
} from '#src/libs/exportable-components/types';

interface Props {
  config?: ConsumerSpaceWidgetConfig;
  onChange: (config: ConsumerSpaceWidgetConfig) => void;
}

const CONSUMER_SPACE_AVAILABLE_PAGES: ConsumerSpaceWidgetPage[] = [
  'consumerBooking',
  'consumerPass',
  'consumerProfile',
  'consumerSubscription',
  'consumerInvoice',
];

const ExportableConsumerSpaceSettingsForm: React.FC<Props> = ({
  config = {},
  onChange,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const setDefaultPage = useCallback(
    (value: ConsumerSpaceWidgetPage) => {
      const newConfig: ConsumerSpaceWidgetConfig = {
        ...config,
        defaultPage: value,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const handleDefaultPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const eventTarget = event.target;
      setDefaultPage(eventTarget.value as ConsumerSpaceWidgetPage);
    },
    [setDefaultPage],
  );

  const handleToggleHideNavigation = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      onChange({ ...config, hideNavigation: checked });
    },
    [onChange, config],
  );

  if (!config) {
    return null;
  }

  return (
    <div className={classes.flexCol}>
      <ExportableLoginWithDisconnectedStatusSettingsForm
        config={config}
        onChange={onChange}
      />

      <FormControlLabel
        control={
          <Switch
            checked={config?.hideNavigation}
            color="primary"
            onChange={handleToggleHideNavigation}
          />
        }
        label={t('widget:widget.consumerSpace.hideNavigation')}
      />

      <FormControl className={classes.fieldContainer}>
        <InputLabel>{t('widget:widget.consumerSpace.defaultPage')}</InputLabel>
        <Select
          className={classes.fullWidth}
          onChange={handleDefaultPageChange}
          value={config?.defaultPage || 'consumerBooking'}
        >
          {CONSUMER_SPACE_AVAILABLE_PAGES.map((type) => (
            <MenuItem key={type} value={type}>
              {t(`widget:widget.consumerSpace.page.${type}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  fieldContainer: {
    marginTop: theme.spacing(1),
  },
}));

export default React.memo(ExportableConsumerSpaceSettingsForm);

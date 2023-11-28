import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';

import { ExpandLess, ExpandMore } from '@material-ui/icons';
import type { MarketplaceNewsletterV2Data } from '#libs/marketplace/types';
import { NewsletterV2FieldsKind } from '#libs/marketplace/constants';

interface Props {
  config?: MarketplaceNewsletterV2Data;
  onChange: (newsletterData: MarketplaceNewsletterV2Data) => void;
}

const MarketplaceCalendarV2SettingsForm: React.FC<Props> = ({
  config = {},
  onChange,
}) => {
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();

  const setFieldsType = useCallback(
    (value: `${NewsletterV2FieldsKind}`) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        fieldsType: value,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setTitle = useCallback(
    (value: string) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        title: value ?? null,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setSubtitle = useCallback(
    (value: string) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        subtitle: value ?? null,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setShowTitle = useCallback(
    (value: boolean) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        showTitle: value,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setShowSubtitle = useCallback(
    (value: boolean) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        showSubtitle: value,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const handleFieldsTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const eventTarget = event.target;
      setFieldsType(eventTarget.value as NewsletterV2FieldsKind);
    },
    [setFieldsType],
  );

  const toggleShowAdvancedOptions = useCallback(
    () => setIsAdvancedOptionsOpen((state) => !state),
    [],
  );

  const handleSetTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const eventTarget = event.target;
      setTitle(eventTarget.value);
    },
    [setTitle],
  );

  const toggleShowTitle = useCallback(
    () => setShowTitle(!config.showTitle),
    [config.showTitle, setShowTitle],
  );

  const handleSetSubtitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const eventTarget = event.target;
      setSubtitle(eventTarget.value);
    },
    [setSubtitle],
  );

  const toggleShowSubtitle = useCallback(
    () => setShowSubtitle(!config.showSubtitle),
    [config.showSubtitle, setShowSubtitle],
  );

  if (!config) {
    return null;
  }

  return (
    <div className={classes.flexCol}>
      <FormControl className={classes.fieldContainer}>
        <InputLabel>
          {t('widget:widget.newsletterV2.newsletterFieldsType')}
        </InputLabel>
        <Select
          className={classes.fullWidth}
          onChange={handleFieldsTypeChange}
          value={
            config?.fieldsType || NewsletterV2FieldsKind.FULL_NAME_AND_EMAIL
          }
        >
          {Object.values(NewsletterV2FieldsKind).map((type) => (
            <MenuItem key={type} value={type}>
              {t(`widget:widget.newsletterV2.${type}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        classes={{ label: classes.settingsLabel }}
        className={classes.fieldContainer}
        color="primary"
        onClick={toggleShowAdvancedOptions}
        variant="text"
      >
        {t('widget:widget.newsletterV2.advancedSettings')}
        {isAdvancedOptionsOpen ? <ExpandLess /> : <ExpandMore />}
      </Button>

      <Collapse
        classes={{ wrapperInner: classes.flexCol }}
        className={classes.fieldContainer}
        in={isAdvancedOptionsOpen}
      >
        <TextField
          className={classes.fieldContainer}
          label={t('widget:widget.newsletterV2.title')}
          onChange={handleSetTitle}
          value={config?.title}
        />
        <FormControlLabel
          className={classes.fieldContainer}
          control={
            <Switch
              checked={config?.showTitle}
              color="primary"
              onChange={toggleShowTitle}
            />
          }
          label={t('widget:widget.newsletterV2.showTitle')}
        />

        <TextField
          className={classes.fieldContainer}
          label={t('widget:widget.newsletterV2.subtitle')}
          onChange={handleSetSubtitle}
          value={config?.subtitle}
        />

        <FormControlLabel
          className={classes.fieldContainer}
          control={
            <Switch
              checked={config?.showSubtitle}
              color="primary"
              onChange={toggleShowSubtitle}
            />
          }
          label={t('widget:widget.newsletterV2.showSubtitle')}
        />
      </Collapse>
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
  settingsLabel: {
    alignItems: 'initial',
    gap: theme.spacing(0.5),
  },
}));

export default React.memo(MarketplaceCalendarV2SettingsForm);

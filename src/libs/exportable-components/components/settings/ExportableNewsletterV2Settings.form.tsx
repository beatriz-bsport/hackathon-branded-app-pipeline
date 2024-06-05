import React, { useCallback } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { makeStyles } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import type { MarketplaceNewsletterV2Data } from '#src/libs/marketplace/types';
import { NewsletterV2FieldsKind } from '#src/libs/marketplace/constants';
import type { Tag, TagGroupAPI } from '#src/libs/tag/types';

interface Props {
  config?: MarketplaceNewsletterV2Data;
  onChange: (newsletterData: MarketplaceNewsletterV2Data) => void;
  tagList: Array<Tag<TagGroupAPI>>;
  tagsLoading: boolean;
}

const MarketplaceCalendarV2SettingsForm: React.FC<Props> = ({
  config = {},
  onChange,
  tagList,
  tagsLoading,
}) => {
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

  const setSuccessTitle = useCallback(
    (value: string) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        successTitle: value ?? null,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setSuccessText = useCallback(
    (value: string) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        successText: value ?? null,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setTag = useCallback(
    (value: number) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        tag_id: value ?? null,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const handleSetTag = useCallback(
    (option) => {
      option?.value && setTag(option.value);
    },
    [setTag],
  );

  const handleDeleteTag = useCallback(() => {
    onChange(omit(config, ['tag_id']));
  }, [config, onChange]);

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

  const setShowSuccessTitle = useCallback(
    (value: boolean) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        showSuccessTitle: value,
      };
      onChange(newConfig);
    },
    [config, onChange],
  );

  const setShowSuccessText = useCallback(
    (value: boolean) => {
      const newConfig: MarketplaceNewsletterV2Data = {
        ...config,
        showSuccessText: value,
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

  const handleSetSuccessTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const eventTarget = event.target;
      setSuccessTitle(eventTarget.value);
    },
    [setSuccessTitle],
  );

  const toggleShowSuccessTitle = useCallback(
    () => setShowSuccessTitle(!config.showSuccessTitle),
    [config.showSuccessTitle, setShowSuccessTitle],
  );

  const handleSetSuccessText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const eventTarget = event.target;
      setSuccessText(eventTarget.value);
    },
    [setSuccessText],
  );

  const toggleShowSuccessText = useCallback(
    () => setShowSuccessText(!config.showSuccessText),
    [config.showSuccessText, setShowSuccessText],
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

      <div className={classNames(classes.fieldContainer, classes.tagForm)}>
        <Typography color="textSecondary" variant="caption">
          {t('widget:widget.newsletterV2.tagToApply')}
        </Typography>
        <TagSelector
          closeMenuOnSelect
          inScrollBar
          isClearable
          noMulti
          allTagsWithTagGroup={tagList}
          isDisabled={tagsLoading}
          onChange={handleSetTag}
          onDeleteTag={handleDeleteTag}
          selectedTags={[config?.tag_id]}
        />
      </div>

      <TextField
        label={t('widget:widget.newsletterV2.title')}
        onChange={handleSetTitle}
        value={config?.title}
      />
      <FormControlLabel
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
        label={t('widget:widget.newsletterV2.subtitle')}
        onChange={handleSetSubtitle}
        value={config?.subtitle}
      />

      <FormControlLabel
        control={
          <Switch
            checked={config?.showSubtitle}
            color="primary"
            onChange={toggleShowSubtitle}
          />
        }
        label={t('widget:widget.newsletterV2.showSubtitle')}
      />

      <TextField
        label={t('widget:widget.newsletterV2.successTitle')}
        onChange={handleSetSuccessTitle}
        value={config?.successTitle}
      />
      <FormControlLabel
        control={
          <Switch
            checked={config?.showSuccessTitle}
            color="primary"
            onChange={toggleShowSuccessTitle}
          />
        }
        label={t('widget:widget.newsletterV2.showSuccessTitle')}
      />

      <TextField
        label={t('widget:widget.newsletterV2.successText')}
        onChange={handleSetSuccessText}
        value={config?.successText}
      />
      <FormControlLabel
        control={
          <Switch
            checked={config?.showSuccessText}
            color="primary"
            onChange={toggleShowSuccessText}
          />
        }
        label={t('widget:widget.newsletterV2.showSuccessText')}
      />
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
  tagForm: {
    paddginTop: theme.spacing(1),
  },
}));

export default React.memo(MarketplaceCalendarV2SettingsForm);

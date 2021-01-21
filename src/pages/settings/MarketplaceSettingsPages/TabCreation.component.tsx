import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';

import { Coach } from '../../../libs/associated-coach/types';
import { Establishment } from '../../../libs/establishment/types';
import { MetaActivity } from '../../../libs/meta-activity/types';
import { PrivateService } from '../../../libs/private-service/types';

import {
  MarketplaceComponentsEnum,
  MarketplaceTabConfig,
} from '../../../libs/marketplace/types';

import MarketplaceComponentTypeSelector from '../../../libs/marketplace/components/MarketplaceComponentTypeSelector.coponent';
import { MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT } from '../../../libs/marketplace/constants';
import MarketplaceSettingsFormSwitch from '../../../libs/marketplace/components/MarketplaceSettingsForm/MarketplaceSettingsFormSwitch.component';
import { Video } from '../../../libs/video/types';

type Props = {
  onClose: () => void;
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  metaActivitiesWorkshop: Array<MetaActivity>;
  privateServices: Array<PrivateService>;
  playlists: Array<{ id: number; name: string }>;
  videos: Array<Video>;
  onSubmit: (tab: MarketplaceTabConfig) => void;
  index: number;
  tab: MarketplaceTabConfig | null;
};

const TabCreation: React.FC<Props> = (props) => {
  const [componentType, setComponentType] = useState(props.tab?.component_type);
  const [title, setTitle] = useState(props.tab?.title);
  const [tabConfig, setTabConfig] = useState<MarketplaceTabConfig['config']>(
    props.tab?.config,
  );
  const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);
  const [componentTypeError, setComponentTypeError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [playlistError, setPlaylistError] = useState('');

  const classes = useStyles();
  const { t } = useTranslation('settings');

  useEffect(() => {
    if (tabConfig) {
      if (tabConfig[componentType]) {
        const componentConfig = tabConfig[componentType];
        for (const key in componentConfig) {
          if (key in componentConfig) {
            // @ts-ignore
            const val = componentConfig[key];
            if (Array.isArray(val)) {
              val.length && setShowAdvanceSettings(true);
            } else {
              val && setShowAdvanceSettings(true);
            }
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    componentType && setComponentTypeError('');
    title && setTitleError('');
  }, [componentType, title]);

  const onChangeComponentType = useCallback(
    (type: MarketplaceComponentsEnum) => {
      const config = { [type]: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT[type] };
      setTabConfig(config);
      setComponentType(type);
      setTitle(t(`marketplaceSettings.componentType.${type}`));
      setShowAdvanceSettings(false);
    },
    [],
  );

  const onSubmit = useCallback(() => {
    if (!componentType) {
      setComponentTypeError(
        t('marketplaceSettings.createDialog.noComponentTypeError'),
      );
      return;
    }

    if (!title || !title.trim()) {
      setTitleError(t('marketplaceSettings.createDialog.noTitleError'));
      return;
    }

    if (
      componentType === MarketplaceComponentsEnum.playlist &&
      tabConfig.playlist
    ) {
      if (tabConfig.playlist.playlistId === undefined) {
        setPlaylistError(t('marketplaceSettings.createDialog.noPlaylistError'));
        return;
      }
    }

    const tab: MarketplaceTabConfig = {
      component_type: componentType,
      title,
      index: props.index,
      config: tabConfig,
    };

    props.onSubmit(tab);
  }, [componentType, title, tabConfig]);

  const renderOptionalData = useCallback(() => {
    if (showAdvanceSettings) {
      return (
        <MarketplaceSettingsFormSwitch
          componentType={componentType}
          coaches={props.coaches}
          establishments={props.establishments}
          metaActivities={props.metaActivities}
          metaActivitiesWorkshop={props.metaActivitiesWorkshop}
          privateServices={props.privateServices}
          videos={props.videos}
          playlists={props.playlists}
          config={tabConfig}
          onChange={(config) =>
            setTabConfig({ [componentType]: config[componentType] })
          }
        />
      );
    }

    return null;
  }, [componentType, tabConfig, showAdvanceSettings, playlistError]);

  return (
    <Dialog open className={classes.container} onClose={props.onClose}>
      <DialogTitle>
        {t('marketplaceSettings.createDialog.dialogTitle')}
      </DialogTitle>
      <DialogContent className={classes.container}>
        <TextField
          className={classes.fullWidth}
          variant="outlined"
          placeholder={t('')}
          label={t('marketplaceSettings.createDialog.inputTitle')}
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        {titleError && <Typography color="error">{titleError}</Typography>}

        <div className={classes.marginTop}>
          <MarketplaceComponentTypeSelector
            source={Object.keys(MarketplaceComponentsEnum)}
            value={componentType}
            onChange={onChangeComponentType}
            error={componentTypeError}
          />
        </div>

        {!showAdvanceSettings &&
          [
            MarketplaceComponentsEnum.calendar,
            MarketplaceComponentsEnum.privateService,
            MarketplaceComponentsEnum.workshop,
            MarketplaceComponentsEnum.playlist,
            MarketplaceComponentsEnum.vod,
          ].includes(componentType) && (
            <div className={classes.showMoreContainer}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowAdvanceSettings(true)}
              >
                {t('marketplaceSettings.createDialog.showAdvanced')}
              </Button>
            </div>
          )}
        {renderOptionalData()}
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          {t('marketplaceSettings.createDialog.cancel')}
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          color="primary"
          id="button_role_save"
        >
          {t('marketplaceSettings.createDialog.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 600,
  },
  fullWidth: {
    width: '100%',
  },
  marginTop: {
    marginTop: theme.spacing(4),
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  showMoreContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}));

export default TabCreation;

import React from 'react';

import { useTranslation } from 'react-i18next';
import MarketplaceSettingsFormSwitch from '../../marketplace/components/MarketplaceSettingsForm/MarketplaceSettingsFormSwitch.component';
import MarketplaceComponentTypeSelector from '../../marketplace/components/MarketplaceComponentTypeSelector.coponent';

import { MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT } from '../../marketplace/constants';
import {
  PrivateServicePageTypeEnum,
  WidgetComponentsEnum,
} from '../../marketplace/types';

import { MetaActivity } from '../../meta-activity/types';
import { Coach } from '../../associated-coach/types';
import { Video, Playlist } from '../../video/types';
import {
  PrivateService,
  PrivateServiceGroup,
} from '../../private-service/types';
import { Establishment } from '../../establishment/types';

type Props = {
  componentType: WidgetComponentsEnum;
  config: any;
  onConfigChange: (a: { config: any; error: any }) => void;
  onComponentTypeChange: (a: {
    componentType: WidgetComponentsEnum;
    config: any;
    error: any;
  }) => void;
  coaches: Array<Coach>;
  metaActivities: Array<MetaActivity>;
  metaActivitiesWorkshop: Array<MetaActivity>;
  establishments: Array<Establishment>;
  privateServices: Array<PrivateService>;
  serviceGroupList: Array<PrivateServiceGroup>;
  videos: Array<Video>;
  playlists: Array<Playlist>;
  hideTypeSelector?: boolean;
};

export const WidgetComponentConfigBuilder = (props: Props) => {
  const { t } = useTranslation(['settings']);

  const onConfigChange = (config: any) => {
    let playlistError = '';
    let privateServiceError = '';

    if (
      props.componentType === WidgetComponentsEnum.playlist &&
      config.playlist
    ) {
      const { playlistId } = config.playlist;
      if (
        playlistId === undefined ||
        playlistId === null ||
        playlistId === -1
      ) {
        playlistError = t('marketplaceSettings.createDialog.noPlaylistError');
      }
    }

    if (
      props.componentType === WidgetComponentsEnum.privateService &&
      config.privateService
    ) {
      let typeValue = config.privateService.type;

      if (!typeValue) {
        if (typeof config.privateService.serviceId === 'number') {
          typeValue = PrivateServicePageTypeEnum.detail;
        } else {
          typeValue = PrivateServicePageTypeEnum.list;
        }
      }

      const { serviceId } = config.privateService;

      if (
        typeValue === PrivateServicePageTypeEnum.detail &&
        (serviceId === undefined || serviceId === null || serviceId === -1)
      ) {
        privateServiceError = t(
          'marketplaceSettings.createDialog.noServiceError',
        );
      }
    }

    props.onConfigChange({
      config,
      error: {
        playlistError,
        privateServiceError,
      },
    });
  };

  const onComponentTypeChange = (componentType: string) => {
    let playlistError = '';

    if (componentType === WidgetComponentsEnum.playlist) {
      playlistError = t(
        'settings:marketplaceSettings.createDialog.noPlaylistError',
      );
    }

    props.onComponentTypeChange({
      componentType,
      config: {
        ...props.config,
        [componentType]: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT[componentType],
      },
      error: {
        playlistError,
        privateServiceError: '',
      },
    });
  };

  return (
    <div>
      {!props.hideTypeSelector && (
        <MarketplaceComponentTypeSelector
          source={Object.keys(WidgetComponentsEnum)}
          value={props.componentType}
          onChange={onComponentTypeChange}
        />
      )}

      <MarketplaceSettingsFormSwitch
        componentType={props.componentType}
        coaches={props.coaches}
        establishments={props.establishments}
        metaActivities={props.metaActivities}
        metaActivitiesWorkshop={props.metaActivitiesWorkshop}
        privateServices={props.privateServices}
        playlists={props.playlists}
        privateServiceError={props.error.privateServiceError}
        playlistError={props.error.playlistError}
        videos={props.videos}
        serviceGroupList={props.serviceGroupList}
        config={props.config}
        onChange={onConfigChange}
      />
    </div>
  );
};

export default WidgetComponentConfigBuilder;

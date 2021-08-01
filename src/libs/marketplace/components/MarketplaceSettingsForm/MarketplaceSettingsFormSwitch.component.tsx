import React from 'react';

import MarketplaceCalendarSettingsForm from './MarketplaceCalendarSettingsForm.component';
import MarketplaceCommonFilterForm from './MarketplaceCommonFilterForm.component';
import MarketplacePrivateServiceSettingsForm from './MarketplacePrivateServiceSettingsForm.component';
import MarketplacePlaylistSettingsForm from './MarketplacePlaylistSettingsForm';
import {
  MarketplaceComponentConfig,
  MarketplaceComponentsEnum,
  WidgetComponentsEnum,
} from '../../types';
import { Coach } from '../../../associated-coach/types';
import { Establishment } from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import {
  PrivateService,
  PrivateServiceGroup,
} from '../../../private-service/types';
import { Video } from '../../../video/types';
import MarketplaceVodSettingsForm from './MarketplaceVodFormSettings.component';
import MarketplacePassSettingsForm from './MarketplacePassSettingsForm';
import MarketplaceSubscriptionSettingsForm from './MarketplaceSubscriptionSettingsForm';

type Props = {
  componentType: MarketplaceComponentsEnum | WidgetComponentsEnum;
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  metaActivitiesWorkshop: Array<MetaActivity>;
  privateServices: Array<PrivateService>;
  videos: Array<Video>;
  playlists: Array<{ id: number; name: string }>;
  serviceGroupList: PrivateServiceGroup[];
  config: MarketplaceComponentConfig;
  onChange: (config: MarketplaceComponentConfig) => void;
  privateServiceError?: string;
  playlistError?: string;
};

export default class MarketplaceSettingsFormSwitch extends React.PureComponent<Props> {
  render() {
    if (this.props.componentType === MarketplaceComponentsEnum.calendar) {
      return (
        <div>
          <MarketplaceCalendarSettingsForm
            coaches={this.props.coaches}
            establishments={this.props.establishments}
            metaActivities={this.props.metaActivities}
            config={this.props.config.calendar}
            showCompactMode
            onChange={(config) =>
              this.props.onChange({
                ...this.props.config,
                calendar: config,
              })
            }
          />
        </div>
      );
    }
    if (this.props.componentType === MarketplaceComponentsEnum.workshop) {
      return (
        <MarketplaceCommonFilterForm
          coaches={this.props.coaches}
          establishments={this.props.establishments}
          metaActivities={this.props.metaActivitiesWorkshop}
          config={this.props.config.workshop}
          onChange={(config) =>
            this.props.onChange({
              ...this.props.config,
              workshop: config,
            })
          }
        />
      );
    }
    if (this.props.componentType === MarketplaceComponentsEnum.privateService) {
      return (
        <MarketplacePrivateServiceSettingsForm
          privateServices={this.props.privateServices}
          serviceGroupList={this.props.serviceGroupList}
          error={this.props.privateServiceError}
          config={this.props.config.privateService}
          onChange={(config) =>
            this.props.onChange({
              ...this.props.config,
              privateService: config,
            })
          }
        />
      );
    }

    if (this.props.componentType === MarketplaceComponentsEnum.vod) {
      return (
        <MarketplaceVodSettingsForm
          videos={this.props.videos}
          config={this.props.config.vod}
          onChange={(config) =>
            this.props.onChange({
              ...this.props.config,
              vod: config,
            })
          }
        />
      );
    }

    if (this.props.componentType === MarketplaceComponentsEnum.playlist) {
      return (
        <MarketplacePlaylistSettingsForm
          config={this.props.config.playlist}
          playlists={this.props.playlists}
          error={this.props.playlistError}
          onChange={(config) =>
            this.props.onChange({
              ...this.props.config,
              playlist: config,
            })
          }
        />
      );
    }

    if (this.props.componentType === MarketplaceComponentsEnum.pass) {
      return (
        <MarketplacePassSettingsForm
          config={this.props.config.pass}
          onChange={(config) => {
            this.props.onChange({ ...this.props.config, pass: config });
          }}
        />
      );
    }

    return null;
  }
}

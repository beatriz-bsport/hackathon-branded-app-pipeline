import React from 'react';

import { useTranslation } from 'react-i18next';
import ExportableComponentConfigurator from '../../exportable-components/components/ExportableComponentConfigurator.component';
import ExportableComponentSelector from '../../exportable-components/components/ExportableComponentSelector.component';

import { WIDGET_SUPPORTED_EXPORTABLE_COMPONENTS } from '../constants';
import { EXPORTABLE_COMPONENT_TYPE_PLAYLIST } from '../../exportable-components/constants';

import { MetaActivity } from '../../meta-activity/types';
import { Coach } from '../../associated-coach/types';
import { Video } from '../../video/types';
import { Playlist } from '../../playlist/types';
import {
  PrivateService,
  PrivateServiceGroup,
} from '../../private-service/types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';

import { Giftcard } from '../../giftcard/types';
import {
  getDefaultConfigByIdentifier,
  checkExportableComponentConfig,
} from '../../exportable-components/utils';
import { PaymentPackCategory } from '../../payment-packs/types';

type Props = {
  componentType: string;
  config: any;
  onConfigChange: (a: { config: any; error: any }) => void;
  onComponentTypeChange: (a: {
    componentType: string;
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
  paymentPackCategories?: Array<PaymentPackCategory>;
  establishmentGroupList: Array<EstablishmentGroup>;
  giftcards?: Array<Giftcard>;
};

export const WidgetComponentConfigBuilder = (props: Props) => {
  const { t } = useTranslation(['settings']);

  const onConfigChange = (config: any) => {
    const errors = checkExportableComponentConfig(props.componentType, config);

    props.onConfigChange({
      config,
      error: errors,
    });
  };

  const onComponentTypeChange = (componentType: string) => {
    let playlistError = '';

    if (componentType === EXPORTABLE_COMPONENT_TYPE_PLAYLIST) {
      playlistError = t(
        'settings:marketplaceSettings.createDialog.noPlaylistError',
      );
    }

    props.onComponentTypeChange({
      componentType,
      config: {
        ...props.config,
        [componentType]: getDefaultConfigByIdentifier(componentType),
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
        <ExportableComponentSelector
          source={WIDGET_SUPPORTED_EXPORTABLE_COMPONENTS}
          value={props.componentType}
          onChange={onComponentTypeChange}
        />
      )}

      <ExportableComponentConfigurator
        componentType={props.componentType}
        coaches={props.coaches}
        establishments={props.establishments}
        metaActivities={props.metaActivities}
        metaActivitiesWorkshop={props.metaActivitiesWorkshop}
        privateServices={props.privateServices}
        playlists={props.playlists}
        videos={props.videos}
        serviceGroupList={props.serviceGroupList}
        config={props.config}
        onChange={onConfigChange}
        errors={props.config?.error}
        paymentPackCategories={props.paymentPackCategories}
        establishmentGroupList={props.establishmentGroupList}
        giftcards={props.giftcards}
      />
    </div>
  );
};

export default WidgetComponentConfigBuilder;

import React from 'react';

import { Coach } from '../../associated-coach/types';
import { Establishment, EstablishmentGroup } from '../../establishment/types';
import { MetaActivity } from '../../meta-activity/types';
import { Giftcard } from '../../giftcard/types';
import {
  PrivatePassCategory,
  PrivateService,
  PrivateServiceGroup,
} from '../../private-service/types';
import { Video } from '../../video/types';
import ExportableComponentSettingForm from './settings';
import {
  PaymentPackCategory,
  PaymentPackTemplate,
} from '../../payment-packs/types';

type Props = {
  componentType: string;
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  metaActivitiesWorkshop: Array<MetaActivity>;
  privateServices: Array<PrivateService>;
  videos: Array<Video>;
  playlists: Array<{ id: number; name: string }>;
  serviceGroupList: PrivateServiceGroup[];
  config: any;
  onChange: (config: any) => void;
  errors: { [componentType: string]: string } | null;
  paymentPackCategories: Array<PaymentPackCategory>;
  privatePassCategories: Array<PrivatePassCategory>;
  establishmentGroupList: Array<EstablishmentGroup>;
  giftcards: Array<Giftcard>;
  paymentPackTemplateListAvailable: Array<PaymentPackTemplate>;
};

export const ExportableComponentConfigurator = (props: Props) => {
  let errors = '';
  if (props.errors && props.errors[props.componentType]) {
    errors = props.errors[props.componentType];
  }

  const SettingForm = ExportableComponentSettingForm[props.componentType];

  if (!SettingForm) return null;

  return (
    <SettingForm
      paymentPackTemplateListAvailable={props.paymentPackTemplateListAvailable}
      coaches={props.coaches}
      establishments={props.establishments}
      metaActivities={props.metaActivities}
      metaActivitiesWorkshop={props.metaActivitiesWorkshop}
      config={props.config[props.componentType]}
      playlists={props.playlists}
      videos={props.videos}
      showCompactMode
      privateServices={props.privateServices}
      serviceGroupList={props.serviceGroupList}
      errors={errors}
      onChange={(config: any) =>
        props.onChange({ ...props.config, [props.componentType]: config })
      }
      paymentPackCategories={props.paymentPackCategories}
      privatePassCategories={props.privatePassCategories}
      establishmentGroupList={props.establishmentGroupList}
      giftcards={props.giftcards}
    />
  );
};

export default ExportableComponentConfigurator;

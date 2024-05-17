import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
import { Level } from '#libs/level/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';

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
  customLevels: Level[];
  tagList: Array<Tag<TagGroupAPI>>;
  tagsLoading: boolean;
};

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

export const ExportableComponentConfigurator = (props: Props) => {
  const classes = useStyles();

  let errors = '';
  if (props.errors && props.errors[props.componentType]) {
    errors = props.errors[props.componentType];
  }

  // @ts-expect-error
  const SettingForm = ExportableComponentSettingForm[props.componentType];

  if (!SettingForm) return null;

  return (
    <div className={classes.root}>
      <SettingForm
        showCompactMode
        coaches={props.coaches}
        config={props.config[props.componentType]}
        customLevels={props.customLevels}
        errors={errors}
        establishmentGroupList={props.establishmentGroupList}
        establishments={props.establishments}
        giftcards={props.giftcards}
        metaActivities={props.metaActivities}
        metaActivitiesWorkshop={props.metaActivitiesWorkshop}
        onChange={(config: any) =>
          props.onChange({ ...props.config, [props.componentType]: config })
        }
        paymentPackCategories={props.paymentPackCategories}
        paymentPackTemplateListAvailable={
          props.paymentPackTemplateListAvailable
        }
        playlists={props.playlists}
        privatePassCategories={props.privatePassCategories}
        privateServices={props.privateServices}
        serviceGroupList={props.serviceGroupList}
        tagList={props.tagList}
        tagsLoading={props.tagsLoading}
        videos={props.videos}
      />
    </div>
  );
};

export default ExportableComponentConfigurator;

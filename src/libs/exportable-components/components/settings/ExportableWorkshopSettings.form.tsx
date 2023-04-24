// @ts-nocheck
import React from 'react';

import CommonSettings from './CommonSettings.form';

import { Coach } from '../../../associated-coach/types';
import {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import { Level } from '#libs/level/types';

interface Props {
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivitiesWorkshop: Array<MetaActivity>;
  establishmentGroupList: Array<EstablishmentGroup>;
  config?: any;
  onChange: (calendarConfig: any) => void;
  customLevels: Level[];
}

export const ExportableWorkshopSettings: React.FC<Props> = (props) => (
  <CommonSettings
    coaches={props.coaches}
    establishmentGroupList={props.establishmentGroupList}
    establishments={props.establishments}
    metaActivities={props.metaActivitiesWorkshop}
    config={props.config}
    onChange={props.onChange}
    customLevels={props.customLevels}
  />
);

export default ExportableWorkshopSettings;

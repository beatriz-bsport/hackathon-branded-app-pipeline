import React from 'react';

import { Level } from '#src/libs/level/types';
import CommonSettings from './CommonSettings.form';

import { Coach } from '../../../associated-coach/types';
import {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';

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
    config={props.config}
    customLevels={props.customLevels}
    establishmentGroupList={props.establishmentGroupList}
    establishments={props.establishments}
    metaActivities={props.metaActivitiesWorkshop}
    onChange={props.onChange}
  />
);

export default ExportableWorkshopSettings;

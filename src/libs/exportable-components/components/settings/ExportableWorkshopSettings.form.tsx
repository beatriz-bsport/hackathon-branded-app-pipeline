import React from 'react';

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
}

export const ExportableWorkshopSettings = (props: Props) => (
  <CommonSettings
    coaches={props.coaches}
    establishmentGroupList={props.establishmentGroupList}
    establishments={props.establishments}
    metaActivities={props.metaActivitiesWorkshop}
    config={props.config}
    onChange={props.onChange}
  />
);

export default ExportableWorkshopSettings;

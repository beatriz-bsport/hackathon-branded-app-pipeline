// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';

import PrivateServiceCard from './PrivateServiceCard.component';
import PrivateServiceConfigurationChecker from './PrivateServiceConfigurationHelper.component';
import PrivateSlotEditableList from '../slot/PrivateSlotEditableList.component';

import type { PrivateService } from '../../types';

type Props = {
  privateService: PrivateService,
  deletePrivateSlot: (any) => void,
  createOrUpdatePrivateSlot: (any) => void,
  goToCoachCalendar: (id: number) => void,
  goToEstablishmentCalendar: (id: number) => void,
  goToPrivateServiceCalendar: (id: number) => void,
  switchServiceHasOwnAvailabilitySlots: () => void,
  getResourceSlotsExistState: (
    resourceDatatype: string,
    resourceId: number,
  ) => { exists: boolean, loading: boolean },
};

export const PrivateServiceDetail = (props: Props) => {
  return (
    <Grid container spacing={2} direction="row">
      <Grid item md={6} xs={12}>
        <PrivateServiceCard
          privateService={props.privateService}
          deletePrivateSlot={props.deletePrivateSlot}
          createOrUpdatePrivateSlot={props.createOrUpdatePrivateSlot}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <PrivateSlotEditableList
          privateService={props.privateService}
          deletePrivateSlot={props.deletePrivateSlot}
          createPrivateSlot={props.createOrUpdatePrivateSlot}
          updatePrivateSlot={props.createOrUpdatePrivateSlot}
        />
        <PrivateServiceConfigurationChecker
          privateService={props.privateService}
          getResourceSlotsExistState={props.getResourceSlotsExistState}
          switchServiceHasOwnAvailabilitySlots={
            props.switchServiceHasOwnAvailabilitySlots
          }
          goToCoachCalendar={props.goToCoachCalendar}
          goToEstablishmentCalendar={props.goToEstablishmentCalendar}
          goToPrivateServiceCalendar={props.goToPrivateServiceCalendar}
        />
      </Grid>
    </Grid>
  );
};

export default PrivateServiceDetail;

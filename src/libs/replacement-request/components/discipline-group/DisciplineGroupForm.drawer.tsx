import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { DisciplineGroup } from '#src/libs/replacement-request/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { SCT } from '#src/libs/category/types';
import { Coach } from '#src/libs/associated-coach/types';

import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import {
  Establishment,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import DisciplineGroupForm from './DisciplineGroupForm.component';
import type { Theme as CompanyTheme } from '../../../theme/types';

const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.DisciplineGroup,
);

type Props = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  disciplineGroup: DisciplineGroup<
    MetaActivity,
    MetaActivity,
    SCT,
    Establishment,
    EstablishmentGroup,
    Coach
  >;
  activityList: MetaActivity[];
  workshopList: MetaActivity[];
  categoryList: SCT[];
  establishmentList: Establishment[];
  establishmentGroupList: EstablishmentGroup[];
  coachList: Coach[];
  companyTheme: CompanyTheme;
};

const convertDataIntoIds = (
  disciplineGroup: DisciplineGroup<
    MetaActivity,
    MetaActivity,
    SCT,
    Establishment,
    EstablishmentGroup,
    Coach
  >,
) => {
  if (!disciplineGroup) return null;
  return {
    ...disciplineGroup,
    meta_activities: disciplineGroup.meta_activities?.map(
      (activity) => activity.id,
    ),
    workshops: disciplineGroup.workshops?.map((workshop) => workshop.id),
    categories: disciplineGroup.categories?.map((sct) => sct.id),
    establishments: disciplineGroup.establishments?.map(
      (establishment) => establishment.id,
    ),
    establishment_groups: disciplineGroup.establishment_groups?.map(
      (establishment_group) => establishment_group.id,
    ),
    associated_coaches: disciplineGroup.associated_coaches?.map(
      (coach) => coach.associated_coach_id,
    ),
  };
};

export const DisciplineGroupFormDrawer: React.FC<Props> = ({
  open,
  handleClose,
  onSubmit,
  disciplineGroup,
  activityList,
  workshopList,
  categoryList,
  coachList,
  establishmentList,
  establishmentGroupList,
  companyTheme,
}) => {
  const { t } = useTranslation('replacement');

  const initial = useMemo(
    () => convertDataIntoIds(disciplineGroup),
    [disciplineGroup],
  );

  return (
    <GenericResponsiveDrawer
      onClose={() => {
        handleClose();
        trackFormCancel(initial?.id);
      }}
      open={open}
      title={t('disciplineGroup.title')}
    >
      {open && (
        <DisciplineGroupForm
          activityList={activityList}
          categoryList={categoryList}
          coachList={coachList}
          companyTheme={companyTheme}
          establishmentGroupList={establishmentGroupList}
          establishmentList={establishmentList}
          handleClose={handleClose}
          initial={initial}
          onSubmit={onSubmit}
          workshopList={workshopList}
        />
      )}
    </GenericResponsiveDrawer>
  );
};

export default DisciplineGroupFormDrawer;

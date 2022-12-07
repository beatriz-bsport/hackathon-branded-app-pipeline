import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import DisciplineGroupForm from './DisciplineGroupForm.component';
import { DisciplineGroup } from '#libs/replacement-request/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { SCT } from '#libs/category/types';
import { Coach } from '#libs/associated-coach/types';

import { SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const { trackFormCancel } = rudderStackFormTrackingFunctionsRegistry(
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.DISCIPLINE_GROUP,
);

type Props = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  disciplineGroup: DisciplineGroup<MetaActivity, MetaActivity, SCT, Coach>;
  activityList: MetaActivity[];
  workshopList: MetaActivity[];
  categoryList: SCT[];
  coachList: Coach[];
};

const convertDataIntoIds = (
  disciplineGroup: DisciplineGroup<MetaActivity, MetaActivity, SCT, Coach>,
) => {
  if (!disciplineGroup) return null;
  return {
    ...disciplineGroup,
    meta_activities: disciplineGroup.meta_activities?.map(
      (activity) => activity.id,
    ),
    workshops: disciplineGroup.workshops?.map((workshop) => workshop.id),
    categories: disciplineGroup.categories?.map((sct) => sct.id),
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
}) => {
  const { t } = useTranslation('replacement');

  const initial = useMemo(
    () => convertDataIntoIds(disciplineGroup),
    [disciplineGroup],
  );

  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={() => {
        handleClose();
        trackFormCancel(initial?.id);
      }}
      title={t('disciplineGroup.title')}
    >
      {open && (
        <DisciplineGroupForm
          initial={initial}
          onSubmit={onSubmit}
          handleClose={handleClose}
          activityList={activityList}
          workshopList={workshopList}
          categoryList={categoryList}
          coachList={coachList}
        />
      )}
    </GenericResponsiveDrawer>
  );
};

export default DisciplineGroupFormDrawer;

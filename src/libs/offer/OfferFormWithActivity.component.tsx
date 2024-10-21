import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { OfferCreate } from '#src/libs/offer/types';
import OfferCreateForm from '#src/libs/offer/OfferCreateForm.component';
import MetaActivitySelectorWithCard from '#src/libs/meta-activity/components/MetaActivitySelectorWithCard.component';
import { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';
import { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import { Level, LevelFilterSet } from '#src/libs/level/types';
import { ZoomApp } from '#src/libs/zoom-app/types';
import OfferFormBanner from '#src/libs/offer/form/OfferFormBanner.component';
import type { LuxonDateTime } from '#src/types';
import { OptionCallback, OptionPaginatedCallback } from '../../state/types';

type Props = {
  activeCustomLevels: Level[];
  activitiesLoading: boolean;
  allCustomLevels: Level[];
  allowGuestMaster: boolean;
  availableEstablishments: Establishment[];
  coaches: Coach[];
  coachesLoading: boolean;
  coachPaymentRulesByKind: { [kind: number]: CoachPaymentRule[] };
  establishmentsLoading: boolean;
  is_whereby_integration_enabled: boolean;
  metaActivities: MetaActivity[];
  processing: boolean;
  roomBlueprints: RoomBlueprint[];
  selectedDate: LuxonDateTime;
  showPartnership: boolean;
  tagList: Tag<TagGroup>[];
  timezone: string;
  zoomAppDetail: ZoomApp;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void;
  onCancel: () => void;
  onSubmit: (metaActivityId: number, data: OfferCreate) => void;
  updateLevel: (
    id: number,
    data: Level,
    options: OptionCallback<Level>,
  ) => void;
};

export const OfferFormWithActivity: React.FC<Props> = ({
  activeCustomLevels,
  activitiesLoading,
  allCustomLevels,
  allowGuestMaster,
  availableEstablishments,
  coaches,
  coachesLoading,
  coachPaymentRulesByKind,
  establishmentsLoading,
  is_whereby_integration_enabled,
  metaActivities,
  processing,
  roomBlueprints,
  selectedDate,
  showPartnership,
  tagList,
  timezone,
  zoomAppDetail,
  createLevel,
  deleteLevel,
  fetchLevelList,
  onCancel,
  onSubmit,
  updateLevel,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['metaActivity', 'translation', 'common']);
  const [selectedMetaActivity, setSelectedMetaActivty] =
    useState<MetaActivity | null>(null);

  const handleSelectActivity = useCallback(
    (activity: MetaActivity) => setSelectedMetaActivty(activity),
    [],
  );

  const handleSubmit = useCallback(
    (data: OfferCreate) => {
      selectedMetaActivity && onSubmit(selectedMetaActivity.id, data);
    },
    [onSubmit, selectedMetaActivity],
  );

  const handleGoBack = () => setSelectedMetaActivty(null);
  // A bit dirty but too many places to change the props otherwise
  const metaActivitiesWithoutBroadcastAndHybrid = React.useMemo(() => {
    return metaActivities?.filter(
      (metaActivity) =>
        !(
          metaActivity?.is_broadcast &&
          metaActivity?.metadata?.linked_hybrid_meta_activity_id
        ),
    );
  }, [metaActivities]);

  if (!selectedMetaActivity) {
    return (
      <div className={classes.container}>
        <OfferFormBanner onCancel={onCancel} />

        <MetaActivitySelectorWithCard
          isLoading={activitiesLoading}
          metaActivities={metaActivitiesWithoutBroadcastAndHybrid}
          onChange={handleSelectActivity}
          placeholder={t('metaActivity:search')}
        />

        <div className={classes.buttonContainer}>
          <Button className={classes.button} onClick={onCancel}>
            {t('translation:common.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <OfferCreateForm
      editableCoachPaymentRule
      activeCustomLevels={activeCustomLevels}
      allCustomLevels={allCustomLevels}
      allowGuestMaster={allowGuestMaster}
      availableEstablishments={availableEstablishments}
      coaches={coaches}
      coachPaymentRulesByKind={coachPaymentRulesByKind}
      createLevel={createLevel}
      deleteLevel={deleteLevel}
      fetchLevelList={fetchLevelList}
      isLoading={coachesLoading || establishmentsLoading}
      isWherebyIntegrationEnabled={is_whereby_integration_enabled}
      metaActivities={metaActivities}
      metaActivity={selectedMetaActivity}
      onBannerGoBack={handleGoBack}
      onCancel={handleGoBack}
      onCancelText={t('common:back')}
      onSelectMetaActivity={handleSelectActivity}
      onSubmit={handleSubmit}
      processing={processing}
      roomBlueprints={roomBlueprints}
      selectedDate={selectedDate}
      showPartnership={showPartnership}
      tagList={tagList}
      timezone={timezone}
      updateLevel={updateLevel}
      zoomAppDetail={zoomAppDetail}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default React.memo(OfferFormWithActivity);

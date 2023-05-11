import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import { Moment } from 'moment-timezone';

import { OfferCreate } from '#libs/offer/types';
import OfferCreateForm from '#libs/offer/OfferCreateForm.component';
import MetaActivitySelectorWithCard from '#libs/meta-activity/components/MetaActivitySelectorWithCard.component';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import type { Tag, TagGroup } from '#libs/tag/types';
import { Level, LevelFilterSet } from '#libs/level/types';
import { OptionCallback, OptionPaginatedCallback } from '../../state/types';
import { ZoomApp } from '#libs/zoom-app/types';
import OfferFormBanner from '#libs/offer/form/OfferFormBanner.component';

type Props = {
  metaActivities: MetaActivity[];
  availableEstablishments: Establishment[];
  roomBlueprints: RoomBlueprint[];
  coaches: Coach[];
  onCancel: () => void;
  processing: boolean;
  activitiesLoading: boolean;
  onSubmit: (metaActivityId: number, data: OfferCreate) => void;
  selectedDate: Moment;
  is_whereby_integration_enabled: boolean;
  timezone: string;
  coachPaymentRulesByKind: { [kind: number]: CoachPaymentRule[] };
  showPartnership: boolean;
  tagList: Tag<TagGroup>[];
  activeCustomLevels: Level[];
  allCustomLevels: Level[];
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void;
  updateLevel: (
    id: number,
    data: Level,
    options: OptionCallback<Level>,
  ) => void;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
  allowGuestMaster: boolean;
  zoomAppDetail: ZoomApp;
  coachesLoading: boolean;
  establishmentsLoading: boolean;
};

export const OfferFormWithActivity: React.FC<Props> = ({
  metaActivities,
  availableEstablishments,
  roomBlueprints,
  coaches,
  onCancel,
  processing,
  activitiesLoading,
  onSubmit,
  selectedDate,
  is_whereby_integration_enabled,
  timezone,
  coachPaymentRulesByKind,
  showPartnership,
  tagList,
  activeCustomLevels,
  allCustomLevels,
  fetchLevelList,
  updateLevel,
  createLevel,
  deleteLevel,
  allowGuestMaster,
  zoomAppDetail,
  coachesLoading,
  establishmentsLoading,
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

  if (!selectedMetaActivity) {
    return (
      <div className={classes.container}>
        <OfferFormBanner onCancel={onCancel} />

        <MetaActivitySelectorWithCard
          metaActivities={metaActivities}
          placeholder={t('metaActivity:search')}
          onChange={handleSelectActivity}
          isLoading={activitiesLoading}
        />

        <div className={classes.buttonContainer}>
          <Button onClick={onCancel} className={classes.button}>
            {t('translation:common.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <OfferCreateForm
      metaActivity={selectedMetaActivity}
      selectedDate={selectedDate}
      activeCustomLevels={activeCustomLevels}
      allCustomLevels={allCustomLevels}
      availableEstablishments={availableEstablishments}
      zoomAppDetail={zoomAppDetail}
      timezone={timezone}
      showPartnership={showPartnership}
      allowGuestMaster={allowGuestMaster}
      coaches={coaches}
      roomBlueprints={roomBlueprints}
      isWherebyIntegrationEnabled={is_whereby_integration_enabled}
      processing={processing}
      coachPaymentRulesByKind={coachPaymentRulesByKind}
      tagList={tagList}
      isLoading={coachesLoading || establishmentsLoading}
      editableCoachPaymentRule
      fetchLevelList={fetchLevelList}
      updateLevel={updateLevel}
      createLevel={createLevel}
      deleteLevel={deleteLevel}
      onBannerGoBack={handleGoBack}
      onCancelText={t('common:back')}
      onCancel={handleGoBack}
      onSubmit={handleSubmit}
    />
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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

export default OfferFormWithActivity;

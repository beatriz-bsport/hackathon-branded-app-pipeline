import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { DateTime } from 'luxon';

import {
  GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE,
} from '#src/libs/group-offer/constants';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import GroupedOfferFormMetaActivitySelect from './GroupedOfferFormMetaActivitySelect.component';
import GroupedOfferFormSettings from './GroupedOfferFormSettings.component';
import GroupedOfferPreviewForm from './GroupedOfferPreview.component';

import type { Coach } from '#src/libs/associated-coach/types';
import type { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Level } from '#src/libs/level/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Offer } from '#src/libs/offer/types';
import type {
  OffersGroup,
  GroupPreviewData,
} from '#src/libs/group-offer/types';
import type { OptionCallback } from '#src/state/types';
import type { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import type { ZoomApp } from '#src/libs/zoom-app/types';

export type Props = {
  open: boolean;
  metaActivity?: MetaActivity | null;
  metaActivities: MetaActivity[];
  metaActivityLoading: boolean;
  coaches: Array<Coach>;
  availableEstablishments: Array<Establishment>;
  allEstablishments: Array<Establishment>;
  availableRoomBlueprints: RoomBlueprint[];
  allRoomBlueprints: RoomBlueprint[];
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  tagList: Array<Tag<TagGroup>>;
  theme: CompanyTheme;
  groupPreview: Record<
    number,
    {
      offers_data: Offer[];
      group: OffersGroup<Offer>;
    }
  >;
  customLevels: Level[];
  fetchLevelList: () => void;
  updateLevel: (id: number, data: Level, options: OptionCallback) => void;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
  generatePreview: (arg0: GroupPreviewData, options?: OptionCallback) => void;
  createGroupOffers: (
    data: {
      group_data_with_offers: Record<
        number,
        {
          offers_data: Offer[];
          group: OffersGroup<Offer>;
        }
      >;
    },
    options?: OptionCallback,
  ) => void;
  resetPreview: () => void;
  onClose?: () => void;
  zoomAppDetail: ZoomApp;
};

const STEP_METACTIVITY_SELECT = 0;
const STEP_GROUPED_OPTION_FORM = 1;
const STEP_GROUPED_OPTION_PREVIEW = 2;

export const GroupedOfferCreateFormDrawer: React.FC<Props> = ({
  open,
  metaActivity = null,
  metaActivities,
  metaActivityLoading = false,
  coaches,
  availableEstablishments,
  allEstablishments,
  availableRoomBlueprints,
  allRoomBlueprints,
  coachPaymentRulesByKind,
  tagList,
  theme,
  groupPreview = {},
  customLevels,
  fetchLevelList,
  resetPreview,
  updateLevel,
  createLevel,
  deleteLevel,
  onClose,
  generatePreview,
  createGroupOffers,
  zoomAppDetail,
}) => {
  const { t } = useTranslation('metaActivity');
  const classes = useStyles();

  const [step, setStep] = useState<0 | 1 | 2>(
    metaActivity ? STEP_GROUPED_OPTION_FORM : STEP_METACTIVITY_SELECT,
  );
  const [selectedMetaActivity, setSelectedMetaActivity] =
    useState(metaActivity);

  useEffect(() => {
    if (!open) {
      setSelectedMetaActivity(null);
      setStep(STEP_GROUPED_OPTION_FORM);
      return;
    }
    resetPreview();
    if (metaActivity) {
      setSelectedMetaActivity(metaActivity);
      setStep(STEP_GROUPED_OPTION_FORM);
    } else {
      setStep(STEP_METACTIVITY_SELECT);
    }
  }, [open, metaActivity, resetPreview]);

  useEffect(() => {
    setSelectedMetaActivity(metaActivity);
  }, [metaActivity]);

  const handleNextStep = useCallback(() => {
    switch (step) {
      case STEP_METACTIVITY_SELECT:
        setStep(STEP_GROUPED_OPTION_FORM);
        break;
      case STEP_GROUPED_OPTION_FORM:
        setStep(STEP_GROUPED_OPTION_PREVIEW);
        break;
      case STEP_GROUPED_OPTION_PREVIEW:
        onClose();
        break;
      default:
        break;
    }
  }, [onClose, step]);

  const handlePreviousStep = useCallback(() => {
    switch (step) {
      case STEP_METACTIVITY_SELECT:
        onClose();
        break;
      case STEP_GROUPED_OPTION_FORM:
        if (metaActivity) {
          onClose();
        }
        setStep(STEP_METACTIVITY_SELECT);
        break;
      case STEP_GROUPED_OPTION_PREVIEW:
        setStep(STEP_GROUPED_OPTION_FORM);
        break;
      default:
        break;
    }
  }, [metaActivity, onClose, step]);

  const getSubtitle = () => {
    switch (step) {
      case STEP_METACTIVITY_SELECT:
        return t('groupedOption.modal.subtitleMetaActivitySelect');
      case STEP_GROUPED_OPTION_FORM:
        return selectedMetaActivity?.name;
      case STEP_GROUPED_OPTION_PREVIEW:
        return t('groupedOption.modal.subtitlePreview');
      default:
        return null;
    }
  };

  const handleSelectActivity = (_metaActivity: MetaActivity) => {
    setSelectedMetaActivity(_metaActivity);
    handleNextStep();
  };

  const groups = Object.keys(groupPreview).map((key) => ({
    // @ts-expect-error
    ...groupPreview[key]?.group,
    // @ts-expect-error
    offers: groupPreview[key]?.offers_data,
  }));

  const handleGeneratePreview = useCallback(
    ({ values, options }) => {
      resetPreview();
      let frequence = GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY;
      if (values.recurrence_frequence === 'week')
        frequence = GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY;
      if (values.recurrence_frequence === 'month')
        frequence = GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY;
      if (values.recurrence_frequence === 'year')
        frequence = GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE;

      const previewData = {
        group_data: {
          meta_activity: selectedMetaActivity.id,
          level: values.level,
          name: values.name,
          allow_booking_after_start: values.allow_booking_after_start,
          full_booking_only: values.full_booking_only,
          available: values.available,
          manager_only: values.manager_only,
          sync_on_spivi: values.sync_on_spivi,
        },
        recurrence_rule: values.withRecurrence
          ? {
              count: values.recurrence_method === 'count' ? values.count : null,
              until:
                values.recurrence_method === 'until'
                  ? DateTime.fromISO(values.until).toUnixInteger()
                  : null,
              frequence,
              interval: values.recurrence_interval,
            }
          : null,
        // @ts-expect-error
        offers_data: values.offers.map((o) => ({
          ...o,
          whitelist_tags: values.whitelist_tags,
          blacklist_tags: values.blacklist_tags,
          manager_only: values.manager_only,
          sync_on_spivi: values.sync_on_spivi,
        })),
      };

      // @ts-expect-error
      generatePreview(previewData, {
        onSuccess: () => {
          handleNextStep();
        },
        ...(options && options?.onError && { onError: options.onError }),
      });
    },
    [generatePreview, handleNextStep, resetPreview, selectedMetaActivity],
  );

  const handleCreateGroup = useCallback(
    ({ values, options }) => {
      // for each groups add the group details
      const group_data_with_offers = values.reduce(
        // @ts-expect-error
        (acc, formikGroup, index) => {
          const { offers, ...group } = formikGroup;
          acc[index] = {
            group,
            // @ts-expect-error
            offers_data: offers.map((o) => ({
              waiting_list_max_size: parseInt(o.waiting_list_max_size),
              effectif: parseInt(o.effectif),
              credits: parseInt(o.credits),
              available_on_partnership: o.available_on_partnership,
              blacklist_tags: o.blacklist_tags,
              broadcast_link: o.broadcast_link,
              coach: o.coach,
              coach_payment_rule_id: o.coach_payment_rule,
              date_start: o.date_start,
              duration_minute: o.duration_minute,
              establishment: o.establishment,
              level: o.level,
              manager_only: o.manager_only,
              partner_max_booking_count: o.partner_max_booking_count,
              whitelist_tags: o.whitelist_tags,
              recurrence_id: o.recurrence_id,
              room_blueprint: o.room_blueprint,
              sync_on_spivi: o.sync_on_spivi,
            })),
          };
          return acc;
        },
        {},
      );
      createGroupOffers(
        { group_data_with_offers },
        {
          onSuccess: () => {
            handleNextStep();
          },
          ...(options && options?.onError && { onError: options.onError }),
        },
      );
    },
    [createGroupOffers, handleNextStep],
  );

  return (
    <GenericResponsiveDrawer
      withoutPadding
      onClose={onClose}
      open={open}
      subtitle={getSubtitle()}
      title={t('groupedOption.modal.title')}
    >
      <div className={classes.drawerInner}>
        {step === STEP_METACTIVITY_SELECT && (
          <GroupedOfferFormMetaActivitySelect
            // @ts-expect-error
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            handleSelectActivity={handleSelectActivity}
            metaActivities={metaActivities}
            metaActivityLoading={metaActivityLoading}
            type="workshop"
          />
        )}

        {step === STEP_GROUPED_OPTION_FORM && (
          <div className={classes.padding}>
            <GroupedOfferFormSettings
              allEstablishments={allEstablishments}
              allRoomBlueprints={allRoomBlueprints}
              availableEstablishments={availableEstablishments}
              availableRoomBlueprints={availableRoomBlueprints}
              coaches={coaches}
              coachPaymentRulesByKind={coachPaymentRulesByKind}
              createLevel={createLevel}
              customLevels={customLevels}
              deleteLevel={deleteLevel}
              fetchLevelList={fetchLevelList}
              handlePreviousStep={handlePreviousStep}
              initial={
                groups?.[0]
                  ? {
                      ...groups[0],
                      name: groups[0].name.replace(/\((\d)*\)/, ''),
                    }
                  : null
              }
              metaActivity={selectedMetaActivity}
              onSubmit={handleGeneratePreview}
              open={open}
              tagList={tagList}
              theme={theme}
              updateLevel={updateLevel}
              zoomAppDetail={zoomAppDetail}
            />
          </div>
        )}
        {step === STEP_GROUPED_OPTION_PREVIEW && groupPreview && (
          <div className={classes.padding}>
            <GroupedOfferPreviewForm
              groups={groups}
              handlePreviousStep={handlePreviousStep}
              metaActivity={selectedMetaActivity}
              onSubmit={handleCreateGroup}
            />
          </div>
        )}
      </div>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  drawerInner: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  padding: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(GroupedOfferCreateFormDrawer);

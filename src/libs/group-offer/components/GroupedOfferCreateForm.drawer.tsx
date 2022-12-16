import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import moment from 'moment-timezone';

import { MetaActivity } from '#libs/meta-activity/types';
import { OffersGroup, GroupPreviewData } from '#libs/group-offer/types';
import { CompanyTheme } from '#libs/theme/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import { Tag, TagGroup } from '#libs/tag/types';

import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import GroupedOfferFormMetaActivitySelect from './GroupedOfferFormMetaActivitySelect.component';
import GroupedOfferFormSettings from './GroupedOfferFormSettings.component';
import GroupedOfferPreviewForm from './GroupedOfferPreview.component';
import { OptionCallback } from '../../../state/types';

import {
  GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE,
} from '#libs/group-offer/constants';
import { Offer } from '#libs/offer/types';
import { Level } from '#libs/level/types';
import { ZoomApp } from '#libs/zoom-app/types';

export type Props = {
  open: boolean;
  metaActivity?: MetaActivity | null;
  metaActivities: MetaActivity[];
  metaActivityLoading: boolean;
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
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
  handlePreviousStep: () => void;
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
  establishments,
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
    } else {
      resetPreview();
      setStep(
        metaActivity ? STEP_GROUPED_OPTION_FORM : STEP_METACTIVITY_SELECT,
      );
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
  };

  const groups = Object.keys(groupPreview).map((key) => ({
    ...groupPreview[key]?.group,
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
        },
        recurrence_rule: values.withRecurrence
          ? {
              count: values.recurrence_method === 'count' ? values.count : null,
              until:
                values.recurrence_method === 'until'
                  ? moment(values.until).unix()
                  : null,
              frequence,
              interval: values.recurrence_interval,
            }
          : null,
        offers_data: values.offers.map((o) => ({
          ...o,
          whitelist_tags: values.whitelist_tags,
          blacklist_tags: values.blacklist_tags,
          manager_only: values.manager_only,
        })),
      };

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
        (acc, formikGroup, index) => {
          const { offers, ...group } = formikGroup;
          acc[index] = {
            group,
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
      open={open}
      onClose={onClose}
      title={t('groupedOption.modal.title')}
      subtitle={getSubtitle()}
      withoutPadding
    >
      <div className={classes.drawerInner}>
        {step === STEP_METACTIVITY_SELECT && (
          <GroupedOfferFormMetaActivitySelect
            metaActivities={metaActivities}
            metaActivityLoading={metaActivityLoading}
            selectedMetaActivity={selectedMetaActivity}
            handleSelectActivity={handleSelectActivity}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            type="workshop"
          />
        )}

        {step === STEP_GROUPED_OPTION_FORM && (
          <div className={classes.padding}>
            <GroupedOfferFormSettings
              initial={
                groups?.[0]
                  ? {
                      ...groups[0],
                      name: groups[0].name.replace(/\((\d)*\)/, ''),
                    }
                  : null
              }
              coaches={coaches}
              establishments={establishments}
              availableRoomBlueprints={availableRoomBlueprints}
              allRoomBlueprints={allRoomBlueprints}
              coachPaymentRulesByKind={coachPaymentRulesByKind}
              tagList={tagList}
              theme={theme}
              metaActivity={selectedMetaActivity}
              onSubmit={handleGeneratePreview}
              handlePreviousStep={handlePreviousStep}
              customLevels={customLevels}
              fetchLevelList={fetchLevelList}
              updateLevel={updateLevel}
              createLevel={createLevel}
              deleteLevel={deleteLevel}
              open={open}
              zoomAppDetail={zoomAppDetail}
            />
          </div>
        )}
        {step === STEP_GROUPED_OPTION_PREVIEW && groupPreview && (
          <div className={classes.padding}>
            <GroupedOfferPreviewForm
              onSubmit={handleCreateGroup}
              groups={groups}
              metaActivity={selectedMetaActivity}
              handlePreviousStep={handlePreviousStep}
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

export default GroupedOfferCreateFormDrawer;

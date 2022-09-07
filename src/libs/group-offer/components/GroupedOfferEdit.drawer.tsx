import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';

import { OffersGroup, MetaActivity } from '#libs/meta-activity/types';
import { CompanyTheme } from '#libs/theme/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { RoomBlueprint } from '#libs/spot-scheduling/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import { Tag, TagGroup } from '#libs/tag/types';

import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import GroupedOfferFormSettings from './GroupedOfferFormSettings.component';
import { OptionCallback } from '../../../state/types';

import { Offer } from '#libs/offer/types';
import { Level } from '#libs/level/types';
import { ZoomApp } from '#libs/zoom-app/types';

export type Props = {
  open: boolean;
  metaActivity?: MetaActivity | null;
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
  group: OffersGroup;
  customLevels: Level[];
  onSubmit: (arg0: {
    level: number;
    name: string;
    allow_booking_after_start: boolean;
    full_booking_only: boolean;
    manager_only: boolean;
    whitelist_tags: number[];
    blacklist_tags: number[];
  }) => void;
  fetchLevelList: () => void;
  updateLevel: (id: number, data: Level, options: OptionCallback) => void;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
  handlePreviousStep: () => void;
  onClose?: () => void;
  zoomAppDetail: ZoomApp;
};

export const GroupedOfferEditDrawer: React.FC<Props> = ({
  open,
  coaches,
  establishments,
  availableRoomBlueprints,
  allRoomBlueprints,
  coachPaymentRulesByKind,
  tagList,
  theme,
  customLevels,
  metaActivity = {},
  group,
  onSubmit,
  fetchLevelList,
  updateLevel,
  createLevel,
  deleteLevel,
  onClose,
  zoomAppDetail,
}) => {
  const { t } = useTranslation('metaActivity');
  const classes = useStyles();

  const handleSubmit = useCallback(
    ({ values }) => {
      const {
        level,
        name,
        allow_booking_after_start,
        full_booking_only,
        manager_only,
        whitelist_tags,
        blacklist_tags,
      } = values;

      onSubmit({
        level,
        name,
        allow_booking_after_start,
        full_booking_only,
        manager_only,
        whitelist_tags,
        blacklist_tags,
      });
    },
    [onSubmit],
  );

  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={onClose}
      title={t('groupedOption.modal.title')}
      subtitle={group?.name}
    >
      <div className={classes.drawerInner}>
        <GroupedOfferFormSettings
          coaches={coaches}
          establishments={establishments}
          availableRoomBlueprints={availableRoomBlueprints}
          allRoomBlueprints={allRoomBlueprints}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          tagList={tagList}
          theme={theme}
          metaActivity={metaActivity}
          initial={group}
          onSubmit={handleSubmit}
          handlePreviousStep={onClose}
          customLevels={customLevels}
          fetchLevelList={fetchLevelList}
          updateLevel={updateLevel}
          createLevel={createLevel}
          deleteLevel={deleteLevel}
          editingLiveOffer
          zoomAppDetail={zoomAppDetail}
        />
      </div>
    </GenericResponsiveDrawer>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  drawerInner: {
    paddingTop: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default GroupedOfferEditDrawer;

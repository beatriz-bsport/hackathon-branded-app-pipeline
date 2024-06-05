import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';

// @ts-expect-error
import { OffersGroup, MetaActivity } from '#src/libs/meta-activity/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Establishment } from '#src/libs/establishment/types';
import { RoomBlueprint } from '#src/libs/spot-scheduling/types';
import { CoachPaymentRule } from '#src/libs/coach-payment-rules/types';
import { Tag, TagGroup } from '#src/libs/tag/types';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';

import { Level } from '#src/libs/level/types';
import { ZoomApp } from '#src/libs/zoom-app/types';
import { OptionCallback } from '../../../state/types';
import GroupedOfferFormSettings from './GroupedOfferFormSettings.component';

export type Props = {
  open: boolean;
  metaActivity?: MetaActivity | null;
  coaches: Array<Coach>;
  availableEstablishments: Array<Establishment>;
  allEstablishments: Array<Establishment>;
  availableRoomBlueprints: RoomBlueprint[];
  allRoomBlueprints: RoomBlueprint[];
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  tagList: Array<Tag<TagGroup>>;
  theme: CompanyTheme;
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
  onClose?: () => void;
  zoomAppDetail: ZoomApp;
};

export const GroupedOfferEditDrawer: React.FC<Props> = ({
  open,
  coaches,
  availableEstablishments,
  allEstablishments,
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
      onClose={onClose}
      open={open}
      subtitle={group?.name}
      title={t('groupedOption.modal.title')}
    >
      <div className={classes.drawerInner}>
        <GroupedOfferFormSettings
          editingLiveOffer
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
          handlePreviousStep={onClose}
          initial={group}
          // @ts-expect-error
          metaActivity={metaActivity}
          onSubmit={handleSubmit}
          tagList={tagList}
          theme={theme}
          updateLevel={updateLevel}
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

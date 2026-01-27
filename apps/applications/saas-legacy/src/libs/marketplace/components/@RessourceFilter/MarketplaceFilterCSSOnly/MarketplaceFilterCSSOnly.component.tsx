import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { withTheme } from '@material-ui/core/styles';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization.js';
import { getCoachDisplayName } from '@bsport/common/lib/master-data/coach.js';
import { Level } from '#src/libs/level/types';
import { getLevelColor, getLevelTranslation } from '#src/libs/level/utils';
import { getGroupedEstablishmentOptions } from '#src/libs/establishment/components/EstablishmentSelector.component';
import MarketplaceCalendarSearch from '#src/libs/marketplace/components/@Calendar/MarketplaceCalendarSearchCSSOnly/MarketplaceCalendarSearchCSSOnly.component';
import {
  Establishment,
  EstablishmentGroup,
} from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Coach } from '#src/libs/associated-coach/types';
import type {
  MarketplaceFilters,
  MarketplaceFiltersSetter,
} from '#src/libs/marketplace/types';
import MarketplaceFilter from '../MarketplaceFilter/MarketplaceFilter.component';

import './MarketplaceFilterCSSOnly.css';
import { ImmutableArray } from 'seamless-immutable';
import { Theme } from '@material-ui/core';

export type OwnProps = {
  coaches: Coach[];
  hideCoach: boolean;
  establishments: ImmutableArray<Establishment>;
  establishmentGroupList: Array<EstablishmentGroup>;
  metaActivities: { [key: number]: MetaActivity };
  filters: MarketplaceFilters;
  setFilters: MarketplaceFiltersSetter;
  variant: 'activity' | 'workshop';
  showMultiLocalization: boolean;
  customLevels: Level[];
  onSearch: (searchText: string) => void;
  onClearInput: () => void;
  coachDisplay?: MarketPlaceCoachDisplay;
};

type Props = OwnProps & { theme: Theme };

const MarketplaceFilterCSSOnly: React.FC<Props> = ({
  customLevels,
  coaches,
  metaActivities,
  variant,
  establishments,
  establishmentGroupList,
  setFilters,
  showMultiLocalization,
  hideCoach,
  filters,
  onSearch,
  onClearInput,
  coachDisplay,
  theme,
}) => {
  const { t } = useTranslation([
    'coach',
    'metaActivity',
    'establishment',
    'offer',
  ]);

  const levelsOptions = useMemo(
    () =>
      [
        ...customLevels.map((level) => ({
          value: level.id,
          label: getLevelTranslation(level.id, level.name, t),
          levelColor: getLevelColor(level.id, level.color, theme),
        })),
      ].sort((a, b) => a.value - b.value),
    [customLevels, t, theme],
  );

  const coachesOptions = useMemo(
    () =>
      coaches.map((coach) => {
        const coachName = getCoachDisplayName(
          coachDisplay,
          coach?.name,
          coach?.firstname,
        );
        return {
          value: coach.id,
          label: coachName,
        };
      }),
    [coaches, coachDisplay],
  );

  const establishmentsOptions = useMemo(
    () =>
      getGroupedEstablishmentOptions([...(establishments ?? [])]).map((opt) => {
        return { ...opt, icon: true };
      }),
    [establishments],
  );

  const metaActivitiesOption = useMemo(() => {
    // @ts-expect-error
    const defaultArray = [];
    if (Object.values(metaActivities)) {
      return Object.values(metaActivities)
        .filter((ma) => ma.customer_enabled)
        .map((ma) => ({
          label: ma.name,
          value: ma.id,
        }));
    }
    // @ts-expect-error
    return defaultArray;
  }, [metaActivities]);

  const establishmentGroupOption = useMemo(
    () =>
      establishmentGroupList
        .filter((group) => group.establishment.length !== 0)
        .map((group) => ({
          label: group.name,
          value: group.id,
        })),
    [establishmentGroupList],
  );

  const handleChange: MarketplaceFiltersSetter = useCallback(
    (key) => (values) => {
      setFilters(key)(values);
    },
    [setFilters],
  );

  const metaActivityTitle = useMemo(
    () =>
      t(
        variant === 'activity'
          ? 'metaActivity:metaActivity'
          : 'metaActivity:workshop',
      ),
    [t, variant],
  );

  return (
    <div className="bs-marketplace-filters__list">
      {variant === 'activity' && (
        <MarketplaceCalendarSearch
          onClearInput={onClearInput}
          onSearch={onSearch}
        />
      )}
      {/* @ts-expect-error */}
      <MarketplaceFilter
        id="bs-marketplace-calendar-filters__activity"
        onSelect={handleChange('activity__in')}
        options={metaActivitiesOption}
        selectedOptions={filters.activity__in}
        text={metaActivityTitle}
      />
      <MarketplaceFilter
        levelVariant
        id="bs-marketplace-calendar-filters__level"
        onSelect={handleChange('levels')}
        options={levelsOptions}
        selectedOptions={filters.levels}
        text={t('offer:levels.select.placeholder')}
      />
      {!hideCoach && (
        // @ts-expect-error
        <MarketplaceFilter
          id="bs-marketplace-calendar-filters__coach"
          onSelect={handleChange('coaches')}
          options={coachesOptions}
          selectedOptions={filters.coaches}
          text={t('coach:coach')}
        />
      )}
      {/* @ts-expect-error */}
      <MarketplaceFilter
        id="bs-marketplace-calendar-filters__establishment"
        onSelect={handleChange('establishments')}
        options={establishmentsOptions}
        selectedOptions={filters.establishments}
        text={t('establishment:room')}
      />
      {showMultiLocalization &&
        establishmentGroupList &&
        establishmentGroupList.length !== 0 && (
          // @ts-expect-error
          <MarketplaceFilter
            id="bs-marketplace-calendar-filters__establishment_group"
            onSelect={handleChange('establishment_group__in')}
            options={establishmentGroupOption}
            selectedOptions={filters.establishment_group__in}
            text={t('establishment:localisation')}
          />
        )}
    </div>
  );
};

export default React.memo(withTheme(MarketplaceFilterCSSOnly));

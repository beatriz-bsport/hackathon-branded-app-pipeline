// @ts-nocheck
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';

import { withTheme } from '@material-ui/styles';
import {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import { Coach } from '../../../associated-coach/types';
import { Level } from '#libs/level/types';
import { MarketPlaceFilter } from '../../types';
import MarketplaceFilter from '../MarketplaceFilter/MarketplaceFilter.component';
import { getLevelColor, getLevelTrad } from '#libs/level/utils';

import './MarketplaceFilterCSSOnly.css';
import { getGroupedEstablishmentOptions } from '#libs/establishment/components/EstablishmentSelector.component';
import { Theme } from '#libs/theme/types';

type Props = {
  coaches: Coach[];
  hideCoach: boolean;
  establishments: Establishment[];
  allEstablishments: Establishment[];
  establishmentGroupList: Array<EstablishmentGroup>;
  metaActivities: { [key: number]: MetaActivity };
  filters: MarketPlaceFilter;
  setFilters: (key: string) => (value: any) => void;
  variant: 'activity' | 'workshop';
  showMultiLocalization: boolean;
  customLevels: Level[];
  theme: Theme;
};

const MarketplaceFilterCSSOnly: React.FC<Props> = ({
  customLevels,
  coaches,
  metaActivities,
  variant,
  establishments,
  allEstablishments,
  establishmentGroupList,
  setFilters,
  showMultiLocalization,
  hideCoach,
  filters,
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
          label: getLevelTrad(level.id, level.name, t),
          levelColor: getLevelColor(level.id, level.color, theme),
        })),
      ].sort((a, b) => a.value - b.value),
    [customLevels, t, theme],
  );

  const coachesOptions = useMemo(
    () =>
      coaches.map((coach) => ({
        value: coach.id,
        label: coach.name,
      })),
    [coaches],
  );

  const establishmentsOptions = useMemo(
    () =>
      getGroupedEstablishmentOptions([...(establishments || [])]).map((opt) => {
        return { ...opt, icon: true };
      }),
    [establishments],
  );

  const metaActivitiesOption = useMemo(() => {
    const defaultArray = [];
    if (Object.values(metaActivities)) {
      return Object.values(metaActivities)
        .filter((ma) => ma.customer_enabled)
        .map((ma) => ({
          label: ma.name,
          value: ma.id,
        }));
    }
    return defaultArray;
  }, [metaActivities]);

  const disabledEstablishmentOptions = useMemo(() => {
    const options: { label: string; value: number }[] = [];
    filters?.establishments?.forEach((id: number) => {
      if (!establishments?.find((est: Establishment) => est.id === id)) {
        const label = (allEstablishments ?? []).find(
          (est: Establishment) => est.id === id,
        )?.title;
        options.push({ label, value: id });
      }
    });
    return options;
  }, [filters.establishments, allEstablishments, establishments]);

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

  const handleChange = useCallback(
    (key: string) => (values: number[]) => {
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
      <MarketplaceFilter
        text={metaActivityTitle}
        options={metaActivitiesOption}
        selectedOptions={filters.activity__in}
        onSelect={handleChange('activity__in')}
      />
      <MarketplaceFilter
        text={t('offer:levels.select.placeholder')}
        selectedOptions={filters.levels}
        onSelect={handleChange('levels')}
        options={levelsOptions}
        levelVariant
      />
      {!hideCoach && (
        <MarketplaceFilter
          options={coachesOptions}
          selectedOptions={filters.coaches}
          onSelect={handleChange('coaches')}
          text={t('coach:coach')}
        />
      )}
      <MarketplaceFilter
        text={t('establishment:room')}
        options={establishmentsOptions.concat(disabledEstablishmentOptions)}
        selectedOptions={filters.establishments}
        onSelect={handleChange('establishments')}
      />
      {showMultiLocalization &&
        establishmentGroupList &&
        establishmentGroupList.length !== 0 && (
          <MarketplaceFilter
            options={establishmentGroupOption}
            onSelect={handleChange('establishment_group__in')}
            text={t('establishment:localisation')}
            selectedOptions={filters.establishment_group__in}
          />
        )}
    </div>
  );
};

export default pure(withTheme(MarketplaceFilterCSSOnly));

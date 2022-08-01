import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';

import {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import { MetaActivity } from '../../../meta-activity/types';
import { Coach } from '../../../associated-coach/types';
import { Level } from '#libs/level/types';
import { MarketPlaceFilter } from '../../types';
import MarketplaceFilter from '../MarketplaceFilter/MarketplaceFilter.component';
import { getLevelTrad } from '#libs/level/utils';

import './MarketplaceFilterCSSOnly.css';

type Props = {
  coaches: Coach[];
  hideCoach: boolean;
  establishments: Establishment[];
  establishmentGroupList: Array<EstablishmentGroup>;
  metaActivities: MetaActivity[];
  filters: MarketPlaceFilter;
  setFilters: (key: string) => (value: any) => void;
  variant: 'activity' | 'workshop';
  showMultiLocalization: boolean;
  customLevels: Level[];
};

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
}) => {
  const { t } = useTranslation();
  const levelsOptions = useMemo(
    () =>
      customLevels.map((level) => ({
        value: level.id,
        label: getLevelTrad(level.id, level.name, t),
      })),
    [customLevels, t],
  );

  const coachesOptions = useMemo(
    () =>
      coaches.map((coach) => ({
        value: coach.id,
        label: coach.name,
      })),
    [coaches],
  );

  const metaActivitiesOption = useMemo(
    () =>
      metaActivities
        .filter((ma) => {
          if (variant === 'activity') {
            return ma.customer_enabled && !ma.is_workshop;
          }
          return ma.customer_enabled && ma.is_workshop;
        })
        .map((ma) => ({
          label: ma.name,
          value: ma.id,
        })),
    [metaActivities, variant],
  );

  const establishmentsOption = useMemo(
    () =>
      establishments.map((est) => ({
        label: est.title,
        value: est.id,
      })),
    [establishments],
  );

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
    <div className="bs-marketplace-filters">
      <div className="bs-marketplace-filters__list">
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
        {!hideCoach && (
          <MarketplaceFilter
            options={coachesOptions}
            selectedOptions={filters.coaches}
            onSelect={handleChange('coaches')}
            text={t('coach:coach')}
          />
        )}
        <MarketplaceFilter
          text={t('offer:levels.select.placeholder')}
          selectedOptions={filters.levels}
          onSelect={handleChange('levels')}
          options={levelsOptions}
        />
        <MarketplaceFilter
          text={t('establishment:room')}
          options={establishmentsOption}
          selectedOptions={filters.establishments}
          onSelect={handleChange('establishments')}
        />
        <MarketplaceFilter
          text={metaActivityTitle}
          options={metaActivitiesOption}
          selectedOptions={filters.activity__in}
          onSelect={handleChange('activity__in')}
        />
      </div>
    </div>
  );
};

export default pure(MarketplaceFilterCSSOnly);

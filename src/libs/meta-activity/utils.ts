import { MarketPlaceFilter } from '#libs/marketplace/types';
import { MetaActivityFilter } from './types';

export const convertMarketplaceFilterForMetaActivityCall = (
  companyId: number,
  filters: MarketPlaceFilter,
  onlineFilter?: { is_online: boolean | undefined },
): MetaActivityFilter => {
  return {
    company: companyId,
    with_future_slots: true,
    ...(filters.activity__in?.length > 0
      ? { id__in: filters.activity__in }
      : {}),
    ...(filters.coaches?.length > 0 ? { coach__in: filters.coaches } : {}),
    ...(filters.establishments?.length > 0
      ? { establishment__in: filters.establishments }
      : {}),
    ...(filters.levels?.length > 0 ? { level__in: filters.levels } : {}),
    ...(filters.establishment_group__in?.length > 0
      ? { establishment_group__in: filters.establishment_group__in }
      : {}),
    ...(typeof onlineFilter?.is_online === 'boolean'
      ? { is_online: onlineFilter.is_online }
      : {}),
  };
};

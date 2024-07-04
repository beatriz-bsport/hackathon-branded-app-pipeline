import React from 'react';

import ConsumerGenericFilters from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericFilters';

import type { TabFilter } from './types';

type Props = {
  filters: TabFilter[];
  selectedFilter: string;
};

export const PageHeaderFilters: React.FC<Props> = ({
  selectedFilter,
  filters,
}) => {
  return (
    <ConsumerGenericFilters filters={filters} selectedTab={selectedFilter} />
  );
};

export default React.memo(PageHeaderFilters);

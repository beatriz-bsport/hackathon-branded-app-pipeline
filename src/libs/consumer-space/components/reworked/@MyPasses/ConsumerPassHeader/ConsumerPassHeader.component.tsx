import React from 'react';

import ConsumerPassTitleAndButtons from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTitleAndButtons';
import ConsumerPassFilters from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters';
import ConsumerPassTabs from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs';

import type { PassFilterTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/types';
import type { PassTab } from '#libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/types';

import './styles.css';

type Props = {
  activeItemsCount: number;
  futureItemsCount: number;
  handleBuyPassClick: () => void;
  handleBookASessionClick: () => void;
  handleSetSelectedFilterTab: (type: PassFilterTab) => void;
  handleSetSelectedTab: (type: PassTab) => void;
  selectedFilterTab: PassFilterTab;
  selectedTab: PassTab;
};

const ConsumerPassHeader: React.FC<Props> = ({
  activeItemsCount,
  futureItemsCount,
  handleBuyPassClick,
  handleBookASessionClick,
  handleSetSelectedTab,
  handleSetSelectedFilterTab,
  selectedFilterTab,
  selectedTab,
}) => {
  return (
    <div className="bs-consumer-pass-page__header">
      <ConsumerPassTitleAndButtons
        onBookSessionClick={handleBookASessionClick}
        onByANewPassClick={handleBuyPassClick}
      />
      <ConsumerPassTabs
        onChangePassTab={handleSetSelectedTab}
        selectedTab={selectedTab}
      />
      <ConsumerPassFilters
        activePassesCount={activeItemsCount}
        futurePassesCount={futureItemsCount}
        onChangeFilterTab={handleSetSelectedFilterTab}
        selectedTab={selectedFilterTab}
      />
    </div>
  );
};

export default React.memo(ConsumerPassHeader);

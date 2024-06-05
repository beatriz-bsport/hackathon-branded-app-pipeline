import React from 'react';

import ConsumerPassTitleAndButtons from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTitleAndButtons';
import ConsumerPassFilters from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters';
import ConsumerPassTabs from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs';
import ConsumerHeaderSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerHeaderSkeleton';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

import type { PassFilterTab } from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassFilters/types';
import type { PassTab } from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassTabs/types';
import type { ConsumerPassesTabDisplay } from '#src/libs/consumer-space/types';

import './styles.css';

type Props = {
  activeItemsCount: number;
  consumerPassesTabDisplay?: ConsumerPassesTabDisplay;
  futureItemsCount: number;
  handleBuyPassClick: () => void;
  handleBookASessionClick: () => void;
  handleSetSelectedFilterTab: (type: PassFilterTab) => void;
  handleSetSelectedTab: (type: PassTab) => void;
  handleTogglePassTabDrawer: () => void;
  isLoading: boolean;
  isMobile?: boolean;
  selectedFilterTab: PassFilterTab;
  selectedTab: PassTab;
};

const ConsumerPassHeader: React.FC<Props> = ({
  activeItemsCount,
  consumerPassesTabDisplay,
  futureItemsCount,
  handleBuyPassClick,
  handleBookASessionClick,
  handleSetSelectedTab,
  handleSetSelectedFilterTab,
  handleTogglePassTabDrawer,
  isLoading,
  isMobile,
  selectedFilterTab,
  selectedTab,
}) => {
  const isWidget = WidgetUtils.isWidget();

  if (isLoading) {
    return <ConsumerHeaderSkeleton className="bs-consumer-pass-page__header" />;
  }

  return (
    <div className="bs-consumer-pass-page__header">
      <ConsumerPassTitleAndButtons
        handleBuyNewPass={handleBuyPassClick}
        isMobile={isMobile}
        isWidget={isWidget}
        onBookSessionClick={handleBookASessionClick}
      />
      <ConsumerPassTabs
        consumerPassesTabDisplay={consumerPassesTabDisplay}
        handleToggleTabDrawer={handleTogglePassTabDrawer}
        isMobile={isMobile}
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

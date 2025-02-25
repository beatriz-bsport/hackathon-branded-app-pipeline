import React from 'react';

import Tab from '#Fabrique/Tab';

import './styles.css';

type Props<TabType> = {
  selectedTab: TabType;
  tabs: {
    label: string;
    type: TabType;
    onClick: () => void;
  }[];
};

export const ConsumerGenericTabs = <TabType,>({
  selectedTab,
  tabs,
}: Props<TabType>) => {
  return (
    <div className="bs-consumer-generic-tabs">
      {(tabs ?? []).map(({ onClick, label, type }) => (
        <Tab
          key={`${label}-${type}`}
          className="bs-consumer-generic-tabs__tab"
          color="grey"
          isSelected={selectedTab === type}
          onClick={onClick}
        >
          {label}
        </Tab>
      ))}
    </div>
  );
};

export default React.memo(ConsumerGenericTabs) as typeof ConsumerGenericTabs;

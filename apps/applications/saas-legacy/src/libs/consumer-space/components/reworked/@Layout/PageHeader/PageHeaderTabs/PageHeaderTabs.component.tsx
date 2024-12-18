import React, { useCallback, useMemo } from 'react';

import Selector from '#Fabrique/Selector';

import ConsumerGenericTabs from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericTabs';

import type { PageHeaderTabsType, TabData } from './types';

import './styles.css';

type Props<T extends PageHeaderTabsType> = {
  handleToggleTabDrawer: () => void;
  isMobile?: boolean;
  selectedTab: keyof T;
  tabs: TabData<T>[];
};

export const PageHeaderTabs = <T extends PageHeaderTabsType>({
  handleToggleTabDrawer,
  isMobile,
  tabs,
  selectedTab,
}: Props<T>) => {
  const getSelectedItemLabel = useCallback(
    (item: { type: string; label: string; onClick: () => void }) => item?.label,
    [],
  );

  const getSelectedItemValue = useCallback(
    (item: { type: string; label: string; onClick: () => void }) => item?.type,
    [],
  );

  // We want the tabs to be shown only if their number exceeds 2.
  const hideComponent = tabs.filter((tab) => !tab.hidden).length <= 1;

  const selectorSelectedItem = useMemo(() => {
    const selectedPassTab = tabs
      .filter((tab) => !!tab?.type && !!tab?.label)
      .find((tab) => tab?.type === selectedTab);

    return {
      id: selectedPassTab?.type,
      label: selectedPassTab?.label,
    };
  }, [tabs, selectedTab]);

  if (hideComponent) {
    return null;
  }

  return isMobile && handleToggleTabDrawer ? (
    <div className="bs-consumer-pass-tabs__root--mobile">
      <Selector
        noAnimate
        preventOpenMenu
        className="bs-consumer-pass-tabs__selector"
        closeOnSelect={false}
        getSelectedItemLabel={getSelectedItemLabel}
        getSelectedItemValue={getSelectedItemValue}
        id="bs-consumer-pass-tabs__selector"
        onClick={handleToggleTabDrawer}
        selectedItems={selectorSelectedItem}
        size="lg"
      />
    </div>
  ) : (
    <ConsumerGenericTabs<keyof T> selectedTab={selectedTab} tabs={tabs} />
  );
};

export default React.memo(PageHeaderTabs);

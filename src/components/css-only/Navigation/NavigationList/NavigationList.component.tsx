import React from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MenuItemList from '#src/components/css-only/Fabrique/MenuItemList';
import NavigationItem from '#src/components/css-only/Navigation/NavigationItem';
import Collapse from '#src/components/css-only/Fabrique/Collapse';

import { ChevronDown, ChevronUp } from '#src/components/untitledui';

import type { NavigationSection } from '#src/libs/consumer-space/components/reworked/@Navigation/types';

const NavigationList: React.FC<NavigationSection> = ({
  navigationItems,
  isCollapsable,
  title,
  hasDivider,
  buildUrl,
  onBottomDrawerClose,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const onClickExpand = React.useCallback(
    () => setIsExpanded((prevState) => !prevState),
    [],
  );

  if (!navigationItems?.length) return null;

  if (isCollapsable) {
    const firstNavigationItem = navigationItems[0];
    const filteredList = navigationItems.filter((_, index) => index !== 0);

    return (
      <MenuItemList groupTitle={title} hasDivider={hasDivider}>
        <NavigationItem
          buildUrl={buildUrl}
          icon={firstNavigationItem.icon}
          onClick={onClickExpand}
          rightSlot={isExpanded ? <ChevronUp /> : <ChevronDown />}
          title={firstNavigationItem.title}
        />
        <Collapse collapsedHeight={0} isExpanded={isExpanded}>
          {filteredList.map((navigationItem) => (
            <NavigationItem
              key={navigationItem.title}
              buildUrl={buildUrl}
              {...navigationItem}
            />
          ))}
        </Collapse>
      </MenuItemList>
    );
  }

  return (
    <MenuItemList groupTitle={title} hasDivider={hasDivider}>
      {(navigationItems ?? []).map((navigationItem) => (
        <NavigationItem
          key={navigationItem.title}
          buildUrl={buildUrl}
          {...navigationItem}
          onClick={onBottomDrawerClose}
        />
      ))}
    </MenuItemList>
  );
};

export const NavigationListStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof NavigationList>>()(
    NavigationList,
  );
export default React.memo(NavigationList);

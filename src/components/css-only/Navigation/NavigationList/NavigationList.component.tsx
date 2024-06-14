import React from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MenuItemList from '#src/components/css-only/Fabrique/MenuItemList';
import NavigationItem from '#src/components/css-only/Navigation/NavigationItem';
import Collapse from '#src/components/css-only/Fabrique/Collapse';
import type { NavigationSection } from '#src/libs/consumer-space/components/reworked/@Navigation/types';

const NavigationList: React.FC<NavigationSection> = ({
  navigationItems,
  isCollapsable,
  title,
  buildUrl,
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
      <MenuItemList groupTitle={title}>
        <NavigationItem
          buildUrl={buildUrl}
          icon={firstNavigationItem.icon}
          onClick={onClickExpand}
          rightSlot={firstNavigationItem.rightSlot}
          title={firstNavigationItem.title}
        />
        <Collapse collapsedHeight={0} isExpanded={isExpanded}>
          {filteredList.map((navigationItem) => (
            <NavigationItem
              key={navigationItem.title}
              buildUrl={buildUrl}
              goTo={navigationItem.goTo}
              icon={navigationItem.icon}
              isCollapsable={navigationItem.isCollapsable}
              rightSlot={navigationItem.rightSlot}
              title={navigationItem.title}
            />
          ))}
        </Collapse>
      </MenuItemList>
    );
  }

  return (
    <MenuItemList groupTitle={title}>
      {(navigationItems ?? []).map((navigationItem) => (
        <NavigationItem
          key={navigationItem.title}
          buildUrl={buildUrl}
          goTo={navigationItem.goTo}
          icon={navigationItem.icon}
          isCollapsable={navigationItem.isCollapsable}
          rightSlot={navigationItem.rightSlot}
          title={navigationItem.title}
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

import React from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import NavigationList from '#src/components/css-only/Navigation/NavigationList';
import { PortalContainer } from '#src/components/css-only/Fabrique/PortalContainer';
import BottomDrawer from '#src/components/css-only/Fabrique/BottomDrawer';
import type { NavigationProps } from '#src/libs/consumer-space/components/reworked/@Navigation/types';

import './styles.css';

const NavigationSideBar: React.FC<NavigationProps> = ({
  isBottomDrawerOpen,
  isMobile,
  navigationMenu,
  buildUrl,
}) => {
  if (!navigationMenu) return null;

  if (isMobile && isBottomDrawerOpen)
    return (
      <PortalContainer wrapperId="bs-consumer-space-navigation__portal-container">
        <BottomDrawer>
          {navigationMenu.map((navigationSection) => (
            <NavigationList
              key={navigationSection.title}
              buildUrl={buildUrl}
              isCollapsable={navigationSection.isCollapsable}
              navigationItems={navigationSection.navigationItems}
              title={navigationSection.title}
            />
          ))}
        </BottomDrawer>
      </PortalContainer>
    );
  if (!isMobile)
    return (
      <aside className="bs-consumer-space-navigation-sidebar__root">
        <nav className="bs-consumer-space-navigation-sidebar__navigation">
          {navigationMenu.map((navigationSection) => (
            <NavigationList
              key={navigationSection.title}
              buildUrl={buildUrl}
              isCollapsable={navigationSection.isCollapsable}
              navigationItems={navigationSection.navigationItems}
              title={navigationSection.title}
            />
          ))}
        </nav>
      </aside>
    );
};

export const NavigationSideBarStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof NavigationSideBar>>()(
    NavigationSideBar,
  );

export default React.memo(NavigationSideBar);

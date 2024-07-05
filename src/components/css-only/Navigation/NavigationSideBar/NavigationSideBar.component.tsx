import React from 'react';
import { useTranslation } from 'react-i18next';
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
  memberName,
  onBottomDrawerClose,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (!navigationMenu) return null;

  if (isMobile)
    return (
      <PortalContainer wrapperId="bs-consumer-space-navigation__portal-container">
        <BottomDrawer
          blanketProps={{
            isOpen: isBottomDrawerOpen,
            onClick: onBottomDrawerClose,
          }}
          modalDialogProps={{
            title: `${memberName},`,
            subtitle: t('reworked.exploreYourProfile'),
            classes: {
              content: 'bs-consumer-space-navigation__bottom-drawer__content',
            },
          }}
        >
          {navigationMenu.map((navigationSection) => (
            <NavigationList
              key={navigationSection.title}
              buildUrl={buildUrl}
              {...navigationSection}
            />
          ))}
        </BottomDrawer>
      </PortalContainer>
    );
  return (
    <aside className="bs-consumer-space-navigation-sidebar__root">
      <nav className="bs-consumer-space-navigation-sidebar__navigation">
        {navigationMenu.map((navigationSection) => (
          <NavigationList
            key={navigationSection.title}
            buildUrl={buildUrl}
            {...navigationSection}
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

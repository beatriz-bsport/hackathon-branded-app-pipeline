import React from 'react';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import NavigationAppBarLogoSection from '#src/components/css-only/Navigation/NavigationAppBar/NavigationAppBarLogoSection';
import NavigationAppBarActionSection from '#src/components/css-only/Navigation/NavigationAppBar/NavigationAppBarActionsSection';

import type { NavigationAppBarProps } from '#src/components/css-only/Navigation/NavigationAppBar/types';

import './styles.css';

const NavigationAppBar: React.FC<NavigationAppBarProps> = ({
  isMobile,
  logo,
  websiteUrl,
  actions,
  onOpenAppBarMenuClick,
}) => {
  return (
    <div className="bs-navigation-app-bar__root">
      <NavigationAppBarLogoSection
        isMobile={isMobile}
        logo={logo}
        onOpenAppBarMenuClick={onOpenAppBarMenuClick}
        websiteUrl={websiteUrl}
      />

      <NavigationAppBarActionSection actions={actions} isMobile={isMobile} />
    </div>
  );
};

export const NavigationAppBarStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof NavigationAppBar>>()(
    NavigationAppBar,
  );
export default React.memo(NavigationAppBar);

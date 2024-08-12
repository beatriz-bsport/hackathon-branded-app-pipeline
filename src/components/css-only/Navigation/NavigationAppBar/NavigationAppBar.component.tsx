import React from 'react';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import NavigationAppBarLogoSection from '#src/components/css-only/Navigation/NavigationAppBar/NavigationAppBarLogoSection';
import NavigationAppBarLinksSection from '#src/components/css-only/Navigation/NavigationAppBar/NavigationAppBarLinksSection';
import NavigationAppBarActionSection from '#src/components/css-only/Navigation/NavigationAppBar/NavigationAppBarActionsSection';

import type { NavigationAppBarProps } from '#src/components/css-only/Navigation/NavigationAppBar/types';

import './styles.css';

const NavigationAppBar: React.FC<NavigationAppBarProps> = ({
  isMobile,
  logo,
  websiteUrl,
  links,
  actions,
  onSideDrawerOpenClick,
}) => {
  return (
    <div className="bs-navigation-app-bar__root">
      <NavigationAppBarLogoSection
        isMobile={isMobile}
        logo={logo}
        onSideDrawerOpenClick={onSideDrawerOpenClick}
        websiteUrl={websiteUrl}
      />

      <NavigationAppBarLinksSection isHidden={isMobile} links={links} />

      <NavigationAppBarActionSection actions={actions} isMobile={isMobile} />
    </div>
  );
};

export const NavigationAppBarStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof NavigationAppBar>>()(
    NavigationAppBar,
  );
export default React.memo(NavigationAppBar);

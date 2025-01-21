import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Alert from '#Fabrique/Alert';
import { Users02 } from '#src/components/untitledui';
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
  relationshipAuthMemberName,
  onSideDrawerOpenClick,
  navigateBackToMasterRelation,
  showGoBackButton,
  goBackNavigation,
}) => {
  const { t } = useTranslation('consumerSpace');

  const hideMarketplaceMenuButton = (links ?? []).length === 0;

  return (
    <div className="bs-navigation-app-bar__root">
      <div className="bs-navigation-app-bar__content">
        <NavigationAppBarLogoSection
          goBackNavigation={goBackNavigation}
          hideMarketplaceMenuButton={hideMarketplaceMenuButton}
          isMobile={isMobile}
          logo={logo}
          onSideDrawerOpenClick={onSideDrawerOpenClick}
          showGoBackButton={showGoBackButton}
          websiteUrl={websiteUrl}
        />
        <NavigationAppBarLinksSection isHidden={isMobile} links={links} />
        <NavigationAppBarActionSection actions={actions} isMobile={isMobile} />
      </div>

      <div
        className={clsx('bs-navigation-app-bar__relationship-alert', {
          'bs-navigation-app-bar__relationship-alert--hidden':
            !relationshipAuthMemberName || isMobile,
        })}
      >
        <Alert
          actionText={t('navigation.backToRelationMasterSpace')}
          className="bs-navigation-app-bar__relationship-alert__alert"
          color="info"
          leftIcon={<Users02 stroke="currentColor" />}
          onActionClick={navigateBackToMasterRelation}
          variant="strong"
        >
          {t('reworked.navigation.loggedInAs', {
            name: relationshipAuthMemberName,
          })}
        </Alert>
      </div>
    </div>
  );
};

export const NavigationAppBarStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof NavigationAppBar>>()(
    NavigationAppBar,
  );
export default React.memo(NavigationAppBar);

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

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
  return (
    <div className="bs-navigation-app-bar__root">
      <div className="flex">
        <NavigationAppBarLogoSection
          goBackNavigation={goBackNavigation}
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
        className={classNames('bs-navigation-app-bar__relationship-alert', {
          'bs-navigation-app-bar__relationship-alert--hidden':
            !relationshipAuthMemberName || isMobile,
        })}
      >
        <Alert
          actionText={t('navigation.backToRelationMasterSpace')}
          className=""
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

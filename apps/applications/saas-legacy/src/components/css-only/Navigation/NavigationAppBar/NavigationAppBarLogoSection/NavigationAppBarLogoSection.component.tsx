import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { httpParser } from '#src/libs/marketplace/utils';
import ButtonBase from '#src/components/css-only/Fabrique/ButtonBaseV2';
import IconButton from '#src/components/css-only/Fabrique/IconButton';
import { ArrowLeft, Menu03 } from '#src/components/untitledui';
import classNames from 'classnames';

import type { NavigationAppBarProps } from '#src/components/css-only/Navigation/NavigationAppBar/types';

import './styles.css';

type Props = Pick<
  NavigationAppBarProps,
  | 'logo'
  | 'websiteUrl'
  | 'isMobile'
  | 'onSideDrawerOpenClick'
  | 'showGoBackButton'
  | 'goBackNavigation'
  | 'hideMarketplaceMenuButton'
>;

const NavigationAppBarLogoImage: React.FC<Pick<NavigationAppBarProps, 'logo'>> =
  React.memo(({ logo }) => {
    const { t } = useTranslation('consumerSpace');
    return (
      <img
        alt={t('reworked.appbar.companyLogo')}
        className="bs-navigation-app-bar__logo-section__logo-container__image"
        src={logo}
      />
    );
  });

const NavigationAppBarLogo: React.FC<
  Pick<NavigationAppBarProps, 'logo' | 'websiteUrl'>
> = React.memo(({ logo, websiteUrl }) => {
  const handleRedirectWebsiteURL = useCallback(() => {
    window.location.href = httpParser(websiteUrl);
  }, [websiteUrl]);

  return (
    <div
      className={classNames(
        'bs-navigation-app-bar__logo-section__logo-container',
        {
          'bs-navigation-app-bar__logo-section__logo-container--hidden': !logo,
        },
      )}
    >
      {websiteUrl ? (
        <ButtonBase
          className="bs-navigation-app-bar__logo-section__logo-container__button"
          onClick={handleRedirectWebsiteURL}
        >
          <NavigationAppBarLogoImage logo={logo} />
        </ButtonBase>
      ) : (
        <NavigationAppBarLogoImage logo={logo} />
      )}
    </div>
  );
});

const NavigationAppBarLogoSection: React.FC<Props> = ({
  logo,
  websiteUrl,
  isMobile,
  hideMarketplaceMenuButton,
  onSideDrawerOpenClick,
  showGoBackButton,
  goBackNavigation,
}) => {
  if (showGoBackButton && !!goBackNavigation) {
    return (
      <div className="bs-navigation-app-bar__logo-section__root">
        <IconButton
          className={classNames(
            'bs-navigation-app-bar__logo-section__menu-button',
          )}
          color="grey"
          onClick={goBackNavigation}
          size="md"
          variant="text"
        >
          <ArrowLeft />
        </IconButton>
      </div>
    );
  }
  return (
    <div className="bs-navigation-app-bar__logo-section__root">
      <IconButton
        className={classNames(
          'bs-navigation-app-bar__logo-section__menu-button',
          {
            'bs-navigation-app-bar__logo-section__menu-button--hidden':
              !isMobile || hideMarketplaceMenuButton,
          },
        )}
        color="grey"
        onClick={onSideDrawerOpenClick}
        size="md"
        variant="text"
      >
        <Menu03 />
      </IconButton>

      <NavigationAppBarLogo logo={logo} websiteUrl={websiteUrl} />
    </div>
  );
};

export const NavigationAppBarLogoSectionStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof NavigationAppBarLogoSection>
>()(NavigationAppBarLogoSection);
export default React.memo(NavigationAppBarLogoSection);

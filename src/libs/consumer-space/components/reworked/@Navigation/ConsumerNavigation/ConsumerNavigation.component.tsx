import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import AppBar from '#src/components/css-only/Navigation/AppBar';
import useViewport from '#Fabrique/hooks/useViewport';
import NavigationSideBar from '#src/components/css-only/Navigation/NavigationSideBar';
import useNavigationData from '../useNavigationData';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
//@ts-expect-error
import LanguageButton from '#src/components/button/LanguageButton.component';
import { ButtonData } from '#src/components/css-only/Navigation/types';
import {
  DotsVertical,
  ShoppingCart01,
  UserCircle,
} from '#src/components/untitledui';
import Menu from '#src/components/css-only/Fabrique/Menu';
import ConsumerGenericFooter from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericFooter';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';

import './styles.css';

type Props = {
  buildUrl: (string: any) => string;
  companyLogo: string;
  companyId: number;
  hasMultipleMembership: boolean;
  hasFranchise: boolean;
  isNewCheckoutFlow: boolean;
  isRelationNavigation: boolean;
  memberName: string;
  buttonsData?: HeaderButton[];
  redirectToCart: () => void;
  redirectToMyProfile: () => void;
};

const ConsumerNavigation: React.FC<Props> = ({
  companyLogo,
  companyId,
  hasMultipleMembership,
  hasFranchise,
  isNewCheckoutFlow,
  isRelationNavigation,
  memberName,
  children,
  buttonsData,
  buildUrl,
  redirectToCart,
  redirectToMyProfile,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);

  const toggleBottomDrawer = useCallback(() => {
    setIsBottomDrawerOpen((prevState) => !prevState);
  }, [setIsBottomDrawerOpen]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

  const [isFlagMenuOpen, setIsFlagMenuOpen] = useState(false);

  const openFlagMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const currentTarget = event.currentTarget;
      setAnchorEl(currentTarget);
      setIsFlagMenuOpen(true);
    },
    [],
  );

  const closeFlagMenu = useCallback(() => {
    setAnchorEl(null);
    setIsFlagMenuOpen(false);
  }, []);

  const rightButtonData: ButtonData[] = useMemo(
    () => [
      {
        label: t('reworked.appbar.cart'),
        color: 'grey',
        leftIcon: <ShoppingCart01 />,
        onClick: redirectToCart,
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
      },
      {
        label: t('reworked.appbar.myAccount'),
        color: 'grey',
        leftIcon: <UserCircle />,
        onClick: redirectToMyProfile,
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
      },
      {
        label: 'changeLanguageButton',
        color: 'grey',
        isIconButton: true,
        leftIcon: <DotsVertical />,
        onClick: isFlagMenuOpen ? closeFlagMenu : openFlagMenu,
        variant: 'text',
      },
    ],
    [
      closeFlagMenu,
      isFlagMenuOpen,
      isMobile,
      openFlagMenu,
      redirectToCart,
      redirectToMyProfile,
      t,
    ],
  );

  const navigationMenu = useNavigationData({
    companyId,
    hasMultipleMembership,
    hasFranchise,
    isMobile,
    isNewCheckoutFlow,
    isRelationNavigation,
    memberName,
  });

  return (
    <div className="bs-consumer-navigation__root">
      <AppBar
        isMobile={isMobile}
        logo={companyLogo}
        onClickMenuButton={toggleBottomDrawer}
        rightButtons={rightButtonData}
      />
      <Menu anchorEl={anchorEl} id="flag-menu" isOpen={isFlagMenuOpen}>
        <LanguageButton onLocaleChange={closeFlagMenu} />
      </Menu>
      <div className="bs-consumer-navigation__layout">
        <NavigationSideBar
          buildUrl={buildUrl}
          isBottomDrawerOpen={isBottomDrawerOpen}
          isMobile={isMobile}
          memberName={memberName}
          navigationMenu={navigationMenu}
          onBottomDrawerClose={toggleBottomDrawer}
        />
        <main
          className={classNames('bs-consumer-navigation__content', {
            'bs-consumer-navigation__content--mobile': isMobile,
          })}
        >
          {children}
          {isMobile && !!buttonsData.length && (
            <ConsumerGenericFooter buttons={buttonsData} />
          )}
        </main>
      </div>
    </div>
  );
};

export const ConsumerNavigationStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ConsumerNavigation>>()(
    ConsumerNavigation,
  );
export default React.memo(ConsumerNavigation);

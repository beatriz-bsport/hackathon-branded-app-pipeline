import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import AppBar from '#src/components/css-only/Navigation/AppBar';
import useViewport from '#Fabrique/hooks/useViewport';
import NavigationSideBar from '#src/components/css-only/Navigation/NavigationSideBar';
import useNavigationData from '../useNavigationData';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
//@ts-expect-error
import LanguageButton from '#src/components/button/LanguageButton.component';
import { ButtonData } from '#src/components/css-only/Navigation/types';
import { DotsVertical } from '#src/components/untitledui';
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
}) => {
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
        label: 'changeLanguageButton',
        color: 'grey',
        isIconButton: true,
        leftIcon: <DotsVertical />,
        onClick: openFlagMenu,
        variant: 'text',
      },
    ],
    [openFlagMenu],
  );

  const navigationMenu = useNavigationData(
    companyId,
    hasMultipleMembership,
    hasFranchise,
    isMobile,
    isNewCheckoutFlow,
    isRelationNavigation,
    memberName,
  );

  return (
    <div className="bs-consumer-navigation__root">
      <AppBar
        isMobile={isMobile}
        logo={companyLogo}
        onClickMenuButton={toggleBottomDrawer}
        rightButtons={rightButtonData}
      />
      <Menu
        anchorEl={anchorEl}
        id="flag-menu"
        isOpen={isFlagMenuOpen}
        onClose={closeFlagMenu}
      >
        <LanguageButton closeMenu={closeFlagMenu} />
      </Menu>
      <div className="bs-consumer-navigation__layout">
        <NavigationSideBar
          buildUrl={buildUrl}
          isBottomDrawerOpen={isBottomDrawerOpen}
          isMobile={isMobile}
          memberName={memberName}
          navigationMenu={navigationMenu}
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

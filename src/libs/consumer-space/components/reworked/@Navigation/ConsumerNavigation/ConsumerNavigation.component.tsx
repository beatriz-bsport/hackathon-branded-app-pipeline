import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import NavigationAppBar from '#src/components/css-only/Navigation/NavigationAppBar';
import useViewport from '#Fabrique/hooks/useViewport';
import NavigationSideBar from '#src/components/css-only/Navigation/NavigationSideBar';
import useNavigationData from '../useNavigationData';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';

import { ShoppingCart01, UserCircle } from '#src/components/untitledui';
import ConsumerGenericFooter from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericFooter';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';
import type { AppBarButton } from '#src/components/css-only/Navigation/NavigationAppBar/types';

import './styles.css';

type Props = {
  buildUrl: (string: any) => string;
  companyLogo: string;
  companyWebsiteUrl?: string;
  companyId: number;
  hasMultipleMembership: boolean;
  hasFranchise: boolean;
  isNewCheckoutFlow: boolean;
  isRelationNavigation: boolean;
  memberName: string;
  /** A list of action buttons to display in the header */
  buttonsData?: HeaderButton[];
  /** The number of products in the current member basket */
  basketProductListCount?: number;
  redirectToCart: () => void;
  redirectToMyProfile: () => void;
};

const ConsumerNavigation: React.FC<Props> = ({
  companyLogo,
  companyWebsiteUrl,
  companyId,
  hasMultipleMembership,
  hasFranchise,
  isNewCheckoutFlow,
  isRelationNavigation,
  memberName,
  children,
  buttonsData,
  basketProductListCount,
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

  const actionsList: AppBarButton[] = useMemo(
    () => [
      {
        label: t('reworked.appbar.cart'),
        color: 'grey',
        leftIcon: <ShoppingCart01 />,
        onClick: redirectToCart,
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
        badgeValue: basketProductListCount,
      },
      {
        label: t('reworked.appbar.myAccount'),
        color: 'grey',
        leftIcon: <UserCircle />,
        onClick: redirectToMyProfile,
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
      },
    ],
    [basketProductListCount, isMobile, redirectToCart, redirectToMyProfile, t],
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
      <NavigationAppBar
        actions={actionsList}
        isMobile={isMobile}
        logo={companyLogo}
        websiteUrl={companyWebsiteUrl}
      />

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

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

// @ts-expect-error JS
import i18n, { AVAILABLE_LANGUAGES, getFullLanguage } from '#src/i18n';
import {
  Calendar,
  FileAttachment02,
  Gift02,
  NotificationText,
  ShoppingCart01,
  Star01,
  Ticket01,
  UserEdit,
} from '#src/components/untitledui';
import {
  getCheckoutUrl,
  getMarketplaceRoute,
} from '#src/libs/marketplace/routing-utils';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';
import type { NavigationSection } from '#src/libs/consumer-space/components/reworked/@Navigation/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';

const useNavigationData = ({
  companyId,
  isMobile,
  isNewCheckoutFlow,
  isRelationNavigation,
  memberName,
  franchisorCompanyList,
  handleCloseSideDrawer,
}: {
  companyId: number;
  hasMultipleMembership: boolean;
  isMobile: boolean;
  isNewCheckoutFlow: boolean;
  isRelationNavigation: boolean;
  memberName: string;
  franchisorCompanyList: FranchiseCompany[];
  handleCloseSideDrawer: () => void;
}) => {
  const { t } = useTranslation('consumerSpace');

  const location = useLocation();

  const isWidget = WidgetUtils.isWidget();

  const checkoutUrl = getCheckoutUrl(companyId, isNewCheckoutFlow);

  const isAbleToChangeStudio =
    !!franchisorCompanyList?.length && !isWidget && !isRelationNavigation;

  const handleChangeLocale = useCallback(
    (locale: string) => () => {
      i18n.changeLanguage(locale);
      handleCloseSideDrawer();
    },
    [handleCloseSideDrawer],
  );

  const navigationDataMobile: SubmenuItem[] = React.useMemo(
    () => [
      {
        title: t('reworked.navigation.myBookings'),
        leftIcon: <Calendar />,
        to: `/c/${companyId}/booking/`,
        isSelected: location.pathname.includes('/booking/'),
        onClick: handleCloseSideDrawer,
      },
      {
        title: t('reworked.navigation.myPasses'),
        leftIcon: <Ticket01 />,
        to: `/c/${companyId}/pack/`,
        isSelected: location.pathname.includes('/pack/'),
        onClick: handleCloseSideDrawer,
      },
      {
        title: t('reworked.navigation.mySubscriptions'),
        leftIcon: <Star01 />,
        to: `/c/${companyId}/subscription/`,
        isSelected: location.pathname.includes('/subscription/'),
        onClick: handleCloseSideDrawer,
      },
      {
        title: t('reworked.navigation.myProfile'),
        leftIcon: <UserEdit />,
        to: `/c/${companyId}/profile/`,
        isSelected: location.pathname.includes('/profile/'),
        onClick: handleCloseSideDrawer,
      },
      {
        title: t('reworked.navigation.myGiftCards'),
        leftIcon: <Gift02 />,
        to: `/c/${companyId}/giftcard/`,
        isSelected: location.pathname.includes('/giftcard/'),
        onClick: handleCloseSideDrawer,
      },
      {
        title: t('reworked.navigation.myInvoices'),
        leftIcon: <FileAttachment02 />,
        to: `/c/${companyId}/invoice/`,
        isSelected: location.pathname.includes('/invoice/'),
        onClick: handleCloseSideDrawer,
      },
      { isDivider: true },
      ...(isAbleToChangeStudio
        ? [
            {
              title: t('reworked.navigation.changeStudio'),
              items: (franchisorCompanyList ?? []).map((company) => ({
                title: company.name,
                isSelected: companyId === company.id,
                to: getMarketplaceRoute(company.name, company.id),
                onClick: handleCloseSideDrawer,
              })),
            },
          ]
        : []),
      {
        title: t('reworked.navigation.changeLanguage'),
        items: (AVAILABLE_LANGUAGES ?? []).map((locale: string) => ({
          title: t(`language.${locale}`),
          isSelected: getFullLanguage() === locale,
          onClick: handleChangeLocale(locale),
        })),
      },
      {
        title: t('reworked.navigation.logOut'),
        className: 'bs-navigation__logout-button__root',
        to: `/login/signout?membership=${companyId}`,
      },
    ],
    [
      isAbleToChangeStudio,
      companyId,
      franchisorCompanyList,
      handleChangeLocale,
      location.pathname,
      handleCloseSideDrawer,
      t,
    ],
  );

  const navigationData: NavigationSection[] = React.useMemo(
    () => [
      {
        title: t('reworked.navigation.account.title'),
        navigationItems: [
          {
            title: t('reworked.navigation.account.summary'),
            icon: <Calendar />,
            goTo: '/home/',
            isCurrentRoute: location.pathname.includes('/home/'),
          },
          {
            title: t('reworked.navigation.account.myBookings'),
            icon: <NotificationText />,
            goTo: '/booking/',
            isCurrentRoute: location.pathname.includes('/booking/'),
          },
          {
            title: t('reworked.navigation.account.myPasses'),
            icon: <Ticket01 />,
            goTo: '/pack/',
            isCurrentRoute: location.pathname.includes('/pack/'),
          },
          {
            title: t('reworked.navigation.account.mySubscriptions'),
            icon: <Star01 />,
            goTo: '/subscription/',
            isCurrentRoute: location.pathname.includes('/subscription/'),
          },
          {
            title: t('reworked.navigation.account.myProfile'),
            icon: <UserEdit />,
            goTo: '/profile/',
            isCurrentRoute: location.pathname.includes('/profile/'),
          },
        ],
      },
      {
        title: t('reworked.navigation.shop.title'),
        navigationItems: [
          {
            title: t('reworked.navigation.shop.myPurchases'),
            icon: <ShoppingCart01 />,
            goTo: checkoutUrl,
          },
          {
            title: t('reworked.navigation.shop.myGiftCards'),
            icon: <Gift02 />,
            goTo: '/giftcard/',
            isCurrentRoute: location.pathname.includes('/giftcard/'),
          },
        ],
      },
      {
        title: t('reworked.navigation.payments.title'),
        hasDivider: true,
        navigationItems: [
          {
            title: t('reworked.navigation.payments.myInvoices'),
            icon: <FileAttachment02 />,
            goTo: '/invoice/',
            isCurrentRoute: location.pathname.includes('/invoice/'),
          },
        ],
      },
      {
        isCollapsable: !isMobile,
        navigationItems: [
          ...(isMobile
            ? []
            : [
                {
                  title: memberName,
                  icon: <UserEdit />,
                },
              ]),
          // TODO: REPLACE BY SUBMENU ITEMS
          {
            title: t('reworked.navigation.myAccount.logOut'),
            goTo: `/login/signout?membership=${companyId}`,
          },
        ],
      },
    ],
    [checkoutUrl, companyId, isMobile, location.pathname, memberName, t],
  );
  return { navigationData, navigationDataMobile };
};

export default useNavigationData;

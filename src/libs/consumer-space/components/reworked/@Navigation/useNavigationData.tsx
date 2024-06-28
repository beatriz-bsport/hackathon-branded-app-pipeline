import React from 'react';
import { useTranslation } from 'react-i18next';

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

import type {
  NavigationMenu,
  NavigationSection,
} from '#src/libs/consumer-space/components/reworked/@Navigation/types';
import { getCheckoutUrl } from '#src/libs/marketplace/routing-utils';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { useLocation } from 'react-router';

const useNavigationData = (
  companyId: number,
  hasMultipleMembership: boolean,
  hasFranchise: boolean,
  isMobile: boolean,
  isNewCheckoutFlow: boolean,
  isRelationNavigation: boolean,
  memberName: string,
): NavigationMenu => {
  const { t } = useTranslation('consumerSpace');

  const location = useLocation();

  const isWidget = WidgetUtils.isWidget();

  const checkoutUrl = getCheckoutUrl(companyId, isNewCheckoutFlow);

  const canChangeStudio =
    hasMultipleMembership &&
    !hasFranchise &&
    !isWidget &&
    !isRelationNavigation;

  const canChangeFranchisee = hasFranchise && !isRelationNavigation;

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

          ...(canChangeStudio
            ? [
                {
                  title: t('reworked.navigation.myAccount.changeStudio'),
                  goTo: '/c/membership-selector/',
                },
              ]
            : []),
          ...(canChangeFranchisee
            ? [
                {
                  title: t('reworked.navigation.myAccount.changeStudio'),
                  goTo: `/c/franchisee-selector/${hasFranchise}`,
                },
              ]
            : []),
          {
            title: t('reworked.navigation.myAccount.logOut'),
          },
        ],
      },
    ],
    [
      canChangeFranchisee,
      canChangeStudio,
      checkoutUrl,
      hasFranchise,
      isMobile,
      location.pathname,
      memberName,
      t,
    ],
  );
  return navigationData;
};

export default useNavigationData;

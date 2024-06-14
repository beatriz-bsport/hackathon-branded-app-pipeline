import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Calendar,
  ChevronDown,
  FileAttachment02,
  Gift02,
  NotificationText,
  ShoppingCart01,
  Star01,
  Ticket01,
  UserEdit,
} from '#src/components/untitledui';

import type { NavigationMenu } from '#src/libs/consumer-space/components/reworked/@Navigation/types';
import { getCheckoutUrl } from '#src/libs/marketplace/routing-utils';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

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

  const isWidget = WidgetUtils.isWidget();

  const checkoutUrl = getCheckoutUrl(companyId, isNewCheckoutFlow);

  const canChangeStudio =
    hasMultipleMembership &&
    !hasFranchise &&
    !isWidget &&
    !isRelationNavigation;

  const canChangeFranchisee = hasFranchise && !isRelationNavigation;

  const navigationData = React.useMemo(
    () => [
      {
        title: t('reworked.navigation.account.title'),
        navigationItems: [
          {
            title: t('reworked.navigation.account.summary'),
            icon: <Calendar />,
            goTo: '/home/',
          },
          {
            title: t('reworked.navigation.account.myBookings'),
            icon: <NotificationText />,
            goTo: '/booking/',
          },
          {
            title: t('reworked.navigation.account.myPasses'),
            icon: <Ticket01 />,
            goTo: '/pack/',
          },
          {
            title: t('reworked.navigation.account.mySubscriptions'),
            icon: <Star01 />,
            goTo: '/subscription/',
          },
          {
            title: t('reworked.navigation.account.myProfile'),
            icon: <UserEdit />,
            goTo: '/profile/',
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
          },
        ],
      },
      {
        title: t('reworked.navigation.payments.title'),
        navigationItems: [
          {
            title: t('reworked.navigation.payments.myInvoices'),
            icon: <FileAttachment02 />,
            goTo: '/invoice/',
          },
        ],
      },
      {
        isCollapsable: !isMobile,
        navigationItems: [
          ...(isMobile
            ? [
                {
                  title: memberName,
                  icon: <UserEdit />,
                  rightSlot: <ChevronDown />,
                },
              ]
            : []),
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
            title: t('reworked.navigation.myAccount.changeLanguage'),
          },
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
      memberName,
      t,
    ],
  );
  return navigationData;
};

export default useNavigationData;

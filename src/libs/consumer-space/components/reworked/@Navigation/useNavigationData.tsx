import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

// @ts-expect-error JS
import i18n, { AVAILABLE_LANGUAGES, getFullLanguage } from '#src/i18n';
import {
  Calendar,
  FileAttachment02,
  Gift02,
  Star01,
  Ticket01,
  UserEdit,
} from '#src/components/untitledui';
import { getMarketplaceRoute } from '#src/libs/marketplace/routing-utils';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';

const useNavigationData = ({
  companyId,
  isRelationNavigation,
  franchisorCompanyList,
  handleCloseSideDrawer,
}: {
  companyId: number;
  isRelationNavigation: boolean;
  franchisorCompanyList: FranchiseCompany[];
  handleCloseSideDrawer: () => void;
}) => {
  const { t } = useTranslation('consumerSpace');

  const location = useLocation();

  const isWidget = WidgetUtils.isWidget();

  const isAbleToChangeStudio =
    !!franchisorCompanyList?.length && !isWidget && !isRelationNavigation;

  const handleChangeLocale = useCallback(
    (locale: string) => () => {
      i18n.changeLanguage(locale);
      handleCloseSideDrawer();
    },
    [handleCloseSideDrawer],
  );

  const navigationData: SubmenuItem[] = React.useMemo(
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

  return navigationData;
};

export default useNavigationData;

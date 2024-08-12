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
  UserCircle,
} from '#src/components/untitledui';
import { getMarketplaceRoute } from '#src/libs/marketplace/routing-utils';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';
import type { AppBarTab } from '#src/components/css-only/Navigation/NavigationAppBar/types';
import type { Company } from '#src/libs/company/types';

const useNavigationData = ({
  companyId,
  linksList,
  franchisorCompanyList,
  handleCloseMarketplaceSideDrawer,
  handleCloseConsumerSideDrawer,
}: {
  companyId: number;
  linksList: AppBarTab[];
  franchisorCompanyList: Company[];
  handleCloseMarketplaceSideDrawer: () => void;
  handleCloseConsumerSideDrawer: () => void;
}) => {
  const { t } = useTranslation('consumerSpace');

  const location = useLocation();

  const isWidget = WidgetUtils.isWidget();

  const isAbleToChangeStudio =
    (franchisorCompanyList ?? []).length > 0 && !isWidget;

  const handleChangeLocale = useCallback(
    (locale: string) => () => {
      i18n.changeLanguage(locale);
      handleCloseConsumerSideDrawer();
    },
    [handleCloseConsumerSideDrawer],
  );

  const consumerNavigationData: SubmenuItem[] = React.useMemo(
    () => [
      {
        title: t('reworked.navigation.myBookings'),
        leftIcon: <Calendar />,
        to: `/c/${companyId}/booking/`,
        isSelected: location.pathname.includes('/booking/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.myPasses'),
        leftIcon: <Ticket01 />,
        to: `/c/${companyId}/pack/`,
        isSelected: location.pathname.includes('/pack/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.mySubscriptions'),
        leftIcon: <Star01 />,
        to: `/c/${companyId}/subscription/`,
        isSelected: location.pathname.includes('/subscription/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.myProfile'),
        leftIcon: <UserEdit />,
        to: `/c/${companyId}/profile/`,
        isSelected: location.pathname.includes('/profile/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.myGiftCards'),
        leftIcon: <Gift02 />,
        to: `/c/${companyId}/giftcard/`,
        isSelected: location.pathname.includes('/giftcard/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.myInvoices'),
        leftIcon: <FileAttachment02 />,
        to: `/c/${companyId}/invoice/`,
        isSelected: location.pathname.includes('/invoice/'),
        onClick: handleCloseConsumerSideDrawer,
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
                onClick: handleCloseConsumerSideDrawer,
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
      t,
      companyId,
      location.pathname,
      handleCloseConsumerSideDrawer,
      isAbleToChangeStudio,
      franchisorCompanyList,
      handleChangeLocale,
    ],
  );

  const marketplaceNavigationData: SubmenuItem[] = React.useMemo(
    () => [
      ...(linksList ?? []).map((link) => ({
        title: link.label,
        isSelected: link.isSelected,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          link.onClick?.(event);
          handleCloseMarketplaceSideDrawer();
        },
      })),
      { isDivider: true },
      {
        title: t('reworked.appbar.myAccount'),
        leftIcon: <UserCircle />,
        to: `/c/${companyId}/booking/`,
        onClick: handleCloseMarketplaceSideDrawer,
      },
    ],
    [companyId, handleCloseMarketplaceSideDrawer, linksList, t],
  );

  return { marketplaceNavigationData, consumerNavigationData };
};

export default useNavigationData;

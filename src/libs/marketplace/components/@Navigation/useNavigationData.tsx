import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
  selectedWidgetPage,
  handleCloseMarketplaceSideDrawer,
  handleCloseConsumerSideDrawer,
  changeWidgetPage,
}: {
  companyId: number;
  linksList: AppBarTab[];
  franchisorCompanyList: Company[];
  selectedWidgetPage?: string;
  handleCloseMarketplaceSideDrawer: () => void;
  handleCloseConsumerSideDrawer: () => void;
  changeWidgetPage?: (page: string) => void;
}) => {
  const { t } = useTranslation('consumerSpace');

  const isWidget = WidgetUtils.isWidget();

  const location = window.location.pathname;

  const isAbleToChangeStudio =
    (franchisorCompanyList ?? []).length > 0 && !isWidget;

  const handleChangeLocale = useCallback(
    (locale: string) => () => {
      i18n.changeLanguage(locale);
      handleCloseConsumerSideDrawer();
    },
    [handleCloseConsumerSideDrawer],
  );

  const handleChangeWidgetPage = useCallback(
    (page: string) => () => changeWidgetPage?.(page),
    [changeWidgetPage],
  );

  const consumerNavigationWidgetData: SubmenuItem[] = React.useMemo(
    () => [
      {
        title: t('reworked.navigation.myBookings'),
        leftIcon: <Calendar />,
        isSelected: selectedWidgetPage === 'consumerBooking',
        onClick: handleChangeWidgetPage('consumerBooking'),
      },
      {
        title: t('reworked.navigation.myPasses'),
        leftIcon: <Ticket01 />,
        isSelected: selectedWidgetPage === 'consumerPass',

        onClick: handleChangeWidgetPage('consumerPass'),
      },
      {
        title: t('reworked.navigation.mySubscriptions'),
        leftIcon: <Star01 />,
        isSelected: selectedWidgetPage === 'consumerSubscription',

        onClick: handleChangeWidgetPage('consumerSubscription'),
      },
      {
        title: t('reworked.navigation.myProfile'),
        leftIcon: <UserEdit />,
        isSelected: selectedWidgetPage === 'consumerProfile',

        onClick: handleChangeWidgetPage('consumerProfile'),
      },
      {
        title: t('reworked.navigation.myInvoices'),
        leftIcon: <FileAttachment02 />,
        isSelected: selectedWidgetPage === 'consumerInvoice',

        onClick: handleChangeWidgetPage('consumerInvoice'),
      },
    ],
    [t, selectedWidgetPage, handleChangeWidgetPage],
  );

  const consumerNavigationData: SubmenuItem[] = React.useMemo(
    () => [
      {
        title: t('reworked.navigation.myBookings'),
        leftIcon: <Calendar />,
        to: `/c/${companyId}/booking/`,
        isSelected: location.includes('/booking/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.myPasses'),
        leftIcon: <Ticket01 />,
        to: `/c/${companyId}/pack/`,
        isSelected: location.includes('/pack/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.mySubscriptions'),
        leftIcon: <Star01 />,
        to: `/c/${companyId}/subscription/`,
        isSelected: location.includes('/subscription/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.myProfile'),
        leftIcon: <UserEdit />,
        to: `/c/${companyId}/profile/`,
        isSelected: location.includes('/profile/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.myGiftCards'),
        leftIcon: <Gift02 />,
        to: `/c/${companyId}/giftcard/`,
        isSelected: location.includes('/giftcard/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        title: t('reworked.navigation.myInvoices'),
        leftIcon: <FileAttachment02 />,
        to: `/c/${companyId}/invoice/`,
        isSelected: location.includes('/invoice/'),
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
      location,
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

  return {
    marketplaceNavigationData,
    consumerNavigationData,
    consumerNavigationWidgetData,
  };
};

export default useNavigationData;

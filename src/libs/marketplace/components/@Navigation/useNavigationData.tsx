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
  PlaySquare,
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
  widgetSignOut,
  pushRouter,
}: {
  companyId: number;
  linksList: AppBarTab[];
  franchisorCompanyList: Company[];
  selectedWidgetPage?: string;
  handleCloseMarketplaceSideDrawer: () => void;
  handleCloseConsumerSideDrawer: () => void;
  changeWidgetPage?: (page: string) => void;
  widgetSignOut?: () => void;
  pushRouter?: (route: string) => void;
}) => {
  const { t } = useTranslation('consumerSpace');

  const isWidget = WidgetUtils.isWidget();

  /**
   *@deprecated The distinction between being in a widget context and being on a context open from
   * a widget must be handled in a better way.
   */
  const isAnActualWebPage =
    window.location.href.includes('https://backoffice') ||
    window.location.href.includes('localhost');

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
    (page: string) => {
      changeWidgetPage?.(page);
      handleCloseConsumerSideDrawer();
    },
    [changeWidgetPage, handleCloseConsumerSideDrawer],
  );

  /**
   * @description FIXEME
   * @deprecated
   */
  const handleChangeWidgetPageAdapted = React.useCallback(
    (TabType: string, to: string) => () => {
      if (isWidget && isAnActualWebPage) {
        return pushRouter?.(to);
      }
      handleChangeWidgetPage(TabType);
    },
    [handleChangeWidgetPage, pushRouter, isWidget, isAnActualWebPage],
  );
  const consumerNavigationWidgetData: SubmenuItem[] = React.useMemo(
    () => [
      {
        title: t('reworked.navigation.myBookings'),
        leftIcon: <Calendar />,
        isSelected: selectedWidgetPage === 'consumerBooking',
        onClick: handleChangeWidgetPageAdapted(
          'consumerBooking',
          `/c/${companyId}/booking/`,
        ),
      },
      {
        title: t('reworked.navigation.myPasses'),
        leftIcon: <Ticket01 />,
        isSelected: selectedWidgetPage === 'consumerPass',
        onClick: handleChangeWidgetPageAdapted(
          'consumerPass',
          `/c/${companyId}/pack/`,
        ),
      },
      {
        title: t('reworked.navigation.mySubscriptions'),
        leftIcon: <Star01 />,
        isSelected: selectedWidgetPage === 'consumerSubscription',
        onClick: handleChangeWidgetPageAdapted(
          'consumerSubscription',
          `/c/${companyId}/subscription/`,
        ),
      },
      {
        title: t('reworked.navigation.myProfile'),
        leftIcon: <UserEdit />,
        isSelected: selectedWidgetPage === 'consumerProfile',
        onClick: handleChangeWidgetPageAdapted(
          'consumerProfile',
          `/c/${companyId}/profile/`,
        ),
      },
      {
        title: t('reworked.navigation.myInvoices'),
        leftIcon: <FileAttachment02 />,
        isSelected: selectedWidgetPage === 'consumerInvoice',
        onClick: handleChangeWidgetPageAdapted(
          'consumerInvoice',
          `/c/${companyId}/invoice/`,
        ),
      },
      { isDivider: true },
      {
        title: t('reworked.navigation.logOut'),
        className: 'bs-navigation__logout-button__root',
        onClick: widgetSignOut,
      },
    ],
    [
      t,
      selectedWidgetPage,
      handleChangeWidgetPageAdapted,
      widgetSignOut,
      companyId,
    ],
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
        title: t('reworked.navigation.myVideosAndEbooks'),
        leftIcon: <PlaySquare />,
        to: `/c/${companyId}/vod/`,
        isSelected: location.includes('/vod/'),
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

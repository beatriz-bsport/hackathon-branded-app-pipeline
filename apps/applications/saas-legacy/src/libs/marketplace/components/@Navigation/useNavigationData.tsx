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
import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';
import {
  CONSUMER_SPACE_MOBILE_BREAKPOINT,
  ConsumerSpaceContextEnum,
} from '#src/libs/consumer-space/constants';

import type { SubmenuItem } from '#src/components/css-only/Fabrique/Submenu/types';
import type { AppBarTab } from '#src/components/css-only/Navigation/NavigationAppBar/types';
import type { Company } from '#src/libs/company/types';
import type { MemberMinimal } from '#src/libs/member/types';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

const useNavigationData = ({
  companyId,
  linksList,
  franchisorCompanyList,
  selectedWidgetPage,
  context = ConsumerSpaceContextEnum.WEB,
  handleCloseMarketplaceSideDrawer,
  handleCloseConsumerSideDrawer,
  changeWidgetPage,
  widgetSignOut,
  pushRouter,
  memberRelationshipList,
  isRelationshipAuth,
  navigateToRelationAccount,
  navigateBackToMasterRelation,
}: {
  companyId: number;
  linksList?: AppBarTab[];
  franchisorCompanyList?: Company[];
  selectedWidgetPage?: string;
  context?: ConsumerSpaceContextEnum;
  handleCloseMarketplaceSideDrawer: () => void;
  handleCloseConsumerSideDrawer: () => void;
  changeWidgetPage?: (page: string) => void;
  widgetSignOut?: () => void;
  pushRouter?: (route: string) => void;
  memberRelationshipList?: MemberMinimal[];
  isRelationshipAuth: boolean;
  navigateToRelationAccount?: (relatedMemberId: number) => void;
  navigateBackToMasterRelation?: () => void;
}) => {
  const { t } = useTranslation('consumerSpace');

  const location = window.location.pathname;
  const { width } = useViewport();

  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const isAbleToChangeStudio =
    (franchisorCompanyList ?? []).length > 0 &&
    ![
      ConsumerSpaceContextEnum.FAB,
      ConsumerSpaceContextEnum.LOGIN_BUTTON,
      ConsumerSpaceContextEnum.WIDGET,
    ].includes(context) &&
    !isRelationshipAuth;

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
   * Change the consumer space page according
   * to the context from where its accessed from
   * @param TabType The next selected consumer space page
   * @param to The associated page route, if accessed from a router context
   */
  const handleChangePage = React.useCallback(
    (TabType: string, to: string) => () => {
      if (
        !!to &&
        [
          ConsumerSpaceContextEnum.LOGIN_BUTTON,
          ConsumerSpaceContextEnum.FAB,
          ConsumerSpaceContextEnum.WEB,
        ].includes(context)
      ) {
        return pushRouter?.(to);
      }
      handleChangeWidgetPage(TabType);
    },
    [context, handleChangeWidgetPage, pushRouter],
  );
  const handleSwitchAccount = useCallback(
    (memberId: number) => () => {
      navigateToRelationAccount(memberId);
    },
    [navigateToRelationAccount],
  );

  const consumerNavigationWidgetData: SubmenuItem[] = React.useMemo(
    () => [
      {
        title: t('reworked.navigation.myBookings'),
        leftIcon: <Calendar />,
        isSelected: selectedWidgetPage === 'consumerBooking',
        onClick: handleChangePage(
          'consumerBooking',
          `/c/${companyId}/booking/`,
        ),
      },
      {
        title: t('reworked.navigation.myPasses'),
        leftIcon: <Ticket01 />,
        isSelected: selectedWidgetPage === 'consumerPass',
        onClick: handleChangePage('consumerPass', `/c/${companyId}/pack/`),
      },
      {
        title: t('reworked.navigation.mySubscriptions'),
        leftIcon: <Star01 />,
        isSelected: selectedWidgetPage === 'consumerSubscription',
        onClick: handleChangePage(
          'consumerSubscription',
          `/c/${companyId}/subscription/`,
        ),
      },
      {
        title: t('reworked.navigation.myProfile'),
        leftIcon: <UserEdit />,
        isSelected: selectedWidgetPage === 'consumerProfile',
        onClick: handleChangePage(
          'consumerProfile',
          `/c/${companyId}/profile/`,
        ),
      },
      {
        title: t('reworked.navigation.myInvoices'),
        leftIcon: <FileAttachment02 />,
        isSelected: selectedWidgetPage === 'consumerInvoice',
        onClick: handleChangePage(
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
    [t, selectedWidgetPage, handleChangePage, companyId, widgetSignOut],
  );

  const consumerNavigationData: SubmenuItem[] = React.useMemo(
    () => [
      {
        className: 'bs-consumer-navigation-submenu-item-bookings',
        title: t('reworked.navigation.myBookings'),
        leftIcon: <Calendar />,
        to: `/c/${companyId}/booking/`,
        isSelected: location.includes('/booking/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        className: 'bs-consumer-navigation-submenu-item-passes',
        title: t('reworked.navigation.myPasses'),
        leftIcon: <Ticket01 />,
        to: `/c/${companyId}/pack/`,
        isSelected: location.includes('/pack/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        className: 'bs-consumer-navigation-submenu-item-subscriptions',
        title: t('reworked.navigation.mySubscriptions'),
        leftIcon: <Star01 />,
        to: `/c/${companyId}/subscription/`,
        isSelected: location.includes('/subscription/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        className: 'bs-consumer-navigation-submenu-item-profile',
        title: t('reworked.navigation.myProfile'),
        leftIcon: <UserEdit />,
        to: `/c/${companyId}/profile/`,
        isSelected: location.includes('/profile/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        className: 'bs-consumer-navigation-submenu-item-giftcards',
        title: t('reworked.navigation.myGiftCards'),
        leftIcon: <Gift02 />,
        to: `/c/${companyId}/giftcard/`,
        isSelected: location.includes('/giftcard/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        className: 'bs-consumer-navigation-submenu-item-vod',
        title: t('reworked.navigation.myVideosAndEbooks'),
        leftIcon: <PlaySquare />,
        to: `/c/${companyId}/vod/`,
        isSelected: location.includes('/vod/'),
        onClick: handleCloseConsumerSideDrawer,
      },
      {
        className: 'bs-consumer-navigation-submenu-item-invoices',
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
      ...(memberRelationshipList?.length > 0 &&
      !isRelationshipAuth &&
      ![
        ConsumerSpaceContextEnum.WIDGET,
        ConsumerSpaceContextEnum.LOGIN_BUTTON,
        ConsumerSpaceContextEnum.FAB,
      ].includes(WidgetUtils.getConsumerSpaceContext())
        ? [
            {
              title: t('reworked.navigation.switchAccount'),
              items: (memberRelationshipList ?? []).map((member) => ({
                title: member.name,
                onClick: handleSwitchAccount(member.id),
              })),
            },
          ]
        : []),
      ...(isRelationshipAuth && isMobile
        ? [
            {
              title: t('navigation.backToRelationMasterSpace'),
              onClick: navigateBackToMasterRelation,
            },
          ]
        : []),
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
      memberRelationshipList,
      isRelationshipAuth,
      isMobile,
      navigateBackToMasterRelation,
      handleChangeLocale,
      handleSwitchAccount,
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

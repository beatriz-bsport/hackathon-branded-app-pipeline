import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { urlToMarketplace } from '#src/libs/marketplace/utils';
import {
  fromConfigToUrl,
  getCheckoutUrl,
} from '#src/libs/marketplace/routing-utils';
import { getDefaultMarketplaceTabTitle } from '#src/libs/exportable-components/utils';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import NavigationAppBar from '#src/components/css-only/Navigation/NavigationAppBar';
import useViewport from '#Fabrique/hooks/useViewport';
import NavigationSideBar from '#src/components/css-only/Navigation/NavigationSideBar';
import useNavigationData from '#src/libs/marketplace/components/@Navigation/useNavigationData';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import { WidgetUtils } from '#src/libs/widget/WidgetUtils';
import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode';
import {
  ArrowLeft,
  ShoppingCart01,
  UserCircle,
  Menu01,
} from '#src/components/untitledui';
import ConsumerGenericFooter from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericFooter';
import NavigationSideDrawer from '#src/components/css-only/Navigation/NavigationSideDrawer/NavigationSideDrawer.component';
import useNavigationSideDrawerData from '#src/components/css-only/Navigation/NavigationSideDrawer/useNavigationSideDrawerData.hook';
import Button from '#src/components/css-only/Fabrique/ButtonV2';

import type { HeaderButton } from '#src/libs/consumer-space/components/reworked/common/ConsumerGenericHeader/ConsumerGenericHeader.component';
import type {
  AppBarButton,
  AppBarTab,
} from '#src/components/css-only/Navigation/NavigationAppBar/types';
import type { Company } from '#src/libs/company/types';
import type { MarketplaceTabConfig } from '#src/libs/marketplace/types';
import type { ConsumerSpaceWidgetPage } from '#src/libs/exportable-components/types';

import './styles.css';

type WidgetProps = {
  selectedWidgetPage: ConsumerSpaceWidgetPage;
  widgetHideNavigation: boolean;
  changeWidgetPage: (page: string) => void;
  widgetSignOut: () => void;
};

type CommonProps = {
  companyName: string;
};

type Props = {
  push: (path: string) => void;
  companyLogo: string;
  companyWebsiteUrl?: string;
  companyId: number;
  isNewCheckoutFlow: boolean;
  memberName: string;
  franchisorCompanyList?: Company[];
  /** A list of action buttons to display in the header */
  buttonsData?: HeaderButton[];
  /** The number of products in the current member basket */
  basketProductListCount?: number;
  /** The current company's marketplace settings config */
  tabConfigList: MarketplaceTabConfig[];
};

type CombinedProps = Partial<WidgetProps & CommonProps & Props>;

const ConsumerNavigation: React.FC<CombinedProps> = ({
  companyLogo,
  companyWebsiteUrl,
  companyName,
  companyId,
  isNewCheckoutFlow,
  memberName,
  franchisorCompanyList,
  children,
  buttonsData,
  basketProductListCount,
  tabConfigList,
  selectedWidgetPage,
  widgetHideNavigation,
  push,
  changeWidgetPage,
  widgetSignOut,
}) => {
  const { t } = useTranslation(['consumerSpace', 'marketplace']);
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const isWidget = WidgetUtils.isWidget();

  const isIframe = WidgetUtils.getDialogMode() === DIALOG_MODE_IFRAME;

  const checkoutUrl = getCheckoutUrl(companyId, isNewCheckoutFlow);

  const linksList: AppBarTab[] = useMemo(
    () =>
      (tabConfigList ?? []).map((tabConfig) => ({
        id: `bs-navigation-app-bar-link-${tabConfig.index}`,
        label:
          tabConfig.title ||
          getDefaultMarketplaceTabTitle(tabConfig.component_type, t),
        color: 'grey',
        onClick: () =>
          push(
            `${urlToMarketplace(
              companyName,
              companyId.toString(),
            )}/${fromConfigToUrl(
              {
                component_type: tabConfig.component_type,
                config: tabConfig.config,
                configIndex: tabConfig.index,
              },
              { tabSelected: tabConfig.index },
            )}`,
          ),
      })),
    [tabConfigList, t, push, companyName, companyId],
  );

  const {
    stackNavigationState,
    isMarketplaceSideDrawerOpen,
    isConsumerSideDrawerOpen,
    handleCloseConsumerSideDrawer,
    handleCloseMarketplaceSideDrawer,
    handleToggleMarketplaceSideDrawer,
    handleToggleConsumerSideDrawer,
    handleBackArrowClick,
    handleSetStackNavigationState,
  } = useNavigationSideDrawerData();

  const {
    marketplaceNavigationData,
    consumerNavigationData,
    consumerNavigationWidgetData,
  } = useNavigationData({
    franchisorCompanyList,
    companyId: companyId,
    linksList,
    selectedWidgetPage,
    handleCloseMarketplaceSideDrawer,
    handleCloseConsumerSideDrawer,
    changeWidgetPage,
    widgetSignOut,
    pushRouter: push,
  });

  const actionsList: AppBarButton[] = useMemo(
    () => [
      {
        label: t('consumerSpace:reworked.appbar.cart'),
        color: 'grey',
        leftIcon: <ShoppingCart01 />,
        onClick: () => push(checkoutUrl),
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
        badgeValue: basketProductListCount,
      },
      {
        label: t('consumerSpace:reworked.appbar.myAccount'),
        color: 'grey',
        leftIcon: <UserCircle />,
        onClick:
          isMobile && !!memberName
            ? handleToggleConsumerSideDrawer
            : () => push(`/c/${companyId}/booking/`),
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
      },
    ],
    [
      basketProductListCount,
      checkoutUrl,
      companyId,
      handleToggleConsumerSideDrawer,
      isMobile,
      memberName,
      push,
      t,
    ],
  );

  if (isWidget && !isIframe) {
    return (
      <div className="bs-widget-consumer-navigation__root">
        {isMobile && !widgetHideNavigation && (
          <Button
            color="grey"
            leftIcon={<Menu01 stroke="currentColor" />}
            onClick={handleToggleConsumerSideDrawer}
            variant="text"
          >
            {t('reworked.menu')}
          </Button>
        )}

        <div className="bs-consumer-navigation__root">
          {!widgetHideNavigation && (
            <NavigationSideDrawer
              handleBackArrowClick={handleBackArrowClick}
              handleSetStackNavigationState={handleSetStackNavigationState}
              isOpen={isConsumerSideDrawerOpen}
              leftIcon={<ArrowLeft fill="currentColor" />}
              stackNavigationState={stackNavigationState}
              submenuItems={consumerNavigationWidgetData}
              subtitle={t('reworked.navigation.exploreYourProfile')}
              title={memberName && `${memberName},`}
            />
          )}

          <div className="bs-consumer-navigation__layout">
            {!widgetHideNavigation && (
              <NavigationSideBar
                items={consumerNavigationWidgetData}
                memberName={memberName}
              />
            )}
            <main
              className={classNames('bs-consumer-navigation__content', {
                'bs-consumer-navigation__content--mobile': isMobile,
              })}
            >
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bs-consumer-navigation__root">
      {!isIframe && (
        <NavigationAppBar
          actions={actionsList}
          isMobile={isMobile}
          links={linksList}
          logo={companyLogo}
          onSideDrawerOpenClick={handleToggleMarketplaceSideDrawer}
          websiteUrl={companyWebsiteUrl}
        />
      )}

      <NavigationSideDrawer
        handleBackArrowClick={handleBackArrowClick}
        handleSetStackNavigationState={handleSetStackNavigationState}
        isOpen={isMarketplaceSideDrawerOpen}
        leftIcon={<ArrowLeft fill="currentColor" />}
        stackNavigationState={stackNavigationState}
        submenuItems={marketplaceNavigationData}
      />

      <NavigationSideDrawer
        handleBackArrowClick={handleBackArrowClick}
        handleSetStackNavigationState={handleSetStackNavigationState}
        isOpen={isConsumerSideDrawerOpen}
        leftIcon={<ArrowLeft fill="currentColor" />}
        stackNavigationState={stackNavigationState}
        submenuItems={consumerNavigationData}
        subtitle={t('reworked.navigation.exploreYourProfile')}
        title={memberName && `${memberName},`}
      />

      <div
        className={classNames(
          'bs-consumer-navigation__layout',
          'bs-consumer-navigation__layout--computed-height',
        )}
      >
        <NavigationSideBar
          items={consumerNavigationData}
          memberName={memberName}
        />
        <main
          className={classNames('bs-consumer-navigation__content', {
            'bs-consumer-navigation__content--mobile': isMobile,
          })}
        >
          {children}
          {isMobile && !!buttonsData?.length && (
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

import React, { useMemo, useEffect, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { push as pushRouter } from 'connected-react-router';
import classNames from 'classnames';
import { MuiThemeProvider } from '@material-ui/core';

// Utils
import { getItemInStorage } from '#src/utils/storage';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

// HOCs
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

// Actions
// @ts-expect-error js file
import { auth as authActions } from '#src/actions';
import { fetchProfile as fetchProfileAction } from '#src/libs/consumer-space/actions';
// @ts-expect-error
import { navigateBackToMasterRelation as navigateBackToMasterRelationAction } from '#src/actions/auth.actions';

// Selectors
import themeSelectors from '#src/libs/theme/selectors';

// Hooks
import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';
import useNavigationSideDrawerData from '#src/components/css-only/Navigation/NavigationSideDrawer/useNavigationSideDrawerData.hook';
import { useTranslation } from 'react-i18next';
import useNavigationData from '#src/libs/marketplace/components/@Navigation/useNavigationData';

// Components
import MinimalAppBar from '#src/libs/checkout/components/MinimalAppBar';
import { MemberShipValidationWrapper } from '#src/pages/consumer/MemberShipValidationWrapperInner.component';
import NavigationAppBar from '#src/components/css-only/Navigation/NavigationAppBar';
import NavigationSideDrawer from '#src/components/css-only/Navigation/NavigationSideDrawer';
import { AppBarButton } from '#src/components/css-only/Navigation/NavigationAppBar/types';
import { ArrowLeft, UserCircle } from '#src/components/untitledui';

// Types
import type { RootState } from '#src/reducers';

// Constants
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import { STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN } from '#src/actions/constants';

import './styles.css';

type Props = {
  classes?: {
    content?: string;
  };
  children: React.ReactNode;
} & ConnectedProps<typeof connector>;

const CheckoutNavigation: React.FC<Props> = ({
  auth,
  children,
  classes,
  companyTheme,
  consumerProfile,
  disconnect,
  fetchProfile,
  push,
  navigateBackToMasterRelation,
  userFullName,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { width } = useViewport();

  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const isWidget = WidgetUtils.isWidget();

  const isRelationshipAuth = !!getItemInStorage(
    'local',
    STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN,
  );

  /**
   * We need to provide an empty list to the NavigationAppBar when we don't want to display any tab
   * For now the "links" props is not truely optional.
   * It breaks everything if undefined because links is used inside the subcomponent NavigationAppBarLinksSection.
   * A ticket is opened to tackle this problem :  https://bsporttest.atlassian.net/browse/BS-5199
   */
  const emptyLinkList = useMemo(() => [], []);

  const handleNavigateBackToMasterRelation = useCallback(() => {
    const canNavigateBackToMasterRelation =
      companyTheme?.company &&
      companyTheme?.company_name &&
      !!navigateBackToMasterRelation;
    if (!canNavigateBackToMasterRelation) return null;
    return navigateBackToMasterRelation({
      company: companyTheme.company,
      companyName: companyTheme.company_name,
    });
  }, [companyTheme, navigateBackToMasterRelation]);

  const {
    stackNavigationState,
    isConsumerSideDrawerOpen,
    handleCloseConsumerSideDrawer,
    handleToggleMarketplaceSideDrawer,
    handleToggleConsumerSideDrawer,
    handleBackArrowClick,
    handleSetStackNavigationState,
  } = useNavigationSideDrawerData();

  const { consumerNavigationData } = useNavigationData({
    companyId: companyTheme?.company,
    // At checkout stage, as we don't display any tab, the drawer becomes useless
    handleCloseMarketplaceSideDrawer: () => {},
    handleCloseConsumerSideDrawer,
    navigateBackToMasterRelation: handleNavigateBackToMasterRelation,
    isRelationshipAuth,
  });

  const actionsList: AppBarButton[] = useMemo(
    () => [
      {
        label: consumerProfile?.first_name ?? t('reworked.appbar.myAccount'),
        color: 'grey',
        leftIcon: <UserCircle />,
        onClick:
          isMobile && !!userFullName
            ? handleToggleConsumerSideDrawer
            : () => push(`/c/${companyTheme?.company}/booking/`),
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
      },
    ],
    [
      companyTheme?.company,
      consumerProfile?.first_name,
      handleToggleConsumerSideDrawer,
      isMobile,
      push,
      t,
      userFullName,
    ],
  );

  const handleDisconnect = useCallback(() => disconnect(), [disconnect]);

  useEffect(() => {
    if (auth?.authenticated && !consumerProfile) {
      fetchProfile();
    }
  }, [auth, consumerProfile, fetchProfile]);

  return (
    <MuiThemeProvider theme={companyTheme}>
      <MemberShipValidationWrapper companyId={companyTheme?.company}>
        <div className="bs-checkout-navigation__container">
          {isWidget ? (
            <MinimalAppBar
              authenticated={auth?.authenticated}
              disconnect={handleDisconnect}
            />
          ) : (
            <div
              className={classNames('bs-checkout-navigation__root', {
                'bs-checkout-navigation__root--relationship':
                  isRelationshipAuth,
              })}
            >
              <NavigationAppBar
                actions={actionsList}
                isMobile={isMobile}
                links={emptyLinkList}
                logo={companyTheme.cover}
                navigateBackToMasterRelation={
                  handleNavigateBackToMasterRelation
                }
                onSideDrawerOpenClick={handleToggleMarketplaceSideDrawer}
                relationshipAuthMemberName={isRelationshipAuth && userFullName}
                websiteUrl={companyTheme.websiteURL}
              />
              <NavigationSideDrawer
                handleBackArrowClick={handleBackArrowClick}
                handleSetStackNavigationState={handleSetStackNavigationState}
                isOpen={isConsumerSideDrawerOpen}
                isRelationshipAuth={isRelationshipAuth}
                leftIcon={<ArrowLeft fill="currentColor" />}
                stackNavigationState={stackNavigationState}
                submenuItems={consumerNavigationData}
                subtitle={t('reworked.navigation.exploreYourProfile')}
                title={userFullName && `${userFullName},`}
              />
            </div>
          )}
          <main
            className={classNames({
              'bs-checkout-navigation__content': !classes?.content,
              [classes?.content]: !!classes?.content,
            })}
          >
            {children}
          </main>
        </div>
      </MemberShipValidationWrapper>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  consumerProfile: state.consumer.profile,
  userFullName: state.auth.name,
  companyTheme: themeSelectors.getTheme(state),
});

const mapDispatchToProps = {
  disconnect: authActions.disconnect,
  fetchProfile: fetchProfileAction,
  push: pushRouter,
  navigateBackToMasterRelation: navigateBackToMasterRelationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const CheckoutNavigationStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof CheckoutNavigation>>()(
    CheckoutNavigation,
  );
export default connector(React.memo(CheckoutNavigation));

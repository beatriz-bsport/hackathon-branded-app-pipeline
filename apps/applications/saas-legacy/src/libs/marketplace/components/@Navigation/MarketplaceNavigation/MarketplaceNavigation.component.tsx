import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { DialogContent, DialogTitle } from '@material-ui/core';

import {
  ArrowLeft,
  ShoppingCart01,
  UserCircle,
} from '#src/components/untitledui';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import {
  fromConfigToUrl,
  getCheckoutUrl,
  getUserSpaceUrl,
} from '#src/libs/marketplace/routing-utils';
import { getDefaultMarketplaceTabTitle } from '#src/libs/exportable-components/utils';
import { urlToMarketplace } from '#src/libs/marketplace/utils';
import { getItemInStorage } from '#src/utils/storage';
import NavigationAppBar from '#src/components/css-only/Navigation/NavigationAppBar';
import NavigationSideDrawer from '#src/components/css-only/Navigation/NavigationSideDrawer/NavigationSideDrawer.component';
import useNavigationData from '#src/libs/marketplace/components/@Navigation/useNavigationData';
import useViewport from '#Fabrique/hooks/useViewport';
import MemberShipValidationWrapper from '#src/pages/consumer/MemberShipValidationWrapper.component';
import Login from '#src/components/css-only/Login/Login.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import ApplyCustomTheme from '#src/libs/exportable-components/ApplyCustomTheme.component';
import ApplyCustomCssStyles from '#src/libs/widget/components/ApplyCustomCssStyles.component';
// @ts-expect-error JS
import { getTheme } from '#src/theme';
import CustomFormView from '#src/libs/custom-form/components/consumer-form/CustomFormView.form';
import CustomFormViewDialog from '#src/libs/custom-form/components/consumer-form/CustomFormViewDialog.component';
import CustomFormPortal from '#Fabrique/Temporary/CustomFormPortal';
import { CustomFormTitle } from '#src/libs/custom-form/components/CustomFormTitle.component';

import useNavigationSideDrawerData from '#src/components/css-only/Navigation/NavigationSideDrawer/useNavigationSideDrawerData.hook';

import type {
  AppBarButton,
  AppBarTab,
} from '#src/components/css-only/Navigation/NavigationAppBar/types';
import type { MarketplaceTabConfig } from '#src/libs/marketplace/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { MarketplaceCSSConfiguration } from '#src/libs/exportable-components/types';
import type { CustomForm } from '#src/libs/custom-form/types';
import type { Franchise } from '#src/libs/franchise/types';
import type { MemberMinimal } from '#src/libs/member/types';

import { CUSTOM_FORM_CSS_VARIANT_ACTIVATED } from '#src/libs/custom-form/constants';
import { STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN } from '#src/actions/constants';

import './styles.css';

type Props = {
  // Due to MUI provider we have to pass the whole company theme
  companyTheme: CompanyTheme;
  authUsername: string;
  isAuthenticated: boolean;
  isLoginDialogOpen: boolean;
  isSignUpDialogOpen: boolean;
  signUpCustomForm: CustomForm;
  customConfiguration: MarketplaceCSSConfiguration;
  /** The number of products in the current member basket */
  basketProductListCount?: number;
  /** The current company's marketplace settings config */
  tabConfigList: MarketplaceTabConfig[];
  memberRelationshipList: MemberMinimal[];
  isAuthStateError: boolean;
  authStateInvalidFields: {
    email?: string;
    password?: string;
  };
  authStateLoading: boolean;
  franchisor?: Franchise;
  memberFirstName: string;
  memberName: string;
  tabSelected: string;
  push: (path: string) => void;
  onToggleSignUpDialog: (value: boolean) => void;
  handleCloseLoginDialog: () => void;
  handleCloseSignUpDialog: () => void;
  handleSubmitCustomForm: () => void;
  handleSubmitDraftCustomForm: () => void;
  handleEmailLogin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => void;
  onRequestResetPassword: (url: string) => void;
  navigateToRelationAccount: (relatedMemberId: number) => void;
  navigateBackToMasterRelation: () => void;
};

const MarketplaceNavigation: React.FC<Props> = ({
  companyTheme,
  isAuthenticated,
  isLoginDialogOpen,
  isSignUpDialogOpen,
  signUpCustomForm,
  customConfiguration,
  basketProductListCount,
  tabConfigList,
  isAuthStateError,
  authStateInvalidFields,
  authStateLoading,
  franchisor,
  memberFirstName,
  memberName,
  tabSelected,
  memberRelationshipList,
  children,
  push,
  onToggleSignUpDialog,
  handleCloseLoginDialog,
  handleCloseSignUpDialog,
  handleSubmitCustomForm,
  handleSubmitDraftCustomForm,
  handleEmailLogin,
  onRequestResetPassword,
  navigateToRelationAccount,
  navigateBackToMasterRelation,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { width } = useViewport();
  const classes = useStyles();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;
  const isRelationshipAuth = !!getItemInStorage(
    'local',
    STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN,
  );

  const checkoutUrl = useMemo(
    () => getCheckoutUrl(companyTheme.company),
    [companyTheme.company],
  );

  const linksList: AppBarTab[] = useMemo(
    () =>
      (tabConfigList ?? []).map((tabConfig) => ({
        id: `bs-navigation-app-bar-link-${tabConfig.index}`,
        label:
          tabConfig.title ||
          getDefaultMarketplaceTabTitle(tabConfig.component_type, t),
        color: 'grey',
        isSelected: parseInt(tabSelected, 10) === tabConfig.index,
        onClick: () => {
          push(
            `${urlToMarketplace(
              companyTheme.company_name,
              companyTheme.company.toString(),
            )}/${fromConfigToUrl(
              {
                component_type: tabConfig.component_type,
                config: tabConfig.config,
                configIndex: tabConfig.index,
              },
              { tabSelected: tabConfig.index },
            )}`,
          );
        },
      })),
    [
      tabConfigList,
      t,
      tabSelected,
      push,
      companyTheme.company_name,
      companyTheme.company,
    ],
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

  const { marketplaceNavigationData, consumerNavigationData } =
    useNavigationData({
      franchisorCompanyList: franchisor?.companies ?? [],
      companyId: companyTheme.company,
      linksList,
      memberRelationshipList,
      handleCloseMarketplaceSideDrawer,
      handleCloseConsumerSideDrawer,
      navigateToRelationAccount,
      navigateBackToMasterRelation,
      isRelationshipAuth,
    });

  const actionsList: AppBarButton[] = useMemo(
    () => [
      {
        label: t('reworked.appbar.cart'),
        color: 'grey',
        leftIcon: <ShoppingCart01 />,
        onClick: () => push(checkoutUrl),
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
        badgeValue: basketProductListCount,
      },
      {
        label: memberFirstName ?? t('reworked.appbar.myAccount'),
        color: 'grey',
        leftIcon: <UserCircle />,
        onClick:
          isMobile && !!memberName
            ? handleToggleConsumerSideDrawer
            : () => push(getUserSpaceUrl(companyTheme.company)),
        variant: isMobile ? 'text' : 'outlined',
        isIconButton: isMobile,
      },
    ],
    [
      basketProductListCount,
      checkoutUrl,
      companyTheme.company,
      memberFirstName,
      handleToggleConsumerSideDrawer,
      isMobile,
      memberName,
      push,
      t,
    ],
  );

  const handleToggleSignUpDialog = useCallback(
    (value: boolean) => () => onToggleSignUpDialog(value),
    [onToggleSignUpDialog],
  );

  return (
    <MuiThemeProvider theme={getTheme(companyTheme)}>
      <MemberShipValidationWrapper companyId={companyTheme.company}>
        <div
          className={clsx('bs-marketplace-navigation__root', {
            'bs-marketplace-navigation__root--relationship': isRelationshipAuth,
          })}
        >
          <NavigationAppBar
            actions={actionsList}
            isMobile={isMobile}
            links={linksList}
            logo={companyTheme.cover}
            navigateBackToMasterRelation={navigateBackToMasterRelation}
            onSideDrawerOpenClick={handleToggleMarketplaceSideDrawer}
            relationshipAuthMemberName={isRelationshipAuth && memberName}
            websiteUrl={companyTheme.websiteURL}
          />

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
            isRelationshipAuth={isRelationshipAuth}
            leftIcon={<ArrowLeft fill="currentColor" />}
            stackNavigationState={stackNavigationState}
            submenuItems={consumerNavigationData}
            subtitle={t('reworked.navigation.exploreYourProfile')}
            title={memberName && `${memberName},`}
          />

          <main
            className={clsx('bs-marketplace-navigation__content', {
              'bs-marketplace-navigation__content--mobile': isMobile,
            })}
          >
            {children}
          </main>

          {!!customConfiguration?.apply_on_marketplace && (
            <>
              {!!companyTheme?.widget_theme && (
                <ApplyCustomTheme styles={companyTheme.widget_theme} />
              )}
              <ApplyCustomCssStyles customConfiguration={customConfiguration} />
            </>
          )}

          <GenericResponsiveDialog
            maxWidth="sm"
            onClose={handleCloseLoginDialog}
            open={isLoginDialogOpen && !isAuthenticated && !isSignUpDialogOpen}
          >
            <DialogContent>
              <div className="bs-setup-variable" id="bs-setup-derived-variable">
                <Login
                  company
                  isPremium
                  logoHidden
                  doEmailLogin={handleEmailLogin}
                  error={isAuthStateError}
                  errorFields={authStateInvalidFields}
                  franchisor={franchisor}
                  loading={authStateLoading}
                  onRequestResetPassword={onRequestResetPassword}
                  requestSignUp={handleToggleSignUpDialog(true)}
                  theme={companyTheme}
                />
              </div>
            </DialogContent>
          </GenericResponsiveDialog>

          {CUSTOM_FORM_CSS_VARIANT_ACTIVATED ? (
            <CustomFormPortal
              generalTermsAndConditions={companyTheme.general_terms_of_use}
              initial={signUpCustomForm}
              isCssVariantActivated={CUSTOM_FORM_CSS_VARIANT_ACTIVATED}
              isOpen={
                isSignUpDialogOpen && !isAuthenticated && !!signUpCustomForm
              }
              layouts={signUpCustomForm ? signUpCustomForm.layout : null}
              onCancel={handleCloseSignUpDialog}
              onClose={handleCloseSignUpDialog}
              onSubmit={handleSubmitCustomForm}
              onSubmitDraft={handleSubmitDraftCustomForm}
              title={t('translation:form.signUpTitle')}
              waiver={companyTheme.waiver}
            />
          ) : (
            // @ts-expect-error
            <CustomFormViewDialog
              fullWidth
              maxWidth="md"
              onClose={handleCloseSignUpDialog}
              open={isSignUpDialogOpen && !isAuthenticated && signUpCustomForm}
            >
              <DialogTitle>
                <CustomFormTitle
                  isCompany
                  title={t('translation:form.signUpTitle')}
                />
              </DialogTitle>
              <div className={classes.customFormContainer}>
                <CustomFormView
                  general_terms_and_conditions={
                    companyTheme.general_terms_of_use
                  }
                  initial={signUpCustomForm}
                  layouts={signUpCustomForm ? signUpCustomForm.layout : null}
                  onCancel={handleCloseSignUpDialog}
                  onSubmit={handleSubmitCustomForm}
                  onSubmitDraft={handleSubmitDraftCustomForm}
                  waiver={companyTheme.waiver}
                />
              </div>
            </CustomFormViewDialog>
          )}
        </div>
      </MemberShipValidationWrapper>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  customFormContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(MarketplaceNavigation);

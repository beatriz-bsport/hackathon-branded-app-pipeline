import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
// We need to use the referencre to the bsport saas instance of material ui
// otherwise it is considered as two different provider
import {
  MuiThemeProvider,
  withStyles,
  createStyles,
} from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import i18n from '@bsport/saas-legacy/src/i18n';
import {
  EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON,
  EXPORTABLE_COMPONENT_TYPE_VOD,
  EXPORTABLE_COMPONENT_TYPE_CALENDAR,
  EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
  EXPORTABLE_COMPONENT_TYPE_PASS,
  EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
  EXPORTABLE_COMPONENT_TYPE_PLAYLIST,
  EXPORTABLE_COMPONENT_TYPE_SHOP,
  EXPORTABLE_COMPONENT_TYPE_SUBSCRIPTION,
  EXPORTABLE_COMPONENT_TYPE_GIFTCARD,
  EXPORTABLE_COMPONENT_TYPE_NEWSLETTER,
  EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE,
  EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2,
  EXPORTABLE_COMPONENT_TYPE_NEWSLETTER_V2,
} from '@bsport/saas-legacy/src/libs/exportable-components/constants';

import WidgetTracker from '@bsport/saas-legacy/src/components/WidgetTracker.component';

// eslint-disable-next-line
import { fetchCompanyThemeWithCache } from '@bsport/saas-legacy/src/libs/theme/actions';
import { fetchSCTWithCache } from '@bsport/saas-legacy/src/libs/category/actions';
import { retrieveFranchiseWithCache } from '@bsport/saas-legacy/src/libs/franchise/actions';
import { getFranchisor } from '@bsport/saas-legacy/src/libs/franchise/selectors';
import { retrieveCompanyCssConfigurationWithCache as retrieveCompanyCssConfigurationAction } from '@bsport/saas-legacy/src/libs/exportable-components/actions';

import {
  SnackbarDataProvider,
  SnackbarPile,
} from '@bsport/saas-legacy/src/SnackbarPile.component';
import { getTheme, getFranchiseTheme } from '@bsport/saas-legacy/src/theme';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import ApplyCustomCssStyles from '@bsport/saas-legacy/src/libs/widget/components/ApplyCustomCssStyles.component';

import ApplyCustomTheme from '@bsport/saas-legacy/src/libs/exportable-components/ApplyCustomTheme.component';
import { WidgetConfig } from '@bsport/saas-legacy/src/libs/marketplace/types';
import { MaterialStyleType } from '@bsport/saas-legacy/src/utils/types';
import {
  EXPORTABLE_COMPONENT_TYPE_REFERRAL,
  EXPORTABLE_COMPONENT_TYPE_CONSUMER_SPACE,
} from '@bsport/saas-legacy/src/libs/exportable-components/constants/widget_builder';

import { RootState } from './reducers';
import BsportLogo from './components/BsportLogo.component';
import '@bsport/saas-legacy/src/index.scss';

import asyncComponent from './components/AsyncComponent';
import {
  closeUserInteractionPortal,
  openUserInteractionPortal,
} from './libs/modal/actions';
import { bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction } from './libs/bridge/actions';
import {
  buildSafeUtmTrackingParams,
  buildAnalyticsTrackingParamsFromCurrentUrl,
} from './utils/http';
import { SafeURI } from './widgets/utils';
import { ConsumerSpaceContextEnum } from '@bsport/saas-legacy/src/libs/consumer-space/constants';

const ConsumerSpaceWidget = asyncComponent(
  () => import('./widgets/ConsumerSpace.widget'),
);

const FabWidget = asyncComponent(() => import('./widgets/FabWidget.widget'));

const WidgetBridge = asyncComponent(
  () => import('./libs/bridge/ProxyBridge.component'),
);

const PassWidget = asyncComponent(() => import('./widgets/Pass.widget'));

const ReferralWidget = asyncComponent(
  () => import('./widgets/Referral.widget'),
);
const ShopWidget = asyncComponent(() => import('./widgets/Shop.widget'));
const SubscriptionWidget = asyncComponent(
  () => import('./widgets/Subscription.widget'),
);
const GiftcardWidget = asyncComponent(
  () => import('./widgets/Giftcard.widget'),
);
const CalendarWidget = asyncComponent(
  () => import('./widgets/Calendar.widget'),
);
const VODWidget = asyncComponent(() => import('./widgets/Vod.widget'));
const PrivateServiceWidget = asyncComponent(
  () => import('./widgets/PrivateService.widget'),
);
const WorkshopWidget = asyncComponent(
  () => import('./widgets/Workshop.widget'),
);
const NewsletterWidget = asyncComponent(
  () => import('./widgets/Newsletter.widget'),
);
const NewsletterV2Widget = asyncComponent(
  () => import('./widgets/NewsletterV2.widget'),
);
const UserInteractionPortal = asyncComponent(
  () => import('./libs/modal/UserInteractionPortal.component'),
);
const LoginButtonWidget = asyncComponent(
  () => import('./widgets/LoginButton.widget'),
);
const PaymentPackTemplate = asyncComponent(
  () => import('./widgets/PaymentPackTemplate.widget'),
);

const Snackbar = themify(connect(...SnackbarDataProvider)(SnackbarPile));

const WidgetByType = {
  [EXPORTABLE_COMPONENT_TYPE_WORKSHOP]: WorkshopWidget,
  [EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE]: PrivateServiceWidget,
  [EXPORTABLE_COMPONENT_TYPE_VOD]: VODWidget,
  [EXPORTABLE_COMPONENT_TYPE_PLAYLIST]: VODWidget,
  [EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON]: LoginButtonWidget,
  [EXPORTABLE_COMPONENT_TYPE_PASS]: PassWidget,
  [EXPORTABLE_COMPONENT_TYPE_SHOP]: ShopWidget,
  [EXPORTABLE_COMPONENT_TYPE_SUBSCRIPTION]: SubscriptionWidget,
  [EXPORTABLE_COMPONENT_TYPE_NEWSLETTER]: NewsletterWidget,
  [EXPORTABLE_COMPONENT_TYPE_NEWSLETTER_V2]: NewsletterV2Widget,
  [EXPORTABLE_COMPONENT_TYPE_GIFTCARD]: GiftcardWidget,
  [EXPORTABLE_COMPONENT_TYPE_CALENDAR]: CalendarWidget,
  [EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2]: CalendarWidget,
  [EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE]: PaymentPackTemplate,
  [EXPORTABLE_COMPONENT_TYPE_REFERRAL]: ReferralWidget,
  [EXPORTABLE_COMPONENT_TYPE_CONSUMER_SPACE]: ConsumerSpaceWidget,
};

const WIDGET_ACCEPTING_NO_POPUP_MODE = [
  EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
  EXPORTABLE_COMPONENT_TYPE_PASS,
  EXPORTABLE_COMPONENT_TYPE_SUBSCRIPTION,
  EXPORTABLE_COMPONENT_TYPE_CALENDAR,
  EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2,
];
type OwnProps = WidgetConfig & {
  store: any;
  lang?: string;
  history: any;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

window.env = {
  ...(window.env || {}),
  APP_CONTEXT: 'widget',
};

class BsportWidget extends Component<Props> {
  componentDidMount() {
    this.fetchData();
    if (this.props.language) {
      setTimeout(() => i18n.changeLanguage(this.props.language), 100);
    }
    this.props.bridgeRequestAuthenticationStatus();
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.companyId &&
      this.props.franchiseId &&
      this.props.franchisor &&
      this.props.franchisor.companies?.length &&
      !prevProps.franchisor
    ) {
      this.props.fetchCompanyTheme(this.props.franchisor.companies[0].id, {});
    }
  }

  fetchData() {
    this.props.fetchSCT();
    if (this.props.companyId) {
      this.props.fetchCompanyTheme(this.props.companyId, {});
      this.props.retrieveCompanyCssConfiguration(this.props.companyId);
    }
    if (this.props.franchiseId) {
      this.props.retrieveFranchise(this.props.franchiseId);
    }
  }

  onWindowOpen = (url: string) => {
    const uri = new SafeURI(url)
      .safeAddQuery('context', 'widget')
      .safeAddQuery('dialogMode', this.props.dialogMode)
      .safeAddQuery('widgetType', this.props.widgetType)
      .safeAddQuery('parentElementId', this.props.parentElement);

    const finalURL = this.props.utmTrackingConfiguration
      ? uri.toString() +
        buildSafeUtmTrackingParams(this.props.utmTrackingConfiguration)
      : uri.toString() + buildAnalyticsTrackingParamsFromCurrentUrl();

    this.props.openUserInteractionPortal({
      url: finalURL,
      dialogMode: this.props.dialogMode,
      fullScreenPopup: this.props.fullScreenPopup,
    });
  };

  getConsumerSpaceContext = () => {
    switch (this.props.widgetType) {
      case 'consumerSpace':
        return ConsumerSpaceContextEnum.WIDGET;
      case 'loginButton':
        return ConsumerSpaceContextEnum.LOGIN_BUTTON;
      default:
        return null;
    }
  };

  render() {
    const {
      classes,
      config,
      store,
      widgetType,
      theme,
      dialogMode,
      franchiseId,
      franchisor,
      styles,
      isBackofficePreview,
      parentElement,
      uniqueWidgetId,
      usePostMessageIframeDimensions,
      usePostMessageIfameScrollup,
    } = this.props;

    if (
      !this.props.theme ||
      !!this.props.themeLoading ||
      (franchiseId && !franchisor)
    ) {
      return (
        <div className={classes.container}>
          <CircularProgress />
        </div>
      );
    }

    const Widget = WidgetByType[widgetType] || CalendarWidget;
    // This mode will only be allowed on specific pages (meaning the pages refactored to css only)
    const allowNoPopup = WIDGET_ACCEPTING_NO_POPUP_MODE.includes(widgetType);
    const companyId =
      this.props.companyId || (this.props.franchisor?.companies ?? [])[0]?.id;

    return (
      <div className={classes.container}>
        <WidgetTracker isBackofficePreview={isBackofficePreview} />
        <React.Suspense fallback={<CircularProgress />}>
          <MuiThemeProvider
            theme={
              franchiseId
                ? getFranchiseTheme({
                    cover: franchisor.cover,
                    primaryRGB: franchisor.primaryRGB,
                    secondaryRGB: franchisor.secondaryRGB,
                  })
                : getTheme(this.props.theme)
            }
          >
            <ApplyCustomTheme
              styles={styles || this.props.theme.widget_theme}
            />
            {!!this.props.customConfiguration && (
              <ApplyCustomCssStyles
                customConfiguration={this.props.customConfiguration}
                fromWidget
              />
            )}
            <Widget
              companyId={companyId}
              franchiseId={franchiseId}
              config={config[widgetType] || {}}
              store={store}
              theme={theme}
              onWindowOpen={this.onWindowOpen}
              dialogMode={dialogMode}
              parentElement={parentElement}
              uniqueWidgetId={uniqueWidgetId}
              usePostMessageIframeDimensions={usePostMessageIframeDimensions}
              isBackofficePreview={isBackofficePreview}
            />
            {!!this.props.theme &&
              !this.props.theme.is_premium &&
              this.props.widgetType !==
                EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON && (
                <BsportLogo theme={this.props.theme} />
              )}
            <Snackbar theme={this.props.theme} />
            <UserInteractionPortal
              url={this.props.dialog.url}
              dialogMode={this.props.dialog.dialogMode}
              onClose={this.props.closeUserInteractionPortal}
              fullScreenPopup={this.props.fullScreenPopup}
              allowNoPopup={allowNoPopup}
              parentElement={this.props.parentElement}
              styles={styles || this.props.theme.widget_theme}
              customConfiguration={this.props.customConfiguration}
              usePostMessageIframeDimensions={usePostMessageIframeDimensions}
              usePostMessageIfameScrollup={usePostMessageIfameScrollup}
            />
            <WidgetBridge
              companyId={companyId}
              companyName={this.props.theme.company_name}
              isBackofficePreview={isBackofficePreview}
              consumerSpaceContext={this.getConsumerSpaceContext()}
            />

            {this.props.showFab && !window.bsportModalUrlOpen && (
              <FabWidget
                companyId={companyId}
                companyName={this.props.theme.company_name}
                onWindowOpen={this.onWindowOpen}
              />
            )}
          </MuiThemeProvider>
        </React.Suspense>
      </div>
    );
  }
}

const styles = () =>
  createStyles({
    container: {
      height: '100%',
      width: '100%',
      display: 'flex !important',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'transparent !important',
    },
  });

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme,
  themeLoading: state.theme.loading,
  dialog: state.modal,
  franchisor: getFranchisor(state),
  customConfiguration: state.exportableComponent.customCss,
});

const mapDispatchToProps = {
  fetchSCT: fetchSCTWithCache,
  fetchCompanyTheme: fetchCompanyThemeWithCache,
  openUserInteractionPortal,
  closeUserInteractionPortal,
  retrieveFranchise: retrieveFranchiseWithCache,
  retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withProps({ modalOpen: !!window.bsportModalUrlOpen }),
)(BsportWidget);

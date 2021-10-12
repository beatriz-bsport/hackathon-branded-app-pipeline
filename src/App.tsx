import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import URI from 'urijs';
import i18n from 'bsport-saas/src/i18n';
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
  EXPORTABLE_COMPONENT_TYPE_NEWSLETTER,
  EXPORTABLE_COMPONENT_TYPE_GIFTCARD,
} from 'bsport-saas/src/libs/exportable-components/constants';

// eslint-disable-next-line
import { fetchCompanyTheme } from 'bsport-saas/src/libs/theme/actions';
import { fetchSCT } from 'bsport-saas/src/libs/category/actions';

import {
  SnackbarDataProvider,
  SnackbarPile,
} from 'bsport-saas/src/SnackbarPile.component';
import { getTheme } from 'bsport-saas/src/theme';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import { WidgetConfig } from 'bsport-saas/src/libs/marketplace/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';

import { RootState } from './reducers';
import BsportLogo from './components/BsportLogo.component';
import 'bsport-saas/src/index.scss';

import asyncComponent from './components/AsyncComponent';
import {
  closeUserInteractionPortal,
  openUserInteractionPortal,
} from './libs/modal/actions';

const FabWidget = asyncComponent(() => import('./widgets/FabWidget.widget'));

const WidgetBridge = asyncComponent(
  () => import('./libs/bridge/BackofficeDataBridge.component'),
);

const PassWidget = asyncComponent(() => import('./widgets/Pass.widget'));
const ShopWidget = asyncComponent(() => import('./widgets/Shop.widget'));
const SubscriptionWidget = asyncComponent(
  () => import('./widgets/Subscription.widget'),
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
const GiftcardWidget = asyncComponent(
  () => import('./widgets/Giftcard.widget'),
);
const UserInteractionPortal = asyncComponent(
  () => import('./libs/modal/UserInteractionModal.component'),
);
const LoginButtonWidget = asyncComponent(
  () => import('./widgets/LoginButton.widget'),
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
  [EXPORTABLE_COMPONENT_TYPE_GIFTCARD]: GiftcardWidget,
  [EXPORTABLE_COMPONENT_TYPE_CALENDAR]: CalendarWidget,
};

type OwnProps = WidgetConfig & {
  store: any,
  lang?: string,
  history: any,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

window.env = { ...(window.env || {}), APP_CONTEXT: 'widget' };

class BsportWidget extends Component<Props> {
  componentDidMount() {
    this.fetchData();
    if (this.props.language) {
      setTimeout(() => i18n.changeLanguage(this.props.language), 100);
    }
  }

  fetchData() {
    this.props.fetchSCT();
    this.props.fetchCompanyTheme(this.props.companyId, {});
  }

  onWindowOpen = (url: string) => {
    const uri = URI(url).addQuery('context', 'widget');
    this.props.openUserInteractionPortal({
      url: uri.toString(),
      dialogMode: this.props.dialogMode,
    });
  };

  render() {
    const {
      classes,
      companyId,
      config,
      store,
      widgetType,
      theme,
      dialogMode,
    } = this.props;
    if (!this.props.theme || !!this.props.themeLoading) {
      return (
        <div className={classes.container}>
          <CircularProgress />
        </div>
      );
    }
    const Widget = WidgetByType[widgetType] || CalendarWidget;

    return (
      <div className={classes.container}>
        <React.Suspense fallback={<CircularProgress />}>
          <MuiThemeProvider theme={getTheme(this.props.theme)}>
            <Widget
              companyId={companyId}
              config={config[widgetType]}
              store={store}
              theme={theme}
              onWindowOpen={this.onWindowOpen}
              dialogMode={dialogMode}
            />
            {!!this.props.theme &&
              !this.props.theme.is_premium &&
              this.props.widgetType !==
                EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON && (
                <BsportLogo theme={this.props.theme} />
              )}
            <Snackbar theme={this.props.theme} />
            {!!this.props.dialog.url && (
              <UserInteractionPortal
                url={this.props.dialog.url}
                dialogMode={this.props.dialog.dialogMode}
                onClose={this.props.closeUserInteractionPortal}
                isBasket={
                  this.props.dialog.url &&
                  this.props.dialog.url.match(/\/basket\?context=widget/)
                }
              />
            )}

            <WidgetBridge
              companyId={this.props.companyId}
              companyName={this.props.theme.company_name}
            />

            {this.props.showFab && !window.bsportModalUrlOpen && (
              <FabWidget
                companyId={this.props.companyId}
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

const styles = () => ({
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
});

const mapDispatchToProps = {
  fetchSCT,
  fetchCompanyTheme,
  openUserInteractionPortal,
  closeUserInteractionPortal,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withProps({ modalOpen: !!window.bsportModalUrlOpen }),
)(BsportWidget);

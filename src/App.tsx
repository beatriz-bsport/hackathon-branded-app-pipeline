import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import URI from 'urijs';
import i18n from 'bsport-saas/src/i18n';

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
const UserInteractionPortal = asyncComponent(
  () => import('./libs/modal/UserInteractionModal.component'),
);
const LoginButtonWidget = asyncComponent(
  () => import('./widgets/LoginButton.widget'),
);

const Snackbar = themify(connect(...SnackbarDataProvider)(SnackbarPile));

const WidgetByType = {
  workshop: WorkshopWidget,
  privateService: PrivateServiceWidget,
  vod: VODWidget,
  playlist: VODWidget,
  loginButton: LoginButtonWidget,
  pass: PassWidget,
  shop: ShopWidget,
  subscription: SubscriptionWidget,
  newsletter: NewsletterWidget,
  calendar: CalendarWidget,
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
              this.props.widgetType !== 'loginButton' && (
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

            {this.props.showFab && (
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
)(BsportWidget);

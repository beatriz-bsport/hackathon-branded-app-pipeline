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

import { RootState } from './store/reducer';
import BsportLogo from './components/BsportLogo';
import 'bsport-saas/src/index.scss';

import asyncComponent from './AsyncComponent';
import FabWidget from './widgets/FabWidget';
import {
  closeUserInteractionPortal,
  openUserInteractionPortal,
} from './store/actions.widget';
import WidgetBridge from './widgets/WidgetBridge';

const PassWidget = asyncComponent(() => import('./widgets/Pass'));
const ShopWidget = asyncComponent(() => import('./widgets/Shop'));
const CalendarWidget = asyncComponent(() => import('./widgets/Calendar'));
const VODWidget = asyncComponent(() => import('./widgets/Vod'));
const PrivateServiceWidget = asyncComponent(
  () => import('./widgets/PrivateService')
);
const WorkshopWidget = asyncComponent(() => import('./widgets/Workshop'));
const NewsletterWidget = asyncComponent(() => import('./widgets/Newsletter'));
const UserInteractionPortal = asyncComponent(
  () => import('./components/UserInteractionPortal.component'),
);

const Snackbar = themify(connect(...SnackbarDataProvider)(SnackbarPile));

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

  renderWidget() {
    const {
      companyId,
      config,
      store,
      widgetType,
      theme,
      dialogMode,
    } = this.props;

    switch (widgetType) {
      case 'workshop':
        return (
          <WorkshopWidget
            companyId={companyId}
            config={config.workshop}
            store={store}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
          />
        );
      case 'privateService':
        return (
          <PrivateServiceWidget
            companyId={companyId}
            store={store}
            config={config.privateService}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
            dialogMode={dialogMode}
          />
        );
      case 'vod':
      case 'playlist':
        return (
          <VODWidget
            companyId={companyId}
            config={config[widgetType]}
            store={store}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
            dialogMode={dialogMode}
          />
        );
      case 'pass':
        return (
          <PassWidget
            companyId={companyId}
            config={config[widgetType]}
            store={store}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
          />
        );
      case 'shop':
        return (
          <ShopWidget
            companyId={companyId}
            config={config[widgetType]}
            store={store}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
          />
        );
      case 'newsletter':
        return <NewsletterWidget companyId={companyId} theme={theme} />;
      default:
        return (
          <CalendarWidget
            companyId={companyId}
            config={config.calendar}
            store={store}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
            dialogMode={dialogMode}
          />
        );
    }
  }

  render() {
    const { classes } = this.props;
    if (!this.props.theme || !!this.props.themeLoading) {
      return (
        <div className={classes.container}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <React.Suspense fallback={<CircularProgress />}>
          <MuiThemeProvider theme={getTheme(this.props.theme)}>
            {this.renderWidget()}
            {!!this.props.theme && !this.props.theme.is_premium && (
              <BsportLogo theme={this.props.theme} />
            )}
            <Snackbar theme={this.props.theme} />

            <UserInteractionPortal
              url={this.props.dialog.url}
              dialogMode={this.props.dialog.dialogMode}
              onClose={this.props.closeUserInteractionPortal}
              isBasket={
                this.props.dialog.url &&
                this.props.dialog.url.match(/\/basket\?context=widget/)
              }
            />

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
  dialog: state.widget.dialog,
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
  connect(mapStateToProps, mapDispatchToProps)
)(BsportWidget);

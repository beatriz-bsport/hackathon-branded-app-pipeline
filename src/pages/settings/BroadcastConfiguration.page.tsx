import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { WithStyles, withStyles, Theme } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';

import { replace as replaceRouter } from 'connected-react-router';
import { withRouter } from 'react-router';
import withTitle from '../../hocs/with-title.hoc';
import Config from '../../config';
import { buildUrlParams, parseQueryString } from '../../http';

import BroadcastConfigurationForm from '#libs/video/components/BroadcastConfiguration.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import { updateCompanyTheme, fetchCompanyTheme } from '#libs/theme/actions';
import themeSelectors from '#libs/theme/selectors';
import zoomAppSelectors from '#libs/zoom-app/selectors';
import {
  updateZoomApp,
  fetchZoomApp as fetchZoomAppAction,
  revokeZoomApp as revokeZoomAppAction,
} from '#libs/zoom-app/actions';
import { snackbarSuccess, snackbarError } from '#libs/snackbar/actions';
import { requestZoomAccessToken as requestZoomAccessTokenAPI } from '#libs/zoom-app/api';
import { showDeleteDialog } from '#components/genericDialog/CustomDialogs';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  paperContainer: {
    padding: theme.spacing(2),
  },
});

type Props = WithStyles<typeof styles> &
  ConnectedProps<typeof connector> &
  WithTranslation & { zoomCode: string } & WithHandlerType<typeof mapHandlers>;

export class BroadcastConfiguration extends Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme();
    this.props.fetchZoomApp(this.props.theme.company);

    if (this.props.zoomCode) {
      this.requestZoomConnect();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.zoomCode && !prevProps.zoomCode) {
      this.requestZoomConnect();
    }
  }

  requestZoomConnect = () => {
    requestZoomAccessTokenAPI(
      this.props.theme.company,
      this.props.zoomCode,
      window.location.href,
    )
      .then(() => {
        this.onZoomZuccess();
      })
      .catch(() => {
        this.onZoomError();
      });
  };

  onZoomZuccess = () => {
    this.props.removeUrlCode();
    this.props.snackbarSuccess('zoom.created.success');
    this.props.fetchZoomApp(this.props.theme.company);
  };

  onZoomError = () => {
    this.props.removeUrlCode();
    this.props.snackbarError('zoom.created.error');
    this.props.fetchZoomApp(this.props.theme.company);
  };

  connectZoom = async () => {
    const res = await showDeleteDialog(
      this.props.t('zoom.confirmDialog.title'),
      this.props.t('zoom.confirmDialog.text'),
    );
    if (res) {
      window.location.href = `https://zoom.us/oauth/authorize${buildUrlParams({
        response_type: 'code',
        client_id: Config.REACT_APP_ZOOM_CLIENT_ID,
        redirect_uri: window.location.href.includes('localhost')
          ? `https://bsport-1.eu.ngrok.io${window.location.pathname}`
          : window.location.origin + window.location.pathname,
      })}`;
    }
  };

  render() {
    const { classes } = this.props;
    if (this.props.loading) return <LinearProgress />;
    return (
      <div className={classes.container}>
        <BroadcastConfigurationForm
          connectZoom={this.connectZoom}
          onSubmitTheme={this.props.submitTheme}
          onSubmitZoomApp={this.props.submitZoomApp}
          processing={this.props.processing}
          revokeZoomApp={this.props.revokeZoomApp}
          theme={this.props.theme}
          zoomApp={this.props.zoomApp}
          zoomLoading={!!this.props.zoomCode}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    theme: themeSelectors.getTheme(state),
    loading: state.theme.loading && state.zoomApp.loading,
    processing:
      state.theme.createOrUpdate.loading && state.zoomApp.update.loading,
    zoomApp: zoomAppSelectors.getZoomApp(state),
  }),
  {
    fetchCompanyTheme,
    submitTheme: updateCompanyTheme,
    fetchZoomApp: fetchZoomAppAction,
    submitZoomApp: updateZoomApp,
    replace: replaceRouter,
    snackbarSuccess,
    snackbarError,
    revokeZoomApp: revokeZoomAppAction,
  },
);

const mapHandlers = {
  removeUrlCode:
    ({ replace }: ConnectedProps<typeof connector>) =>
    () => {
      replace(window.location.pathname);
    },
  revokeZoomApp:
    ({ revokeZoomApp, theme }: ConnectedProps<typeof connector>) =>
    () => {
      revokeZoomApp(theme.company);
    },
  submitZoomApp:
    ({
      submitZoomApp,
      fetchZoomApp,
      theme,
    }: ConnectedProps<typeof connector>) =>
    (zoomAppData: any) => {
      submitZoomApp(theme.company, zoomAppData, {
        onSuccess: () => {
          fetchZoomApp(theme.company);
        },
      });
    },
};

export default compose(
  connector,
  withHandlers(mapHandlers),
  withRouter,
  withProps(({ location }) => ({
    zoomCode:
      (parseQueryString(location.search) as { code?: string })?.code || null,
  })),
  withStyles(styles),
  withTranslation('theme'),
  withTitle(({ t }) => t('pageTitles.broadcast')),
)(BroadcastConfiguration);

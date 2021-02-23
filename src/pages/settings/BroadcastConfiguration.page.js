// @flow
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';

import { replace as replaceRouter } from 'connected-react-router';
import { withRouter } from 'react-router';
import type { Theme } from '../../libs/theme/types';
import withTitle from '../../hocs/with-title.hoc';
import Config from '../../config';
import { buildUrlParams, parseQueryString } from '../../http';

import BroadcastConfigurationForm from '../../libs/video/components/BroadcastConfiguration.component';
import {
  updateCompanyTheme,
  fetchCompanyTheme,
} from '../../libs/theme/actions';
import themeSelectors from '../../libs/theme/selectors';
import zoomAppSelectors from '../../libs/zoom-app/selectors';
import {
  updateZoomApp,
  fetchZoomApp as fetchZoomAppAction,
  revokeZoomApp as revokeZoomAppAction,
} from '../../libs/zoom-app/actions';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import { requestZoomAccessToken as requestZoomAccessTokenAPI } from '../../libs/zoom-app/api';

type Props = {
  theme: Theme,
  loading: boolean,
  revokeZoomApp: (companyId: number) => void,
  processing: boolean,
  submitTheme: (companyId: number, data: *) => void,
  fetchCompanyTheme: () => void,
  classes: any,
  zoomApp: any,
  submitZoomApp: (data: *) => void,
  fetchZoomApp: (companyId: number) => void,
  removeUrlCode: () => void,
  snackbarSuccess: (string) => void,
  snackbarError: (string) => void,
  zoomCode: string,
};

export class BroadcastConfiguration extends Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme();
    this.props.fetchZoomApp(this.props.theme.company);

    if (this.props.zoomCode) {
      this.requestZoomConnect();
    }
  }

  componentDidUpdate(prevProps) {
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

  connectZoom = () => {
    window.location.href = `https://zoom.us/oauth/authorize${buildUrlParams({
      response_type: 'code',
      client_id: Config.REACT_APP_ZOOM_CLIENT_ID,
      redirect_uri: window.location.href.includes('localhost')
        ? `https://bsport-1.eu.ngrok.io${window.location.pathname}`
        : window.location.origin + window.location.pathname,
    })}`;
  };

  render() {
    const { classes } = this.props;
    if (this.props.loading) return <LinearProgress />;
    return (
      <div className={classes.container}>
        <BroadcastConfigurationForm
          theme={this.props.theme}
          onSubmitTheme={this.props.submitTheme}
          processing={this.props.processing}
          zoomApp={this.props.zoomApp}
          connectZoom={this.connectZoom}
          onSubmitZoomApp={this.props.submitZoomApp}
          revokeZoomApp={this.props.revokeZoomApp}
          zoomLoading={!!this.props.zoomCode}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  paperContainer: {
    padding: theme.spacing(2),
  },
});

export default compose(
  connect(
    (state) => ({
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
  ),
  withHandlers({
    removeUrlCode: ({ replace }) => () => {
      replace(window.location.pathname);
    },
    revokeZoomApp: ({ revokeZoomApp, theme }) => () => {
      revokeZoomApp(theme.company);
    },
    submitZoomApp: ({ submitZoomApp, fetchZoomApp, theme }) => (
      zoomAppData,
    ) => {
      submitZoomApp(theme.company, zoomAppData, {
        onSuccess: () => {
          fetchZoomApp(theme.company);
        },
      });
    },
  }),
  withRouter,
  withProps(({ location }) => ({
    zoomCode: parseQueryString(location.search).code,
  })),
  withStyles(styles),
  withTranslation(['theme']),
  withTitle(({ t }) => t('pageTitles.broadcast')),
)(BroadcastConfiguration);

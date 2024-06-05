import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { WithStyles, withStyles, Theme } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';

import { replace as replaceRouter } from 'connected-react-router';
import { withRouter } from 'react-router';

import BroadcastConfigurationForm from '#libs/video/components/BroadcastConfiguration.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import { fetchCompanyTheme } from '#libs/theme/actions';
import themeSelectors from '#libs/theme/selectors';
import zoomAppSelectors from '#libs/zoom-app/selectors';
import {
  toggleDisableZoomApp as toggleDisableZoomAppAction,
  fetchZoomApp as fetchZoomAppAction,
  revokeZoomApp as revokeZoomAppAction,
  toggleMultiZoomUserSupport as toggleMultiZoomUserSupportAction,
  updateZoomGroupId as updateZoomGroupIdAction,
  resetZoomEstablishments as resetZoomEstablishmentsAction,
  fetchZoomGroupMembers as fetchZoomGroupMembersAction,
  fetchAllZoomMembers as fetchAllZoomMembersAction,
  listZoomEstablishments as listZoomEstablishmentsAction,
  bulkEditZoomEstablishments,
} from '#libs/zoom-app/actions';
import { fetchEstablishments as fetchEstablishmentsAction } from '#libs/establishment/actions';
import { getAllEstablishmentsDict } from '#libs/establishment/selectors';
import { snackbarSuccess, snackbarError } from '#libs/snackbar/actions';
import { requestZoomAccessToken as requestZoomAccessTokenAPI } from '#libs/zoom-app/api';
import { showDeleteDialog } from '#components/genericDialog/CustomDialogs';
import type { ZoomApp } from '#libs/zoom-app/types';
import { buildUrlParams, parseQueryString } from '../../http';
import Config from '../../config';
import withTitle from '../../hocs/with-title.hoc';
import type { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';
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
    this.props.fetchZoomApp(this.props.theme.company, {
      onSuccess: (zoomApp) => {
        if (
          !zoomApp.is_disabled &&
          zoomApp.is_configured &&
          zoomApp.multi_zoom_user_support_enabled
          // && zoomApp.zoom_group_id
        ) {
          this.props.fetchZoomMembersAndEstablishments();
        }
      },
    });

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
          bulkEditZoomEstablishments={this.props.bulkEditZoomEstablishments}
          connectZoom={this.connectZoom}
          establishmentsById={this.props.establishmentsById}
          fetchZoomMembersAndEstablishments={
            this.props.fetchZoomMembersAndEstablishments
          }
          processing={this.props.processing}
          resetZoomEstablishments={
            this.props.resetZoomEstablishmentsAndRefreshZoomApp
          }
          revokeZoomApp={this.props.revokeZoomApp}
          theme={this.props.theme}
          toggleDisableZoomApp={this.props.toggleDisableZoomAppForCompany}
          toggleMultiZoomUserSupport={
            this.props.toggleMultiZoomUserSupportForCompany
          }
          updateZoomGroupId={this.props.updateZoomGroupIdForCompany}
          zoomApp={this.props.zoomApp}
          zoomAppUpdateLoading={this.props.zoomAppUpdateLoading}
          zoomEstablishments={this.props.zoomEstablishments}
          zoomEstablishmentTableDataLoading={
            this.props.zoomEstablishmentTableDataLoading
          }
          zoomLoading={!!this.props.zoomCode}
          zoomMembersById={this.props.zoomMembersById}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    theme: themeSelectors.getTheme(state),
    loading: state.theme.loading || state.zoomApp.loading,
    processing:
      state.theme.createOrUpdate.loading || state.zoomApp.edit.loading,
    zoomApp: zoomAppSelectors.getZoomApp(state),
    establishmentsById: getAllEstablishmentsDict(state),
    zoomMembersById: state.zoomApp.zoomMembers.byId,
    zoomEstablishments: state.zoomApp.zoomEstablishments.data,
    zoomAppUpdateLoading: state.zoomApp.edit.loading,
    zoomMembersLoading: state.zoomApp.zoomMembers.loading,
    zoomEstablishmentTableDataLoading:
      state.establishment.loading ||
      state.zoomApp.zoomEstablishments.loading ||
      state.zoomApp.zoomEstablishments.edit.loading ||
      state.zoomApp.zoomMembers.loading,
  }),
  {
    fetchCompanyTheme,
    fetchZoomApp: fetchZoomAppAction,
    replace: replaceRouter,
    snackbarSuccess,
    snackbarError,
    revokeZoomApp: revokeZoomAppAction,
    toggleMultiZoomUserSupport: toggleMultiZoomUserSupportAction,
    updateZoomGroupId: updateZoomGroupIdAction,
    resetZoomEstablishments: resetZoomEstablishmentsAction,
    fetchZoomGroupMembers: fetchZoomGroupMembersAction,
    fetchAllZoomMembers: fetchAllZoomMembersAction,
    listZoomEstablishments: listZoomEstablishmentsAction,
    fetchEstablishments: fetchEstablishmentsAction,
    bulkEditZoomEstablishments,
    toggleDisableZoomApp: toggleDisableZoomAppAction,
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
  toggleMultiZoomUserSupportForCompany:
    ({ toggleMultiZoomUserSupport, theme }: ConnectedProps<typeof connector>) =>
    (options?: OptionCallback<ZoomApp>) => {
      toggleMultiZoomUserSupport(theme.company, options);
    },
  updateZoomGroupIdForCompany:
    ({ updateZoomGroupId, theme }: ConnectedProps<typeof connector>) =>
    (data: { zoom_group_id: string }, options?: OptionCallback<ZoomApp>) => {
      updateZoomGroupId(theme.company, data, options);
    },
  resetZoomEstablishmentsAndRefreshZoomApp:
    ({
      resetZoomEstablishments,
      theme,
      fetchZoomApp,
    }: ConnectedProps<typeof connector>) =>
    (options?: OptionCallback) => {
      resetZoomEstablishments({
        onSuccess: () => {
          fetchZoomApp(theme.company);
          options?.onSuccess?.();
        },
        onError: options?.onError,
      });
    },
  fetchZoomMembersAndEstablishments:
    ({
      // fetchZoomGroupMembers,
      fetchAllZoomMembers,
      listZoomEstablishments,
      fetchEstablishments,
      theme,
    }: ConnectedProps<typeof connector>) =>
    () => {
      // fetchZoomGroupMembers(theme.company);
      fetchAllZoomMembers(theme.company);
      listZoomEstablishments();
      fetchEstablishments({ disabled: false });
    },
  toggleDisableZoomAppForCompany:
    ({ toggleDisableZoomApp, theme }: ConnectedProps<typeof connector>) =>
    () => {
      toggleDisableZoomApp(theme.company);
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

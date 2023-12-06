import React, { Component } from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import VideocamIcon from '@material-ui/icons/Videocam';
import Paper from '@material-ui/core/Paper';
import { withTranslation, WithTranslation } from 'react-i18next';

// @ts-expect-error
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
// @ts-expect-error
import CustomColorButton from '#components/button/CustomColorButton.component';
import RedButton from '#components/button/RedButton.component';
import ZoomMultiUserSupportForm from '#libs/zoom-app/components/ZoomMultiUserSupportForm.component';

import type { Theme as CompanyTheme } from '../../theme/types';
import type {
  ZoomApp,
  ZoomEstablishment,
  ZoomMember,
  ZoomEstablishmentBulkEditData,
} from '#libs/zoom-app/types';
import type { OptionCallback } from '../../../state/types';
import type { Establishment } from '#libs/establishment/types';
import { FeatureList } from '#libs/company/types';
import { UPSELL_IDENTIFIER_ZOOM_APP } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';

const styles = (theme: Theme) =>
  createStyles({
    horizontalInput: {
      marginRight: theme.spacing(3),
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: theme.spacing(1),
      alignItems: 'center',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    progress: {
      marginLeft: theme.spacing(1),
    },
    verticalInput: {
      marginBottom: theme.spacing(2),
    },
    explainContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: theme.spacing(2),
      alignItems: 'center',
    },
    subInputContainer: {
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    namesHeader: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
    },
    paperContainer: {
      padding: theme.spacing(2),
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1),
    },
    iconLeft: {
      marginRight: theme.spacing(1),
    },
    rowActions: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      '&>*': {
        marginRight: theme.spacing(1),
      },
    },
  });

type OuterProps = {
  theme: CompanyTheme;
  connectZoom: () => void;
  onSubmitTheme: (id: number, data: any) => void;
  onSubmitZoomApp: (data: any) => void;
  processing: boolean;
  revokeZoomApp: () => void;
  zoomApp: ZoomApp;
  zoomLoading: boolean;
  toggleMultiZoomUserSupport: (options?: OptionCallback<ZoomApp>) => void;
  updateZoomGroupId: (
    data: { zoom_group_id: string },
    options?: OptionCallback<ZoomApp>,
  ) => void;
  resetZoomEstablishments: (options?: OptionCallback) => void;
  fetchZoomMembersAndEstablishments: () => void;
  zoomEstablishmentTableDataLoading: boolean;
  zoomEstablishments: ZoomEstablishment[];
  zoomMembersById: Record<string, ZoomMember>;
  establishmentsById: Record<number, Establishment>;
  bulkEditZoomEstablishments: (
    data: ZoomEstablishmentBulkEditData,
    options?: OptionCallback<ZoomEstablishment[]>,
  ) => void;
  zoomAppUpdateLoading: boolean;
};

type InnerProps = OuterProps & WithTranslation & WithStyles<typeof styles>;

type State = {
  theme: CompanyTheme;
  zoomApp?: Partial<ZoomApp>;
};

export class BroadcastConfigurationForm extends Component<InnerProps, State> {
  constructor(props: InnerProps) {
    super(props);
    this.state = {
      theme: props.theme,
      zoomApp: props.zoomApp || { id: null },
    };
  }

  componentDidUpdate(prevProps: InnerProps) {
    if (prevProps.theme !== this.props.theme) {
      this.setState({ theme: this.props.theme });
    }
    if (this.props.zoomApp && prevProps.zoomApp !== this.props.zoomApp) {
      this.setState({ zoomApp: this.props.zoomApp });
    }
  }

  handleChange = (key: string) => (value: any) => {
    this.setState((prevState) => ({
      theme: { ...prevState.theme, [key]: value },
    }));
  };

  handleChangeZoom = (key: string) => (value: any) => {
    this.setState((prevState) => ({
      zoomApp: { ...prevState.zoomApp, [key]: value },
    }));
  };

  checkChange = () => {
    let check_zoomApp = true;
    if (this.props.zoomApp) {
      check_zoomApp =
        this.state.zoomApp.is_disabled === this.props.zoomApp.is_disabled;
    }
    return (
      check_zoomApp &&
      this.state.theme.is_whereby_integration_enabled ===
        this.props.theme.is_whereby_integration_enabled
    );
  };

  onSubmit = () => {
    const new_theme = new FormData();
    ['is_whereby_integration_enabled'].map((key) =>
      // @ts-ignore | I don't know what's this
      new_theme.append(key, this.state.theme[key]),
    );
    this.props.onSubmitTheme(this.props.theme.company, new_theme);

    if (this.props.zoomApp && this.props.onSubmitZoomApp) {
      const zoom_conf = new FormData();
      ['is_disabled'].map((key) =>
        // @ts-ignore | I don't know what's this
        zoom_conf.append(key, this.state.zoomApp[key]),
      );
      this.props.onSubmitZoomApp(zoom_conf);
    }
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <FeatureListProvider>
          {(featureList: FeatureList) => {
            const hasZoom = hasUpsell(featureList, UPSELL_IDENTIFIER_ZOOM_APP);
            // Even if zoom app does not exist, default values for this.props.zoomApp (see zoom-app/reducers.tsx)
            const { is_configured, is_disabled } = this.props.zoomApp;
            return (
              <Paper className={classes.paperContainer}>
                <div className={classes.inputContainer}>
                  <Switch
                    checked={!is_disabled}
                    disabled={!hasZoom || !is_configured}
                    onChange={(ev) => {
                      this.handleChangeZoom('is_disabled')(!ev.target.checked);
                    }}
                    value={!this.state.zoomApp.is_disabled}
                  />
                  <Typography
                    color={
                      hasZoom || is_configured ? undefined : 'textSecondary'
                    }
                  >
                    {t('broadcast.zoom.enabled')}
                  </Typography>
                </div>
                <Typography style={{ marginBottom: 8 }} variant="caption">
                  {t('broadcast.zoom.explainValid')}
                </Typography>
                <div className={classes.rowActions}>
                  <CustomColorButton
                    color="#2d8cff"
                    disabled={
                      this.props.zoomLoading || !hasZoom || is_configured
                    }
                    onClick={this.props.connectZoom}
                    variant="contained"
                  >
                    {is_configured ? (
                      <CheckIcon className={classes.iconLeft} />
                    ) : (
                      <VideocamIcon className={classes.iconLeft} />
                    )}
                    CONNECT ZOOM
                  </CustomColorButton>
                  {is_configured && hasZoom && (
                    <RedButton
                      disabled={this.props.zoomLoading}
                      onClick={this.props.revokeZoomApp}
                      variant="contained"
                    >
                      {t('broadcast.zoom.revoke')}
                    </RedButton>
                  )}
                  {!!this.props.zoomLoading && <CircularProgress />}
                  {!hasZoom && (
                    <Link
                      style={{ textDecoration: 'none' }}
                      to="/settings/platform-billing"
                    >
                      <Button variant="outlined">
                        <ArrowForwardIcon className={classes.iconLeft} />
                        {t('broadcast.seeUpsell')}
                      </Button>
                    </Link>
                  )}
                </div>

                {hasZoom && (
                  <ZoomMultiUserSupportForm
                    bulkEditZoomEstablishments={
                      this.props.bulkEditZoomEstablishments
                    }
                    establishmentsById={this.props.establishmentsById}
                    fetchZoomMembersAndEstablishments={
                      this.props.fetchZoomMembersAndEstablishments
                    }
                    resetZoomEstablishments={this.props.resetZoomEstablishments}
                    toggleMultiZoomUserSupport={
                      this.props.toggleMultiZoomUserSupport
                    }
                    updateZoomGroupId={this.props.updateZoomGroupId}
                    zoomApp={this.props.zoomApp}
                    zoomAppUpdateLoading={this.props.zoomAppUpdateLoading}
                    zoomEstablishments={this.props.zoomEstablishments}
                    zoomEstablishmentTableDataLoading={
                      this.props.zoomEstablishmentTableDataLoading
                    }
                    zoomMembersById={this.props.zoomMembersById}
                  />
                )}
              </Paper>
            );
          }}
        </FeatureListProvider>
        <div className={classes.buttonContainer}>
          <Button
            color="primary"
            disabled={this.checkChange() || this.props.processing}
            onClick={() => this.onSubmit()}
            variant="contained"
          >
            {t('broadcast.submit')}
          </Button>
          {this.props.processing ? (
            <CircularProgress className={classes.progress} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default compose<InnerProps, OuterProps>(
  withStyles(styles),
  withTranslation('settings'),
)(BroadcastConfigurationForm);

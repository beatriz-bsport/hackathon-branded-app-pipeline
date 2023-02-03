// @flow

import React, { Component } from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import CheckIcon from '@material-ui/icons/Check';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import VideocamIcon from '@material-ui/icons/Videocam';
import Paper from '@material-ui/core/Paper';
import { withTranslation, TFunction } from 'react-i18next';

import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import CustomColorButton from '../../../components/button/CustomColorButton.component';
import RedButton from '../../../components/button/RedButton.component';

import type { Theme } from '../../theme/types';
import type { ZoomApp } from '../../zoom-app/types';
import { FeatureList } from '#libs/company/types';
import { UPSELL_IDENTIFIER_ZOOM_APP } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';

type Props = {
  theme: Theme,
  onSubmitTheme: (id: number, data: *) => void,
  processing: boolean,
  t: TFunction,
  classes: Object,
  zoomApp?: ZoomApp,
  revokeZoomApp: () => void,
  onSubmitZoomApp?: (data: *) => void,
  connectZoom: () => void,
  zoomLoading: boolean,
};

type State = {
  theme: Theme,
  zoomApp?: ZoomApp,
};

export class BroadcastConfigurationForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: props.theme,
      zoomApp: props.zoomApp || { id: null },
    };
  }

  componentDidUpdate(prevProps: Props) {
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
      new_theme.append(key, this.state.theme[key]),
    );
    this.props.onSubmitTheme(this.props.theme.company, new_theme);

    if (this.props.zoomApp && this.props.onSubmitZoomApp) {
      const zoom_conf = new FormData();
      ['is_disabled'].map((key) =>
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
                    value={!this.state.zoomApp.is_disabled}
                    onChange={(ev) => {
                      this.handleChangeZoom('is_disabled')(!ev.target.checked);
                    }}
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
                    variant="contained"
                    color="#2d8cff"
                    disabled={
                      this.props.zoomLoading || !hasZoom || is_configured
                    }
                    onClick={this.props.connectZoom}
                  >
                    {is_configured ? (
                      <CheckIcon className={classes.leftIcon} />
                    ) : (
                      <VideocamIcon className={classes.iconLeft} />
                    )}
                    CONNECT ZOOM
                  </CustomColorButton>
                  {is_configured && hasZoom && (
                    <RedButton
                      variant="contained"
                      disabled={this.props.zoomLoading}
                      onClick={this.props.revokeZoomApp}
                    >
                      {t('broadcast.zoom.revoke')}
                    </RedButton>
                  )}
                  {!!this.props.zoomLoading && <CircularProgress />}
                  {!hasZoom && (
                    <Link
                      to="/settings/platform-billing"
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="outlined">
                        <ArrowForwardIcon className={classes.leftIcon} />
                        {t('broadcast.seeUpsell')}
                      </Button>
                    </Link>
                  )}
                </div>
              </Paper>
            );
          }}
        </FeatureListProvider>
        <div className={classes.buttonContainer}>
          <Button
            onClick={() => this.onSubmit()}
            disabled={this.checkChange() || this.props.processing}
            variant="contained"
            color="primary"
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

const styles = (theme) => ({
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

export default compose(
  withStyles(styles),
  withTranslation(['settings']),
)(BroadcastConfigurationForm);

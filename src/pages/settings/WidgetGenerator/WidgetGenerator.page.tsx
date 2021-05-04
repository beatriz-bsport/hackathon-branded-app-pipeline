import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  ButtonBase,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { WithTranslation, withTranslation } from 'react-i18next';
import { merge } from 'lodash';
import moment from 'moment-timezone';

import {
  DIALOG_MODE_POPUP,
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_TAB,
} from '@bsport/common/lib/master-data/widget-dialog-mode';

import { MaterialStyleType } from '../../../utils/types';
import MarketplaceComponentTypeSelector from '../../../libs/marketplace/components/MarketplaceComponentTypeSelector.coponent';
import {
  MarketplaceComponentConfig,
  PrivateServicePageTypeEnum,
  WidgetComponentsEnum,
} from '../../../libs/marketplace/types';
import { RootState } from '../../../reducers';
import {
  fetchAllPrivateServices,
  fetchPrivateServiceGroupList,
} from '../../../libs/private-service/actions';
import { fetchAssociatedCoachesList } from '../../../libs/associated-coach/actions';
import { fetchEstablishments } from '../../../libs/establishment/actions';
import { fetchAllActivities } from '../../../libs/meta-activity/actions';
import { fetchPlaylistList } from '../../../libs/playlist/actions';
import {
  getAvailablePrivateServices,
  getPrivateServiceGroupList,
} from '../../../libs/private-service/selectors/private-service';
import { getActiveCoaches } from '../../../libs/associated-coach/selectors';
import { getAvailableEstablishmentList } from '../../../libs/establishment/selectors';
import {
  getEnabledWorkshops,
  getPageEnabledMetaActivities,
} from '../../../libs/meta-activity/selectors';
import { getPlaylistList } from '../../../libs/playlist/selectors';
import { WidgetCodeStringGenerator } from '../../../libs/marketplace/utils';
import { snackbarInfo } from '../../../actions/snackbar.actions';
import { fromConfigToUrl } from '../../marketplace/routing-utils';
import MarketplaceSettingsFormSwitch from '../../../libs/marketplace/components/MarketplaceSettingsForm/MarketplaceSettingsFormSwitch.component';
import { MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT } from '../../../libs/marketplace/constants';
import { fetchVideoList } from '../../../libs/video/actions';
import { getVideoList } from '../../../libs/video/selectors';
import Config from '../../../config';
import { LanguageSelect } from '../../../components/button/LanguageButton.component';

type OwnProps = {
  defaultValue?: {
    componentType: WidgetComponentsEnum;
    config: MarketplaceComponentConfig;
  };
  hideTypeSelector?: boolean;
  hidePreview?: boolean;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

interface State {
  componentType: WidgetComponentsEnum;
  useIframe: boolean;
  dialogMode: 0 | 1 | 2;
  language?: string;
  config: MarketplaceComponentConfig;
  error: {
    privateServiceError: string;
    playlistError: string;
  };
  showFab: boolean;
}

class WidgetGeneratorPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const state: State = {
      componentType: WidgetComponentsEnum.calendar,
      useIframe: false,
      dialogMode: DIALOG_MODE_IFRAME,
      config: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT,
      language: props.i18n.language,
      error: {
        privateServiceError: '',
        playlistError: '',
      },
      showFab: false,
    };

    if (props.defaultValue) {
      state.componentType = props.defaultValue.componentType;
      merge(state.config, props.defaultValue.config);
    }

    this.state = state;
  }

  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
    this.props.fetchAllActivities();
    this.props.fetchAllPrivateServices();
    this.props.fetchEstablishments();
    this.props.fetchPlaylistList({ mine: true });
    this.props.fetchVideoList({ mine: true });
    this.props.fetchPrivateServiceGroupList({ mine: true });
  }

  onComponentTypeChange = (componentType: WidgetComponentsEnum) => {
    const { t } = this.props;

    let playlistError = '';

    if (componentType === WidgetComponentsEnum.playlist) {
      playlistError = t(
        'settings:marketplaceSettings.createDialog.noPlaylistError',
      );
    }

    this.setState((prevState) => ({
      componentType,
      config: {
        ...prevState.config,
        [componentType]: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT[componentType],
      },
      error: {
        playlistError,
        privateServiceError: '',
      },
    }));
  };

  copyToClipboard(str: string) {
    navigator.clipboard.writeText(str).then(() => {
      this.props.snackbarInfo('snackbar:copied');
    });
  }

  getCodeString = () => {
    return WidgetCodeStringGenerator.getString({
      company: this.props.theme.company,
      componentType: this.state.componentType,
      config: this.state.config,
      useIframe: this.state.useIframe,
      language: this.state.language,
      dialogMode: this.state.dialogMode,
      showFab: this.state.showFab,
    });
  };

  getCodeStringPreview = () => {
    let codeStringPreview = '';

    if (!this.props.hidePreview) {
      codeStringPreview = WidgetCodeStringGenerator.getString({
        company: this.props.theme.company,
        componentType: this.state.componentType,
        config: this.state.config,
        useIframe: false,
        language: this.state.language,
        dialogMode: this.state.dialogMode,
        showFab: this.state.showFab,
      });
    }

    return codeStringPreview;
  };

  getUrl() {
    let url = '';

    if (this.state.componentType !== WidgetComponentsEnum.newsletter) {
      const urlParams = fromConfigToUrl({
        component_type: this.state.componentType,
        config: this.state.config,
      });

      url = `${Config.PUBLIC_URL}/m/${this.props.theme.company_name}/${this.props.theme.company}/${urlParams}`;
      return url;
    }

    return url;
  }

  onConfigChange = (config: MarketplaceComponentConfig) => {
    const { t } = this.props;
    let playlistError = '';
    let privateServiceError = '';

    if (
      this.state.componentType === WidgetComponentsEnum.playlist &&
      config.playlist
    ) {
      const { playlistId } = config.playlist;
      if (
        playlistId === undefined ||
        playlistId === null ||
        playlistId === -1
      ) {
        playlistError = t(
          'settings:marketplaceSettings.createDialog.noPlaylistError',
        );
      }
    }

    if (
      this.state.componentType === WidgetComponentsEnum.privateService &&
      config.privateService
    ) {
      let typeValue = config.privateService.type;

      if (!typeValue) {
        if (typeof config.privateService.serviceId === 'number') {
          typeValue = PrivateServicePageTypeEnum.detail;
        } else {
          typeValue = PrivateServicePageTypeEnum.list;
        }
      }

      const { serviceId } = config.privateService;

      if (
        typeValue === PrivateServicePageTypeEnum.detail &&
        (serviceId === undefined || serviceId === null || serviceId === -1)
      ) {
        privateServiceError = t(
          'settings:marketplaceSettings.createDialog.noServiceError',
        );
      }
    }

    this.setState({
      config,
      error: {
        playlistError,
        privateServiceError,
      },
    });
  };

  onChangeCompatibilityMode = (e: any, checked: boolean) => {
    this.setState({
      useIframe: checked,
      dialogMode: checked ? DIALOG_MODE_TAB : DIALOG_MODE_IFRAME,
    });
  };

  onChangeShowFab = (e: any, checked: boolean) => {
    this.setState({ showFab: checked });
  };

  render() {
    const { classes, t } = this.props;

    const codeString = this.getCodeString();
    const codeStringPreview = this.getCodeStringPreview();
    const url = this.getUrl();

    const error =
      this.state.error.privateServiceError || this.state.error.playlistError;

    return (
      <div className={classes.container}>
        <div className={classes.creationContainer}>
          <div className={classes.explain}>
            <div className={classes.row}>
              <InfoOutlinedIcon className={classes.explainIcon} />
              <Typography>{t('widget:widget.creationPageInfo')}</Typography>
            </div>
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.useIframe}
                onChange={this.onChangeCompatibilityMode}
                name="checkedA"
              />
            }
            label={t('widget:widget.ownStyle')}
          />

          <div className={classes.showFabContainer}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.showFab}
                  onChange={this.onChangeShowFab}
                  name="checkedB"
                />
              }
              label={t('widget:widget.showFabLabel')}
            />

            <a
              target="_blank"
              rel="noreferrer"
              href={`https://intercom.help/bsport-helpcenter/${moment
                .locale()
                .slice(0, 2)}/articles/4942264`}
              className={classes.link}
            >
              <HelpOutlineIcon />
            </a>
          </div>

          <FormControl className={classes.dialogMode}>
            <InputLabel>{t('widget:widget.dialogModeLabel')}</InputLabel>
            <Select
              className={classes.fullWidth}
              value={this.state.dialogMode}
              onChange={(ev: any) =>
                this.setState({ dialogMode: ev.target.value })
              }
            >
              <MenuItem value={DIALOG_MODE_TAB}>
                {t(`widget:widget.dialogMode.tab`)}
              </MenuItem>

              {!this.state.useIframe && (
                <MenuItem value={DIALOG_MODE_IFRAME}>
                  {t(`widget:widget.dialogMode.iframe`)}
                </MenuItem>
              )}

              <MenuItem value={DIALOG_MODE_POPUP}>
                {t(`widget:widget.dialogMode.popup`)}
              </MenuItem>
            </Select>
          </FormControl>

          <div className={classes.language}>
            <div className={classes.languageSelect}>
              <LanguageSelect
                onChange={(language) => this.setState({ language })}
                value={this.state.language}
                label={t('widget:widget.pickALanguage')}
                none={t('widget:widget.browserLanguage')}
              />
            </div>
            <Tooltip title={t('widget:widget.languageHelper')}>
              <HelpOutlineIcon />
            </Tooltip>
          </div>

          {!this.props.hideTypeSelector && (
            <div className={classes.componentType}>
              <MarketplaceComponentTypeSelector
                source={Object.keys(WidgetComponentsEnum)}
                value={this.state.componentType}
                onChange={this.onComponentTypeChange}
              />
            </div>
          )}

          <MarketplaceSettingsFormSwitch
            componentType={this.state.componentType}
            coaches={this.props.coaches}
            establishments={this.props.establishments}
            metaActivities={this.props.metaActivities}
            metaActivitiesWorkshop={this.props.metaActivitiesWorkshop}
            privateServices={this.props.privateServices}
            playlists={this.props.playlists}
            privateServiceError={this.state.error.privateServiceError}
            playlistError={this.state.error.playlistError}
            videos={this.props.videoList}
            serviceGroupList={this.props.serviceGroupList}
            config={this.state.config}
            onChange={this.onConfigChange}
          />

          <div className={classes.separator} />

          {url && (
            <>
              <Typography className={classes.marginTop}>
                {t('widget:widget.linkToConfig')}
              </Typography>

              <Paper elevation={1} className={classes.codeContainer}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className={classes.code}
                >
                  {error ? t('widget:widget.widgetPreviewError') : url}
                </Typography>

                {!error && (
                  <ButtonBase
                    onClick={() => this.copyToClipboard(url)}
                    className={classes.copyClipboardContainer}
                  >
                    <FileCopyIcon />
                  </ButtonBase>
                )}
              </Paper>
            </>
          )}

          <>
            <Typography className={classes.marginTop}>
              {t('widget:widget.codeInfo')}
            </Typography>

            <Paper elevation={1} className={classes.codeContainer}>
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.code}
              >
                {error ? t('widget:widget.widgetPreviewError') : codeString}
              </Typography>

              {!error && (
                <ButtonBase
                  onClick={() => this.copyToClipboard(codeString)}
                  className={classes.copyClipboardContainer}
                >
                  <FileCopyIcon />
                </ButtonBase>
              )}
            </Paper>
          </>
        </div>

        {!this.props.hidePreview && (
          <div className={classes.iframeContainer}>
            <Paper className={classes.iframePaper} elevation={1}>
              {error ? (
                <div className={classes.previewErrorContainer}>
                  <SettingsIcon fontSize="large" />
                  <Typography variant="h5">
                    {t('widget:widget.widgetPreviewError')}
                  </Typography>
                </div>
              ) : (
                <iframe
                  title="preview"
                  className={classes.iframe}
                  srcDoc={codeStringPreview}
                />
              )}
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    minHeight: '100vh',
    flexDirection: 'column',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
    },
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  creationContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    [theme.breakpoints.up('lg')]: {
      maxWidth: 450,
    },
    zIndex: 99,
  },
  showFabContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
    '&:focus, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none',
      color: 'black',
    },
  },
  dialogMode: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  language: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    marginTop: theme.spacing(2),
  },
  languageSelect: {
    minWidth: '100%',
    marginRight: theme.spacing(1),
  },
  componentType: {
    marginTop: theme.spacing(4),
  },
  fullWidth: {
    width: '100%',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  codeContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    position: 'relative',
  },
  code: {
    whiteSpace: 'pre-wrap',
    paddingRight: theme.spacing(4),
  },
  copyClipboardContainer: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  explain: {
    padding: theme.spacing(2),
    borderRadius: 8,
    border: '1px solid #DEDEDE',
    marginBottom: theme.spacing(3),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  explainIcon: {
    marginRight: theme.spacing(1),
  },
  separator: {
    borderStyle: 'solid',
    borderWidth: 0,
    borderTopWidth: 2,
    borderColor: '#CCC',
    marginTop: theme.spacing(4),
  },
  iframeContainer: {
    display: 'flex',
    flex: 1,
    height: '100%',
    minHeight: '100vh',
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('lg')]: {
      marginTop: 0,
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
    },
  },
  iframe: {
    display: 'flex',
    flex: 1,
    height: '100%',
    borderStyle: 'none',
  },
  iframePaper: {
    display: 'flex',
    flex: 1,
  },
  previewErrorContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state: RootState) => ({
  privateServices: getAvailablePrivateServices(state),
  coaches: getActiveCoaches(state),
  establishments: getAvailableEstablishmentList(state),
  metaActivities: getPageEnabledMetaActivities(state),
  metaActivitiesWorkshop: getEnabledWorkshops(state),
  playlists: getPlaylistList(state),
  videoList: getVideoList(state),
  theme: state.theme.theme,
  privateServiceLoading: state.privateService.privateService.loading,
  coachesLoading: state.coach.loading,
  establishmentsLoading: state.establishment.loading,
  metaActivitiesLoading: state.metaActivity.loading,
  serviceGroupList: getPrivateServiceGroupList(state),
  themeLoading: state.theme.loading,
});

const mapDispatchToProps = {
  fetchAllPrivateServices,
  fetchAssociatedCoachesList,
  fetchEstablishments,
  fetchAllActivities,
  fetchPlaylistList,
  fetchVideoList,
  fetchPrivateServiceGroupList,
  snackbarInfo,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['widget', 'settings']),
  connect(mapStateToProps, mapDispatchToProps),
)(WidgetGeneratorPage);

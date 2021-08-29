import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { WithTranslation, withTranslation } from 'react-i18next';
import { merge } from 'lodash';

import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode';
import { MaterialStyleType } from '../../utils/types';
import {
  MarketplaceComponentConfig,
  WidgetComponentsEnum,
} from '../../libs/marketplace/types';
import { RootState } from '../../reducers';
import {
  fetchAllPrivateServices,
  fetchPrivateServiceGroupList,
} from '../../libs/private-service/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchAllActivities } from '../../libs/meta-activity/actions';
import { fetchPlaylistList } from '../../libs/playlist/actions';
import {
  getAvailablePrivateServices,
  getPrivateServiceGroupList,
} from '../../libs/private-service/selectors/private-service';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import {
  getEnabledWorkshops,
  getPageEnabledMetaActivities,
} from '../../libs/meta-activity/selectors';
import { getPlaylistList } from '../../libs/playlist/selectors';
import { WidgetCodeStringGenerator } from '../../libs/marketplace/utils';
import { snackbarInfo } from '../../actions/snackbar.actions';
import { MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT } from '../../libs/marketplace/constants';
import { fetchVideoList } from '../../libs/video/actions';
import { getVideoList } from '../../libs/video/selectors';

import WidgetMarketplaceConfigBuilder from '../../libs/widget/components/WidgetMarketplaceConfigBuilder.component';
import WidgetComponentConfigBuilder from '../../libs/widget/components/WidgetComponentConfigBuilder.component';
import WidgetCodePreview from '../../libs/widget/components/WidgetCodePreview.component';
import WidgetPreview from '../../libs/widget/components/WidgetPreview.component';
import WidgetContainerConfigurator from '../../libs/widget/components/WidgetContainerConfigurator.component';

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
  containerConfig: {
    useIframe: boolean;
    dialogMode: 0 | 1 | 2;
    language?: string;
    showFab: boolean;
  };
  config: MarketplaceComponentConfig;
  error: {
    privateServiceError: string;
    playlistError: string;
  };
}

class WidgetGeneratorPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const state: State = {
      uuid: `-${parseInt(Math.random() * 1000000, 10)}`,
      componentType: WidgetComponentsEnum.calendar,
      containerConfig: {
        useIframe: false,
        dialogMode: DIALOG_MODE_IFRAME,
        language: 'none',
        showFab: false,
      },
      config: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT,
      error: {
        privateServiceError: '',
        playlistError: '',
      },
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

  onComponentTypeChange = ({
    componentType,
    config,
    error,
  }: {
    componentType: WidgetComponentsEnum;
    config: any;
    error: any;
  }) => {
    this.setState({
      componentType,
      config,
      error,
    });
  };

  getCodeString = () => {
    return WidgetCodeStringGenerator.getString({
      company: this.props.theme.company,
      componentType: this.state.componentType,
      config: this.state.config,
      useIframe: this.state.containerConfig.useIframe,
      language: this.state.containerConfig.language,
      dialogMode: this.state.containerConfig.dialogMode,
      showFab: this.state.containerConfig.showFab,
      uuid: this.state.uuid,
    });
  };

  getCodeStringPreview = () => {
    let codeStringPreview = '';

    codeStringPreview = WidgetCodeStringGenerator.getString({
      company: this.props.theme.company,
      componentType: this.state.componentType,
      config: this.state.config,
      useIframe: false,
      language: this.state.containerConfig.language,
      dialogMode: this.state.containerConfig.dialogMode,
      showFab: this.state.containerConfig.showFab,
      uuid: this.state.uuid,
    });

    return codeStringPreview;
  };

  onConfigChange = ({
    config,
    error,
  }: {
    config: MarketplaceComponentConfig;
    error: any;
  }) => {
    this.setState({
      config,
      error,
    });
  };

  copyToClipboard = (str: string) => {
    navigator.clipboard.writeText(str).then(() => {
      this.props.snackbarInfo('snackbar:copied');
    });
  };

  render() {
    const { classes, t } = this.props;

    const codeString = this.getCodeString();
    const codeStringPreview = this.getCodeStringPreview();

    const error = Object.values(this.state.error).filter((e) => !!e).length > 0;

    return (
      <div className={classes.container}>
        <div className={classes.creationContainer}>
          <div className={classes.explain}>
            <div className={classes.row}>
              <InfoOutlinedIcon className={classes.explainIcon} />
              <Typography>{t('widget.creationPageInfo')}</Typography>
            </div>
          </div>
          <WidgetContainerConfigurator
            showFab={this.state.containerConfig.showFab}
            useIframe={this.state.containerConfig.useIframe}
            language={this.state.containerConfig.language}
            dialogMode={this.state.containerConfig.dialogMode}
            onChangeContainerConfiguration={(containerConfig: any) =>
              this.setState((prevState) => ({
                containerConfig: {
                  ...prevState.containerConfig,
                  ...containerConfig,
                },
              }))
            }
          />
          <fieldset className={classes.marginTop}>
            <legend>{t('widget.configTitle')}</legend>
            <WidgetComponentConfigBuilder
              hideTypeSelector={this.props.hideTypeSelector}
              onComponentTypeChange={this.onComponentTypeChange}
              error={this.state.error}
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
              onConfigChange={this.onConfigChange}
            />
          </fieldset>
          <WidgetMarketplaceConfigBuilder
            theme={this.props.theme}
            componentType={this.state.componentType}
            copyToClipboard={this.copyToClipboard}
            config={this.state.config}
            error={error}
          />
          <WidgetCodePreview
            copyToClipboard={this.copyToClipboard}
            error={error}
            codeString={codeString}
          />
        </div>
        <WidgetPreview codeStringPreview={codeStringPreview} />
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
  marginTop: {
    marginTop: theme.spacing(2),
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
  withTranslation(['widget']),
  connect(mapStateToProps, mapDispatchToProps),
)(WidgetGeneratorPage);

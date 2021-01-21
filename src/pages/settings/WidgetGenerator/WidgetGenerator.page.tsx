import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  ButtonBase,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { WithTranslation, withTranslation } from 'react-i18next';
import { merge } from 'lodash';

import { MaterialStyleType } from '../../../utils/types';
import MarketplaceComponentTypeSelector from '../../../libs/marketplace/components/MarketplaceComponentTypeSelector.coponent';
import {
  MarketplaceComponentConfig,
  WidgetComponentsEnum,
} from '../../../libs/marketplace/types';
import { RootState } from '../../../reducers';
import { fetchAllPrivateServices } from '../../../libs/private-service/actions';
import { fetchAssociatedCoachesList } from '../../../libs/associated-coach/actions';
import { fetchEstablishments } from '../../../libs/establishment/actions';
import { fetchAllActivities } from '../../../libs/meta-activity/actions';
import { fetchPlaylistList } from '../../../libs/playlist/actions';
import { getAvailablePrivateServices } from '../../../libs/private-service/selectors/private-service';
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
import { MetaActivity } from '../../../libs/meta-activity/types';

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
  config: MarketplaceComponentConfig;
}

class WidgetGeneratorPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const state: State = {
      componentType: WidgetComponentsEnum.calendar,
      useIframe: false,
      config: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT,
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
  }

  onComponentTypeChange = (componentType: WidgetComponentsEnum) => {
    this.setState((prevState) => ({
      componentType,
      config: {
        ...prevState.config,
        [componentType]: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT[componentType],
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

  render() {
    const { classes, t } = this.props;

    const codeString = this.getCodeString();
    const codeStringPreview = this.getCodeStringPreview();
    const url = this.getUrl();

    return (
      <div className={classes.container}>
        <div className={classes.creationContainer}>
          <div className={classes.explain}>
            <div className={classes.row}>
              <InfoOutlinedIcon className={classes.explainIcon} />
              <Typography>{t('widget.creationPageInfo')}</Typography>
            </div>
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.useIframe}
                onChange={(e) => {
                  this.setState({ useIframe: e.target.checked });
                }}
                name="checkedA"
              />
            }
            label={t('widget.ownStyle')}
          />

          {!this.props.hideTypeSelector && (
            <div className={classes.marginTop}>
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
            videos={this.props.videoList}
            config={this.state.config}
            onChange={(config) => this.setState({ config })}
          />

          <div className={classes.separator} />

          {url && (
            <>
              <Typography className={classes.marginTop}>
                {t('widget.linkToConfig')}
              </Typography>

              <Paper elevation={1} className={classes.codeContainer}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  className={classes.code}
                >
                  {url}
                </Typography>

                <ButtonBase
                  onClick={() => this.copyToClipboard(url)}
                  className={classes.copyClipboardContainer}
                >
                  <FileCopyIcon />
                </ButtonBase>
              </Paper>
            </>
          )}

          <Typography className={classes.marginTop}>
            {t('widget.codeInfo')}
          </Typography>

          <Paper elevation={1} className={classes.codeContainer}>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.code}
            >
              {codeString}
            </Typography>

            <ButtonBase
              onClick={() => this.copyToClipboard(codeString)}
              className={classes.copyClipboardContainer}
            >
              <FileCopyIcon />
            </ButtonBase>
          </Paper>
        </div>

        {!this.props.hidePreview && (
          <div className={classes.iframeContainer}>
            <Paper className={classes.iframePaper} elevation={1}>
              <iframe
                title="preview"
                className={classes.iframe}
                srcDoc={codeStringPreview}
              />
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
  themeLoading: state.theme.loading,
});

const mapDispatchToProps = {
  fetchAllPrivateServices,
  fetchAssociatedCoachesList,
  fetchEstablishments,
  fetchAllActivities,
  fetchPlaylistList,
  fetchVideoList,
  snackbarInfo,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation('widget'),
  connect(mapStateToProps, mapDispatchToProps),
)(WidgetGeneratorPage);

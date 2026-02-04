import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { WithTranslation, withTranslation } from 'react-i18next';
import merge from 'lodash/merge';

import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import { getPrivatePassCategories } from '#src/libs/private-service/selectors/private-pass-category';
import { getFranchiseId } from '#src/libs/franchise/selectors';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { getActiveCustomLevels } from '#src/libs/level/selectors';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { MaterialStyleType } from '../../utils/types';
import { MarketplaceComponentConfig } from '../../libs/marketplace/types';
import { RootState } from '../../reducers';
import {
  fetchAllPrivateServices,
  fetchPrivateServiceGroupList,
  fetchAllPrivatePassCategory,
} from '../../libs/private-service/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentGroup,
} from '../../libs/establishment/actions';
import { fetchActivitiesCompany } from '../../libs/meta-activity/actions';
import { fetchPlaylistList } from '../../libs/playlist/actions';
import {
  fetchAllPaymentPackCategory,
  fetchPaymentPackTemplateList,
} from '../../libs/payment-packs/actions';
import { fetchGiftcardList } from '../../libs/giftcard/actions';
import {
  getAvailablePrivateServices,
  getPrivateServiceGroupList,
} from '../../libs/private-service/selectors/private-service';
import {
  getAllPaymentPackCategory,
  getPaymentPackTemplateListAvailable,
} from '../../libs/payment-packs/selectors';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import {
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
} from '../../libs/establishment/selectors';
import {
  getEnabledWorkshops,
  getPageEnabledPureMetaActivities,
} from '../../libs/meta-activity/selectors';
import { getGiftcardListEnabled } from '../../libs/giftcard/selectors';
import { getPlaylistList } from '../../libs/playlist/selectors';
import { WidgetCodeStringGenerator } from '../../libs/marketplace/utils';
import { snackbarInfo } from '../../libs/snackbar/actions';
import { fetchVideoList } from '../../libs/video/actions';
import { getVideoList } from '../../libs/video/selectors';

import WidgetMarketplaceConfigBuilder from '../../libs/widget/components/WidgetMarketplaceConfigBuilder.component';
import WidgetComponentConfigBuilder from '../../libs/widget/components/WidgetComponentConfigBuilder.component';
import WidgetCodePreview from '../../libs/widget/components/WidgetCodePreview.component';
import WidgetPreview from '../../libs/widget/components/WidgetPreview.component';
import WidgetContainerConfigurator from '../../libs/widget/components/WidgetContainerConfigurator.component';

import {
  EXPORTABLE_COMPONENT_TYPE_CALENDAR,
  EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE,
} from '../../libs/exportable-components/constants';

type OwnProps = {
  defaultValue?: {
    componentType: string;
    config: MarketplaceComponentConfig;
    configIndex?: number;
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
  componentType: string;
  containerConfig: {
    useIframe: boolean;
    responsiveIframe: boolean;
    dialogMode: 0 | 1 | 2;
    language?: string;
    showFab: boolean;
    fullScreenPopup: boolean;
  };
  config: MarketplaceComponentConfig;
  error: {
    privateServiceError: string;
    playlistError: string;
  };
  uuid: string;
}

class WidgetGeneratorPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const state: State = {
      // @ts-expect-error
      uuid: `-${parseInt(Math.random() * 1000000, 10)}`,
      componentType: props.isFranchisor
        ? EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE
        : EXPORTABLE_COMPONENT_TYPE_CALENDAR,
      containerConfig: {
        useIframe: false,
        responsiveIframe: true,
        dialogMode: DIALOG_MODE_IFRAME,
        language: 'none',
        showFab: false,
        fullScreenPopup: false,
      },
      config: {
        calendar: {},
        paymentPackTemplate: { paymentPackTemplateList: [] },
      },
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
    if (this.props.theme?.company) {
      this.props.fetchActivitiesCompany(this.props.theme.company);
    }
    this.props.fetchAllPrivateServices();
    this.props.fetchEstablishments();
    this.props.fetchAllPaymentPackCategory();
    this.props.fetchAllPrivatePassCategory();
    this.props.fetchPlaylistList({ mine: true });
    this.props.fetchVideoList({ mine: true });
    this.props.fetchPrivateServiceGroupList({ mine: true });
    this.props.fetchAllEstablishmentGroup();
    this.props.fetchGiftcardList();
    this.props.fetchLevelList({
      is_active: true,
    });

    this.props.franchiseId &&
      this.props.fetchPaymentPackTemplateList({
        franchisor: this.props.franchiseId,
      });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.containerConfig !== this.state.containerConfig) {
      this.setState({
        // @ts-expect-error
        uuid: `-${parseInt(Math.random() * 1000000, 10)}`,
      });
    }
    if (prevState.componentType !== this.state.componentType) {
      this.setState({
        // @ts-expect-error
        uuid: `-${parseInt(Math.random() * 1000000, 10)}`,
      });
    }
    if (prevState.config !== this.state.config) {
      this.setState({
        // @ts-expect-error
        uuid: `-${parseInt(Math.random() * 1000000, 10)}`,
      });
    }
  }

  onComponentTypeChange = ({
    componentType,
    config,
    error,
  }: {
    componentType: string;
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
    // @ts-expect-error
    return WidgetCodeStringGenerator.getString({
      company: this.props.theme.company,
      franchise: this.props.franchiseId,
      componentType: this.state.componentType,
      config: this.state.config,
      useIframe: this.state.containerConfig.useIframe,
      language: this.state.containerConfig.language,
      dialogMode: this.state.containerConfig.dialogMode,
      fullScreenPopup: this.state.containerConfig.fullScreenPopup,
      showFab: this.state.containerConfig.showFab,
      uuid: this.state.uuid,
      responsiveIframe: this.state.containerConfig.responsiveIframe,
    });
  };

  getCodeStringPreview = () => {
    let codeStringPreview = '';

    // @ts-expect-error
    codeStringPreview = WidgetCodeStringGenerator.getString({
      company: this.props.theme.company,
      franchise: this.props.franchiseId,
      componentType: this.state.componentType,
      config: this.state.config,
      useIframe: false,
      language: this.state.containerConfig.language,
      dialogMode: this.state.containerConfig.dialogMode,
      fullScreenPopup: this.state.containerConfig.fullScreenPopup,
      showFab: this.state.containerConfig.showFab,
      uuid: this.state.uuid,
      responsiveIframe: this.state.containerConfig.responsiveIframe,
      isBackofficePreview: true,
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
            dialogMode={this.state.containerConfig.dialogMode}
            fullScreenPopup={this.state.containerConfig.fullScreenPopup}
            isFranchisor={this.props.isFranchisor}
            language={this.state.containerConfig.language}
            onChangeContainerConfiguration={(containerConfig: any) =>
              this.setState((prevState) => ({
                containerConfig: {
                  ...prevState.containerConfig,
                  ...containerConfig,
                },
              }))
            }
            responsiveIframe={this.state.containerConfig.responsiveIframe}
            showFab={this.state.containerConfig.showFab}
            useIframe={this.state.containerConfig.useIframe}
          />
          <fieldset className={classes.marginTop}>
            <legend>{t('widget.configTitle')}</legend>

            <WidgetComponentConfigBuilder
              coaches={this.props.coaches}
              companyId={this.props.theme?.company}
              componentType={this.state.componentType}
              config={this.state.config}
              customLevels={this.props.customLevels}
              error={this.state.error}
              establishmentGroupList={this.props.establishmentGroupList}
              establishments={this.props.establishments}
              giftcards={this.props.giftcards}
              hideTypeSelector={this.props.hideTypeSelector}
              isFranchisor={this.props.isFranchisor}
              metaActivities={this.props.metaActivities.map((metaActivity) =>
                metaActivity.asMutable({ deep: true }),
              )}
              // @ts-expect-error
              metaActivitiesWorkshop={this.props.metaActivitiesWorkshop}
              onComponentTypeChange={this.onComponentTypeChange}
              onConfigChange={this.onConfigChange}
              paymentPackCategories={this.props.paymentPackCategories}
              paymentPackTemplateListAvailable={
                this.props.paymentPackTemplateListAvailable
              }
              playlistError={this.state.error.playlistError}
              playlists={this.props.playlists}
              privatePassCategories={this.props.privatePassCategories}
              privateServiceError={this.state.error.privateServiceError}
              privateServices={this.props.privateServices}
              serviceGroupList={this.props.serviceGroupList}
              tagList={this.props.allTagsWithTagGroup}
              tagsLoading={this.props.tagsLoading}
              videos={this.props.videoList}
            />
          </fieldset>
          <WidgetMarketplaceConfigBuilder
            componentType={this.state.componentType}
            config={this.state.config}
            configIndex={this.props.defaultValue?.configIndex}
            copyToClipboard={this.copyToClipboard}
            // @ts-expect-error
            error={error}
            theme={this.props.theme}
          />
          <WidgetCodePreview
            codeString={codeString}
            copyToClipboard={this.copyToClipboard}
            // @ts-expect-error
            error={error}
          />
        </div>
        {/* @ts-expect-error */}
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
  isFranchisor: state.auth.is_franchisor,
  franchiseId: getFranchiseId(state),
  privateServices: getAvailablePrivateServices(state),
  coaches: getActiveCoaches(state),
  establishments: getAvailableEstablishmentList(state),
  metaActivities: getPageEnabledPureMetaActivities(state),
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
  paymentPackCategories: getAllPaymentPackCategory(state),
  privatePassCategories: getPrivatePassCategories(state),
  establishmentGroupList: groupWithEstablishment(
    getAssociatedEstablishmentGroup,
  )(state),
  giftcards: getGiftcardListEnabled(state),
  paymentPackTemplateListAvailable: getPaymentPackTemplateListAvailable(state),
  customLevels: getActiveCustomLevels(state),
  allTagsWithTagGroup: getAllTagsWithTagGroup(state),
  tagsLoading: state.tag.tag.loading || state.tag.group.loading,
});

const mapDispatchToProps = {
  fetchPaymentPackTemplateList,
  fetchAllPrivateServices,
  fetchAssociatedCoachesList,
  fetchEstablishments,
  fetchActivitiesCompany,
  fetchPlaylistList,
  fetchVideoList,
  fetchPrivateServiceGroupList,
  fetchAllPaymentPackCategory,
  fetchAllPrivatePassCategory,
  fetchAllEstablishmentGroup,
  fetchGiftcardList,
  snackbarInfo,
  fetchLevelList: fetchLevelListAction,
};

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(['widget']),
  connect(mapStateToProps, mapDispatchToProps),
)(WidgetGeneratorPage);

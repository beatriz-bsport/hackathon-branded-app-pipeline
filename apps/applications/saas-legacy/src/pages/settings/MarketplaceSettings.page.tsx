import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ImmutableArray } from 'seamless-immutable';

import {
  getDefaultConfigByIdentifier,
  getDefaultTitleForComponent,
} from '#src/libs/exportable-components/utils-common';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import { getPrivatePassCategories } from '#src/libs/private-service/selectors/private-pass-category';
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { getActiveCustomLevels } from '#src/libs/level/selectors';
import { EXPORTABLE_COMPONENT_TYPE_CALENDAR } from '#src/libs/exportable-components/constants';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { RootState } from '../../reducers';
import {
  fetchAllPrivatePassCategory as fetchAllPrivatePassCategoryAction,
  fetchAllPrivateServices as fetchAllPrivateServicesAction,
  fetchPrivateServiceGroupList as fetchPrivateServiceGroupListAction,
} from '../../libs/private-service/actions';
import {
  getAvailablePrivateServices,
  getPrivateServiceGroupList,
} from '../../libs/private-service/selectors/private-service';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '../../libs/associated-coach/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '../../libs/establishment/actions';
import {
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
} from '../../libs/establishment/selectors';
import { fetchGiftcardList as fetchGiftcardListAction } from '../../libs/giftcard/actions';
import { getGiftcardListEnabled } from '../../libs/giftcard/selectors';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '../../libs/meta-activity/actions';
import { fetchAllPaymentPackCategory as fetchAllPaymentPackCategoryAction } from '../../libs/payment-packs/actions';
import {
  getEnabledWorkshops,
  getPageEnabledPureMetaActivities,
} from '../../libs/meta-activity/selectors';
import { MarketplaceTabConfig } from '../../libs/marketplace/types';
import {
  fetchMarketplaceSettings as fetchMarketplaceSettingsAction,
  updateMarketplaceSettings as updateMarketplaceSettingsAction,
} from '../../libs/marketplace/actions';
import { getAllPaymentPackCategory } from '../../libs/payment-packs/selectors';
import { fetchPlaylistList as fetchPlaylistListAction } from '../../libs/playlist/actions';
import { getPlaylistList } from '../../libs/playlist/selectors';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';

import WidgetGeneratorDialog from '../../libs/widget/components/WidgetGeneratorDialog.component';
import { getVideoList } from '../../libs/video/selectors';
import { fetchVideoList as fetchVideoListAction } from '../../libs/video/actions';
import MarketplaceBuilder from '../../libs/marketplace/components/builder/MarketplaceBuilder.component';
import MarketplaceTabPreview from '../../libs/marketplace/components/builder/MarketplaceTabPreview.component';
import MarketplaceTabBuilder from '../../libs/marketplace/components/builder/MarketplaceTabBuilder.component';
import { getMarketplaceSettings } from '#src/libs/marketplace/selectors';

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const MarketplaceSettingsPages: React.FC<Props> = (props: Props) => {
  const {
    fetchMarketplaceSettings,
    updateMarketplaceSettings,
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
    fetchLevelList,
    settings,
    loading,
    privateServices,
    coaches,
    establishments,
    metaActivities,
    metaActivitiesWorkshop,
    playlists,
    videoList,
    serviceGroupList,
    theme,
    paymentPackCategories,
    privatePassCategories,
    establishmentGroupList,
    giftcards,
    company,
    customLevels,
  } = props;

  const [openCreation, setOpenCreation] = useState<boolean>(false);
  const [openWidgetDialog, setOpenWidgetDialog] = useState<boolean>(false);
  const [config, setConfig] = useState<MarketplaceTabConfig[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(null);

  useEffect(() => {
    fetchMarketplaceSettings('me');
    fetchAllPrivateServices({ mine: true });
    fetchAssociatedCoachesList();
    fetchEstablishments();
    fetchActivitiesCompany(company);
    fetchVideoList({ mine: true });
    fetchPlaylistList({ mine: true });
    fetchPrivateServiceGroupList({ mine: true });
    fetchAllPaymentPackCategory();
    fetchAllPrivatePassCategory();
    fetchAllEstablishmentGroup();
    fetchGiftcardList();
    fetchLevelList({
      is_active: true,
      company,
    });
  }, [
    fetchMarketplaceSettings,
    fetchAllPrivateServices,
    fetchAssociatedCoachesList,
    fetchEstablishments,
    fetchActivitiesCompany,
    fetchVideoList,
    fetchPlaylistList,
    fetchPrivateServiceGroupList,
    fetchAllPaymentPackCategory,
    fetchAllPrivatePassCategory,
    fetchAllEstablishmentGroup,
    fetchGiftcardList,
    fetchLevelList,
    company,
  ]);

  useEffect(() => {
    if (settings && settings.config && Array.isArray(settings.config)) {
      const _config = [...settings.config];
      setConfig(_config);
    }
  }, [settings]);

  const onSubmitTab = useCallback(
    (tab: MarketplaceTabConfig) => {
      setConfig((prevState) => {
        const tabs = [...prevState];

        if (currentTab !== null) {
          tabs[currentTab] = tab;
        } else {
          tabs.push(tab);
        }

        return tabs;
      });
      setOpenCreation(false);
    },
    [currentTab],
  );

  const { t: tAll } = useTranslation();

  const onSaveConfig = useCallback(() => {
    const newSettings = {
      ...settings,
      is_custom: true,
      config: config.map((tab, i) => ({
        ...tab,
        index: tab.index !== undefined ? tab.index : i,
        title:
          tab.title || getDefaultTitleForComponent(tab.component_type, tAll),
      })),
    };

    updateMarketplaceSettings('me', newSettings);
  }, [config, settings, tAll, updateMarketplaceSettings]);

  const onCreateNewTab = useCallback(() => {
    setCurrentTab(null);
    setOpenCreation(true);
  }, []);

  const onDeleteTab = useCallback((index: number) => {
    setConfig((prevState) => prevState.filter((tab, i) => index !== i));
  }, []);

  const onEditTab = useCallback((index: number) => {
    setCurrentTab(index);
    setOpenCreation(true);
  }, []);

  const classes = useStyles();
  const { t } = useTranslation('settings');

  const DEFAULT_TAB = useMemo(
    () => ({
      componentType: EXPORTABLE_COMPONENT_TYPE_CALENDAR,
      title: t(
        `settings:marketplaceSettings.componentType.${EXPORTABLE_COMPONENT_TYPE_CALENDAR}`,
      ),
      config: getDefaultConfigByIdentifier(EXPORTABLE_COMPONENT_TYPE_CALENDAR),
    }),
    [t],
  );

  return (
    <div className={classes.container}>
      {loading && <LinearProgress />}
      {settings && settings.config && config && !loading && (
        <>
          <MarketplaceBuilder
            config={config}
            onDeleteTab={onDeleteTab}
            onEditTab={onEditTab}
            onSaveConfig={onSaveConfig}
            setConfig={setConfig}
            setCurrentTab={setCurrentTab}
            setOpenWidgetDialog={setOpenWidgetDialog}
            settings={settings}
            theme={theme}
          />
          <MarketplaceTabPreview
            settings={{ ...settings, config }}
            theme={theme}
          />
        </>
      )}

      <BottomActionsButton
        onCreate={onCreateNewTab}
        onCreateLabel={t('marketplaceSettings.addButton')}
      />

      {openCreation && (
        <MarketplaceTabBuilder
          coaches={coaches}
          customLevels={customLevels}
          establishmentGroupList={establishmentGroupList}
          establishments={establishments}
          giftcards={giftcards}
          index={currentTab !== null ? currentTab : config.length}
          metaActivities={metaActivities}
          metaActivitiesWorkshop={
            metaActivitiesWorkshop as ImmutableArray<MetaActivity>
          }
          onClose={() => setOpenCreation(false)}
          onSubmit={onSubmitTab}
          paymentPackCategories={paymentPackCategories}
          playlists={playlists || []}
          privatePassCategories={privatePassCategories}
          privateServices={privateServices}
          serviceGroupList={serviceGroupList}
          tab={currentTab !== null ? config[currentTab] : DEFAULT_TAB}
          videos={videoList}
        />
      )}

      {openWidgetDialog && (
        <WidgetGeneratorDialog
          componentType={config[currentTab].component_type}
          config={config[currentTab].config}
          configIndex={currentTab}
          onClose={() => setOpenWidgetDialog(false)}
          open={openWidgetDialog}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: theme.spacing(2),
    paddingBottom: '20vh',
  },
  saveContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  addIcon: {
    marginRight: theme.spacing(1),
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  listText: {
    marginLeft: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  paperItem: {
    width: '100%',
  },
  explain: {
    padding: theme.spacing(2),
    borderRadius: 8,
    border: '1px solid #DEDEDE',
    maxWidth: 580,
    marginBottom: theme.spacing(3),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconLeft: {
    marginRight: theme.spacing(2),
  },
}));

const mapStateToProps = (state: RootState) => ({
  settings: getMarketplaceSettings(state),
  loading: state.marketplace.loading,
  privateServices: getAvailablePrivateServices(state),
  coaches: getActiveCoaches(state),
  establishments: getAvailableEstablishmentList(state),
  metaActivities: getPageEnabledPureMetaActivities(state),
  metaActivitiesWorkshop: getEnabledWorkshops(state),
  playlists: getPlaylistList(state),
  videoList: getVideoList(state),
  serviceGroupList: getPrivateServiceGroupList(state),
  theme: state.theme.theme,
  paymentPackCategories: getAllPaymentPackCategory(state),
  privatePassCategories: getPrivatePassCategories(state),
  establishmentGroupList: groupWithEstablishment(
    getAssociatedEstablishmentGroup,
  )(state),
  giftcards: getGiftcardListEnabled(state),
  company: state.theme.theme.company,
  customLevels: getActiveCustomLevels(state),
});

const mapDispatchToProps = {
  fetchMarketplaceSettings: fetchMarketplaceSettingsAction,
  updateMarketplaceSettings: updateMarketplaceSettingsAction,
  fetchAllPrivateServices: fetchAllPrivateServicesAction,
  fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
  fetchEstablishments: fetchEstablishmentsAction,
  fetchActivitiesCompany: fetchActivitiesCompanyAction,
  fetchPlaylistList: fetchPlaylistListAction,
  fetchVideoList: fetchVideoListAction,
  fetchPrivateServiceGroupList: fetchPrivateServiceGroupListAction,
  fetchAllPaymentPackCategory: fetchAllPaymentPackCategoryAction,
  fetchAllPrivatePassCategory: fetchAllPrivatePassCategoryAction,
  fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  fetchGiftcardList: fetchGiftcardListAction,
  fetchLevelList: fetchLevelListAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  // @ts-expect-error
)(MarketplaceSettingsPages);

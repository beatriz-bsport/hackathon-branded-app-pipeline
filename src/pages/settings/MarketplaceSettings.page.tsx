import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LinearProgress } from '@material-ui/core';

import { getDefaultTitleForComponent } from '../../libs/exportable-components/utils';

import { RootState } from '../../reducers';
import {
  fetchAllPrivateServices,
  fetchPrivateServiceGroupList,
} from '../../libs/private-service/actions';
import {
  getAvailablePrivateServices,
  getPrivateServiceGroupList,
} from '../../libs/private-service/selectors/private-service';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import { fetchAllActivities } from '../../libs/meta-activity/actions';
import {
  getEnabledWorkshops,
  getPageEnabledMetaActivities,
} from '../../libs/meta-activity/selectors';
import { MarketplaceTabConfig } from '../../libs/marketplace/types';
import {
  fetchMarketplaceSettings,
  updateMarketplaceSettings,
} from '../../libs/marketplace/actions';
import { fetchPlaylistList } from '../../libs/playlist/actions';
import { getPlaylistList } from '../../libs/playlist/selectors';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';

import WidgetGeneratorDialog from '../../libs/widget/components/WidgetGeneratorDialog.component';
import { getVideoList } from '../../libs/video/selectors';
import { fetchVideoList } from '../../libs/video/actions';
import MarketplaceBuilder from '../../libs/marketplace/components/builder/MarketplaceBuilder.component';
import MarketplaceTabPreview from '../../libs/marketplace/components/builder/MarketplaceTabPreview.component';
import MarketplaceTabBuilder from '../../libs/marketplace/components/builder/MarketplaceTabBuilder.component';

const defaultTab = {
  componentType: 'calendar',
  title: '',
  config: {},
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const MarketplaceSettingsPages: React.FC<Props> = (props: Props) => {
  const [openCreation, setOpenCreation] = useState<boolean>(false);
  const [openWidgetDialog, setOpenWidgetDialog] = useState<boolean>(false);
  const [config, setConfig] = useState<MarketplaceTabConfig[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(null);

  useEffect(() => {
    props.fetchMarketplaceSettings('me');
    props.fetchAllPrivateServices({ mine: true });
    props.fetchAssociatedCoachesList();
    props.fetchEstablishments();
    props.fetchAllActivities();
    props.fetchVideoList({ mine: true });
    props.fetchPlaylistList({ mine: true });
    props.fetchPrivateServiceGroupList({ mine: true });
  }, []);

  useEffect(() => {
    if (
      props.settings &&
      props.settings.config &&
      Array.isArray(props.settings.config)
    ) {
      const _config = [...props.settings.config];
      setConfig(_config);
    }
  }, [props.settings]);

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
    [config, currentTab],
  );

  const { t: tAll } = useTranslation();

  const onSaveConfig = useCallback(() => {
    const settings = {
      ...props.settings,
      is_custom: true,
      config: config.map((tab, i) => ({
        ...tab,
        index: tab.index !== undefined ? tab.index : i,
        title:
          tab.title || getDefaultTitleForComponent(tab.component_type, tAll),
      })),
    };

    props.updateMarketplaceSettings('me', settings);
  }, [config]);

  const onCreateNewTab = useCallback(() => {
    setCurrentTab(null);
    setOpenCreation(true);
  }, []);

  const onDeleteTab = useCallback(
    (index: number) => {
      setConfig((prevState) => prevState.filter((tab, i) => index !== i));
    },
    [config],
  );

  const onEditTab = useCallback(
    (index: number) => {
      setCurrentTab(index);
      setOpenCreation(true);
    },
    [config],
  );

  const classes = useStyles();
  const { t } = useTranslation('settings');

  return (
    <div className={classes.container}>
      {props.loading && <LinearProgress style={{ width: '100%' }} />}
      {props.settings && props.settings.config && config && !props.loading && (
        <MarketplaceBuilder
          theme={props.theme}
          config={config}
          settings={props.settings}
          setConfig={setConfig}
          onEditTab={onEditTab}
          onDeleteTab={onDeleteTab}
          setCurrentTab={setCurrentTab}
          setOpenWidgetDialog={setOpenWidgetDialog}
          onSaveConfig={onSaveConfig}
        />
      )}
      <MarketplaceTabPreview theme={props.theme} config={config} />

      <BottomActionsButton
        onCreate={onCreateNewTab}
        onCreateLabel={t('marketplaceSettings.addButton')}
      />

      {openCreation && (
        <MarketplaceTabBuilder
          onSubmit={onSubmitTab}
          onClose={() => setOpenCreation(false)}
          coaches={props.coaches}
          establishments={props.establishments}
          metaActivities={props.metaActivities}
          metaActivitiesWorkshop={props.metaActivitiesWorkshop}
          privateServices={props.privateServices}
          serviceGroupList={props.serviceGroupList}
          playlists={props.playlists || []}
          videos={props.videoList}
          index={currentTab !== null ? currentTab : config.length}
          tab={currentTab !== null ? config[currentTab] : defaultTab}
        />
      )}

      {openWidgetDialog && (
        <WidgetGeneratorDialog
          open={openWidgetDialog}
          onClose={() => setOpenWidgetDialog(false)}
          componentType={config[currentTab].component_type}
          config={config[currentTab].config}
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
  settings: state.marketplace.settings,
  loading: state.marketplace.loading,
  privateServices: getAvailablePrivateServices(state),
  coaches: getActiveCoaches(state),
  establishments: getAvailableEstablishmentList(state),
  metaActivities: getPageEnabledMetaActivities(state),
  metaActivitiesWorkshop: getEnabledWorkshops(state),
  playlists: getPlaylistList(state),
  videoList: getVideoList(state),
  serviceGroupList: getPrivateServiceGroupList(state),
  theme: state.theme.theme,
});

const mapDispatchToProps = {
  fetchMarketplaceSettings,
  updateMarketplaceSettings,
  fetchAllPrivateServices,
  fetchAssociatedCoachesList,
  fetchEstablishments,
  fetchAllActivities,
  fetchPlaylistList,
  fetchVideoList,
  fetchPrivateServiceGroupList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  // @ts-ignore
)(MarketplaceSettingsPages);

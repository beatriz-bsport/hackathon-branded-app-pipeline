import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { Link } from 'react-router-dom';
import {
  LinearProgress,
  Paper,
  Button,
  ListItem,
  ListItemText,
  AppBar,
  Tabs,
  Tab,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import SaveIcon from '@material-ui/icons/Save';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

import { getMarketplaceRoute } from '../../marketplace/routing-utils';

import { RootState } from '../../../reducers';
import TabCreation from './TabCreation.component';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';
import { fetchAllPrivateServices } from '../../../libs/private-service/actions';
import { getAvailablePrivateServices } from '../../../libs/private-service/selectors/private-service';
import { fetchAssociatedCoachesList } from '../../../libs/associated-coach/actions';
import { getActiveCoaches } from '../../../libs/associated-coach/selectors';
import { fetchEstablishments } from '../../../libs/establishment/actions';
import { getAvailableEstablishmentList } from '../../../libs/establishment/selectors';
import { fetchAllActivities } from '../../../libs/meta-activity/actions';
import { getPageEnabledMetaActivities } from '../../../libs/meta-activity/selectors';
import {
  MarketplaceComponentsEnum,
  MarketplaceConfig,
  MarketplaceTabConfig,
} from '../../../libs/marketplace/types';
import {
  fetchMarketplaceSettings,
  updateMarketplaceSettings,
} from '../../../libs/marketplace/actions';
import { fetchPlaylistList } from '../../../libs/playlist/actions';
import { getPlaylistList } from '../../../libs/playlist/selectors';
import BottomActionsButton from '../../../components/button/BottomActionsButton.component';

import Config from '../../../config';

const defaultTab = {
  componentType: '',
  title: '',
  data: {},
};

const DragHandle = SortableHandle(() => <DragHandleIcon color="action" />);
const SortableItem = SortableElement((props: any) => (
  <div style={{ display: 'flex', opacity: '1', zIndex: 99999, width: '100%' }}>
    {props.children}
  </div>
));
const Container = SortableContainer((props: any) => {
  return <div>{props.children}</div>;
});

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const MarketplaceSettingsPages: React.FC<Props> = (props: Props) => {
  const [openCreation, setOpenCreation] = useState<boolean>(false);
  const [config, setConfig] = useState<MarketplaceConfig>(null);
  const [tabToEditIndex, setTabToEditIndex] = useState<number>(null);

  useEffect(() => {
    props.fetchMarketplaceSettings('me');
    props.fetchAllPrivateServices({ mine: true });
    props.fetchAssociatedCoachesList();
    props.fetchEstablishments();
    props.fetchAllActivities();
    props.fetchPlaylistList({ mine: true });
  }, []);

  useEffect(() => {
    if (props.settings && props.settings.config) {
      const _config = { ...props.settings.config };

      if (_config && !_config.tabs) {
        _config.tabs = [];
      }

      setConfig(_config);
    }
  }, [props.settings]);

  const onSubmitTab = useCallback(
    (tab: MarketplaceTabConfig) => {
      setConfig((prevState) => {
        const tabs = [...prevState.tabs];

        if (tabToEditIndex !== null) {
          tabs[tabToEditIndex] = tab;
        } else {
          tabs.push(tab);
        }

        return {
          ...prevState,
          tabs,
        };
      });
      setOpenCreation(false);
    },
    [config, tabToEditIndex],
  );

  const onSaveConfig = useCallback(() => {
    props.updateMarketplaceSettings('me', {
      ...props.settings,
      config: {
        ...config,
        custom: true,
      },
    });
  }, [config]);

  const onCreateNewTab = useCallback(() => {
    setTabToEditIndex(null);
    setOpenCreation(true);
  }, []);

  const onDeleteTab = useCallback(
    (index: number) => {
      setConfig((prevState) => ({
        ...prevState,
        tabs: prevState.tabs.filter((tab, i) => index !== i),
      }));
    },
    [config],
  );

  const onEditTab = useCallback(
    (index: number) => {
      setTabToEditIndex(index);
      setOpenCreation(true);
    },
    [config],
  );

  const onSortEnd = useCallback(
    (e: { oldIndex: number; newIndex: number }) => {
      const tabs = [...config.tabs];
      const temp = { ...tabs[e.oldIndex] };
      tabs[e.oldIndex] = { ...tabs[e.newIndex] };
      tabs[e.newIndex] = temp;
      setConfig({ ...config, tabs });
    },
    [config],
  );

  const { t: tAll } = useTranslation();

  const getDefaultTitleForComponent = (
    componentType: MarketplaceComponentsEnum,
  ) => {
    const obj = {
      [MarketplaceComponentsEnum.calendar]: tAll('marketplace.calendar'),
      [MarketplaceComponentsEnum.workshop]: tAll('marketplace.workshop'),
      [MarketplaceComponentsEnum.privateService]: tAll(
        'marketplace.private_service',
      ),
      [MarketplaceComponentsEnum.pass]: tAll('marketplace.pass'),
      [MarketplaceComponentsEnum.vod]: tAll('marketplace.vod'),
      [MarketplaceComponentsEnum.subscription]: tAll(
        'marketplace.contract.tabName',
      ),
      [MarketplaceComponentsEnum.shop]: tAll('marketplace.shop.tabName'),
      [MarketplaceComponentsEnum.playlist]: tAll('marketplace.playlist'),
    };

    return obj[componentType];
  };

  const classes = useStyles();
  const { t } = useTranslation('settings');

  return (
    <div className={classes.container}>
      {props.loading && <LinearProgress style={{ width: '100%' }} />}
      {props.settings && props.settings.config && config && !props.loading && (
        <>
          <div className={classes.marginTop} />
          <div className={classes.explain}>
            <div className={classes.row}>
              <InfoOutlinedIcon className={classes.iconLeft} />
              <Typography>
                {t('marketplaceSettings.explainMarketplace')}
              </Typography>
            </div>
            <Link
              style={{ textDecoration: 'none' }}
              to={getMarketplaceRoute(
                props.theme.company_name,
                props.theme.company,
              )}
            >
              <Button
                color="secondary"
                style={{
                  marginTop: 16,
                }}
                variant="outlined"
              >
                {t('marketplaceSettings.link')}
              </Button>
            </Link>
          </div>
          <Container
            useDragHandle
            hideSortableGhost={false}
            onSortEnd={onSortEnd}
          >
            {config.tabs.map((tab, i) => (
              <SortableItem index={i} key={i}>
                <Paper className={classes.paperItem}>
                  <ListItem divider alignItems="center" dense>
                    <DragHandle />

                    <ListItemText
                      className={classes.listText}
                      primary={tab.title}
                      secondary={t(
                        `marketplaceSettings.componentType.${tab.componentType}`,
                      )}
                    />

                    <ListItemResponsiveAction
                      actions={[
                        {
                          icon: EditIcon,
                          label: t('serviceGroup.edit'),
                          color: 'primary',
                          onClick: () => onEditTab(i),
                        },
                        {
                          icon: DeleteIcon,
                          label: t('serviceGroup.delete'),
                          onClick: () => onDeleteTab(i),
                        },
                      ]}
                    />
                  </ListItem>
                </Paper>
              </SortableItem>
            ))}
          </Container>

          <div className={classes.saveContainer}>
            <Button
              color="primary"
              onClick={onSaveConfig}
              variant="contained"
              disabled={isEqual(config, props.settings.config)}
            >
              <SaveIcon className={classes.addIcon} />
              {t('marketplaceSettings.saveButton')}
            </Button>
          </div>

          <BottomActionsButton
            onCreate={onCreateNewTab}
            onCreateLabel={t('marketplaceSettings.addButton')}
          />

          <div className={classes.marginTop}>
            <Typography>{t('marketplaceSettings.preview')}</Typography>

            <AppBar
              position="relative"
              color="default"
              className={classes.marginTop}
            >
              <Tabs
                onChange={() => null}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                value={-1}
              >
                {config.tabs.map((tab, i) => {
                  if (
                    tab.componentType === MarketplaceComponentsEnum.vod &&
                    !(
                      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
                      props.theme.vod
                    )
                  ) {
                    return null;
                  }

                  let { title } = tab;
                  if (!title) {
                    title = getDefaultTitleForComponent(tab.componentType);
                  }

                  return <Tab value={i} label={title} />;
                })}
              </Tabs>
            </AppBar>
          </div>

          {/** EDIT FORM DIALOG */}
          {openCreation && (
            <TabCreation
              onSubmit={onSubmitTab}
              onClose={() => setOpenCreation(false)}
              coaches={props.coaches}
              establishments={props.establishments}
              metaActivities={props.metaActivities}
              privateServices={props.privateServices}
              playlists={props.playlists}
              tab={
                tabToEditIndex !== null
                  ? config.tabs[tabToEditIndex]
                  : defaultTab
              }
            />
          )}
        </>
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
  playlists: getPlaylistList(state),
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  // @ts-ignore
)(MarketplaceSettingsPages);

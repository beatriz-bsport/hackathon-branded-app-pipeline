import React from 'react';
// External Libs
import { push as pushAction } from 'connected-react-router';
import { useTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
// HOCS
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
import withTitle from '#src/hocs/with-title.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

// Types
import { RootState } from '#src/reducers';
import { OptionCallback } from '#src/state/types';
import type { CommunicationSentGroupConfig } from '#src/libs/communication/types';

// Redux Actions
import {
  createCommunicationSentGroupConfig as createCommunicationSentGroupConfigAction,
  deleteCommunicationSentGroupConfig as deleteCommunicationSentGroupConfigAction,
  fetchCommunicationSentGroupConfigsPaginatedList as fetchCommunicationSentGroupConfigsPaginatedListAction,
  updateCommunicationSentGroupConfig as updateCommunicationSentGroupConfigAction,
  duplicateCommunicationSentGroupConfig as duplicateCommunicationSentGroupConfigAction,
} from '#src/libs/communication/actions';

// Redux Selectors
import {
  getCommunicationSentGroupConfigFromPaginatedState,
  getCommunicationSentGroupConfigsPaginated,
} from '#src/libs/communication/selectors';

// Components
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
// @ts-expect-error
import SmartListCard from '#src/libs/smart-list/components/SmartlistCard.component';
// @ts-expect-error
import SmartListFormDialog from '#src/libs/smart-list/components/SmartListFormDialog.component';
import BottomActionButtons from '#src/components/button/BottomActionsButton.component';
import PaginatedListBaseReworked from '#src/components/PaginatedListBaseReworked.component';
import CommunicationSentGroupConfigListItem from '#src/libs/communication/components/communication-sent-group-config/CommunicationSentGroupConfigListing/CommunicationSentGroupConfigListItem.component';
import CommunicationSentGroupConfigSearchItem from '#src/libs/communication/components/communication-sent-group-config/CommunicationSentGroupConfigListing/CommunicationSentGroupConfigSearchItem.component';

import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';

type RouterProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  campaignId: number;
  setQueryParams: (queryName: string) => (queryValue: boolean) => void;
  selectedId: number;
};

type Props = RouterProps & ConnectedProps<typeof connector>;

// @debt(impact: 1, easy: 1, contagion: 1)
// This component shouldn't exist, and proper API error handling should be performed
// to help the user understand that a unique name must be used.
const UniqueCampaignNameAlert: React.FC = () => {
  const { t } = useTranslation('campaign');
  return (
    <Alert severity="info" style={{ alignItems: 'center' }}>
      <AlertTitle>{t('detail.tab.general')}</AlertTitle>
      {t('campaignCreationWarning')}
    </Alert>
  );
};
const CommunicationSentGroupConfigList: React.FC<Props> = ({
  communicationSentGroupConfigsPaginatedState,
  createCommunicationSentGroupConfig,
  deleteCommunicationSentGroupConfig,
  duplicateCommunicationSentGroupConfig,
  fetchAllCommunicationSentGroupConfigPaginated,
  goToCampaignHistory,
  goToSelected,
  goToCampaignDetailPage,
  selectedId,
  setQueryParams,
  updateCommunicationSentGroupConfig,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('campaign');
  const [openCreationDialog, setOpenCreationDialog] = React.useState(false);
  const [selectedForEdit, setSelectedForEdit] =
    React.useState<CommunicationSentGroupConfig | null>(null);

  const [selected, setSelected] =
    React.useState<CommunicationSentGroupConfig | null>(null);

  const handleOpenCreationDialog = React.useCallback(
    () => setOpenCreationDialog(true),
    [],
  );
  const handleCloseCreationDialog = React.useCallback(
    () => setOpenCreationDialog(false),
    [],
  );

  const handleCloseEditionDialog = React.useCallback(
    () => setSelectedForEdit(null),
    [],
  );

  const handleOpenEditionDialog = React.useCallback(
    () => setSelectedForEdit(selected),
    [selected],
  );

  const handlSetSelected = React.useCallback(
    (id: number) => {
      const _selected = communicationSentGroupConfigsPaginatedState.byId[id];
      if (!!_selected) {
        setSelected(_selected);
        goToSelected(id);
      } else {
        setSelected(null);
      }
    },
    [communicationSentGroupConfigsPaginatedState, goToSelected],
  );

  const handleAddNewCommunicationSentGroupConfig = React.useCallback(
    (
      communicationSentGroupConfig: Omit<CommunicationSentGroupConfig, 'id'>,
      options?: OptionCallback,
    ) => {
      createCommunicationSentGroupConfig(
        { ...communicationSentGroupConfig, to_all_members: true },
        {
          onSuccess: (
            newCommunicationSentGroupConfig: CommunicationSentGroupConfig,
          ) => {
            options?.onSuccess?.();
            goToCampaignDetailPage(newCommunicationSentGroupConfig.id);
          },
        },
      );
      handleCloseCreationDialog();
      setQueryParams('create')(false);
    },
    [
      createCommunicationSentGroupConfig,
      goToCampaignDetailPage,
      handleCloseCreationDialog,
      setQueryParams,
    ],
  );

  const handleUpdateCommunicationSentGroupConfig = React.useCallback(
    (communicationSentGroupConfig: CommunicationSentGroupConfig) => {
      handleCloseCreationDialog();
      updateCommunicationSentGroupConfig(selectedId, {
        ...communicationSentGroupConfig,
        ...(selected.to_all_members
          ? {
              to_all_members: selected.to_all_members,
            }
          : {
              smartlists: selected.smartlists,
            }),
      });
    },
    [
      handleCloseCreationDialog,
      selected,
      selectedId,
      updateCommunicationSentGroupConfig,
    ],
  );

  const handleDeleteCommunicationSentGroupConfig = React.useCallback(
    (id: number) => {
      deleteCommunicationSentGroupConfig(id, {
        onSuccess: () =>
          fetchAllCommunicationSentGroupConfigPaginated({ page: 1 }),
      });
    },
    [
      deleteCommunicationSentGroupConfig,
      fetchAllCommunicationSentGroupConfigPaginated,
    ],
  );

  const handleGoToCampaignDetailPage = React.useCallback(
    (id: number) => goToCampaignDetailPage(id),
    [goToCampaignDetailPage],
  );

  const handleDuplicateCommunicationSentGroupConfig = React.useCallback(
    (id: number) =>
      duplicateCommunicationSentGroupConfig(id, {
        onSuccess: (
          communicationSentGroupConfig: CommunicationSentGroupConfig,
        ) =>
          fetchAllCommunicationSentGroupConfigPaginated(
            { page: 1 },
            {
              onSuccess: () =>
                goToCampaignDetailPage(communicationSentGroupConfig.id),
            },
          ),
      }),
    [
      duplicateCommunicationSentGroupConfig,
      fetchAllCommunicationSentGroupConfigPaginated,
      goToCampaignDetailPage,
    ],
  );

  // Enabling automatic selection when id in url
  React.useEffect(() => {
    selectedId && handlSetSelected(selectedId);

    return () => handlSetSelected(null);
  }, [selectedId, handlSetSelected]);

  const noExistingConfig =
    !communicationSentGroupConfigsPaginatedState.loading &&
    !communicationSentGroupConfigsPaginatedState.count;

  const formatSearchOptions = React.useCallback(
    (searchResults: CommunicationSentGroupConfig[]) => {
      return searchResults.map((result) => ({
        label: result.name,
        value: result.id,
        onClick: () => goToCampaignDetailPage(result.id),
      }));
    },
    [goToCampaignDetailPage],
  );

  return (
    <>
      <IsEmptyList
        button={t('campaign.add')}
        hideEmptyText={!noExistingConfig}
        onCreate={handleOpenCreationDialog}
        onCreateLabel={t('campaign.add')}
        text={t('noCampaign')}
      />
      <Grid container direction="row" spacing={3}>
        <Grid item md={6} xs={12}>
          {!noExistingConfig && (
            <ObjectSearchComponent
              className={classes.searchComponent}
              components={{ Option: CommunicationSentGroupConfigSearchItem }}
              optionsFormatter={formatSearchOptions}
              placeholder={t('search')}
              searchedObjectType="communication_sent_group_config"
              variant="default"
            />
          )}
          <PaginatedListBaseReworked
            hideDefaultEmptyComponent
            itemPerPage={communicationSentGroupConfigsPaginatedState.page_size}
            items={communicationSentGroupConfigsPaginatedState.items}
            loading={communicationSentGroupConfigsPaginatedState.loading}
            nbItems={communicationSentGroupConfigsPaginatedState.count}
            onPageRequested={fetchAllCommunicationSentGroupConfigPaginated}
            page={communicationSentGroupConfigsPaginatedState.page}
            renderItem={(
              communicationSentGroupConfig: CommunicationSentGroupConfig,
            ) => (
              <CommunicationSentGroupConfigListItem
                key={communicationSentGroupConfig.id}
                communicationSentGroupConfig={communicationSentGroupConfig}
                onClick={handlSetSelected}
                onClickDelete={handleDeleteCommunicationSentGroupConfig}
                onClickDuplicate={handleDuplicateCommunicationSentGroupConfig}
                onClickEdit={handleGoToCampaignDetailPage}
                selected={communicationSentGroupConfig?.id === selected?.id}
              />
            )}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <SmartListCard
            onClickCampaign={goToCampaignHistory}
            onClickConfigure={handleGoToCampaignDetailPage}
            onEdit={handleOpenEditionDialog}
            smartlist={selected}
          />
        </Grid>
      </Grid>
      {openCreationDialog && (
        <SmartListFormDialog
          fullScreen
          isFranchisor
          onCancel={handleCloseCreationDialog}
          open={openCreationDialog}
          smartlist={null}
          updateSmartList={handleAddNewCommunicationSentGroupConfig}
        >
          <UniqueCampaignNameAlert />
        </SmartListFormDialog>
      )}

      {selectedForEdit && (
        <SmartListFormDialog
          fullScreen
          isFranchisor
          onCancel={handleCloseEditionDialog}
          open={!!selectedForEdit}
          smartlist={selectedForEdit}
          updateSmartList={handleUpdateCommunicationSentGroupConfig}
        >
          <UniqueCampaignNameAlert />
        </SmartListFormDialog>
      )}
      {/* Mandatoory condition to avoid duplicate bottom actions due to EmptyList component */}
      {!noExistingConfig && (
        <BottomActionButtons
          onCreate={handleOpenCreationDialog}
          onCreateLabel={t('campaign.add')}
        />
      )}
    </>
  );
};

const mapStateToProps = (
  state: RootState,
  { selectedId }: { selectedId: number },
) => ({
  communicationSentGroupConfigsPaginatedState:
    getCommunicationSentGroupConfigsPaginated(state),
  communicationSentGroupConfigSelected:
    getCommunicationSentGroupConfigFromPaginatedState(state, selectedId),
  loading:
    state.communicationSentGroupConfig.communicationSentGroupConfig.loading,
});

const mapDispatchToProps = {
  fetchAllCommunicationSentGroupConfigPaginated:
    fetchCommunicationSentGroupConfigsPaginatedListAction,
  createCommunicationSentGroupConfig: createCommunicationSentGroupConfigAction,
  updateCommunicationSentGroupConfig: updateCommunicationSentGroupConfigAction,
  deleteCommunicationSentGroupConfig: deleteCommunicationSentGroupConfigAction,
  duplicateCommunicationSentGroupConfig:
    duplicateCommunicationSentGroupConfigAction,
  goToCampaignHistory: (id: number) =>
    pushAction(`/f/marketing/campaign/${id}/history`),
  goToSelected: (id: number) => pushAction(`/f/marketing/campaign/${id}`),
  goToCampaignDetailPage: (id: number) =>
    pushAction(`/f/marketing/campaign/${id}/general`),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  routerParamsToProps({ campaignId: 'selectedId:number' }),
  withTranslation(['campaign']),
  withTitle(({ t }: { t: TFunction }) =>
    t('navigation:franchiseMenu.marketing.campaigns'),
  ),
  withQueryParams([['create'], 'queryParams', 'setQueryParams']),
  connector,
)(CommunicationSentGroupConfigList);

const useStyles = makeStyles((theme) => ({
  searchComponent: {
    paddingBottom: theme.spacing(2),
  },
}));

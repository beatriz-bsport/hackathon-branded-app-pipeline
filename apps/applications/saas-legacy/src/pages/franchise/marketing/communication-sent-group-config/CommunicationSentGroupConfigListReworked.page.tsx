import React from 'react';
// External Libs
import { push as pushAction } from 'connected-react-router';
import { useTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';

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
import { Grid } from '@material-ui/core';
// @ts-expect-error
import SmartListCard from '#src/libs/smart-list/components/SmartlistCard.component';
// @ts-expect-error
import SmartListFormDialog from '#src/libs/smart-list/components/SmartListFormDialog.component';
import BottomActionButtons from '#src/components/button/BottomActionsButton.component';
import PaginatedListBaseReworked from '#src/components/PaginatedListBaseReworked.component';
import CommunicationSentGroupConfigListItem from '#src/libs/communication/components/communication-sent-group-config/CommunicationSentGroupConfigListing/CommunicationSentGroupConfigListItem.component';

type RouterProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  campaignId: number;
  setQueryParams: (queryName: string) => (queryValue: boolean) => void;
  selectedId: number;
};

type Props = RouterProps & ConnectedProps<typeof connector>;

const CommunicationSentGroupConfigListReworked: React.FC<Props> = ({
  communicationSentGroupConfigsPaginatedState,
  createCommunicationSentGroupConfig,
  deleteCommunicationSentGroupConfig,
  duplicateCommunicationSentGroupConfig,
  fetchAllCommunicationSentGroupConfigPaginated,
  goToEdit,
  goToSelected,
  goToSelectedCommunicationSentGroupConfig,
  selectedId,
  setQueryParams,
  updateCommunicationSentGroupConfig,
}) => {
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

  const handleAddNewCommunicationSentGroupConfig = (
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
          goToEdit(newCommunicationSentGroupConfig.id);
        },
      },
    );
    handleCloseCreationDialog();
    setQueryParams('create')(false);
  };

  const handleUpdateCommunicationSentGroupConfig = (
    communicationSentGroupConfig: CommunicationSentGroupConfig,
  ) => {
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
  };

  const handleDeleteCommunicationSentGroupConfig = (id: number) => {
    deleteCommunicationSentGroupConfig(id, {
      onSuccess: () =>
        fetchAllCommunicationSentGroupConfigPaginated({ page: 1 }),
    });
  };
  const handleDuplicateCommunicationSentGroupConfig = (id: number) =>
    duplicateCommunicationSentGroupConfig(id, {
      onSuccess: (communicationSentGroupConfig: CommunicationSentGroupConfig) =>
        fetchAllCommunicationSentGroupConfigPaginated(
          { page: 1 },
          { onSuccess: () => goToEdit(communicationSentGroupConfig.id) },
        ),
    });

  // Enabling automatic selection when id in url
  React.useEffect(() => {
    selectedId && handlSetSelected(selectedId);

    return () => handlSetSelected(null);
  }, [selectedId, handlSetSelected]);

  return (
    <>
      <Grid container direction="row" spacing={3}>
        <Grid item md={6} xs={12}>
          <PaginatedListBaseReworked
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
                onClickEdit={() => goToEdit(communicationSentGroupConfig.id)}
                selected={communicationSentGroupConfig?.id === selected?.id}
              />
            )}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <SmartListCard
            onClickCampaign={goToSelectedCommunicationSentGroupConfig}
            onClickConfigure={goToEdit}
            onEdit={() => setSelectedForEdit(selected)}
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
        />
      )}

      {selectedForEdit && (
        <SmartListFormDialog
          fullScreen
          isFranchisor
          onCancel={handleCloseEditionDialog}
          open={!!selectedForEdit}
          smartlist={selectedForEdit}
          updateSmartList={handleUpdateCommunicationSentGroupConfig}
        />
      )}
      <BottomActionButtons
        onCreate={handleOpenCreationDialog}
        onCreateLabel={t('campaign.add')}
      />
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
  goToEdit: (id: number) => pushAction(`/f/marketing/campaign/${id}/general`),
  goToSelected: (id: number) => pushAction(`/f/marketing/campaign/${id}`),
  goToSelectedCommunicationSentGroupConfig: (id: number) =>
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
)(CommunicationSentGroupConfigListReworked);

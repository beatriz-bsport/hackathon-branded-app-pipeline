import React, { useEffect, useState, useCallback } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  isWidthDown,
  isWidthUp,
  makeStyles,
  MenuItem,
  Theme,
  Typography,
  DialogTitle,
  DialogContentText,
  DialogActions,
  LinearProgress,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import InfoIcon from '@material-ui/icons/Info';
import Select from '@material-ui/core/Select';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

import GroupedOfferCreateForm from '#libs/group-offer/components/GroupedOfferCreateForm.drawer';
import GroupedOfferEditDrawer from '#libs/group-offer/components/GroupedOfferEdit.drawer';
import GroupedOfferDuplicate from '#libs/group-offer/components/GroupedOfferDuplicateForm.drawer';
import GroupedOfferDeleteDialog from '#libs/group-offer/components/GroupedOfferDelete.dialog';

import IsEmptyList from '#components/navigation/IsEmptyList.component';
import OfferCard from '#components/offer/OfferCard.component';
import MetaActivityGroupsFilter from '#libs/meta-activity/components/MetaActivityGroupsFilter.component';
import GroupCard from '#libs/group-offer/components/GroupCard.component';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import OfferEditForm from '#libs/offer/OfferEditForm.component';
import { Offer } from '#libs/offer/types';
import DeleteOfferForm from '#libs/offer/DeleteOfferForm.component';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';

import usePagination from '../../hooks/usePagination';
import { OffersGroup, OffersGroupFilter } from '#libs/group-offer/types';
import { workshopActivityGroupConnector } from './WorkshopActivityGroup.page';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

type Props = ConnectedProps<typeof workshopActivityGroupConnector> & {
  width: Breakpoint;
  selectedOfferId: number;
  metaActivityId: number;
  filter: OffersGroupFilter;
  setWorkshopGroupFilter: (filter: OffersGroupFilter) => void;
  pageHeight: number;
};

const WorkshopActivityGroup: React.FC<Props> = ({
  metaActivities,
  metaActivityLoading,
  filter,
  groupList,
  groupListCount,
  groupListLoading,
  groupExistLoading,
  groupExist,
  similarGroups,
  theme,
  coaches,
  availableEstablishments,
  allEstablishments,
  allRoomBlueprints,
  availableRoomBlueprints,
  coachPaymentRulesByKind,
  allTagsWithTagGroup,
  width,
  groupPreview,
  customLevels,
  companyId,
  selectedOffer,
  showVaccinationStatus,
  bookings,
  bookingsLoading,
  members,
  membersLoading,
  getOffersListByGroup,
  selectedOfferId,
  allCustomLevels,
  coachesLoading,
  similarOffers,
  editOfferProcessing,
  similarOfferLoading,
  establishmentsLoading,
  similarLoading,
  metaActivityId,
  metaActivity,
  pageHeight,
  zoomAppDetail,
  hardDeleteOffers,
  restoreOffer,
  fetchSimilarOffers,
  editOffers,
  fetchGroupsOfferList,
  generateGroupOffersPreview,
  fetchGroupOffer,
  createGroupOffers,
  editGroupOffer,
  deleteGroupOffer,
  fetchSimilarGroupOffers,
  fetchEstablishments,
  fetchMetaActivityBulk,
  fetchAssociatedCoachesList,
  fetchRoomBlueprints,
  fetchAllCoachPaymentRules,
  fetchMetaActivities,
  fetchExistingGroupOffer,
  setWorkshopGroupFilter,
  fetchBookedGenderBulk,
  snackbarSuccess,
  fetchFilteredMembers,
  fetchBookingsByOffer,
  fetchOfferBulk,
  disableOffer,
  fetchLevelList,
  updateLevel,
  createLevel,
  deleteLevel,
  resetPreview,
  push,
  fetchZoomApp,
  fetchSimilarOffersWithReset,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<OffersGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<OffersGroup | null>(null);
  const [duplicatingGroup, setDuplicatingGroup] = useState<OffersGroup | null>(
    null,
  );

  const [editOfferModalOpen, setEditOfferModalOpen] = useState(false);
  const [deleteOfferModalOpen, setDeleteOfferModalOpen] = useState(false);
  const [deleteImpossibleModalOpen, setDeleteImpossibleModalOpen] =
    useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);

  const fetchGroups = useCallback(
    (page: number, page_size: number) => {
      fetchGroupsOfferList(
        {
          ...filter,
          page,
          page_size,
          available: true,
          ...(metaActivityId ? { meta_activity__in: [metaActivityId] } : {}),
        },
        {
          onSuccess: (data) => {
            fetchOfferBulk(data.results.flatMap((go) => go.offers));
          },
        },
      );
    },
    [filter, metaActivityId, fetchGroupsOfferList, fetchOfferBulk],
  );

  const handleFetchLevel = useCallback(() => {
    fetchLevelList({
      company: companyId,
    });
  }, [companyId, fetchLevelList]);

  const { page, pageSize, handleSetPage, handleSetPageSize, resetPage } =
    usePagination(1, PAGE_SIZE_OPTIONS[0], fetchGroups);

  // CDM
  useEffect(() => {
    fetchEstablishments();
    fetchAssociatedCoachesList();
    fetchRoomBlueprints();
    fetchAllCoachPaymentRules();
    fetchMetaActivities();
    handleFetchLevel();
    fetchExistingGroupOffer();
    fetchZoomApp(companyId);
    setWorkshopGroupFilter({
      ...filter,
      min_date: moment().format('YYYY-MM-DD'),
    });
    if (metaActivityId) {
      fetchMetaActivityBulk([metaActivityId]);
    }
    // no min_date in effect manage in another function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleFetchLevel,
    fetchAllCoachPaymentRules,
    fetchAssociatedCoachesList,
    fetchEstablishments,
    fetchRoomBlueprints,
    fetchMetaActivities,
    fetchExistingGroupOffer,
    fetchMetaActivityBulk,
    setWorkshopGroupFilter,
    metaActivityId,
    companyId,
  ]);

  useEffect(() => {
    if (selectedOfferId) {
      fetchOfferBulk([selectedOfferId], {
        onSuccess: (offers) => {
          fetchGroupOffer(offers?.[0]?.group);
        },
      });
      fetchBookedGenderBulk([selectedOfferId]);
      fetchFilteredMembers({
        offer: selectedOfferId,
        withNotes: true,
      });
      fetchBookingsByOffer(selectedOfferId);
    }
  }, [
    selectedOfferId,
    fetchFilteredMembers,
    fetchBookedGenderBulk,
    fetchBookingsByOffer,
    fetchGroupOffer,
    fetchOfferBulk,
  ]);

  // Group offer Modal management and call
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleCreateGroup = (data: {
    group_data_with_offers: Record<
      number,
      {
        offers_data: Offer<number, number, number, number, number, number>[];
        group: OffersGroup<
          Offer<number, number, number, number, number, number>
        >;
      }
    >;
  }) => {
    createGroupOffers(data, {
      onSuccess: () => {
        handleCloseCreateModal();
        handleCloseDuplicateGroupModal();
      },
      onBackgroundSuccess: () => {
        fetchGroups(page, pageSize);
      },
      onError: () => {
        handleCloseCreateModal();
      },
    });
  };

  const handleOpenEditGroupModal = (offerGroup: OffersGroup) => {
    setEditingGroup(offerGroup);
  };

  const handleCloseEditGroupModal = () => {
    setEditingGroup(null);
  };

  const handleEditGroup = (data: {
    level: number;
    name: string;
    allow_booking_after_start: boolean;
    full_booking_only: boolean;
    manager_only: boolean;
    whitelist_tags: number[];
    blacklist_tags: number[];
  }) => {
    editGroupOffer(editingGroup.id, data, {
      onSuccess: () => {
        handleCloseEditGroupModal();
      },
      onBackgroundSuccess: () => {
        fetchGroups(page, pageSize);
      },
    });
  };

  const handleOpenDeleteGroupModal = (offerGroup: OffersGroup) => {
    setDeletingGroup(offerGroup);
  };

  const handleCloseDeleteGroupModal = () => {
    setDeletingGroup(null);
  };

  const handleDeleteGroup = (data: {
    notify: boolean;
    similarIds: number[];
  }) => {
    deleteGroupOffer(
      deletingGroup.id,
      {
        notify_if_cancelled: data.notify,
        similar_group_ids: data.similarIds,
      },
      {
        onSuccess: () => {
          handleCloseDeleteGroupModal();
        },
        onBackgroundSuccess: () => {
          fetchGroups(1, pageSize);
        },
      },
    );
  };

  const handleOpenDuplicateGroupModal = (offerGroup: OffersGroup) => {
    setDuplicatingGroup(offerGroup);
  };

  const handleCloseDuplicateGroupModal = () => {
    setDuplicatingGroup(null);
  };

  // Offer Modal management & Call
  const navigateToOffer = (offerId: number) => {
    push(`/offer/${offerId}`);
  };

  const handleSelectOffer = (offerId: number) => {
    if (metaActivityId) {
      push(`/workshop-activity/${metaActivityId}/group/${offerId}`);
      return;
    }
    push(`/workshop-activity/tabs/groups/${offerId}`);
  };

  const resetOffer = () => {
    if (metaActivityId) {
      push(`/workshop-activity/${metaActivityId}/group`);
      return;
    }
    push(`/workshop-activity/tabs/groups`);
  };

  const handleOpenOfferEditModal = () => {
    setEditOfferModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditOfferModalOpen(false);
  };

  const onEditOffer = ({ offerId, data }: { offerId: number; data: Offer }) => {
    editOffers(offerId, data, {
      onSuccess: () => {
        handleCloseEditModal();
      },
      onError: () => {
        handleCloseEditModal();
      },
      onBackgroundSuccess: () => {
        fetchOfferBulk([
          selectedOfferId,
          ...(data?.custom_selection_ids ?? []),
        ]);
      },
    });
  };

  const handleOpenOfferDeleteModal = () => {
    setDeleteOfferModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOfferModalOpen(false);
  };

  const handleOpenOfferDeleteImpossibleModal = () => {
    setDeleteImpossibleModalOpen(true);
  };

  const handleCloseDeleteImpossibleModal = () => {
    setDeleteImpossibleModalOpen(false);
  };

  const handleCancelOffer = (data: {
    cashback?: boolean;
    notify?: boolean;
    deleteAll?: boolean;
    custom_selection?: boolean;
    custom_selection_ids?: Array<number>;
    force: boolean;
  }) => {
    disableOffer(
      {
        ...data,
        offerId: selectedOfferId,
      },
      {
        onSuccess: () => {
          handleCloseDeleteModal();
        },
        onBackgroundSuccess: () => {
          fetchOfferBulk([
            selectedOfferId,
            ...(data?.custom_selection_ids ?? []),
          ]);
        },
        onError: () => {
          handleCloseDeleteModal();
        },
      },
    );
  };

  const handleDeleteOffer = (data: any) => {
    hardDeleteOffers(selectedOfferId, data, {
      onSuccess: () => {
        handleCloseDeleteModal();
      },
      onBackgroundSuccess: () => {
        fetchOfferBulk([
          selectedOfferId,
          ...(data?.custom_selection_ids ?? []),
        ]);
        fetchGroups(1, pageSize);
      },
    });
  };

  const handleOpenOfferRestoreModal = () => {
    setRestoreModalOpen(true);
  };

  const handleCloseRestoreModal = () => {
    setRestoreModalOpen(false);
  };

  const handleRestoreOffer = () => {
    restoreOffer(selectedOfferId, {
      onSuccess: () => {
        handleCloseRestoreModal();
        fetchOfferBulk([selectedOfferId]);
      },
    });
  };

  if (groupExistLoading) {
    return <BackofficeLinearProgress />;
  }

  const hideEmptyState = groupExist || groupList.length > 0;

  const _metaActivities = metaActivity ? [metaActivity] : metaActivities;

  return (
    <div className={classes.container}>
      <div style={pageHeight ? { maxHeight: pageHeight } : {}}>
        <Grid container spacing={3}>
          {isWidthDown('md', width) && selectedOffer && (
            <Button
              size="small"
              className={classes.button}
              onClick={resetOffer}
            >
              <KeyboardArrowLeft />
              {t('workshop:group.backToGroup')}
            </Button>
          )}

          {(isWidthUp('lg', width) || !selectedOffer) && !!hideEmptyState && (
            <Grid item xs={12} lg={6}>
              <MetaActivityGroupsFilter
                metaActivities={[..._metaActivities]}
                filter={filter}
                isLoading={metaActivityLoading}
                onChange={(_filter) => {
                  setWorkshopGroupFilter(_filter);
                  resetPage();
                }}
                withoutMetaActivity={!!metaActivityId}
              />
              <div className={classes.pageSizeSelect}>
                <Typography color="textSecondary">
                  {t('workshop:group.pageSize')}
                </Typography>
                <Select
                  value={pageSize}
                  onChange={(
                    ev: React.ChangeEvent<{
                      value: number;
                    }>,
                  ) => {
                    handleSetPageSize(ev.target.value);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((ps) => (
                    <MenuItem key={ps} value={ps}>
                      {ps}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              {groupListLoading && <LinearProgress />}
              {!groupListLoading && (
                <>
                  {groupListCount === 0 && (
                    <Typography
                      color="textSecondary"
                      className={classes.emptyState}
                    >
                      {t('workshop:group.emptySearch')}
                    </Typography>
                  )}
                  <div className={classes.list}>
                    {groupList.map((group) => (
                      <GroupCard
                        key={group.id}
                        group={group}
                        metaActivity={_metaActivities.find(
                          (m) => m.id === group.meta_activity,
                        )}
                        offers={getOffersListByGroup(group.id)}
                        offerSelected={selectedOffer?.id}
                        onSelect={handleSelectOffer}
                        onEdit={handleOpenEditGroupModal}
                        onCopy={handleOpenDuplicateGroupModal}
                        onDelete={handleOpenDeleteGroupModal}
                      />
                    ))}
                  </div>
                </>
              )}

              {Math.ceil(groupListCount / pageSize) > 1 && (
                <div className={classes.pagination}>
                  <Pagination
                    count={Math.ceil(groupListCount / pageSize)}
                    page={page}
                    onChange={(_, _page) => {
                      handleSetPage(_page);
                    }}
                    shape="round"
                  />
                </div>
              )}
            </Grid>
          )}
          {!!hideEmptyState && (
            <Grid item xs={12} lg={6}>
              {selectedOffer ? (
                <div className={classes.offerCard}>
                  <OfferCard
                    snackbarSuccess={snackbarSuccess}
                    offer={selectedOffer}
                    companyId={companyId}
                    goToOfferManagement={navigateToOffer}
                    members={members}
                    membersLoading={membersLoading || !members}
                    bookings={bookings}
                    bookingsLoading={bookingsLoading || !bookings}
                    showOfferGender={theme?.show_booked_gender_offer}
                    showVaccinationStatus={showVaccinationStatus}
                    onEditButtonClick={handleOpenOfferEditModal}
                    onDeleteButtonClick={handleOpenOfferDeleteModal}
                    onRestoreButtonClick={handleOpenOfferRestoreModal}
                    onModifyTags={handleOpenOfferEditModal}
                  />
                </div>
              ) : (
                <div className={classes.emptySelect}>
                  <InfoIcon color="disabled" className={classes.info} />
                  <div>
                    <Typography color="textSecondary" variant="body1">
                      {t('workshop:group.emptySelect')}
                    </Typography>
                  </div>
                </div>
              )}
            </Grid>
          )}
        </Grid>
        <IsEmptyList
          text={t('workshop:group.emptyState')}
          button={t('workshop:actions.addWorkshopGroup')}
          onCreate={handleOpenCreateModal}
          onCreateLabel={t('workshop:actions.addWorkshopGroup')}
          hideEmptyText={hideEmptyState}
        />
        {/* Groups Modal */}
        <GroupedOfferCreateForm
          open={openCreateModal}
          metaActivities={[..._metaActivities]}
          metaActivity={metaActivity}
          metaActivityLoading={metaActivityLoading}
          availableRoomBlueprints={availableRoomBlueprints}
          allRoomBlueprints={allRoomBlueprints}
          theme={theme}
          coaches={coaches}
          availableEstablishments={availableEstablishments}
          allEstablishments={allEstablishments}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          tagList={allTagsWithTagGroup}
          customLevels={customLevels}
          fetchLevelList={handleFetchLevel}
          updateLevel={updateLevel}
          createLevel={createLevel}
          deleteLevel={deleteLevel}
          resetPreview={resetPreview}
          generatePreview={generateGroupOffersPreview}
          groupPreview={groupPreview}
          createGroupOffers={handleCreateGroup}
          onClose={handleCloseCreateModal}
          zoomAppDetail={zoomAppDetail}
          fetchSimilarOffersWithReset={fetchSimilarOffersWithReset}
        />
        <GroupedOfferEditDrawer
          open={!!editingGroup}
          metaActivity={_metaActivities.find(
            (o) => o.id === editingGroup?.meta_activity,
          )}
          availableRoomBlueprints={availableRoomBlueprints}
          allRoomBlueprints={allRoomBlueprints}
          theme={theme}
          coaches={coaches}
          group={editingGroup}
          availableEstablishments={availableEstablishments}
          allEstablishments={allEstablishments}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          tagList={allTagsWithTagGroup}
          customLevels={customLevels}
          onSubmit={handleEditGroup}
          fetchLevelList={handleFetchLevel}
          updateLevel={updateLevel}
          createLevel={createLevel}
          deleteLevel={deleteLevel}
          onClose={handleCloseEditGroupModal}
          zoomAppDetail={zoomAppDetail}
          fetchSimilarOffersWithReset={fetchSimilarOffersWithReset}
        />
        {deletingGroup && (
          <GroupedOfferDeleteDialog
            open={!!deletingGroup}
            onCancel={handleCloseDeleteGroupModal}
            processing={false}
            onSubmit={handleDeleteGroup}
            fetchSimilar={fetchSimilarGroupOffers}
            fetchOfferBulk={fetchOfferBulk}
            similarLoading={similarLoading}
            similars={[...(similarGroups ?? [])]}
            group={deletingGroup}
            getOffersListByGroup={getOffersListByGroup}
          />
        )}
        {!!duplicatingGroup && (
          <GroupedOfferDuplicate
            open={!!duplicatingGroup}
            onClose={handleCloseDuplicateGroupModal}
            createGroupOffers={handleCreateGroup}
            group={duplicatingGroup}
            generatePreview={generateGroupOffersPreview}
            groupPreview={groupPreview}
            metaActivity={_metaActivities.find(
              (o) => o.id === duplicatingGroup?.meta_activity,
            )}
            resetPreview={resetPreview}
          />
        )}
        {/* OFFERS MODAL */}
        {editOfferModalOpen && (
          <GenericResponsiveDrawer
            open={editOfferModalOpen}
            onClose={handleCloseEditModal}
            title={t('translation:common.offers')}
            subtitle={t('translation:common.offerEdition')}
          >
            <OfferEditForm
              offer={selectedOffer}
              coaches={coaches}
              availableEstablishments={availableEstablishments}
              allEstablishments={allEstablishments}
              roomBlueprints={availableRoomBlueprints}
              allRoomBlueprints={allRoomBlueprints}
              is_whereby_integration_enabled={
                theme?.is_whereby_integration_enabled &&
                theme?.is_whereby_integration_allowed
              }
              loading={coachesLoading || establishmentsLoading}
              onConfirm={onEditOffer}
              onCancel={handleCloseEditModal}
              processing={editOfferProcessing}
              fetchSimilarOffers={fetchSimilarOffers}
              fetchSimilarOffersWithReset={fetchSimilarOffersWithReset}
              similarOffers={similarOffers}
              similarOfferLoading={similarOfferLoading}
              coachPaymentRulesByKind={coachPaymentRulesByKind}
              showPartnership={theme.has_partnership}
              tagList={allTagsWithTagGroup}
              activeCustomLevels={customLevels}
              allCustomLevels={allCustomLevels}
              fetchLevelList={handleFetchLevel}
              updateLevel={updateLevel}
              createLevel={createLevel}
              deleteLevel={deleteLevel}
              zoomAppDetail={zoomAppDetail}
            />
          </GenericResponsiveDrawer>
        )}
        {deleteOfferModalOpen && (
          <Dialog onClose={handleCloseDeleteModal} open={deleteOfferModalOpen}>
            <DialogContent>
              <DeleteOfferForm
                offer={selectedOffer}
                offerWasCancelled={!selectedOffer.available}
                onCancelOffer={handleCancelOffer}
                onHardDelete={handleDeleteOffer}
                fetchSimilarOffers={() => {
                  fetchSimilarOffers(selectedOfferId);
                }}
                onCancel={handleCloseDeleteModal}
                processing={false}
                setOpenDeleteDialog={handleOpenOfferDeleteImpossibleModal}
                similarOffers={similarOffers}
                similarOfferLoading={similarOfferLoading}
              />
            </DialogContent>
          </Dialog>
        )}
        {deleteImpossibleModalOpen && (
          <Dialog
            open={deleteImpossibleModalOpen}
            onClose={handleCloseDeleteImpossibleModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t('offer:deleteImpossibleTitle')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t('offer:deleteImpossibleText')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDeleteImpossibleModal}
                color="primary"
              >
                {t('offer:close')}
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {restoreModalOpen && (
          <Dialog open={restoreModalOpen}>
            <DialogTitle>
              <Typography variant="h6">
                {t('offer.restoreModal.title')}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography>{t('offer.restoreModal.explain')}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRestoreModal}>
                {t('common.cancel')}
              </Button>
              <Button color="primary" onClick={handleRestoreOffer}>
                {t('common.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  emptyState: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  emptySelect: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  info: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  pageSizeSelect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  pagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: theme.spacing(2),
  },
  offerCard: {
    paddingBottom: theme.spacing(8),
  },
}));

export default WorkshopActivityGroup;

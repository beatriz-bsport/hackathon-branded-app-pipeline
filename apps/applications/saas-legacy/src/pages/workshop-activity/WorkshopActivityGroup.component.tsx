import React, { useEffect, useState, useCallback } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

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

import GroupedOfferCreateForm from '#src/libs/group-offer/components/GroupedOfferCreateForm.drawer';
import GroupedOfferEditDrawer from '#src/libs/group-offer/components/GroupedOfferEdit.drawer';
import GroupedOfferDuplicate from '#src/libs/group-offer/components/GroupedOfferDuplicateForm.drawer';
import GroupedOfferDeleteDialog from '#src/libs/group-offer/components/GroupedOfferDelete.dialog';

import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
// @ts-expect-error
import OfferCard from '#src/components/offer/OfferCard.component';
import MetaActivityGroupsFilter from '#src/libs/meta-activity/components/MetaActivityGroupsFilter.component';
import GroupCard from '#src/libs/group-offer/components/GroupCard.component';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { Offer, DeleteOfferPayload } from '#src/libs/offer/types';
// @ts-expect-error
import DeleteOfferForm from '#src/libs/offer/DeleteOfferForm.component';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import { OffersGroup, OffersGroupFilter } from '#src/libs/group-offer/types';
import OfferEditForm from '#src/libs/offer/OfferEditForm.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { workshopActivityGroupConnector } from './WorkshopActivityGroup.page';
import usePagination from '../../hooks/usePagination';

const PAGE_SIZE_OPTIONS = [5, 10];

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
          // @ts-expect-error
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
      min_date: DateTime.now().toISODate(),
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
    fetchEstablishments({
      page_size: 1000,
      disabled: false,
      company: companyId,
    });
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
    // @ts-expect-error
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
          // @ts-expect-error
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
    notify: boolean;
    deleteAll: boolean;
    custom_selection: boolean;
    custom_selection_ids: Array<number>;
    cancel_linked_hybrid_offer: boolean;
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

  const handleDeleteOffer = (data: DeleteOfferPayload) => {
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
    return <BackofficeLinearProgress additionalMargin={1} />;
  }

  const hideEmptyState = groupExist || groupList.length > 0;

  const _metaActivities = metaActivity ? [metaActivity] : metaActivities;

  return (
    <ObjectLevelPermissionProviderComponent
      requiredPermission={[
        'session.workshop.allowed_actions.create',
        'session.workshop.allowed_actions.edit',
        'session.workshop.allowed_actions.delete',
      ]}
    >
      {([
        hasAddSessionPermission,
        hasEditSessionPermission,
        hasDeleteSessionPermission,
      ]: boolean[]) => (
        <div className={classes.container}>
          <div style={pageHeight ? { maxHeight: pageHeight } : {}}>
            <Grid container spacing={3}>
              {isWidthDown('md', width) && selectedOffer && (
                <Button
                  className={classes.button}
                  onClick={resetOffer}
                  size="small"
                >
                  <KeyboardArrowLeft />
                  {t('workshop:group.backToGroup')}
                </Button>
              )}

              {(isWidthUp('lg', width) || !selectedOffer) &&
                !!hideEmptyState && (
                  <Grid item lg={6} xs={12}>
                    <MetaActivityGroupsFilter
                      filter={filter}
                      isLoading={metaActivityLoading}
                      metaActivities={[..._metaActivities]}
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
                        onChange={(
                          ev: React.ChangeEvent<{
                            value: number;
                          }>,
                        ) => {
                          handleSetPageSize(ev.target.value);
                        }}
                        value={pageSize}
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
                            className={classes.emptyState}
                            color="textSecondary"
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
                              onCopy={
                                hasEditSessionPermission &&
                                hasAddSessionPermission &&
                                handleOpenDuplicateGroupModal
                              }
                              onDelete={
                                hasDeleteSessionPermission &&
                                handleOpenDeleteGroupModal
                              }
                              onEdit={
                                hasEditSessionPermission &&
                                handleOpenEditGroupModal
                              }
                              onSelect={handleSelectOffer}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {Math.ceil(groupListCount / pageSize) > 1 && (
                      <div className={classes.pagination}>
                        <Pagination
                          count={Math.ceil(groupListCount / pageSize)}
                          onChange={(_, _page) => {
                            handleSetPage(_page);
                          }}
                          page={page}
                          shape="round"
                        />
                      </div>
                    )}
                  </Grid>
                )}
              {!!hideEmptyState && (
                <Grid item lg={6} xs={12}>
                  {selectedOffer ? (
                    <div className={classes.offerCard}>
                      <OfferCard
                        bookings={bookings}
                        bookingsLoading={bookingsLoading || !bookings}
                        companyId={companyId}
                        companyTheme={theme}
                        goToOfferManagement={navigateToOffer}
                        members={members}
                        membersLoading={membersLoading || !members}
                        offer={selectedOffer}
                        onDeleteButtonClick={handleOpenOfferDeleteModal}
                        onEditButtonClick={handleOpenOfferEditModal}
                        onModifyTags={handleOpenOfferEditModal}
                        onRestoreButtonClick={handleOpenOfferRestoreModal}
                        showOfferGender={theme?.show_booked_gender_offer}
                        snackbarSuccess={snackbarSuccess}
                      />
                    </div>
                  ) : (
                    <div className={classes.emptySelect}>
                      <InfoIcon className={classes.info} color="disabled" />
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
            {hasAddSessionPermission && (
              <IsEmptyList
                button={t('workshop:actions.addWorkshopGroup')}
                hideEmptyText={hideEmptyState}
                onCreate={handleOpenCreateModal}
                onCreateLabel={t('workshop:actions.addWorkshopGroup')}
                text={t('workshop:group.emptyState')}
              />
            )}
            {/* Groups Modal */}
            <GroupedOfferCreateForm
              // @ts-expect-error
              allEstablishments={allEstablishments}
              allRoomBlueprints={allRoomBlueprints}
              availableEstablishments={availableEstablishments}
              availableRoomBlueprints={availableRoomBlueprints}
              coaches={coaches}
              coachPaymentRulesByKind={coachPaymentRulesByKind}
              createGroupOffers={handleCreateGroup}
              createLevel={createLevel}
              customLevels={customLevels}
              deleteLevel={deleteLevel}
              fetchLevelList={handleFetchLevel}
              fetchSimilarOffersWithReset={fetchSimilarOffersWithReset}
              // @ts-expect-error
              generatePreview={generateGroupOffersPreview}
              // @ts-expect-error
              groupPreview={groupPreview}
              metaActivities={[..._metaActivities]}
              metaActivity={metaActivity}
              metaActivityLoading={metaActivityLoading}
              onClose={handleCloseCreateModal}
              open={openCreateModal}
              resetPreview={resetPreview}
              // @ts-expect-error
              tagList={allTagsWithTagGroup}
              theme={theme}
              // @ts-expect-error
              updateLevel={updateLevel}
              zoomAppDetail={zoomAppDetail}
            />
            <GroupedOfferEditDrawer
              // @ts-expect-error
              allEstablishments={allEstablishments}
              allRoomBlueprints={allRoomBlueprints}
              availableEstablishments={availableEstablishments}
              availableRoomBlueprints={availableRoomBlueprints}
              coaches={coaches}
              coachPaymentRulesByKind={coachPaymentRulesByKind}
              createLevel={createLevel}
              customLevels={customLevels}
              deleteLevel={deleteLevel}
              fetchLevelList={handleFetchLevel}
              fetchSimilarOffersWithReset={fetchSimilarOffersWithReset}
              group={editingGroup}
              metaActivity={_metaActivities.find(
                (o) => o.id === editingGroup?.meta_activity,
              )}
              onClose={handleCloseEditGroupModal}
              onSubmit={handleEditGroup}
              open={!!editingGroup}
              // @ts-expect-error
              tagList={allTagsWithTagGroup}
              theme={theme}
              // @ts-expect-error
              updateLevel={updateLevel}
              zoomAppDetail={zoomAppDetail}
            />
            {deletingGroup && (
              <GroupedOfferDeleteDialog
                fetchOfferBulk={fetchOfferBulk}
                fetchSimilar={fetchSimilarGroupOffers}
                getOffersListByGroup={getOffersListByGroup}
                group={deletingGroup}
                onCancel={handleCloseDeleteGroupModal}
                onSubmit={handleDeleteGroup}
                open={!!deletingGroup}
                processing={false}
                similarLoading={similarLoading}
                similars={[...(similarGroups ?? [])]}
              />
            )}
            {!!duplicatingGroup && (
              <GroupedOfferDuplicate
                createGroupOffers={handleCreateGroup}
                // @ts-expect-error
                generatePreview={generateGroupOffersPreview}
                // @ts-expect-error
                group={duplicatingGroup}
                // @ts-expect-error
                groupPreview={groupPreview}
                metaActivity={_metaActivities.find(
                  (o) => o.id === duplicatingGroup?.meta_activity,
                )}
                onClose={handleCloseDuplicateGroupModal}
                open={!!duplicatingGroup}
                resetPreview={resetPreview}
              />
            )}
            {/* OFFERS MODAL */}
            {editOfferModalOpen && (
              <GenericResponsiveDrawer
                withoutHeaderContainer
                withoutPadding
                onClose={handleCloseEditModal}
                open={editOfferModalOpen}
                subtitle={t('translation:common.offerEdition')}
                title={t('translation:common.offers')}
              >
                <OfferEditForm
                  editableCoachPaymentRule
                  isOfferInGroup
                  activeCustomLevels={customLevels}
                  allCustomLevels={allCustomLevels}
                  allEstablishments={allEstablishments}
                  allRoomBlueprints={allRoomBlueprints}
                  availableEstablishments={availableEstablishments}
                  coaches={coaches}
                  coachPaymentRulesByKind={coachPaymentRulesByKind}
                  createLevel={createLevel}
                  deleteLevel={deleteLevel}
                  fetchLevelList={handleFetchLevel}
                  fetchSimilarOffers={fetchSimilarOffers}
                  isLoading={
                    coachesLoading ||
                    metaActivityLoading ||
                    establishmentsLoading ||
                    similarOfferLoading
                  }
                  isWherebyIntegrationEnabled={
                    theme?.is_whereby_integration_enabled &&
                    theme?.is_whereby_integration_allowed
                  }
                  offer={selectedOffer}
                  onCancel={handleCloseEditModal}
                  // @ts-expect-error
                  onSubmit={onEditOffer}
                  processing={editOfferProcessing}
                  roomBlueprints={availableRoomBlueprints}
                  showPartnership={theme.has_partnership}
                  similarOffers={similarOffers}
                  // @ts-expect-error
                  tagList={allTagsWithTagGroup}
                  updateLevel={updateLevel}
                  zoomAppDetail={zoomAppDetail}
                />
              </GenericResponsiveDrawer>
            )}
            {deleteOfferModalOpen && (
              <Dialog
                onClose={handleCloseDeleteModal}
                open={deleteOfferModalOpen}
              >
                <DialogContent>
                  <DeleteOfferForm
                    fetchSimilarOffers={() => {
                      fetchSimilarOffers(selectedOfferId);
                    }}
                    offer={selectedOffer}
                    offerWasCancelled={!selectedOffer.available}
                    onCancel={handleCloseDeleteModal}
                    onCancelOffer={handleCancelOffer}
                    onHardDelete={handleDeleteOffer}
                    processing={false}
                    setOpenDeleteDialog={handleOpenOfferDeleteImpossibleModal}
                    similarOfferLoading={similarOfferLoading}
                    similarOffers={similarOffers}
                  />
                </DialogContent>
              </Dialog>
            )}
            {deleteImpossibleModalOpen && (
              <Dialog
                aria-describedby="alert-dialog-description"
                aria-labelledby="alert-dialog-title"
                onClose={handleCloseDeleteImpossibleModal}
                open={deleteImpossibleModalOpen}
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
                    color="primary"
                    onClick={handleCloseDeleteImpossibleModal}
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
      )}
    </ObjectLevelPermissionProviderComponent>
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

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { ConnectedProps, connect } from 'react-redux';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { DateTime } from 'luxon';

/** ACTIONS */
import { search } from '#src/libs/member/actions';
import {
  getMemberVisitList as getMemberVisitListAction,
  refreshMemberVisitAccessStatus as refreshMemberVisitAccessStatusAction,
  retrieveMemberNextBookingOrPrivateBooking as retrieveMemberNextBookingOrPrivateBookingAction,
  setMemberVisitEntryStatus as setMemberVisitEntryStatusAction,
  getUserPhotoUpdates as getUserPhotoUpdatesAction,
  approvePhotoUpdate as approvePhotoUpdateAction,
} from '#src/libs/access-control/actions';
import { handleBroadcastChannelMessages as handleBroadcastChannelMessagesAction } from '#src/libs/broadcast-channel/actions';
import { openNewBackOfficeWindow } from '#src/utils/windows';

/** COMPONENTS */
import MemberVisitSearchMember from '#src/libs/access-control/components/MemberVisit/EmptyState/MemberVisitSearchMember.component';
import MemberVisitLiveHistoryTable from '#src/libs/access-control/components/MemberVisitLiveHistory/MemberVisitLiveHistoryTable/MemberVisitLiveHistoryTable.component';
import MemberVisitDetailsCard from '#src/libs/access-control/components/MemberVisit/MemberVisitDetailsCard/MemberVisitDetailsCard.component';
import MemberVisitHeadButtons from '#src/libs/access-control/components/MemberVisit/MemberVisitHeadButtons.component';
import MemberVisitWarnings from '#src/libs/access-control/components/MemberVisit/MemberVisitWarnings.component';
import AccessStatusChangedSuccessModal from '#src/libs/access-control/components/MemberVisit/AccessStatusChangedSuccessModal.component';
import EntryStatusChangedModal from '#src/libs/access-control/components/MemberVisit/EntryStatusChangedModal.component';
import MemberPhotoHistoryModal from '#src/libs/access-control/components/MemberVisit/MemberPhotoHistoryModal.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import ConnectedBillingProblemCard from '#src/libs/access-control/components/ConnectedBillingProblemCard.component';

/** SELECTORS */
import {
  getAllMemberVisits,
  getMemberNextBookingOrPrivateBooking,
  getMemberVisitLiveHistoryIsLoading,
  getUserPhotoUpdatesList,
} from '#src/libs/access-control/selectors';
import {
  getAllEstablishmentsDict,
  getAssociatedEstablishmentGroup,
  getEstablishmentsSelectedInRole,
} from '#src/libs/establishment/selectors';
import { getPermissions } from '#src/libs/role/selectors';

/** CONSTANTS */
import { EntryStatus, AccessStatus } from '#src/libs/access-control/constants';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

/** TYPES */
import type { RootState } from 'src/reducers';
import type { MemberVisitREST } from '#src/libs/access-control/types';

/** HOOKS */
import { useBroadcastChannel } from '#src/libs/broadcast-channel/hooks';
import { useCheckAccessControlLocationSetup } from '#src/libs/access-control/hooks/checkLocationSetup';
import { formatLocationString } from '#src/libs/access-control/utils';
import { BroadcastChannelMessageType } from '#src/libs/broadcast-channel/types';

export type Props = ConnectedProps<typeof connector>;

const useLiveHistoryPageDataManager = ({
  approvePhotoUpdate,
  establishmentGroups,
  establishmentsData,
  getMemberPhotoHistory,
  getMemberVisitList,
  handleBroadcastChannelMessages,
  memberPhotoHistory,
  memberVisitState,
  permissions,
  refreshMemberVisitAccessStatus,
  retrieveMemberNextBookingOrPrivateBooking,
  setMemberVisitEntryStatus,
}: Pick<
  Props,
  | 'approvePhotoUpdate'
  | 'establishmentGroups'
  | 'establishmentsData'
  | 'getMemberPhotoHistory'
  | 'getMemberVisitList'
  | 'handleBroadcastChannelMessages'
  | 'memberPhotoHistory'
  | 'memberVisitState'
  | 'permissions'
  | 'refreshMemberVisitAccessStatus'
  | 'retrieveMemberNextBookingOrPrivateBooking'
  | 'setMemberVisitEntryStatus'
>) => {
  const [selectedMemberVisitId, setSelectedMemberVisitId] = useState(null);

  /** STATE */

  const [showStatusChangeSuccessModal, setShowStatusChangeSuccessModal] =
    useState(false);
  const [showEntryStatusChangedModal, setShowEntryStatusChangedModal] =
    useState(false);
  const [showMemberPhotoHistoryModal, setShowMemberPhotoHistoryModal] =
    useState(false);
  // Indicator to know if a member has been selected through the search bar
  const [isMemberSelectedInSearchBar, setIsMemberSelectedInSearchBar] =
    useState(false);

  /**
   * Get the selected member visit directly from the store
   * This way, we can avoid re-select selectedMemberVisit when selectedMemberVisitId doesn't change
   */
  const selectedMemberVisit = useMemo(() => {
    return memberVisitState.byId?.[selectedMemberVisitId];
  }, [memberVisitState, selectedMemberVisitId]);

  /** EFFECTS */

  // Fetch today's member visit list
  const fetchMemberVisitList = useCallback(
    (params: { page: number; member?: number }) => {
      // If current time is before 2am, we need to fetch yesterday's data as well
      const datetime_created_after = DateTime.now()
        .minus({ hour: 2 })
        .startOf('day')
        .toUTC()
        .toISO();

      // If the staff user has the permission to perform access monitoring, we will only show the member visits performed by him
      const performed_by_me =
        permissions?.navigationMenu?.accessMonitoring?.perform;

      getMemberVisitList({
        ...params,
        datetime_created_after,
        ...{ performed_by_me },
      });
    },
    [getMemberVisitList],
  );

  useEffect(() => {
    fetchMemberVisitList({ page: 1 });
  }, [fetchMemberVisitList]);

  /** HOOKS */

  const sendToBroadcastChannel = useBroadcastChannel<MemberVisitREST>(
    handleBroadcastChannelMessages,
  );

  const {
    establishmentObjects,
    staffLocationAddress,
    staffLocationEstablishmentGroup,
  } = useCheckAccessControlLocationSetup({
    establishmentGroups,
    establishmentsData,
    establishmentsToCheck: selectedMemberVisit?.establishments ?? [],
  });

  /** HANDLERS */

  // Select member visit details
  const handleCloseMemberVisitDetails = useCallback(() => {
    setSelectedMemberVisitId(null);
  }, [setSelectedMemberVisitId]);

  const handleSelectMemberVisit = useCallback(
    (memberVisit: MemberVisitREST) => {
      retrieveMemberNextBookingOrPrivateBooking(memberVisit.member.id);
      getMemberPhotoHistory(memberVisit.member.id);
      setSelectedMemberVisitId(memberVisit.id);
    },
    [
      getMemberPhotoHistory,
      retrieveMemberNextBookingOrPrivateBooking,
      setSelectedMemberVisitId,
    ],
  );

  // Member filter selection
  const handleSelectMember = useCallback(
    (memberId: number) => {
      fetchMemberVisitList({ member: memberId, page: 1 });
      setIsMemberSelectedInSearchBar(true);
    },
    [fetchMemberVisitList],
  );

  // In member visit details
  const handleRefreshMemberVisitAccessStatus = useCallback(() => {
    refreshMemberVisitAccessStatus(selectedMemberVisitId, {
      onSuccess: (data: MemberVisitREST) => {
        sendToBroadcastChannel({
          type: BroadcastChannelMessageType.accessControlMemberVisitRefresh,
          payload: data,
        });
        if (
          data.access_status !== data.initial_access_status &&
          data.access_status === AccessStatus.GREEN
        ) {
          setShowStatusChangeSuccessModal(true);
        }
      },
    });
    retrieveMemberNextBookingOrPrivateBooking(selectedMemberVisit.member.id);
    getMemberPhotoHistory(selectedMemberVisit.member.id);
  }, [
    getMemberPhotoHistory,
    refreshMemberVisitAccessStatus,
    retrieveMemberNextBookingOrPrivateBooking,
    selectedMemberVisit,
    sendToBroadcastChannel,
  ]);

  // When clearing the member filter
  const handleRefreshFirstPage = useCallback(() => {
    fetchMemberVisitList({ page: 1 });
    setIsMemberSelectedInSearchBar(false);
  }, [fetchMemberVisitList]);

  const handleMemberProfileClick = useCallback((memberId: number) => {
    const url = `/member/${memberId}`;
    openNewBackOfficeWindow(url);
  }, []);

  const handleMemberBillClick = useCallback(() => {
    if (selectedMemberVisit?.member?.id) {
      const url = `/invoice/bill-member/${selectedMemberVisit.member.id}`;
      openNewBackOfficeWindow(url);
    }
  }, [selectedMemberVisit]);

  const handleSelectedMemberProfileClick = useCallback(() => {
    if (selectedMemberVisit) {
      handleMemberProfileClick(selectedMemberVisit?.member?.id);
    }
  }, [handleMemberProfileClick, selectedMemberVisit]);

  const handleAllowManualEntry = useCallback(() => {
    if (selectedMemberVisitId) {
      setMemberVisitEntryStatus(selectedMemberVisitId, EntryStatus.ENTERED, {
        onSuccess: (data) => {
          sendToBroadcastChannel({
            type: BroadcastChannelMessageType.accessControlSetEntryStatus,
            payload: data,
          });
          setShowEntryStatusChangedModal(true);
        },
      });
    }
  }, [
    setMemberVisitEntryStatus,
    selectedMemberVisitId,
    sendToBroadcastChannel,
  ]);

  const handleRefuseManualEntry = useCallback(() => {
    if (selectedMemberVisitId) {
      setMemberVisitEntryStatus(
        selectedMemberVisitId,
        EntryStatus.NOT_ENTERED,
        {
          onSuccess: (data) => {
            sendToBroadcastChannel({
              type: BroadcastChannelMessageType.accessControlSetEntryStatus,
              payload: data,
            });
            setShowEntryStatusChangedModal(true);
          },
        },
      );
    }
  }, [
    setMemberVisitEntryStatus,
    selectedMemberVisitId,
    sendToBroadcastChannel,
  ]);

  const handleCloseAccessStatusChangeSuccessModal = useCallback(() => {
    setShowStatusChangeSuccessModal(false);
  }, [setShowStatusChangeSuccessModal]);

  const handleCloseEntryStatusChangedModal = useCallback(() => {
    setShowEntryStatusChangedModal(false);
  }, [setShowEntryStatusChangedModal]);

  const handleOpenMemberPhotoHistoryModal = useCallback(() => {
    setShowMemberPhotoHistoryModal(true);
  }, [setShowMemberPhotoHistoryModal]);

  const handleCloseMemberPhotoHistoryModal = useCallback(() => {
    setShowMemberPhotoHistoryModal(false);
  }, [setShowMemberPhotoHistoryModal]);

  const handleApprovePhotoUpdate = useCallback(() => {
    if (memberPhotoHistory.length) {
      approvePhotoUpdate(memberPhotoHistory[0].uuid, {
        onSuccess: handleRefreshMemberVisitAccessStatus,
      });
    }
    handleCloseMemberPhotoHistoryModal();
  }, [
    approvePhotoUpdate,
    handleCloseMemberPhotoHistoryModal,
    handleRefreshMemberVisitAccessStatus,
    memberPhotoHistory,
  ]);

  /** COMPUTED */

  const locationInformation = useMemo(
    () =>
      formatLocationString({
        staffLocationEstablishmentGroup,
        staffLocationAddress,
        establishmentObjects,
      }),
    [
      staffLocationEstablishmentGroup,
      staffLocationAddress,
      establishmentObjects,
    ],
  );

  return {
    fetchMemberVisitList,
    handleAllowManualEntry,
    handleApprovePhotoUpdate,
    handleCloseAccessStatusChangeSuccessModal,
    handleCloseEntryStatusChangedModal,
    handleCloseMemberPhotoHistoryModal,
    handleCloseMemberVisitDetails,
    handleMemberBillClick,
    handleMemberProfileClick,
    handleOpenMemberPhotoHistoryModal,
    handleRefreshFirstPage,
    handleRefreshMemberVisitAccessStatus,
    handleRefuseManualEntry,
    handleSelectedMemberProfileClick,
    handleSelectMember,
    handleSelectMemberVisit,
    isMemberSelectedInSearchBar,
    locationInformation,
    selectedMemberVisit,
    showEntryStatusChangedModal,
    showMemberPhotoHistoryModal,
    showStatusChangeSuccessModal,
  };
};

const LiveHistory: React.FC<Props> = ({
  approvePhotoUpdate,
  establishmentGroups,
  establishmentsData,
  getMemberPhotoHistory,
  getMemberVisitList,
  handleBroadcastChannelMessages,
  isLoading,
  memberNextBookingOrPrivateBooking,
  memberVisitList,
  memberVisitState,
  memberVisitUnreadCount,
  memberPhotoHistory,
  permissions,
  refreshMemberVisitAccessStatus,
  retrieveMemberNextBookingOrPrivateBooking,
  searchMembers,
  setMemberVisitEntryStatus,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  const {
    fetchMemberVisitList,
    handleAllowManualEntry,
    handleApprovePhotoUpdate,
    handleCloseAccessStatusChangeSuccessModal,
    handleCloseEntryStatusChangedModal,
    handleCloseMemberPhotoHistoryModal,
    handleCloseMemberVisitDetails,
    handleMemberBillClick,
    handleMemberProfileClick,
    handleOpenMemberPhotoHistoryModal,
    handleRefreshFirstPage,
    handleRefreshMemberVisitAccessStatus,
    handleRefuseManualEntry,
    handleSelectedMemberProfileClick,
    handleSelectMember,
    handleSelectMemberVisit,
    isMemberSelectedInSearchBar,
    locationInformation,
    selectedMemberVisit,
    showEntryStatusChangedModal,
    showMemberPhotoHistoryModal,
    showStatusChangeSuccessModal,
  } = useLiveHistoryPageDataManager({
    approvePhotoUpdate,
    establishmentGroups,
    establishmentsData,
    getMemberPhotoHistory,
    getMemberVisitList,
    handleBroadcastChannelMessages,
    memberPhotoHistory,
    memberVisitState,
    permissions,
    refreshMemberVisitAccessStatus,
    retrieveMemberNextBookingOrPrivateBooking,
    setMemberVisitEntryStatus,
  });

  if (selectedMemberVisit) {
    return (
      <>
        <div className={classes.root}>
          <div className={classes.header}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Typography
                variant="body1"
                color="textSecondary"
                className={classes.breadcrumbMainText}
                onClick={handleCloseMemberVisitDetails}
              >
                {t('liveHistory.breadcrumbTitle')}
              </Typography>
              <Typography
                variant="body1"
                className={classes.breadcrumbSecondaryText}
              >
                {selectedMemberVisit.member.name}
              </Typography>
            </Breadcrumbs>
            <MemberVisitHeadButtons
              accessStatus={selectedMemberVisit.access_status}
              onRefresh={handleRefreshMemberVisitAccessStatus}
              isLoading={isLoading}
            />
          </div>
          <MemberVisitDetailsCard
            locationInformation={locationInformation}
            memberVisit={selectedMemberVisit}
            nextBooking={memberNextBookingOrPrivateBooking}
            onAllowManualEntry={handleAllowManualEntry}
            handleOpenMemberPhotoHistoryModal={
              !!memberPhotoHistory.length && handleOpenMemberPhotoHistoryModal
            }
            onRefuseManualEntry={handleRefuseManualEntry}
            onMemberBillClick={handleMemberBillClick}
            onMemberProfileClick={handleSelectedMemberProfileClick}
            isLoading={isLoading}
          />
          <MemberVisitWarnings
            isLoading={isLoading}
            memberVisit={selectedMemberVisit}
          />
          {!!selectedMemberVisit?.member?.id &&
            !isLoading &&
            selectedMemberVisit.access_status !== AccessStatus.GREEN && (
              <ConnectedBillingProblemCard
                memberId={selectedMemberVisit.member.id}
                onPaymentSuccess={handleRefreshMemberVisitAccessStatus}
              />
            )}
        </div>
        <MemberPhotoHistoryModal
          memberPhotoHistory={memberPhotoHistory}
          onClose={handleCloseMemberPhotoHistoryModal}
          onValidateIdentity={
            memberPhotoHistory.length &&
            selectedMemberVisit?.access_status_data?.check_on_member_account
              ?.last_photo_update_is_not_approved
              ? handleApprovePhotoUpdate
              : null
          }
          open={showMemberPhotoHistoryModal}
        />
        <AccessStatusChangedSuccessModal
          onClose={handleCloseAccessStatusChangeSuccessModal}
          open={showStatusChangeSuccessModal}
        />
        <EntryStatusChangedModal
          entryStatus={selectedMemberVisit?.entry_status || EntryStatus.UNKNOWN}
          onCloseMemberPage={handleCloseMemberVisitDetails}
          onStayOnMemberPage={handleCloseEntryStatusChangedModal}
          open={showEntryStatusChangedModal}
        />
      </>
    );
  }

  return (
    <div className={classes.root}>
      <ObjectLevelPermissionWrapper
        forcedBehavior="hidden"
        requiredPermission="member.allowed_actions.search"
      >
        <div className={classes.searchBarAndNewVisitContainer}>
          <MemberVisitSearchMember
            displayDropDownInPopover
            reducedWidth
            searchMembers={searchMembers}
            onMemberClick={handleSelectMember}
            onClearSearch={handleRefreshFirstPage}
          />
          {memberVisitUnreadCount > 0 && (
            <Link
              variant="body1"
              className={classes.unreadVisitsLink}
              onClick={handleRefreshFirstPage}
            >
              {t('liveHistory.unreadCount', { count: memberVisitUnreadCount })}
            </Link>
          )}
        </div>
      </ObjectLevelPermissionWrapper>
      <MemberVisitLiveHistoryTable
        isMemberSelectedInSearchBar={isMemberSelectedInSearchBar}
        isLoading={isLoading}
        handleSelectMemberVisit={handleSelectMemberVisit}
        handleMemberProfileClick={handleMemberProfileClick}
        memberVisitList={memberVisitList}
        getMemberVisitList={fetchMemberVisitList}
        memberVisitState={memberVisitState}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  breadcrumbMainText: { cursor: 'pointer' },
  breadcrumbSecondaryText: { color: theme.palette.text.disabled },
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  root: { display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  searchBarAndNewVisitContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadVisitsLink: {
    cursor: 'pointer',
    color: theme.palette.info.dark,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
}));

const connector = connect(
  (state: RootState) => ({
    establishmentGroups: getAssociatedEstablishmentGroup(state),
    establishmentsData: getAllEstablishmentsDict(state),
    establishmentsSelectedInRole: getEstablishmentsSelectedInRole(state),
    isLoading: getMemberVisitLiveHistoryIsLoading(state),
    memberPhotoHistory: getUserPhotoUpdatesList(state),
    memberVisitList: getAllMemberVisits(state),
    memberVisitState: state.accessControl.memberVisit,
    memberVisitUnreadCount: state.accessControl.memberVisit.unreadCount,
    memberNextBookingOrPrivateBooking:
      getMemberNextBookingOrPrivateBooking(state),
    permissions: getPermissions(state),
  }),
  {
    approvePhotoUpdate: approvePhotoUpdateAction,
    getMemberVisitList: getMemberVisitListAction,
    getMemberPhotoHistory: getUserPhotoUpdatesAction,
    handleBroadcastChannelMessages: handleBroadcastChannelMessagesAction,
    refreshMemberVisitAccessStatus: refreshMemberVisitAccessStatusAction,
    retrieveMemberNextBookingOrPrivateBooking:
      retrieveMemberNextBookingOrPrivateBookingAction,
    searchMembers: search,
    setMemberVisitEntryStatus: setMemberVisitEntryStatusAction,
  },
);

export default React.memo(connector(LiveHistory));
